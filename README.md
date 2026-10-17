# What Would Jezus Do (WWJD)

**Fact-check any YouTube video and evaluate how its statements, actions, and attitude align with the teachings of Jesus Christ and the Ten Commandments.**

What Would Jezus Do (WWJD) analyzes YouTube videos in two fundamental steps: first, it extracts key claims and actions and verifies them through a fast fact-check (using the **Google Fact Check Tools API** with an AI historical/online verification fallback, while explicitly detecting self-contradiction as lying); second, it evaluates the fact-checked findings against a curated database of **25 Biblical guidelines** (the Ten Commandments in their broader context and 15 core New Testament teachings of Jesus), producing a clear **0.0–10.0 score** with direct, clickable links to the relevant Bible passages.

## Download

Ready to use: download, install, and enter your API keys. No build tools required.

| Platform | Download | Installation Guide |
|---|---|---|
| 📱 **Android App**<br>Phone and tablet, Android 7.0 or newer | [**WhatWouldJezusDo-0.1.0.apk**](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/apk/WhatWouldJezusDo-0.1.0.apk)<br>3.1 MB | [Install on Android](#installing-the-android-app) |
| 🧩 **Chrome & Edge Extension**<br>Windows, macOS, Linux | [**WhatWouldJezusDo-extension-0.1.0.zip**](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.1.0.zip)<br>54 kB | [Install in Chrome or Edge](#installing-the-extension-in-chrome-or-edge) |

You will need your own LLM API key from **Google (Gemini, free)** or **Anthropic (Claude, paid)**, and optionally a free **Google Fact Check Tools API key**; see [Configuring API Keys](#configuring-api-keys). All releases and their SHA-256 checksums are available under [Releases](https://github.com/GosseVledder/WhatWouldJezusDo/releases).

---

## How It Works: Two Fundamental Activities

### 1. Extraction & Historical / Online Fact-Check
Statements made in a video are **never blindly accepted as truth**:
- **Key Statements & Claims**: Extracts the most important statements and claims from the video transcript, each with a clickable timestamp (`[mm:ss]`) that jumps directly to that moment in the video.
- **Primary Layer — Google Fact Check Tools API**: Queries `factchecktools.googleapis.com` in a fraction of a second to check whether independent fact-checking organizations (Reuters, AFP, Full Fact, PolitiFact, etc.) have already rated the claim (`True`, `False`, `Misleading`, etc.).
- **Fallback Layer — AI Historical & Online Verification**: For claims without a pre-existing fact-check record, the AI engine performs a historical and online verification (using Google Search grounding) to determine whether the claim is supported or refuted by established consensus.
- **Contradiction & Integrity Detection**: Explicitly checks whether the speaker contradicts themselves in word or deed (for example, promising *"I will not start a war"* and subsequently starting a war). **Self-contradiction is by definition classified as lying.**
- **Core Activity & Attitude**: Identifies the core activity being performed or promoted and evaluates the speaker's sentiment and attitude toward others.

### 2. Evaluation Against the Teachings of Jesus & The Ten Commandments
Once the statements and actions have been fact-checked, the verified dossier is evaluated against a database of **25 Biblical guidelines**:
- **The Ten Commandments (1–10)** in their broader ethical context and as deepened by Jesus in the New Testament (e.g., *You shall not murder* extended in the Sermon on the Mount to anger, dehumanizing insults, and warmongering; *You shall not bear false witness* applied to lying, slander, and self-contradiction).
- **15 Core Teachings of Jesus (11–25)** from the Gospels (including *Love your neighbor as yourself*, *The Golden Rule*, *Love your enemies*, *Turn the other cheek*, *Blessed are the peacemakers*, *Forgiveness*, *Do not judge*, *Care for the poor and marginalized*, *Rejection of hypocrisy*, *Servant leadership and humility*, *Meekness and mercy*, and *Accountability for every spoken word*).
- **Relevance Filtering**: Only guidelines that are **relevant** to the specific video are included in the score. Irrelevant guidelines are excluded so they do not skew the average.
- **0.0–10.0 Final Score**: Each relevant guideline is scored from `0` to `10`. The final WWJD score is the arithmetic mean of all relevant guideline scores, rounded to **one decimal place** (e.g., `4.3` or `7.6`).
- **Expandable Substantiation & Hard Bible Links**: Clicking to expand the score reveals every weighed guideline, its individual score, reasoning tied to the video's quotes and fact-check results, and **clickable Bible reference badges** linking directly to the scripture text on [`debijbel.nl`](https://www.debijbel.nl/).

---

## Installing the Android App

| Property | Details |
|---|---|
| **File** | [`WhatWouldJezusDo-0.1.0.apk`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/apk/WhatWouldJezusDo-0.1.0.apk) (also in [`apk/`](apk/)) |
| **Version** | 0.1.0 (versionCode 1) |
| **Requires** | Android 7.0 or newer |
| **Size** | 3.1 MB |
| **SHA-256** | `fe87357dfefc232b90940523e5fea440536129976a25e329395fd924f8190e66` |

The APK is a signed release build distributed directly via GitHub.

1. **Download** the APK on your Android phone or tablet using the link above.
2. **Open** the downloaded `.apk` file from your notifications or *Files › Downloads*.
3. If prompted by Android, allow installation from this source (*Settings › Allow from this source*).
4. Tap **Install**. If Google Play Protect shows an unknown-developer prompt, choose *Install anyway*.
5. Open **What Would Jezus Do**, tap the **⚙️ Settings** icon, and enter your [API keys](#configuring-api-keys).

### Using the Android App
- **Share directly from YouTube**: In the YouTube app or browser, tap **Share › What Would Jezus Do**. The app opens and immediately starts analyzing the shared video.
- **Paste a link**: You can also paste any YouTube URL or video ID directly into the input field on the home screen.
- **Interactive Timestamps**: Tap any `[mm:ss]` timestamp in the fact-check or guideline breakdown to open the embedded player at that exact moment in the video.

---

## Installing the Extension in Chrome or Edge

| Property | Details |
|---|---|
| **File** | [`WhatWouldJezusDo-extension-0.1.0.zip`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.1.0.zip) (also unpacked in [`extension/WhatWouldJezusDo/`](extension/WhatWouldJezusDo/)) |
| **Version** | 0.1.0 |
| **Browsers** | Google Chrome and Microsoft Edge (Manifest V3) |
| **Size** | 54 kB |
| **SHA-256** | `5e1eebc0ccadbad49cadc4e66bf127343ec36e35d4e6a0da8973c87bb7e5b217` |

1. **Download** [`WhatWouldJezusDo-extension-0.1.0.zip`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.1.0.zip).
2. **Extract** the zip file to a permanent folder on your computer (for example, `Documents\WhatWouldJezusDo`). Keep this folder in place—the browser loads the extension from it.
3. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
4. Enable **Developer mode** (top-right in Chrome; left sidebar in Edge).
5. Click **Load unpacked** and select the extracted folder (the folder containing `manifest.json`).
6. Pin **What Would Jezus Do** to your browser toolbar and click its icon to open the settings page and configure your [API keys](#configuring-api-keys).

---

## Configuring API Keys

What Would Jezus Do runs directly on your device without a middleman server. You provide your own API keys:

| Service | Purpose | Cost | Where to Create | Default Model |
|---|---|---|---|---|
| **Google Gemini** | AI Evaluation & Search Grounding | Free tier available | <https://aistudio.google.com/app/apikey> | `gemini-flash-latest` |
| **Anthropic Claude** | AI Evaluation (Alternative) | Paid (prepaid credit) | <https://console.anthropic.com/settings/keys> | `claude-haiku-5-5` |
| **Google Fact Check Tools API** | Fast primary lookup of existing fact-checks | Free | <https://console.cloud.google.com/> (*Enable "Fact Check Tools API" → Credentials → Create API Key*) | N/A |

### Privacy & Security
- **Browser Extension**: API keys are stored exclusively in the extension's isolated `IndexedDB` (`wwjd-secrets`), inaccessible to YouTube page scripts.
- **Android App**: App backups are disabled (`android:allowBackup="false"`), and requests are sent directly from your device to YouTube, Google, or Anthropic.
- **No Intermediary Server**: Your keys and video history are never sent to any third-party backend.

---

## Project Architecture & Building from Source

The repository is organized as a TypeScript monorepo using `npm workspaces`:

```
WhatWouldJezusDo/
├── packages/core/              # Platform-neutral engine (@wwjd/core)
│   ├── src/
│   │   ├── guidelines/         # Database of 25 Jesus guidelines & Ten Commandments with Bible links
│   │   ├── factcheck/          # Google Fact Check Tools API client & verdict mapper
│   │   ├── engine/             # Two-stage evaluation engine, Zod schemas, Gemini/Claude providers
│   │   ├── youtube/            # InnerTube transcript fetcher & YouTube URL parser
│   │   ├── ui/                 # Shared Shadow DOM scorecard & expandable breakdown UI
│   │   └── settings.ts         # Shared settings schema
│   └── scripts/try.ts          # CLI evaluation runner
├── apps/extension/             # Chrome & Edge extension (@wwjd/extension, WXT Manifest V3)
├── apps/mobile/                # Android & Web app (@wwjd/mobile, Capacitor + Vite)
├── apk/                        # Signed Android release APK
└── extension/                  # Packaged unpacked extension & zip archive
```

### Build Commands

Requires **Node.js 20+**. Building the Android APK additionally requires **JDK 21** and the **Android SDK**.

```bash
# Install dependencies
npm install

# Build the Chrome/Edge extension (output in apps/extension/.output/chrome-mv3)
npm run build

# Package the extension into extension/ and update apk/
npm run package:extension

# Build the mobile web assets & sync Capacitor Android
npm run build -w @wwjd/mobile
cd apps/mobile && npx cap sync android

# Build the Android APK (inside apps/mobile/android)
./gradlew assembleRelease      # Windows: gradlew.bat assembleRelease
```

### Development Commands

| Command | Description |
|---|---|
| `npm run dev` / `npm run dev:edge` | Start WXT extension development with hot reload in Chrome / Edge |
| `npm run typecheck` | Run TypeScript type checking across all workspaces |
| `npm run lint` | Run ESLint code quality checks |
| `npm run format` | Format code with Prettier |
| `npm run try -- <videoId-or-URL> [--save]` | Run a live evaluation from the CLI using keys from `.env.local` |
| `npm run secrets` | Scan tracked and staged git files for accidentally committed API keys |

## License

MIT, see [LICENSE](LICENSE).
