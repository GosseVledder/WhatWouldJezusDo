import {
  DEFAULT_WWJD_SETTINGS,
  messages,
  parseVideoId,
  renderWwjdStateView,
  type WwjdEvaluation,
  type WwjdSettings,
  type WwjdViewState,
} from '@wwjd/core';
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
          onSeek: (seconds) => seekVideo(seconds),
          onToggleCollapse: (nextCollapsed) => {
            collapsed = nextCollapsed;
            void saveSettings({ paneelIngeklapt: nextCollapsed });
          },
          onToggleEnabled: (enabled) => {
            settings = { ...settings, actief: enabled };
            void saveSettings({ actief: enabled });
            if (enabled && state.kind === 'idle') {
              void runEvaluation(videoId, false);
            } else {
              render();
            }
          },
        },
        {
          collapsed,
          enabled: settings.actief,
          taal: settings.taal,
        },
      );
    }

    function handleNavigation() {
      const onWatch = window.location.pathname === '/watch';
      const videoId = onWatch ? parseVideoId(window.location.href) : null;
      if (videoId === currentVideoId) return;

      currentVideoId = videoId;
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

      if (!settings.actief || !settings.automatisch) {
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
      };
      render();

      try {
        const response = (await browser.runtime.sendMessage({
          type: 'evaluate',
          videoId,
          force,
        })) as { ok: boolean; data?: WwjdEvaluation; error?: string };

        if (currentVideoId !== videoId) return;

        if (!response?.ok || !response.data) {
          const msg = response?.error ?? t.extension.unknownError;
          state = {
            kind: 'error',
            message: msg,
            showSettings: /sleutel|instellingen|toegang|key|settings|clé|Schlüssel|clave|chiave|chave/i.test(
              msg,
            ),
          };
          render();
          return;
        }

        state = { kind: 'done', evaluation: response.data, fromCache: false };
        render();
      } catch (err) {
        if (currentVideoId === videoId) {
          const msg = (err as Error).message;
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

    const stopSettings = onSettingsChanged((next) => {
      const enabledChanged = next.actief !== settings.actief;
      const collapsedChanged = next.paneelIngeklapt !== settings.paneelIngeklapt;
      const langChanged = next.taal !== settings.taal;
      settings = next;
      if (collapsedChanged) collapsed = next.paneelIngeklapt;
      if (langChanged && currentVideoId) {
        void mountPanel(currentVideoId);
      } else if (enabledChanged && next.actief && currentVideoId && state.kind === 'idle') {
        void runEvaluation(currentVideoId, false);
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
