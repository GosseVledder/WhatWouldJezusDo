import {
  DEFAULT_MODELS,
  evaluateVideo,
  getTranscriptById,
  parseVideoId,
  renderWwjdView,
  type ProviderId,
} from '@wwjd/core';
import { nativeFetch } from './nativeFetch';
import { onShare } from './shareIntent';

const STORAGE_KEYS = {
  provider: 'wwjd_mob_provider',
  apiKey: 'wwjd_mob_api_key',
  factcheckKey: 'wwjd_mob_factcheck_key',
};

function getStored(key: string, def = ''): string {
  return localStorage.getItem(key) || def;
}

function setStored(key: string, val: string) {
  localStorage.setItem(key, val);
}

/** Extract a YouTube URL or video ID from shared text (e.g. "Title https://youtu.be/abc"). */
function extractYouTubeFromSharedText(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  if (urlMatch && parseVideoId(urlMatch[0])) return urlMatch[0];
  return parseVideoId(text) ? text.trim() : null;
}

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('video-url-input') as HTMLInputElement;
  const evalBtn = document.getElementById('btn-evaluate') as HTMLButtonElement;
  const resultsView = document.getElementById('results-view') as HTMLElement;
  const playerContainer = document.getElementById('player-container') as HTMLElement;
  const playerIframe = document.getElementById('yt-player') as HTMLIFrameElement;
  const settingsBtn = document.getElementById('btn-settings') as HTMLButtonElement;
  const settingsDialog = document.getElementById('settings-dialog') as HTMLDialogElement;
  const mobProvider = document.getElementById('mob-provider') as HTMLSelectElement;
  const mobKey = document.getElementById('mob-key') as HTMLInputElement;
  const mobFactcheckKey = document.getElementById('mob-factcheck-key') as HTMLInputElement;
  const mobSaveSettings = document.getElementById('mob-save-settings') as HTMLButtonElement;
  const mobCloseSettings = document.getElementById('mob-close-settings') as HTMLButtonElement;

  // Init settings
  mobProvider.value = getStored(STORAGE_KEYS.provider, 'gemini');
  mobKey.value = getStored(STORAGE_KEYS.apiKey, '');
  mobFactcheckKey.value = getStored(STORAGE_KEYS.factcheckKey, '');

  settingsBtn.addEventListener('click', () => {
    settingsDialog.showModal();
  });

  mobCloseSettings.addEventListener('click', () => {
    settingsDialog.close();
  });

  mobSaveSettings.addEventListener('click', (e) => {
    e.preventDefault();
    setStored(STORAGE_KEYS.provider, mobProvider.value);
    setStored(STORAGE_KEYS.apiKey, mobKey.value.trim());
    setStored(STORAGE_KEYS.factcheckKey, mobFactcheckKey.value.trim());
    settingsDialog.close();
    alert('Instellingen opgeslagen!');
  });

  async function runEvaluation() {
    const rawUrl = urlInput.value.trim();
    const videoId = parseVideoId(rawUrl);
    if (!videoId) {
      alert('Voer een geldige YouTube video-link of video ID in.');
      return;
    }

    const provider = getStored(STORAGE_KEYS.provider, 'gemini') as ProviderId;
    const apiKey = getStored(STORAGE_KEYS.apiKey, '');
    const factCheckApiKey = getStored(STORAGE_KEYS.factcheckKey, '') || undefined;

    if (!apiKey) {
      alert('Geen API-sleutel ingesteld. Klik op het tandwiel-icoon ⚙️ om je sleutel op te slaan.');
      settingsDialog.showModal();
      return;
    }

    evalBtn.disabled = true;
    evalBtn.textContent = 'Bezig...';
    resultsView.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 24px; margin-bottom: 8px;">⏳</div>
        <strong>Video analyseren en factchecken...</strong>
        <p style="color: var(--text-muted); font-size: 13px;">Ondertitels ophalen, feiten verifiëren via Google Fact Check en toetsen aan Jezus' richtlijnen.</p>
      </div>
    `;

    try {
      const transcriptRes = await getTranscriptById(videoId, { fetch: nativeFetch });
      if (!transcriptRes.transcript) {
        throw new Error(
          `Geen transcript beschikbaar voor deze video (${transcriptRes.reden ?? 'geen ondertitels'}).`,
        );
      }

      const model = DEFAULT_MODELS[provider];
      const evaluation = await evaluateVideo(
        {
          videoId,
          transcript: transcriptRes.transcript,
          meta: transcriptRes.info.meta,
        },
        provider,
        { apiKey, model, factCheckApiKey, fetch: nativeFetch },
      );

      // Render evaluation view
      renderWwjdView(resultsView, evaluation, {
        onSeek(seconds) {
          playerContainer.style.display = 'block';
          playerIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${Math.floor(seconds)}`;
          playerContainer.scrollIntoView({ behavior: 'smooth' });
        },
      });
    } catch (err) {
      resultsView.innerHTML = `
        <div class="card" style="border-color: #c5221f; color: #c5221f;">
          <strong>Fout bij analyseren:</strong><br>
          ${(err as Error).message}
        </div>
      `;
    } finally {
      evalBtn.disabled = false;
      evalBtn.textContent = 'Analyseer';
    }
  }

  // Check URL params for shared links: e.g. ?url=...
  const params = new URLSearchParams(window.location.search);
  const sharedUrl = params.get('url') || params.get('text');
  if (sharedUrl) {
    const extracted = extractYouTubeFromSharedText(sharedUrl);
    if (extracted) {
      urlInput.value = extracted;
      void runEvaluation();
    }
  }

  // Android native share intent listener ("Delen -> What Would Jezus Do")
  onShare((e) => {
    const extracted = extractYouTubeFromSharedText(e.text);
    if (extracted) {
      urlInput.value = extracted;
      void runEvaluation();
    }
  });

  evalBtn.addEventListener('click', () => {
    void runEvaluation();
  });
});
