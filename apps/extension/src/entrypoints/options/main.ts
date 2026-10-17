import type { WwjdSettings } from '@wwjd/core';
import { readKeys, writeKeys } from '../../storage/secrets';

async function init() {
  const providerSelect = document.getElementById('provider-select') as HTMLSelectElement;
  const geminiGroup = document.getElementById('gemini-key-group') as HTMLElement;
  const claudeGroup = document.getElementById('claude-key-group') as HTMLElement;
  const geminiKeyInput = document.getElementById('gemini-key') as HTMLInputElement;
  const claudeKeyInput = document.getElementById('claude-key') as HTMLInputElement;
  const factcheckKeyInput = document.getElementById('factcheck-key') as HTMLInputElement;
  const factcheckEnabled = document.getElementById('factcheck-enabled') as HTMLInputElement;
  const activeEnabled = document.getElementById('active-enabled') as HTMLInputElement;
  const autoEnabled = document.getElementById('auto-enabled') as HTMLInputElement;
  const saveBtn = document.getElementById('save-btn') as HTMLButtonElement;
  const statusBox = document.getElementById('status-box') as HTMLElement;

  // Toggle provider inputs
  function updateProviderVisibility() {
    if (providerSelect.value === 'claude') {
      claudeGroup.style.display = 'block';
      geminiGroup.style.display = 'none';
    } else {
      claudeGroup.style.display = 'none';
      geminiGroup.style.display = 'block';
    }
  }
  providerSelect.addEventListener('change', updateProviderVisibility);

  // Load stored keys and settings
  const keys = await readKeys();
  geminiKeyInput.value = keys.gemini || '';
  claudeKeyInput.value = keys.claude || '';
  factcheckKeyInput.value = keys.factcheck || '';

  const resp = (await browser.runtime.sendMessage({ type: 'getSettings' })) as {
    ok: boolean;
    data?: WwjdSettings;
  };
  if (resp?.ok && resp.data) {
    const s = resp.data;
    providerSelect.value = s.provider || 'gemini';
    factcheckEnabled.checked = s.googleFactCheckActief !== false;
    activeEnabled.checked = s.actief !== false;
    autoEnabled.checked = s.automatisch !== false;
    updateProviderVisibility();
  }

  // Save handler
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    statusBox.className = 'status-msg';
    statusBox.style.display = 'none';

    try {
      // Save keys in IndexedDB
      await writeKeys({
        gemini: geminiKeyInput.value.trim(),
        claude: claudeKeyInput.value.trim(),
        factcheck: factcheckKeyInput.value.trim(),
      });

      // Save settings
      const settings = {
        ...(resp?.data ?? {}),
        provider: providerSelect.value,
        googleFactCheckActief: factcheckEnabled.checked,
        actief: activeEnabled.checked,
        automatisch: autoEnabled.checked,
      };

      await browser.runtime.sendMessage({ type: 'saveSettings', settings });

      statusBox.className = 'status-msg ok';
      statusBox.textContent = 'Instellingen en API-sleutels succesvol opgeslagen!';
      statusBox.style.display = 'block';
    } catch (e) {
      statusBox.className = 'status-msg err';
      statusBox.textContent = `Fout bij opslaan: ${(e as Error).message}`;
      statusBox.style.display = 'block';
    } finally {
      saveBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
