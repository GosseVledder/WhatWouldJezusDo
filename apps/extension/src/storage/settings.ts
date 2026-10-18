import {
  DEFAULT_WWJD_SETTINGS,
  parseWwjdSettings,
  wwjdSettingsSchema,
  type WwjdSettings,
} from '@wwjd/core';

export {
  DEFAULT_WWJD_SETTINGS,
  parseWwjdSettings,
  wwjdSettingsSchema,
  type WwjdSettings,
};

const SETTINGS_KEY = 'settings';

export async function getSettings(): Promise<WwjdSettings> {
  const stored = await browser.storage.local.get(SETTINGS_KEY);
  return parseWwjdSettings(stored[SETTINGS_KEY]);
}

export async function saveSettings(patch: Partial<WwjdSettings>): Promise<WwjdSettings> {
  const current = await getSettings();
  const next = parseWwjdSettings({ ...current, ...patch });
  await browser.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}

export function onSettingsChanged(cb: (s: WwjdSettings) => void): () => void {
  const listener = (changes: Record<string, { newValue?: unknown }>, area: string) => {
    if (area === 'local' && changes[SETTINGS_KEY]) {
      cb(parseWwjdSettings(changes[SETTINGS_KEY].newValue));
    }
  };
  browser.storage.onChanged.addListener(listener);
  return () => browser.storage.onChanged.removeListener(listener);
}
