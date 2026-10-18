// Native stores: Preferences (SharedPreferences) for settings and cache, and the
// Keystore-backed secure storage for API keys. Keys never go into Preferences.
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Preferences } from '@capacitor/preferences';
import type { KeyValue } from './kv';

export const preferencesKV: KeyValue = {
  get: async (key) => {
    try {
      return (await Preferences.get({ key })).value;
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: async (key, value) => {
    try {
      await Preferences.set({ key, value });
    } catch {
      localStorage.setItem(key, value);
    }
  },
  remove: async (key) => {
    try {
      await Preferences.remove({ key });
    } catch {
      localStorage.removeItem(key);
    }
  },
};

export const secureKV: KeyValue = {
  get: async (key) => {
    try {
      const val = await SecureStorage.getItem(key);
      return typeof val === 'string' ? val : null;
    } catch {
      return localStorage.getItem(key);
    }
  },
  set: async (key, value) => {
    try {
      await SecureStorage.setItem(key, value);
    } catch {
      localStorage.setItem(key, value);
    }
  },
  remove: async (key) => {
    try {
      await SecureStorage.removeItem(key);
    } catch {
      localStorage.removeItem(key);
    }
  },
};
