// Generates the extension icons (public/icon/<size>.png) and Android launcher/splash icons without external tools.
// Usage: npx tsx apps/extension/scripts/make-icons.ts
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

type RGBA = [number, number, number, number];

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function pngRect(width: number, height: number, pixel: (x: number, y: number) => RGBA): Buffer {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixel(x, y);
      const o = y * (width * 4 + 1) + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function png(size: number, pixel: (x: number, y: number) => RGBA): Buffer {
  return pngRect(size, size, pixel);
}

function inRoundedSquare(x: number, y: number): boolean {
  const r = 0.22;
  const cx = Math.min(Math.max(x, r), 1 - r);
  const cy = Math.min(Math.max(y, r), 1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function inCircle(x: number, y: number): boolean {
  return (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.5 ** 2;
}

function inRoundedRect(
  x: number,
  y: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  r: number,
): boolean {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r);
  const cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

function sampleGlyph(lx: number, ly: number): RGBA | null {
  // Golden dot in bottom-right (matching ThePoint's palette #FFCC00 + #1A56DB)
  if ((lx - 18.6) ** 2 + (ly - 17.8) ** 2 <= 2.3 ** 2) {
    return [255, 204, 0, 255];
  }
  // White Latin cross
  const inVertical = inRoundedRect(lx, ly, 9.6, 3.2, 13.0, 20.8, 1.1);
  const inHorizontal = inRoundedRect(lx, ly, 5.2, 7.4, 17.4, 10.8, 1.1);
  if (inVertical || inHorizontal) {
    return [255, 255, 255, 255];
  }
  return null;
}

// 24-unit coordinate space: Latin cross + golden checkmark/star dot in lower-right
const SPAN = 26;
function sample(x: number, y: number): RGBA {
  if (!inRoundedSquare(x, y)) return [0, 0, 0, 0];
  const lx = 12 + (x - 0.5) * SPAN;
  const ly = 12 + (y - 0.5) * SPAN;
  return sampleGlyph(lx, ly) ?? [26, 86, 219, 255]; // #1A56DB
}

function sampleRound(x: number, y: number): RGBA {
  if (!inCircle(x, y)) return [0, 0, 0, 0];
  const lx = 12 + (x - 0.5) * SPAN;
  const ly = 12 + (y - 0.5) * SPAN;
  return sampleGlyph(lx, ly) ?? [26, 86, 219, 255];
}

// Android 108dp adaptive icon foreground: inner 66dp safe zone holds the 26-unit icon space
const FOREGROUND_SPAN = SPAN * (108 / 64);
function sampleForeground(x: number, y: number): RGBA {
  const lx = 12 + (x - 0.5) * FOREGROUND_SPAN;
  const ly = 12 + (y - 0.5) * FOREGROUND_SPAN;
  return sampleGlyph(lx, ly) ?? [0, 0, 0, 0];
}

function supersample(size: number, fn: (x: number, y: number) => RGBA): Buffer {
  const ss = 4;
  return png(size, (px, py) => {
    const acc: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < ss; i++) {
      for (let j = 0; j < ss; j++) {
        const c = fn((px + (i + 0.5) / ss) / size, (py + (j + 0.5) / ss) / size);
        acc[0] += c[0] * c[3];
        acc[1] += c[1] * c[3];
        acc[2] += c[2] * c[3];
        acc[3] += c[3];
      }
    }
    const a = acc[3]!;
    return a === 0
      ? [0, 0, 0, 0]
      : [
          Math.round(acc[0]! / a),
          Math.round(acc[1]! / a),
          Math.round(acc[2]! / a),
          Math.round(a / (ss * ss)),
        ];
  });
}

function renderSplash(width: number, height: number): Buffer {
  const iconSize = Math.round(Math.min(width, height) * 0.28);
  const iconBuf = supersample(iconSize, sampleForeground);
  // Decode raw pixels by sampling directly in the center box
  const x0 = Math.floor((width - iconSize) / 2);
  const y0 = Math.floor((height - iconSize) / 2);
  void iconBuf;
  const ss = 2;
  return pngRect(width, height, (px, py) => {
    if (px < x0 || px >= x0 + iconSize || py < y0 || py >= y0 + iconSize) {
      return [26, 86, 219, 255];
    }
    const acc: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < ss; i++) {
      for (let j = 0; j < ss; j++) {
        const u = (px - x0 + (i + 0.5) / ss) / iconSize;
        const v = (py - y0 + (j + 0.5) / ss) / iconSize;
        const lx = 12 + (u - 0.5) * SPAN;
        const ly = 12 + (v - 0.5) * SPAN;
        const c = sampleGlyph(lx, ly) ?? [26, 86, 219, 255];
        acc[0] += c[0];
        acc[1] += c[1];
        acc[2] += c[2];
        acc[3] += 255;
      }
    }
    const n = ss * ss;
    return [Math.round(acc[0] / n), Math.round(acc[1] / n), Math.round(acc[2] / n), 255];
  });
}

const dir = join(import.meta.dirname, '..', 'public', 'icon');
mkdirSync(dir, { recursive: true });
for (const size of [16, 32, 48, 96, 128]) {
  writeFileSync(join(dir, `${size}.png`), supersample(size, sample));
}
console.log('extension icons written to', dir);

// Also generate Android mipmap launcher icons & splash screens so the APK matches the extension icon
const androidRes = join(import.meta.dirname, '..', '..', 'mobile', 'android', 'app', 'src', 'main', 'res');
if (existsSync(androidRes)) {
  const mipmapSizes: Array<{ folder: string; launcher: number; foreground: number }> = [
    { folder: 'mipmap-mdpi', launcher: 48, foreground: 108 },
    { folder: 'mipmap-hdpi', launcher: 72, foreground: 162 },
    { folder: 'mipmap-xhdpi', launcher: 96, foreground: 216 },
    { folder: 'mipmap-xxhdpi', launcher: 144, foreground: 324 },
    { folder: 'mipmap-xxxhdpi', launcher: 192, foreground: 432 },
  ];
  for (const { folder, launcher, foreground } of mipmapSizes) {
    const folderPath = join(androidRes, folder);
    mkdirSync(folderPath, { recursive: true });
    writeFileSync(join(folderPath, 'ic_launcher.png'), supersample(launcher, sample));
    writeFileSync(join(folderPath, 'ic_launcher_round.png'), supersample(launcher, sampleRound));
    writeFileSync(
      join(folderPath, 'ic_launcher_foreground.png'),
      supersample(foreground, sampleForeground),
    );
  }
  for (const entry of readdirSync(androidRes)) {
    if (!entry.startsWith('drawable')) continue;
    const splashPath = join(androidRes, entry, 'splash.png');
    if (existsSync(splashPath)) {
      const existing = readFileSync(splashPath);
      const w = existing.readUInt32BE(16);
      const h = existing.readUInt32BE(20);
      writeFileSync(splashPath, renderSplash(w, h));
    }
  }
  console.log('android launcher and splash icons written to', androidRes);
}
