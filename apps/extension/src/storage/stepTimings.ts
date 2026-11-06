import { createStepTimingStore, type KeyValue } from '@wwjd/core';

// Durations per analysis step (for "usually ~40 s" in the step list), in extension storage.
const localKV: KeyValue = {
  get: async (key) => {
    const value = (await browser.storage.local.get(key))[key];
    return typeof value === 'string' ? value : null;
  },
  set: async (key, value) => browser.storage.local.set({ [key]: value }),
  remove: async (key) => browser.storage.local.remove(key),
};

export const stepTimings = createStepTimingStore(localKV);
