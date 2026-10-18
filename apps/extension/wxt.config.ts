import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifestVersion: 3,
  manifest: {
    name: 'WWJD',
    description:
      "Factcheckt YouTube-video's en toetst uitspraken en gedrag aan de Tien Geboden en de leer van Jezus.",
    permissions: ['storage', 'unlimitedStorage', 'declarativeNetRequestWithHostAccess'],
    action: { default_title: 'WWJD – instellingen' },
    host_permissions: [
      'https://www.youtube.com/*',
      'https://api.anthropic.com/*',
      'https://generativelanguage.googleapis.com/*',
      'https://factchecktools.googleapis.com/*',
      'https://api.github.com/*',
    ],
  },
  webExt: {
    binaries: {
      edge: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    },
  },
});
