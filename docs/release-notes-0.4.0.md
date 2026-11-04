# What Would Jezus Do 0.4.0

Extension 0.4.0 (Chrome, Edge) · Android app 0.4.0 (versionCode 13)

## Set up in about three minutes

- **Welcome page.** Opens by itself after installing (extension) or at first start (app), in the
  language of your browser or phone. Two numbered cards, one per key, each with one big button to
  the exact page where the key is made and a "Show me where to click" step list.
- **Keys checked as you paste them.** A green tick when a key works; otherwise a plain-language
  message: wrong key, key for another Google service, API not switched on (with a one-click
  "Switch it on" link), limit reached, or no internet. The same checks are used in Settings.
- **"Setup not finished" reminders** in the YouTube panel, on the settings page and on the app's
  start screen, naming the key that is still missing, and a **Setup guide** link in Settings. A key
  that Google rejects is not saved, so the reminder stays until a working key is pasted.
- **Updated key steps**: a key that AI Studio already made for you is used as is, and the Fact
  Check steps include the API restriction that Google Cloud now asks for.
- **Two separate keys.** Earlier versions said the Gemini key could also be used for Fact Check.
  Keys made in Google AI Studio only work for Gemini, so that tip is gone. Newer Gemini keys that
  start with `AQ.` are accepted.

## Clearer results

- **Summary.** A short summary of the video's message, written after the fact check, with the
  list of checked facts, their verdicts and clickable timestamps.
- **Two scores side by side**: *Story & facts* and *Presenter*, at the top of the result and in
  the collapsed line.
- **Sources per verdict.** Web sources are attached to the statement they support instead of to
  every statement; other sources consulted are listed separately, and a statement without a
  source says so. Search sources are no longer lost when a fact-check correction re-scores the
  video.
- **Step-by-step progress** while a video is analysed.

## Follow along while you watch

- **Synced live mode** (on by default): the panel lights up and scrolls to each fact check and
  teaching note at the moment it is said. Scroll yourself and it waits a few seconds. Also in the
  app when the YouTube player is shown.
- **Overlay on video** (extension, off by default): a small subtitle-style card on the video at
  each checked moment.
- **Thumbnail badges** (extension): videos you analysed before show their score on YouTube
  thumbnails, from your saved analyses (no AI calls).

## Other

- The extension is now called *What Would Jezus Do* (short WWJD) in the browser, with its
  description in all seven languages.
- Error messages from the AI service (invalid key, limit reached, no connection, …) are shown in
  your language; they were always in Dutch.
- New website with installation steps and FAQ, and a privacy policy:
  https://gossevledder.github.io/WhatWouldJezusDo/

Your keys, settings and saved analyses are kept when you update. Analyses saved with an earlier
version show without the new summary; use ↻ Re-analyse to get it.
