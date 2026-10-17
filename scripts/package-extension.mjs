// Build the extension and put a ready-to-load copy in `extension/` for download from GitHub:
// the unpacked folder `extension/WhatWouldJezusDo/` and `extension/WhatWouldJezusDo-extension-<version>.zip`.
// Usage: npm run package:extension
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'apps/extension/.output');
const target = join(root, 'extension');
const { version } = JSON.parse(readFileSync(join(root, 'apps/extension/package.json'), 'utf8'));

execSync('npm run zip', { cwd: root, stdio: 'inherit' });

const builtZip = readdirSync(output).find((f) => f.endsWith(`-${version}-chrome.zip`));
if (!builtZip) throw new Error(`No zip for version ${version} in ${output}`);

mkdirSync(target, { recursive: true });
for (const name of readdirSync(target))
  if (name === 'WhatWouldJezusDo' || /^WhatWouldJezusDo-extension-.*\.zip$/.test(name))
    rmSync(join(target, name), { recursive: true });

cpSync(join(output, 'chrome-mv3'), join(target, 'WhatWouldJezusDo'), { recursive: true });
const zipName = `WhatWouldJezusDo-extension-${version}.zip`;
copyFileSync(join(output, builtZip), join(target, zipName));

const zip = readFileSync(join(target, zipName));
const sha256 = createHash('sha256').update(zip).digest('hex');
console.log(`\nextension/WhatWouldJezusDo/ and extension/${zipName}`);
console.log(`Size: ${Math.round(zip.length / 1024)} kB, SHA-256: ${sha256}`);

// Also copy APK if built
const releaseApk = join(
  root,
  'apps/mobile/android/app/build/outputs/apk/release',
  `WhatWouldJezusDo-${version}.apk`,
);
if (existsSync(releaseApk)) {
  const apkDir = join(root, 'apk');
  mkdirSync(apkDir, { recursive: true });
  const targetApk = join(apkDir, `WhatWouldJezusDo-${version}.apk`);
  copyFileSync(releaseApk, targetApk);
  const apkBytes = readFileSync(targetApk);
  const apkSha256 = createHash('sha256').update(apkBytes).digest('hex');
  console.log(`\napk/WhatWouldJezusDo-${version}.apk`);
  console.log(`Size: ${(apkBytes.length / (1024 * 1024)).toFixed(1)} MB, SHA-256: ${apkSha256}`);
}
