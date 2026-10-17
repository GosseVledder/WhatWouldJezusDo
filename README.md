# What Would Jezus Do (WWJD)

**Fact-check any YouTube video and evaluate how its statements, actions, and attitude align with the teachings of Jesus Christ and the Ten Commandments.**

What Would Jezus Do (WWJD) analyzes YouTube videos in two fundamental steps: first, it extracts key claims and actions and verifies them through a fast fact-check (using the **Google Fact Check Tools API** with an AI historical/online verification fallback, while explicitly detecting self-contradiction as lying); second, it evaluates the fact-checked findings against a curated database of **25 Biblical guidelines** (the Ten Commandments in their broader context and 15 core New Testament teachings of Jesus), producing a clear **0.0–10.0 score** with direct, clickable links to the relevant Bible passages.

## Download

Ready to use: download, install, and enter your API keys. No build tools required.

| Platform | Download | Installation Guide |
|---|---|---|
| 📱 **Android App**<br>Phone and tablet, Android 7.0 or newer | [**WhatWouldJezusDo-0.1.0.apk**](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/apk/WhatWouldJezusDo-0.1.0.apk)<br>3.1 MB | [Install on Android](#installing-the-android-app) |
| 🧩 **Chrome & Edge Extension**<br>Windows, macOS, Linux | [**WhatWouldJezusDo-extension-0.1.0.zip**](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/extension/WhatWouldJezusDo-extension-0.1.0.zip)<br>55 kB | [Install in Chrome or Edge](#installing-the-extension-in-chrome-or-edge) |

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
| **File** | [`WhatWouldJezusDo-0.1.0.apk`](https://github.com/GosseVledder/WhatWouldJezusDo/raw/main/apk/WhatWouldJezusDo-0.1.0.apk) (also in [`apk/`](apk/)) |
| **Version** | 0.1.0 (versionCode 1) |
| **Requires** | Android 7.0 or newer |
| **Size** | 3.1 MB |
| **SHA-256** | `a9231a188d25c1eb637d92190f84538a3597ec831dcd30ac19a6803ef97e7a2c` |

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
| **Size** | 55 kB |
| **SHA-256** | `7b283f6ecabb30375877c3a6bce9e35bba32cd16c35a6c93c845e8b6f68b2837` |

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
| **Google Fact Check Tools API** | Fast primary lookup of existing fact-checks | 100% Free | <https://console.cloud.google.com/apis/library/factchecktools.googleapis.com> | N/A |

---

### Step-by-Step Guide (For Dummies): Google Fact Check Tools API Key

The **Google Fact Check Tools API** lets the app search thousands of existing fact-checks from independent organizations worldwide (Reuters, AP, AFP, PolitiFact, Full Fact, etc.) in less than a second.

- **Cost**: **100% Free** (up to 10,000 queries per day).
- **Credit Card Needed?**: **No.** You do **not** need to enable billing or enter a credit card.

#### Step 1 — Open Google Cloud Console
1. Go to **<https://console.cloud.google.com/>** in your browser.
2. Sign in with your regular Google / Gmail account.
3. *First time visiting?* A welcome popup will ask you to accept the Terms of Service. Check the box and click **Agree and Continue**.
   > 💡 **Important:** Ignore any banner at the top offering "$300 in free credit / Start Free Trial". You do **not** need a trial or credit card for the Fact Check Tools API.

#### Step 2 — Select or Create a Project
1. Look at the very top bar (just to the right of the **Google Cloud** logo) and click the **Project dropdown button** (it may say *Select a project* or *My First Project*).
2. A popup window will appear:
   - **Shortcut:** If you already created a Gemini key in Google AI Studio, you may already see a project in the list (such as `Default Gemini Project`). You can simply click that project to select it!
   - **Or create a new project:** Click **New Project** in the top-right corner of the popup, enter a name like `WWJD-FactCheck`, and click **Create**. Wait a few seconds and make sure `WWJD-FactCheck` is selected in the top bar.

#### Step 3 — Enable the "Fact Check Tools API"
1. Click this direct link to open the Fact Check Tools API page:
   👉 **<https://console.cloud.google.com/apis/library/factchecktools.googleapis.com>**
   *(Alternatively: click the search bar at the top of Google Cloud Console, type `Fact Check Tools API`, and click the result with the blue API icon).*
2. Click the blue **Enable** button.
3. Wait 2–5 seconds until the page refreshes and shows that the API is enabled.

#### Step 4 — Create and Copy Your API Key
1. Click this direct link to open the Credentials page:
   👉 **<https://console.cloud.google.com/apis/credentials>**
   *(Alternatively: in the left sidebar menu, click **APIs & Services › Credentials**).*
2. At the top of the page, click **+ Create Credentials** and choose **API key** from the dropdown menu.
3. A box titled *API key created* will pop up showing a long code that starts with `AIzaSy...`.
4. Click the **Copy** icon next to the key.

#### Step 5 — (Optional) Restrict Your Key to Only the Fact Check API
For extra peace of mind so the key cannot be used for anything else:
1. Click on your newly created API key in the **Credentials** list.
2. Under **API restrictions**, select **Restrict key**.
3. Click the **Select APIs** dropdown, check **Fact Check Tools API**, click **OK**, and click **Save**.
   > 💡 **Pro Tip:** If you enabled the *Fact Check Tools API* on the same Google Cloud project as your Gemini key and did not restrict your Gemini key to a single API, that single `AIzaSy...` key can actually be pasted into **both** the Gemini field and the Fact Check field!

#### Step 6 — Paste the Key into What Would Jezus Do
- **In the Chrome / Edge Extension**:
  1. Click the **WWJD** icon in your browser toolbar to open the Settings page.
  2. Under *2. Google Fact Check Tools API*, make sure **Google Fact Check Tools API inschakelen** is checked.
  3. Paste your `AIzaSy...` key into **Google Fact Check API-sleutel**.
  4. Click **Instellingen & Sleutels Opslaan** at the bottom.
- **In the Android App**:
  1. Tap the **⚙️ Settings** icon in the top-right corner.
  2. Paste your `AIzaSy...` key into **Google Fact Check Tools API Key**.
  3. Tap **Opslaan**.

---

### Step-by-Step Guide: Google Gemini API Key (Free)

1. Open **<https://aistudio.google.com/app/apikey>** and sign in with your Google account.
2. Accept the terms of service if prompted.
3. Click **Create API key** (choose an existing project or click *Create API key in new project*).
4. Copy the generated key (starts with `AIzaSy...`).
5. Paste it into the **Gemini API key** field in the WWJD settings and click **Save**.
   - As long as you do not attach a billing account to the Google project, the Flash models (`gemini-flash-latest`) are completely free to use within Google's free-tier rate limits.

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
