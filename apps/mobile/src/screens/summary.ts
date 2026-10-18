// Evaluation screen: the YouTube player on top (optional, off by default), the shared
// WWJD evaluation view below inside a Shadow DOM root.
import {
  evaluateVideo,
  formatTimestamp,
  getTranscriptById,
  h,
  renderWwjdStateView,
  type WwjdViewState,
} from '@wwjd/core';
import { isDark, type App, type Screen } from '../app';
import { nativeFetch } from '../nativeFetch';
import { createPlayer, type EmbeddedPlayer } from '../player';
import { inSplitScreen, openInYouTubeApp } from '../youtubeApp';

const VIEW_CSS = `
.root { padding: 12px 16px 32px; }
`;

export function summaryScreen(app: App, videoId: string, start: number | null): Screen {
  const t = app.t;
  const playerBox = h('div', { class: 'player', hidden: true });
  const host = h('div', { class: 'summary-host' });
  const darkQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
  const applyTheme = () => (host.dataset.theme = isDark() ? 'dark' : 'light');
  applyTheme();
  darkQuery?.addEventListener('change', applyTheme);
  const shadow = host.attachShadow({ mode: 'open' });
  const root = h('div', { class: 'root' });
  shadow.append(h('style', {}, VIEW_CSS), root);
  const el = h('div', { class: 'screen summary' }, playerBox, host);

  let state: WwjdViewState = { kind: 'loading', step: t.settings.busy };
  let collapsed = false;
  let currentLang = 'nl';
  let run = 0;
  let disposed = false;

  let player: Promise<EmbeddedPlayer> | null = null;
  let ready: EmbeddedPlayer | null = null;
  let playerFailed = false;
  let playerGen = 0;

  const openInYouTube = async (sec: number) =>
    openInYouTubeApp(videoId, sec, await inSplitScreen());

  const showPlayer = (at: number | null): Promise<EmbeddedPlayer> => {
    if (player) return player;
    const gen = ++playerGen;
    playerBox.hidden = false;
    player = createPlayer(playerBox, videoId, {
      start: at,
      onError: (code) => {
        if (gen !== playerGen) return;
        playerFailed = true;
        playerBox.replaceChildren(
          h(
            'div',
            { class: 'player-fallback' },
            h('p', {}, t.app.cannotPlay(code)),
            h('button', { onClick: () => void openInYouTube(at ?? 0) }, t.app.openInYouTube),
          ),
        );
        render();
      },
    });
    void player.then((p) => {
      if (gen === playerGen) ready = p;
    });
    return player;
  };

  const hidePlayer = () => {
    playerGen++;
    ready?.pause();
    playerBox.replaceChildren();
    playerBox.hidden = true;
    player = null;
    ready = null;
    if (playerFailed) {
      playerFailed = false;
      render();
    }
  };
  if (app.playerOn) void showPlayer(start);

  const playAt = (sec: number) => {
    if (!app.playerOn) app.setPlayerOn(true);
    const gen = playerGen;
    void showPlayer(sec).then((p) => gen === playerGen && p.seekTo(sec));
  };

  const jumpInYouTube = async (sec: number) => {
    await openInYouTubeApp(videoId, sec, true);
    app.toast(t.app.openedInYouTube(formatTimestamp(sec)));
  };

  const seek = (sec: number) => {
    if (playerFailed) void openInYouTube(sec);
    else if (player) playAt(sec);
    else void inSplitScreen().then((split) => (split ? jumpInYouTube(sec) : askSeek(sec)));
  };

  let dialog: HTMLElement | null = null;
  const closeDialog = () => {
    dialog?.remove();
    dialog = null;
  };
  function askSeek(sec: number) {
    closeDialog();
    const tijd = formatTimestamp(sec);
    const backdrop: HTMLElement = h(
      'div',
      {
        class: 'dialog-backdrop',
        onClick: (e: Event) => e.target === backdrop && closeDialog(),
      },
      h(
        'div',
        { class: 'dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'seek-title' },
        h('h2', { id: 'seek-title' }, t.app.seekTitle(tijd)),
        h('p', {}, t.app.playerOff),
        h(
          'button',
          {
            class: 'primary',
            onClick: () => {
              closeDialog();
              playAt(sec);
            },
          },
          t.app.showPlayerAndSeek(tijd),
        ),
        h(
          'button',
          {
            onClick: () => {
              closeDialog();
              void openInYouTube(sec);
            },
          },
          t.app.openInYouTubeAt(tijd),
        ),
        h('button', { onClick: closeDialog }, t.app.cancel),
      ),
    );
    dialog = backdrop;
    el.append(backdrop);
    backdrop.querySelector<HTMLButtonElement>('button.primary')?.focus();
  }

  function render() {
    if (disposed) return;
    renderWwjdStateView(
      root,
      state,
      {
        onSeek: seek,
        onStart: () => void evaluate(false),
        onRefresh: () => void evaluate(true),
        onOpenOptions: () => app.go('#/instellingen'),
        onToggleCollapse: (next) => {
          collapsed = next;
          void app.settings.save({ paneelIngeklapt: next });
        },
      },
      {
        collapsed,
        enabled: true,
        taal: currentLang,
        t,
      },
    );
  }

  async function evaluate(forceRefresh: boolean) {
    const my = ++run;
    const [s, keys] = await Promise.all([app.settings.get(), app.keys.get()]);
    collapsed = s.paneelIngeklapt;
    currentLang = s.taal;

    if (!forceRefresh) {
      const cached = await app.cache.get(videoId, s.taal);
      if (my !== run || disposed) return;
      if (cached) {
        state = { kind: 'done', evaluation: cached, fromCache: true };
        render();
        return;
      }
    }

    const provider = s.provider;
    const apiKey = keys[provider];
    if (!apiKey) {
      state = {
        kind: 'error',
        message: t.app.noKeyError,
        showSettings: true,
      };
      render();
      return;
    }

    state = { kind: 'loading', step: t.view.fetchingTranscript };
    render();

    try {
      const transcriptRes = await getTranscriptById(videoId, { fetch: nativeFetch });
      if (my !== run || disposed) return;
      if (!transcriptRes.transcript) {
        throw new Error(
          t.extension.noTranscriptError(transcriptRes.reden ?? 'no captions'),
        );
      }

      const providerName = provider === 'claude' ? 'Claude' : 'Gemini';
      state = {
        kind: 'loading',
        step: t.view.evaluatingWith(providerName),
      };
      render();

      const factCheckApiKey = s.googleFactCheckActief ? keys.factcheck || undefined : undefined;
      const evaluation = await evaluateVideo(
        {
          videoId,
          transcript: transcriptRes.transcript,
          meta: transcriptRes.info.meta,
        },
        provider,
        {
          apiKey,
          model: s.models[provider],
          taal: s.taal,
          factCheckApiKey,
          fetch: nativeFetch,
        },
      );

      if (my !== run || disposed) return;
      await app.cache.set(evaluation);
      state = { kind: 'done', evaluation, fromCache: false };
      render();
    } catch (e) {
      if (my !== run || disposed) return;
      const msg = e instanceof Error ? e.message : String(e);
      state = {
        kind: 'error',
        message: msg,
        showSettings: /sleutel|instellingen|toegang|key|settings|clé|Schlüssel|clave|chiave|chave/i.test(
          msg,
        ),
      };
      render();
    }
  }

  render();
  void evaluate(false);

  return {
    title: t.app.analysisTitle,
    el,
    refresh: render,
    setPlayer(on) {
      if (on) void showPlayer(null);
      else hidePlayer();
    },
    back() {
      if (!dialog) return false;
      closeDialog();
      return true;
    },
    dispose() {
      disposed = true;
      closeDialog();
      darkQuery?.removeEventListener('change', applyTheme);
      run++;
    },
  };
}
