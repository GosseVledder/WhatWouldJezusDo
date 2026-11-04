import {
  analysisErrorView,
  createLiveSync,
  createVideoOverlay,
  DEFAULT_WWJD_SETTINGS,
  messages,
  parseVideoId,
  renderWwjdStateView,
  type AnalysisStep,
  type KeyKind,
  type LiveMoment,
  type LiveSync,
  type VideoOverlay,
  type SetupStatus,
  type WwjdEvaluation,
  type WwjdSettings,
  type WwjdViewState,
} from '@wwjd/core';
import { startThumbnailBadges } from '../badges';
import { KEYS_UPDATED } from '../storage/secrets';
import { getSettings, onSettingsChanged, saveSettings } from '../storage/settings';

export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  runAt: 'document_idle',
  cssInjectionMode: 'manual',

  async main(ctx) {
    console.log('[wwjd] geladen');

    let settings: WwjdSettings = await getSettings().catch(() => DEFAULT_WWJD_SETTINGS);
    let currentVideoId: string | null = null;
    let lastUrl = '';
    let hostEl: HTMLElement | null = null;
    let state: WwjdViewState = { kind: 'idle' };
    let collapsed = settings.paneelIngeklapt;
    let panelCollapsed = !settings.actief;
    let setupMissing: KeyKind[] = [];
    let live: LiveSync | null = null;
    let overlay: VideoOverlay | null = null;

    /** YouTube's main player video (not previews or ads in other elements). */
    const mainVideo = () =>
      document.querySelector<HTMLVideoElement>('#movie_player video.html5-main-video') ??
      document.querySelector<HTMLVideoElement>('ytd-watch-flexy video');

    /** "Overlay on video": the small card on the player at each checked moment. */
    function showOnVideo(moment: LiveMoment | null): void {
      const player = document.querySelector<HTMLElement>('#movie_player');
      if (!moment || !settings.overlayOpVideo || !settings.actief || !player) {
        overlay?.show(null);
        return;
      }
      overlay ??= createVideoOverlay(player);
      overlay.mount(player);
      overlay.show(moment);
    }

    // Synced live mode: follow the playback time of the main video
    const onTime = (e: Event) => {
      if (!live || e.target !== mainVideo()) return;
      showOnVideo(live.update((e.target as HTMLVideoElement).currentTime));
    };
    document.addEventListener('timeupdate', onTime, true);
    document.addEventListener('seeked', onTime, true);
    const noAiKey = () => setupMissing.some((k) => k !== 'factcheck');

    async function refreshSetup(): Promise<void> {
      const res = (await browser.runtime
        .sendMessage({ type: 'setupStatus' })
        .catch(() => null)) as { ok: boolean; data?: SetupStatus } | null;
      if (res?.ok && res.data) setupMissing = res.data.missing;
    }

    function currentTheme(): 'dark' | 'light' {
      return document.documentElement.hasAttribute('dark') ? 'dark' : 'light';
    }

    function syncTheme() {
      if (hostEl) {
        hostEl.dataset.theme = currentTheme();
      }
    }

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dark'],
    });

    function placeHost() {
      if (!hostEl) return;
      const flexy = document.querySelector('ytd-watch-flexy');
      const twoColumns = flexy?.hasAttribute('is-two-columns_') ?? true;
      const target = twoColumns
        ? (document.querySelector('ytd-watch-flexy #secondary-inner') ??
          document.querySelector('ytd-watch-flexy #secondary'))
        : document.querySelector('ytd-watch-flexy #below');

      if (!target) return;

      const thePointPanel = target.querySelector(':scope > #the-point-panel');
      if (thePointPanel) {
        if (thePointPanel.nextElementSibling !== hostEl) {
          thePointPanel.after(hostEl);
        }
      } else if (hostEl.parentElement !== target || target.firstElementChild !== hostEl) {
        target.prepend(hostEl);
      }
    }

    function render() {
      if (!hostEl || !currentVideoId) return;
      const videoId = currentVideoId;
      const shadow = hostEl.shadowRoot ?? hostEl.attachShadow({ mode: 'open' });
      renderWwjdStateView(
        shadow as unknown as HTMLElement,
        state,
        {
          onStart: () => void runEvaluation(videoId, false),
          onRefresh: () => void runEvaluation(videoId, true),
          onOpenOptions: () => void browser.runtime.sendMessage({ type: 'openOptions' }),
          onOpenSetup: () => void browser.runtime.sendMessage({ type: 'openWelcome' }),
          onSeek: (seconds) => seekVideo(seconds),
          onToggleCollapse: (nextCollapsed) => {
            collapsed = nextCollapsed;
            void saveSettings({ paneelIngeklapt: nextCollapsed });
          },
          onToggleEnabled: (enabled) => {
            settings = { ...settings, actief: enabled };
            if (enabled) {
              panelCollapsed = false;
            } else {
              panelCollapsed = true;
              collapsed = true;
            }
            void saveSettings({ actief: enabled });
            if (enabled && state.kind === 'idle') {
              void startForVideo(videoId);
            } else {
              render();
            }
          },
        },
        {
          collapsed,
          panelCollapsed,
          enabled: settings.actief,
          setupMissing,
          live: settings.liveMeelezen,
          taal: settings.taal,
        },
      );
      // The view was rebuilt: follow the video again on the new elements
      live?.stop();
      live = null;
      const follow = settings.liveMeelezen || settings.overlayOpVideo;
      if (state.kind === 'done' && settings.actief && follow) {
        live = createLiveSync(shadow, { highlight: settings.liveMeelezen });
        const video = mainVideo();
        if (video) showOnVideo(live.update(video.currentTime));
      } else {
        showOnVideo(null);
      }
    }

    function handleNavigation() {
      const onWatch = window.location.pathname === '/watch';
      const videoId = onWatch ? parseVideoId(window.location.href) : null;
      if (videoId === currentVideoId) return;

      currentVideoId = videoId;
      live?.stop();
      live = null;
      showOnVideo(null);
      if (!videoId) {
        if (hostEl) {
          hostEl.remove();
          hostEl = null;
        }
        return;
      }

      void mountPanel(videoId);
    }

    async function mountPanel(videoId: string) {
      const target = await waitForElement([
        'ytd-watch-flexy #secondary-inner',
        'ytd-watch-flexy #secondary',
        'ytd-watch-flexy #below',
      ]);
      if (!target || currentVideoId !== videoId) return;

      if (!hostEl) {
        hostEl = document.createElement('div');
        hostEl.id = 'wwjd-root';
        hostEl.style.display = 'block';
        hostEl.style.marginBottom = '16px';
        for (const t of ['keydown', 'keyup', 'keypress']) {
          hostEl.addEventListener(t, (e) => e.stopPropagation());
        }
      }
      syncTheme();
      placeHost();

      collapsed = settings.paneelIngeklapt;
      await refreshSetup();
      if (currentVideoId !== videoId) return;
      if (!settings.actief) {
        panelCollapsed = true;
        state = { kind: 'idle' };
        render();
        return;
      }

      await startForVideo(videoId);
    }

    async function startForVideo(videoId: string) {
      // Check cache first even if auto is off
      const cachedResp = (await browser.runtime
        .sendMessage({ type: 'getCached', videoId, taal: settings.taal })
        .catch(() => null)) as { ok: boolean; data?: WwjdEvaluation | null } | null;

      if (currentVideoId !== videoId) return;

      if (cachedResp?.ok && cachedResp.data) {
        state = { kind: 'done', evaluation: cachedResp.data, fromCache: true };
        render();
        return;
      }

      if (!settings.actief || !settings.automatisch || noAiKey()) {
        state = { kind: 'idle' };
        render();
        return;
      }

      await runEvaluation(videoId, false);
    }

    async function runEvaluation(videoId: string, force: boolean) {
      const t = messages(settings.taal);
      state = {
        kind: 'loading',
        step: t.view.loadingStep,
        progress: { current: 'transcript', factcheck: !setupMissing.includes('factcheck') },
      };
      render();

      try {
        const response = (await browser.runtime.sendMessage({
          type: 'evaluate',
          videoId,
          force,
        })) as { ok: boolean; data?: WwjdEvaluation; error?: string; code?: string };

        if (currentVideoId !== videoId) return;

        if (!response?.ok || !response.data) {
          const err = { code: response?.code, message: response?.error };
          state = { kind: 'error', ...analysisErrorView(t, err, settings.provider) };
          render();
          return;
        }

        state = { kind: 'done', evaluation: response.data, fromCache: false };
        render();
      } catch (err) {
        if (currentVideoId === videoId) {
          state = { kind: 'error', ...analysisErrorView(t, err, settings.provider) };
          render();
        }
      }
    }

    function seekVideo(seconds: number) {
      const video = document.querySelector('video') as HTMLVideoElement | null;
      if (video) {
        video.currentTime = Math.max(0, seconds);
        video.play().catch(() => {});
      }
    }

    function waitForElement(selectors: string[]): Promise<Element | null> {
      return new Promise((resolve) => {
        for (const s of selectors) {
          const el = document.querySelector(s);
          if (el) return resolve(el);
        }

        const observer = new MutationObserver(() => {
          for (const s of selectors) {
            const el = document.querySelector(s);
            if (el) {
              observer.disconnect();
              return resolve(el);
            }
          }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 12_000);
      });
    }

    // Keys added on the welcome page or in the settings: update the setup card right away.
    const onKeys = (changes: Record<string, unknown>, area: string) => {
      if (area !== 'local' || !(KEYS_UPDATED in changes)) return;
      const blocked = noAiKey();
      void refreshSetup().then(() => {
        if (blocked && !noAiKey() && currentVideoId && state.kind === 'idle') {
          void startForVideo(currentVideoId);
        } else {
          render();
        }
      });
    };
    browser.storage.onChanged.addListener(onKeys);

    // Progress of a running analysis, sent by the background
    const onProgress = (message: unknown) => {
      const m = message as { type?: string; videoId?: string; step?: AnalysisStep; factcheck?: boolean };
      if (m?.type !== 'progress' || !m.step || m.videoId !== currentVideoId) return;
      if (state.kind !== 'loading') return;
      state = { kind: 'loading', progress: { current: m.step, factcheck: Boolean(m.factcheck) } };
      render();
    };
    browser.runtime.onMessage.addListener(onProgress);

    // Score badges on thumbnails of videos analysed before (from the cache, no AI calls)
    const badges = startThumbnailBadges(() => settings);

    const stopSettings = onSettingsChanged((next) => {
      if (next.provider !== settings.provider) void refreshSetup().then(() => render());
      const enabledChanged = next.actief !== settings.actief;
      const collapsedChanged = next.paneelIngeklapt !== settings.paneelIngeklapt;
      const langChanged = next.taal !== settings.taal;
      settings = next;
      if (collapsedChanged) collapsed = next.paneelIngeklapt;
      if (enabledChanged) {
        panelCollapsed = !next.actief;
        if (!next.actief) collapsed = true;
      }
      if (langChanged && currentVideoId) {
        void mountPanel(currentVideoId);
      } else if (enabledChanged && next.actief && currentVideoId && state.kind === 'idle') {
        void startForVideo(currentVideoId);
      } else {
        render();
      }
    });

    document.addEventListener('yt-navigate-finish', handleNavigation);
    window.addEventListener('yt-navigate-finish', handleNavigation);
    window.addEventListener('popstate', handleNavigation);

    const interval = window.setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        handleNavigation();
      }
      if (currentVideoId && hostEl && !hostEl.isConnected) {
        placeHost();
      }
    }, 1000);

    ctx.onInvalidated(() => {
      stopSettings();
      browser.storage.onChanged.removeListener(onKeys);
      browser.runtime.onMessage.removeListener(onProgress);
      document.removeEventListener('timeupdate', onTime, true);
      document.removeEventListener('seeked', onTime, true);
      live?.stop();
      overlay?.destroy();
      badges.stop();
      themeObserver.disconnect();
      window.clearInterval(interval);
      document.removeEventListener('yt-navigate-finish', handleNavigation);
      window.removeEventListener('yt-navigate-finish', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
      hostEl?.remove();
    });

    lastUrl = window.location.href;
    handleNavigation();
  },
});
