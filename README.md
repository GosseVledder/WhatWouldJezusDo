<img src="apps/extension/public/icon/128.png" width="72" alt="Logo of What Would Jezus Do">

# What Would Jezus Do (WWJD)

**Fact-check any YouTube video and evaluate how its statements, actions, and attitude align with the teachings of Jesus Christ and the Ten Commandments.**

What Would Jezus Do (WWJD) analyzes YouTube videos in two fundamental steps: first, it extracts key claims and actions and verifies them through a fast fact-check (using the **Google Fact Check Tools API** with an AI historical/online verification fallback, while explicitly detecting self-contradiction as lying); second, it evaluates the fact-checked findings against a curated database of **25 Biblical guidelines** (the Ten Commandments in their broader context and 15 core New Testament teachings of Jesus), producing a clear **0.0–10.0 score** with direct, clickable links to the relevant Bible passages.

## Download

Ready to use: download, install, and enter your API keys. No build tools required.

| Platform | Download | Installation Guide |
|---|---|---|
| 📱 **Android App**<br>Phone and tablet, Android 7.0 or newer | [**WhatWouldJezusDo-0.2.0.apk**](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/apk/WhatWouldJezusDo-0.2.0.apk)<br>3.1 MB | [Install on Android](#installing-the-android-app) |
| 🧩 **Chrome & Edge Extension**<br>Windows, macOS, Linux | [**WhatWouldJezusDo-extension-0.2.0.zip**](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.2.0.zip)<br>217 kB | [Install in Chrome or Edge](#installing-the-extension-in-chrome-or-edge) |

You will need your own LLM API key from **Google (Gemini, free)** or **Anthropic (Claude, paid)**, and optionally a free **Google Fact Check Tools API key**; see [Configuring API Keys](#configuring-api-keys). All releases and their SHA-256 checksums are available under [Releases](https://github.com/GosseVledder/WhatWouldJezusDo/releases); both the app and the extension can check for updates directly via *Instellingen › Updates*.

---

## How It Works: Two Fundamental Activities

### 1. Extraction & Historical / Online Fact-Check
Statements made in a video are **never blindly accepted as truth**:
- **Key Statements & Claims**: Extracts the most important statements and claims from the video transcript, each with a clickable timestamp (`[mm:ss]`) that jumps directly to that moment in the video.
- **Primary Layer — Google Fact Check Tools API**: Queries `factchecktools.googleapis.com` in a fraction of a second to check whether independent fact-checking organizations (Reuters, AFP, Full Fact, PolitiFact, etc.) have already rated the claim (`True`, `False`, `Misleading`, etc.).
- **Fallback Layer — AI Historical & Online Verification**: For claims without a pre-existing fact-check record, the AI engine performs a historical and online verification to determine whether the claim is supported or refuted by established consensus.
- **Contradiction & Integrity Detection**: Explicitly checks whether the speaker contradicts themselves in word or deed (for example, promising *"I will not start a war"* and subsequently starting a war). **Self-contradiction is by definition classified as lying.**
- **Core Activity & Attitude**: Identifies the core activity being performed or promoted and evaluates the speaker's sentiment and attitude toward others.

### 2. Evaluation Against the Teachings of Jesus & The Ten Commandments
Once the statements and actions have been fact-checked, the verified dossier is evaluated against a database of **25 Biblical guidelines**:
- **The Ten Commandments (1–10)** in their broader ethical context and as deepened by Jesus in the New Testament (e.g., *You shall not murder* extended in the Sermon on the Mount to anger, dehumanizing insults, and warmongering; *You shall not bear false witness* applied to lying, slander, and self-contradiction).
- **15 Core Teachings of Jesus (11–25)** from the Gospels (including *Love your neighbor as yourself*, *The Golden Rule*, *Love your enemies*, *Turn the other cheek*, *Blessed are the peacemakers*, *Forgiveness*, *Do not judge*, *Care for the poor and marginalized*, *Rejection of hypocrisy*, *Servant leadership and humility*, *Meekness and mercy*, and *Accountability for every spoken word*).
- **Relevance Filtering**: Only guidelines that are **relevant** to the specific video are included in the score. Irrelevant guidelines are excluded so they do not skew the average.
- **0.0–10.0 Final Score**: Each relevant guideline is scored from `0` to `10`. The final WWJD score is the arithmetic mean of all relevant guideline scores, rounded to **one decimal place** (e.g., `4.3` or `7.6`).
- **Expandable Substantiation & Hard Bible Links**: Clicking to expand the score reveals every weighed guideline, its individual score, reasoning tied to the video's quotes and fact-check results, and **clickable Bible reference badges** linking directly to the scripture text on [`debijbel.nl`](https://www.debijbel.nl/).

<details>
<summary><b>📖 View All 25 Biblical Guidelines in the Database (The Ten Commandments + 15 Core Teachings of Jesus)</b></summary>

#### Part A: The Ten Commandments in Broader Context & Deepened by Jesus (1–10)

| # | Guideline / Commandment | Broader Meaning & Jesus' Fulfillment | Biblical Sources (OT + NT) |
|---|---|---|---|
| **1** | **No other gods (Love God and the good above all)** | Where does ultimate loyalty lie? Are money (Mammon), power, ideology, nation, or ego elevated above God and justice? | Exodus 20:2-3 · Matthew 22:37-38 · Matthew 6:24 · Luke 4:8 |
| **2** | **No idols (Purity of faith, do not abuse religion)** | Do not reduce faith or the sacred to a commercial or political instrument for personal gain or manipulation. | Exodus 20:4-6 · John 4:23-24 · Matthew 21:12-13 |
| **3** | **Do not misuse God's name & Integrity of oaths** | Do not claim God's authority to justify lies, violence, or injustice; let your "Yes" simply be "Yes" and your "No" be "No". | Exodus 20:7 · Matthew 5:33-37 · Matthew 7:21 |
| **4** | **Honor the Sabbath / Humanity & mercy above rigid rules** | Protect rest, recovery, and human dignity; saving lives and doing good always come before legalistic formalism. | Exodus 20:8-11 · Mark 2:27-28 · Matthew 12:11-12 |
| **5** | **Honor your father and mother (Care for parents & elders)** | Show respect and genuine material and moral care for parents, elders, and family bonds without pious excuses. | Exodus 20:12 · Mark 7:9-13 · John 19:26-27 |
| **6** | **You shall not murder (Including anger, hate speech & warmongering)** | Protect human life. Jesus extends this in the Sermon on the Mount to rage, contempt, dehumanizing slurs, and violence (*"all who draw the sword will die by the sword"*). | Exodus 20:13 · Matthew 5:21-22 · Matthew 26:52 · Luke 9:54-56 |
| **7** | **You shall not commit adultery (Relational faithfulness & purity)** | Faithfulness in relationships and commitments; do not reduce other people to objects of lust or exploitation. | Exodus 20:14 · Matthew 5:27-28 · Matthew 19:4-6 |
| **8** | **You shall not steal (Justice, fairness & restitution)** | Do not take what belongs to another through theft, plunder, fraud, or exploitation; share generously and restore what was taken. | Exodus 20:15 · Mark 10:19 · Luke 19:8-9 · John 10:10 |
| **9** | **You shall not bear false witness (Do not lie or contradict yourself)** | Speak the truth. Deliberate falsehoods, debunked claims, slander, or **self-contradiction** (e.g., promising peace while starting a war) are by definition lying. | Exodus 20:16 · Matthew 5:37 · John 8:44 · John 14:6 · Matthew 15:18-19 |
| **10** | **You shall not covet (Freedom from greed, envy & expansionism)** | Guard against all kinds of greed, jealousy, and the urge to seize what belongs to others; life does not consist in an abundance of possessions. | Exodus 20:17 · Luke 12:15 · Matthew 6:19-21 |

#### Part B: 15 Core New Testament Teachings & Guidelines of Jesus (11–25)

| # | Teaching / Guideline of Jesus | Broader Meaning for Video Evaluation | Biblical Sources (NT) |
|---|---|---|---|
| **11** | **Love your neighbor as yourself (Including the stranger & outsider)** | Active compassion for every human being without partiality, as exemplified in the Parable of the Good Samaritan. | Matthew 22:39-40 · Luke 10:27-37 · John 13:34-35 |
| **12** | **The Golden Rule (Treat others as you want to be treated)** | Active empathy and reciprocity: do to others what you would have them do to you, without double standards. | Matthew 7:12 · Luke 6:31 |
| **13** | **Love your enemies and pray for those who persecute you** | Reject hatred, dehumanization, and vengeance toward opponents; overcome evil with good. | Matthew 5:43-45 · Luke 6:27-28 · Luke 23:34 |
| **14** | **Turn the other cheek (Non-violence & de-escalation)** | Break the cycle of "an eye for an eye" retaliation through non-violence, calm restraint, and de-escalation. | Matthew 5:38-39 · Luke 6:29-30 · John 18:36 |
| **15** | **Blessed are the peacemakers (Active peace & reconciliation)** | Build bridges and pursue diplomacy and reconciliation rather than stoking division, polarization, or war. | Matthew 5:9 · Mark 9:50 · John 14:27 |
| **16** | **Forgiveness (Seventy times seven)** | Willingness to forgive and offer grace and restoration rather than harboring ruthless resentment or vengeance. | Matthew 18:21-22 · Matthew 6:14-15 · Luke 17:3-4 |
| **17** | **Do not judge (Self-reflection over self-righteousness)** | Remove the plank from your own eye before pointing at the speck in another's; humility over self-righteous condemnation. | Matthew 7:1-5 · John 8:7 · Luke 6:37 |
| **18** | **Care for the poor, hungry, and oppressed** | Whatever you do for the least of these (the hungry, strangers, sick, and downtrodden), you do for Jesus Himself. | Matthew 25:35-40 · Luke 14:13-14 · Luke 4:18 |
| **19** | **Rejection of hypocrisy (Words and deeds must match)** | Jesus sharply condemns leaders who preach noble or pious words in public while acting in the exact opposite way (*"by their fruit you will recognize them"*). | Matthew 23:3 · Matthew 7:16-20 · Luke 12:1 |
| **20** | **Humility and servant leadership** | True greatness is not dominating or exalting oneself, but serving others (*"whoever wants to be first must be servant of all"*). | Mark 10:42-45 · Luke 14:11 · John 13:14-15 |
| **21** | **Meekness and mercy** | Showing gentleness, patience, and deep compassion for human suffering rather than cruelty, arrogance, or intimidation. | Matthew 5:5 · Matthew 5:7 · Luke 6:36 |
| **22** | **Accountability for every spoken word** | Out of the overflow of the heart the mouth speaks; people are accountable for reckless, abusive, or destructive language. | Matthew 12:34-37 · Matthew 15:11 |
| **23** | **Faithful stewardship (Trustworthy in small and great things)** | Using entrusted power, resources, and influence responsibly for the common good rather than squandering or abusing them. | Luke 16:10 · Matthew 25:21 · Luke 12:48 |
| **24** | **Hunger and thirst for righteousness** | Courageously standing up for justice, truth, mercy, and the voiceless without partiality. | Matthew 5:6 · Matthew 23:23 · John 7:24 |
| **25** | **Protection of children and the vulnerable** | Welcoming and safeguarding children and the defenseless; causing them harm carries the heaviest condemnation. | Matthew 18:5-6 · Matthew 19:14 · Mark 9:36-37 |

</details>

---

## Installing the Android App

| Property | Details |
|---|---|
| **File** | [`WhatWouldJezusDo-0.2.0.apk`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/apk/WhatWouldJezusDo-0.2.0.apk) (also in [`apk/`](apk/)) |
| **Version** | 0.2.0 (versionCode 2) |
| **Requires** | Android 7.0 or newer |
| **Size** | 3.1 MB |
| **SHA-256** | `fbe127463f5bca93b8ea30dae56af488f99d670db5ac5d7b5fb75ed0a6188a6a` |

The APK is a signed release build distributed directly via GitHub.

1. **Download** the APK on your Android phone or tablet using the link above.
2. **Open** the downloaded `.apk` file from your notifications or *Files › Downloads*.
3. If prompted by Android, allow installation from this source (*Settings › Allow from this source*).
4. Tap **Install**. If Google Play Protect shows an unknown-developer prompt, choose *Install anyway*.
5. Open **What Would Jezus Do**, tap the **⚙️ Settings** icon in the top bar, and enter your [API keys](#configuring-api-keys); use *Test verbinding* to verify them.

### Using the Android App (Layout & Screens)
- **Home Screen & Recent History**: Share a video from the YouTube app (**Delen → What Would Jezus Do**) or paste any YouTube link on the start screen. Previously analyzed videos are listed under **Recent** with their thumbnail, title, WWJD score (`0.0–10.0`), and timestamp.
- **Evaluation Screen & Optional Player**:
  - Toggle the embedded **YouTube player** on or off using the ▶ button in the top bar (off by default).
  - When the player is off, tapping any `[mm:ss]` timestamp opens a choice dialog: show the embedded player and jump to that moment, or open the video at that timestamp directly in the **YouTube app**.
  - **Split-screen support**: When What Would Jezus Do is open next to the YouTube app in Android split-screen mode with the embedded player off, tapping a timestamp jumps the YouTube app in the other half of the screen directly to that moment.
- **Settings Screen (`#/instellingen`)**: Full-screen settings menu sharing the same design language as the browser extension: grouped cards, segmented **Gemini** / **Claude** provider selector, `Toon`/`Verberg` key buttons, collapsible *"Hoe kom ik aan een sleutel?"* guides, `ⓘ` info tooltips, *"Test verbinding"* buttons, cache management, and one-tap **in-app APK updates**. Every change is saved immediately.

---

## Installing the Extension in Chrome or Edge

| Property | Details |
|---|---|
| **File** | [`WhatWouldJezusDo-extension-0.2.0.zip`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.2.0.zip) (also unpacked in [`extension/WhatWouldJezusDo/`](extension/WhatWouldJezusDo/)) |
| **Version** | 0.2.0 |
| **Browsers** | Google Chrome and Microsoft Edge (Manifest V3) |
| **Size** | 217 kB |
| **SHA-256** | `1ef45034935bc85639ea2247b4afc4db7d86aa6fc2e421ba5134f8c9a0faf7c9` |

1. **Download** [`WhatWouldJezusDo-extension-0.2.0.zip`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.2.0.zip).
2. **Extract** the zip file to a permanent folder on your computer (for example, `Documents\WhatWouldJezusDo`). Keep this folder in place—the browser loads the extension from it.
3. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
4. Enable **Developer mode** (top-right in Chrome; left sidebar in Edge).
5. Click **Load unpacked** and select the extracted folder (the folder containing `manifest.json`).
6. Pin **What Would Jezus Do** to your browser toolbar and click its icon to open the settings tab and configure your [API keys](#configuring-api-keys).

### Using the Extension (Layout & Settings)
- **Watch-Page Panel**: On any YouTube watch page, the **WWJD** panel mounts at the top of the right-hand sidebar (or directly below The Point if both extensions are installed). Its header includes the **WWJD** badge, an **on/off switch**, and a toggle to expand or collapse the detailed substantiation.
- **Full-Tab Settings Page**: Clicking the extension icon in the browser toolbar opens the settings page in a full browser tab with sticky header and instant auto-save (`✓ Opgeslagen` / `✓ Saved`):
  - **Taal / Language**: Choose the language (`Nederlands`, `English`, `Deutsch`, `Français`, `Español`, `Italiano`, `Português`) for the interface, the AI analysis, and the linked Bible passages (`debijbel.nl` NBV21 for Dutch; localized BibleGateway versions such as `NIV` for English and other languages).
  - **AI-dienst**: Choose **Gemini** (Google) or **Claude** (Anthropic), enter your API key (`Toon`/`Verberg`), select or type a model (`<datalist>`), read *"Hoe kom ik aan een sleutel?"*, and verify with **Test verbinding**.
  - **Feitencontrole (Google Fact Check API)**: Toggle the primary fact-check lookup on or off, enter your free Google Fact Check API key, view step-by-step instructions, and test the connection with **Test verbinding**.
  - **Analyse & weergave**: Toggle the extension on/off, automatic analysis on video open, and whether substantiation starts collapsed.
  - **Updates**: Check GitHub Releases for a newer version, download the zip, and reload the extension in one click.
  - **Geavanceerd**: View and clear cached evaluations or inspect the per-call **Debuglog** table (provider, model, input size, duration, and token usage).

---

## Configuring API Keys

What Would Jezus Do runs directly on your device without a middleman server. Every setting is saved automatically as soon as you type or toggle it:

| Service | Purpose | Cost | Where to Create | Default Model |
|---|---|---|---|---|
| **Google Gemini** | AI Evaluation & Fact-Check Fallback | Free tier available (± 10/min, ± 200/day) | <https://aistudio.google.com/apikey> | `gemini-flash-latest` |
| **Anthropic Claude** | AI Evaluation (Alternative) | Paid (prepaid credit) | <https://console.anthropic.com/settings/keys> | `claude-haiku-5-5` |
| **Google Fact Check Tools API** | Fast primary lookup of existing fact-checks | 100% Free (up to 10,000/day) | <https://console.cloud.google.com/apis/credentials> | N/A |

### 1. Google Gemini API Key (Free)

1. Open **<https://aistudio.google.com/apikey>** and sign in with your Google account.
2. Accept the terms of service (first time only).
3. Click **Create API key** (choose an existing project or let one be created).
4. Copy the generated key (starts with `AIza...`).
5. In the WWJD settings, select **Gemini**, paste the key under *API-sleutel* (it saves automatically), and click **Test verbinding**.
   - As long as you do not link billing to the Google project, the Flash and Flash-Lite models (`gemini-flash-latest`, `gemini-3.8-flash`, `gemini-flash-lite-latest`) are free to use.

### 2. Google Fact Check Tools API Key (Free)

The **Google Fact Check Tools API** searches thousands of existing fact-checks from independent organizations worldwide (Reuters, AP, AFP, PolitiFact, Full Fact, etc.) in a fraction of a second. It is **100% free** (up to 10,000 queries/day) and requires **no credit card**.

1. Open **<https://console.cloud.google.com/apis/credentials>** and sign in with your Google account.
2. Select an existing project at the top (for example your Gemini project) or click **New Project** and name it `WWJD`.
3. Open the **[Fact Check Tools API page](https://console.cloud.google.com/apis/library/factchecktools.googleapis.com)** and click **Enable**.
4. Return to **[Credentials](https://console.cloud.google.com/apis/credentials)**, click **+ Create Credentials → API key**, and copy the key (`AIza...`).
5. Paste the key into **API-sleutel Fact Check** in the WWJD settings and click **Test verbinding**.
   > 💡 **Tip:** If you enable the *Fact Check Tools API* in the same Google Cloud project as your Gemini key, you can use the exact same `AIza...` key for both Gemini and Fact Check.

### 3. Anthropic Claude API Key (Paid Alternative)

1. Open **<https://console.anthropic.com/settings/keys>** and sign in.
2. Purchase prepaid credit under **Billing**.
3. Click **Create key**, copy the key (`sk-ant-...`), paste it under **Claude → API-sleutel** in the WWJD settings, and click **Test verbinding**.

---

## Updating

Both the Android app and the browser extension can check for updates via **Instellingen › Updates › Controleren op updates**:
- **Android App**: Tap **Downloaden en installeren**. The app downloads the new APK, verifies its SHA-256 checksum, and opens the Android package installer. Your keys, settings, and cached evaluations are preserved.
- **Browser Extension**: Download the new zip, extract it over your existing extension folder (replacing the files), and click **Herladen**.

### Privacy & Security
- **Browser Extension**: API keys are stored exclusively in the extension's isolated `IndexedDB` (`wwjd-secrets`), inaccessible to YouTube page scripts.
- **Android App**: API keys are stored encrypted in the Android Keystore (`@aparajita/capacitor-secure-storage`), and cloud/device backups are disabled (`android:allowBackup="false"`).
- **No Intermediary Server**: Your keys and video history are never sent to any third-party backend.

---

## Project Architecture & Building from Source

The repository is organized as a TypeScript monorepo using `npm workspaces`:

```
WhatWouldJezusDo/
├── packages/core/              # Platform-neutral engine & shared UI (@wwjd/core)
│   ├── src/
│   │   ├── guidelines/         # Database of 25 Jesus guidelines & Ten Commandments with Bible links
│   │   ├── factcheck/          # Google Fact Check Tools API client, verdict mapper & connection test
│   │   ├── engine/             # Two-stage evaluation engine, Zod schemas, Gemini/Claude providers
│   │   ├── youtube/            # InnerTube transcript fetcher & YouTube URL parser
│   │   ├── ui/                 # Shared Shadow DOM view, tooltips (ⓘ) & collapsible keySteps
│   │   ├── settings.ts         # Shared settings schema
│   │   └── update.ts           # GitHub Releases update checker
│   └── scripts/try.ts          # CLI evaluation runner
├── apps/extension/             # Chrome & Edge extension (@wwjd/extension, WXT Manifest V3)
├── apps/mobile/                # Android app (@wwjd/mobile, Capacitor + Vite)
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

# Build the mobile web assets & sync Capacitor Android
npm run android -w @wwjd/mobile

# Build the Android APK (inside apps/mobile/android)
./gradlew assembleRelease      # Windows: gradlew.bat assembleRelease

# Package the extension into extension/ and copy the release APK into apk/
npm run package:extension
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
