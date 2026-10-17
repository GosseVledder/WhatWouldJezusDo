import { parseVideoId, renderWwjdView, type WwjdEvaluation } from '@wwjd/core';

export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  cssInjectionMode: 'manual',

  main() {
    let currentVideoId: string | null = null;
    let hostEl: HTMLElement | null = null;

    function handleNavigation() {
      const videoId = parseVideoId(window.location.href);
      if (videoId === currentVideoId) return;

      currentVideoId = videoId;
      if (!videoId) {
        if (hostEl) {
          hostEl.remove();
          hostEl = null;
        }
        return;
      }

      mountPanel(videoId);
    }

    async function mountPanel(videoId: string) {
      // Find insertion point on YouTube watch page
      const target = await waitForElement([
        '#secondary-inner',
        '#secondary',
        '#below',
        '#primary-inner',
      ]);
      if (!target || currentVideoId !== videoId) return;

      if (!hostEl) {
        hostEl = document.createElement('div');
        hostEl.id = 'wwjd-root';
        hostEl.style.marginBottom = '16px';
        target.prepend(hostEl);
      }

      const shadow = hostEl.shadowRoot ?? hostEl.attachShadow({ mode: 'open' });
      renderLoading(shadow);

      try {
        const response = (await browser.runtime.sendMessage({
          type: 'evaluate',
          videoId,
        })) as { ok: boolean; data?: WwjdEvaluation; error?: string };

        if (currentVideoId !== videoId) return;

        if (!response.ok || !response.data) {
          renderError(shadow, response.error ?? 'Onbekende fout bij evaluatie.');
          return;
        }

        renderWwjdView(shadow as unknown as HTMLElement, response.data, {
          onSeek(seconds) {
            seekVideo(seconds);
          },
        });
      } catch (err) {
        if (currentVideoId === videoId) {
          renderError(shadow, (err as Error).message);
        }
      }
    }

    function renderLoading(root: ShadowRoot) {
      root.innerHTML = `
        <div style="background: rgba(0,0,0,0.05); border-radius: 12px; padding: 16px; font-family: Roboto, sans-serif; font-size: 14px; color: #0f0f0f; border: 1px solid rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #065fd4; color: #fff; font-weight: 700; font-size: 11px; padding: 2px 6px; border-radius: 4px;">WWJD</span>
            <strong>What Would Jezus Do</strong>
          </div>
          <div style="margin-top: 10px; color: #606060;">
            ⏳ Video factchecken en toetsen aan Jezus' richtlijnen en De Tien Geboden...
          </div>
        </div>
      `;
    }

    function renderError(root: ShadowRoot, errorMsg: string) {
      root.innerHTML = `
        <div style="background: #fce8e6; color: #c5221f; border-radius: 12px; padding: 14px; font-family: Roboto, sans-serif; font-size: 13px; border: 1px solid #c5221f;">
          <div style="font-weight: 600; margin-bottom: 4px;">WWJD Analyse kon niet worden voltooid</div>
          <div>${escapeHtml(errorMsg)}</div>
          <div style="margin-top: 8px;">
            <button id="wwjd-open-opt" style="background: #c5221f; color: #fff; border: 0; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Instellingen openen</button>
          </div>
        </div>
      `;
      root.querySelector('#wwjd-open-opt')?.addEventListener('click', () => {
        browser.runtime.sendMessage({ type: 'openOptions' });
      });
    }

    function seekVideo(seconds: number) {
      const video = document.querySelector('video') as HTMLVideoElement | null;
      if (video) {
        video.currentTime = Math.max(0, seconds);
        video.play().catch(() => {});
      }
    }

    function escapeHtml(str: string): string {
      return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
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

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(null);
        }, 8000);
      });
    }

    window.addEventListener('yt-navigate-finish', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    handleNavigation();
  },
});
