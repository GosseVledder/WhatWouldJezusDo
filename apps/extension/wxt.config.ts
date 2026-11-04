import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  // `--mode store`: Chrome Web Store / Edge Add-ons build without the GitHub update check.
  manifest: ({ mode }) => ({
    // Localised in public/_locales/<lang>/messages.json (store listings, browser UI)
    name: '__MSG_extName__',
    short_name: '__MSG_extShortName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    homepage_url: 'https://gossevledder.github.io/WhatWouldJezusDo/',
    permissions: ['storage', 'unlimitedStorage', 'declarativeNetRequestWithHostAccess'],
    action: { default_title: '__MSG_actionTitle__' },
    host_permissions: [
      'https://www.youtube.com/*',
      'https://api.anthropic.com/*',
      'https://generativelanguage.googleapis.com/*',
      'https://factchecktools.googleapis.com/*',
      ...(mode === 'store' ? [] : ['https://api.github.com/*']),
    ],
  }),
  webExt: {
    binaries: {
      edge: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    },
  },
});
