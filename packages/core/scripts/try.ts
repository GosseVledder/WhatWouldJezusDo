import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { DEFAULT_MODELS } from '../src/engine/config';
import { evaluateVideo } from '../src/engine/evaluate';
import type { ProviderId, Transcript, VideoMeta } from '../src/engine/types';
import { getTranscriptById } from '../src/youtube/transcript';
import { parseVideoId } from '../src/youtube/videoId';

const root = join(import.meta.dirname, '..');
const envFile = join(root, '..', '..', '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]!]) process.env[m[1]!] = m[2]!.replace(/^["']|["']$/g, '');
  }
}

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const target = args.find(
  (a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'),
);
if (!target) {
  console.error(
    'Gebruik: npm run try -- <videoId-of-URL> [--provider gemini|claude] [--model ...] [--save]',
  );
  process.exit(1);
}

const provider = (flag('provider') ??
  (process.env.GEMINI_API_KEY ? 'gemini' : 'claude')) as ProviderId;
const apiKey = provider === 'claude' ? process.env.ANTHROPIC_API_KEY : process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    `Geen sleutel voor ${provider}. Zet ${provider === 'claude' ? 'ANTHROPIC_API_KEY' : 'GEMINI_API_KEY'} in .env.local.`,
  );
  process.exit(1);
}

const factCheckApiKey = process.env.GOOGLE_FACTCHECK_API_KEY;
const model = flag('model') ?? DEFAULT_MODELS[provider];

const videoId = parseVideoId(target) ?? target;
console.log(`\nWWJD Evaluatie starten voor video: ${videoId}`);
console.log(`Provider: ${provider} (${model})`);
if (factCheckApiKey) {
  console.log('Google Fact Check Tools API: Ingeschakeld');
} else {
  console.log(
    'Google Fact Check Tools API: Niet ingesteld (zet GOOGLE_FACTCHECK_API_KEY in .env.local voor live Google Factchecks)',
  );
}

async function main() {
  let meta: VideoMeta;
  let transcript: Transcript;

  const targetStr = target!;
  const fixturePath = existsSync(targetStr)
    ? targetStr
    : join(root, 'tests', 'fixtures', `${basename(targetStr, '.json')}.json`);

  if (existsSync(fixturePath)) {
    console.log(`Laden vanuit fixture: ${fixturePath}`);
    const raw = readFileSync(fixturePath, 'utf8') as string;
    const fx = JSON.parse(raw);
    meta = fx.meta;
    transcript = fx.transcript;
  } else {
    console.log(`Transcript ophalen van YouTube...`);
    const res = await getTranscriptById(videoId);
    if (!res.transcript) {
      console.error(`Kon geen transcript ophalen voor video ${videoId}: ${res.reden}`);
      process.exit(1);
    }
    meta = res.info.meta;
    transcript = res.transcript;
    console.log(`Transcript opgehaald: ${meta.titel} (${transcript.segmenten.length} segmenten)`);
  }

  console.log(
    'Starten met tweetraps-analyse (1. Factcheck & Integriteit, 2. Toetsing aan Jezus)...',
  );
  const evaluation = await evaluateVideo({ videoId, transcript, meta }, provider, {
    apiKey: apiKey!,
    model,
    factCheckApiKey,
  });

  console.log('\n======================================================');
  console.log(`WWJD EINDSCORE: ${evaluation.finalScore.toFixed(1)} / 10`);
  console.log('======================================================');
  console.log(`Conclusie: ${evaluation.verdictSummary}\n`);

  console.log('--- 1. FACTCHECK & INTEGRITEIT (ACTIVITEIT 1) ---');
  console.log(`Kern van de activiteit: ${evaluation.factcheckDossier.coreActivity}`);
  console.log(`Sentiment & houding: ${evaluation.factcheckDossier.sentimentAndAttitude}`);
  if (evaluation.factcheckDossier.contradictionsDetected.length > 0) {
    console.log('\n⚠️ ZELF-TEGENSPRAAK GECONSTATEERD (= PER DEFINITIE LIEGEN):');
    evaluation.factcheckDossier.contradictionsDetected.forEach((c) => console.log(`  • ${c}`));
  }
  console.log('\nUitspraken & Factcheck:');
  evaluation.factcheckDossier.statements.forEach((s) => {
    console.log(`  [${s.timestampLabel}] "${s.quote}"`);
    console.log(`    Oordeel: [${s.verdict.toUpperCase()}]`);
    console.log(`    Factcheck: ${s.historicalAnalysis}`);
  });

  console.log("\n--- 2. TOETSING AAN JEZUS' RICHTLIJNEN (ACTIVITEIT 2) ---");
  console.log(
    `${evaluation.relevantGuidelines.length} relevante richtlijnen meegewogen in het gemiddelde:`,
  );
  evaluation.relevantGuidelines.forEach((g) => {
    console.log(`\n• #${g.number} ${g.title}: ${g.score.toFixed(1)} / 10`);
    console.log(`  Onderbouwing: ${g.reasoning}`);
    console.log('  Harde Bijbelverwijzingen:');
    g.bibleSources.forEach((b) => {
      console.log(`    📖 ${b.reference}: "${b.quote}"`);
      console.log(`       Link: ${b.url}`);
    });
  });

  if (args.includes('--save')) {
    const outFile = join(root, `wwjd-evaluation-${videoId}.json`);
    writeFileSync(outFile, JSON.stringify(evaluation, null, 2), 'utf8');
    console.log(`\nEvaluatie opgeslagen in: ${outFile}`);
  }
}

main().catch((err) => {
  console.error('\nFout tijdens evaluatie:', err);
  process.exit(1);
});
