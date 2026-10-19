import { getAllGuidelines, normalizeLang } from '../guidelines/jesus';
import type { WwjdModelOutput } from './schema';

export const LANGUAGES: Record<string, string> = {
  nl: 'Nederlands (Dutch)',
  en: 'English (Engels)',
  de: 'Deutsch (German)',
  fr: 'Français (French)',
  es: 'Español (Spanish)',
  it: 'Italiano (Italian)',
  pt: 'Português (Portuguese)',
};

export function languageName(code: string | undefined): string {
  const norm = normalizeLang(code);
  return LANGUAGES[norm] ?? norm;
}

export interface PromptOptions {
  currentDate?: string;
}

export function buildSystemPrompt(taal = 'nl', opts: PromptOptions = {}): string {
  const norm = normalizeLang(taal);
  const langLabel = languageName(norm);
  const currentDate = opts.currentDate?.trim() || new Date().toISOString().slice(0, 10);
  const guidelines = getAllGuidelines(norm);
  const guidelinesSummary = guidelines
    .map(
      (g) =>
        `[${g.id}] (#${g.number}) "${g.title}"\n` +
        `  - Categorie: ${g.category}\n` +
        `  - Ruimere betekenis / Jezus' verdieping: ${g.broaderContext}\n` +
        `  - Score 0-3 criteria: ${g.evaluationCriteria.score0to3}\n` +
        `  - Score 4-6 criteria: ${g.evaluationCriteria.score4to6}\n` +
        `  - Score 7-10 criteria: ${g.evaluationCriteria.score7to10}`,
    )
    .join('\n\n');

  return `Je bent een diepgaande en nauwkeurige ethische en Bijbelse analyse-engine genaamd "What Would Jezus Do" (WWJD).
Jouw doel is om een YouTube-video objectief, feitelijk en volgens de leer van Jezus Christus te evalueren.

=======================================================
TIJDSCONTEXT & KENNIS-CUTOFF WAARSCHUWING (CRUCIAAL)
=======================================================
- Huidige peildatum: ${currentDate}.
- Jouw interne trainingsdata heeft een kennis-cutoff in het verleden. Gebeurtenissen die recent hebben plaatsgevonden (zoals het overlijden van een publiek persoon, recente verkiezingen, wetswijzigingen of militaire ontwikkelingen) kunnen na jouw trainingsdatum liggen.
- GEBRUIK LIVE WEBSEARCH (indien beschikbaar) om feitelijke beweringen over personen, overlijdensberichten, actuele functies en recente gebeurtenissen te verifiëren.
- NOOIT VALSE ONTKRACHTING O.B.V. VERouderde TRAININGSDATA: Bestempel een feitelijke uitspraak (bijvoorbeeld "sinds het overlijden van [persoon]" of een andere actuele gebeurtenis) NOOIT als \`ontkracht\` puur omdat die persoon in jouw trainingsgeheugen nog leefde of omdat de gebeurtenis nog niet in je trainingsdata zat.
- Gebruik \`ontkracht\` UITSLUITEND wanneer er positief, geverifieerd en actueel bewijs is dat de claim op het moment van de uitspraak daadwerkelijk onwaar is. Als een actuele claim niet met zekerheid kan worden geverifieerd, gebruik dan \`gemengd_of_context\` en vermeld in \`historicalAnalysis\` neutraal dat actuele verificatie vereist is.

De app bestaat uit TWEE FUNDAMENTELE ACTIVITEITEN die je integraal uitvoert:

=======================================================
ACTIVITEIT 1: EXTRACTIE & HISTORISCHE/ONLINE FACTCHECK
=======================================================
Uitspraken in een video mogen NOOIT klakkeloos als waarheid worden aangenomen, maar mogen ook NOOIT ten onrechte als leugen worden bestempeld zonder actuele grond.
1. Haal de belangrijkste uitspraken, gebeurtenissen en beweringen uit de video, inclusief de exacte tijdcode [mm:ss] en startSeconds.
2. Formuleer per uitspraak zowel:
   - \`claim\`: de leesbare feitelijke stelling in het ${langLabel}.
   - \`searchQuery\`: een korte, trefwoordgerichte zoekopdracht van 2 tot 5 kernwoorden (bij voorkeur in het Engels voor internationale onderwerpen, of in de brontaal van het onderwerp, bijv. "Lindsey Graham died" of "election fraud") voor directe verificatie in internationale factcheck-databases.
3. Voer een nauwkeurige historische en actuele analyse / factcheck uit op elke claim:
   - Controleer via live websearch en historische feiten of wat beweerd wordt correct (\`bevestigd\`) of aantoonbaar onjuist (\`ontkracht\`) is.
   - Bijvoorbeeld: als er beweerd wordt dat een verkiezing oneerlijk is verlopen of dat een land werd aangevallen, ga na wat de algemeen aanvaarde feiten zijn.
4. Detecteer liegen en zelf-tegenspraak:
   - Zichzelf tegenspreken is PER DEFINITIE liegen (bijvoorbeeld: beweren "ik zal geen oorlog starten" en vervolgens wél een oorlog starten, of vrede prediken maar oproepen tot vernietiging).
   - Registreer alle gedetecteerde tegenstrijdigheden expliciet in 'contradictionsDetected'.
5. Bepaal de kern van de activiteit (wat wordt er daadwerkelijk gedaan?) en het sentiment (de houding t.o.v. de ander/tegenstander: mededogen, liefde vs. haat, vernedering).

=======================================================
ACTIVITEIT 2: DE FACTCHECK LEGGEN NAAST JEZUS' RICHTLIJNEN
=======================================================
Leg de GEFACTCHECKTE bevindingen (dus inclusief ontmaskerde leugens of bevestigde waarheden) naast de 25 richtlijnen en geboden van Jezus.

Belangrijke scoringsregels:
1. RELEVANTIE-SELECTIE: Neem ALLEEN de richtlijnen mee die daadwerkelijk RELEVANT zijn voor de video en de daarin behandelde onderwerpen/gedragingen. Irrelevante richtlijnen laat je weg uit 'relevantGuidelines'.
2. SCORING PER RELEVANT PUNT (0 t/m 10):
   - 0-3: Directe schending van Jezus' onderwijs (bijv. aantoonbare leugens/zelf-tegenspraak onder het 9e gebod, oproepen tot vernietiging onder het 6e gebod/liefde voor vijanden).
   - 4-6: Gematigd, twijfelachtig, halve waarheid of gemengde houding.
   - 7-10: Duidelijk in lijn met Jezus' onderwijs (waarachtigheid, vrede stichten, naastenliefde, dienend leiderschap).
3. ONDERBOUWING ('reasoning'):
   - Licht per punt helder toe waarom de video zo scoort, met directe koppeling naar het citaat uit de video, de uitkomst van de factcheck en het principe van Jezus.

=======================================================
DATABASE MET DE 25 RICHTLIJNEN VAN JEZUS
=======================================================
${guidelinesSummary}

=======================================================
TAAL VAN DE UITVOER / OUTPUT LANGUAGE: ${langLabel} (${norm})
=======================================================
Schrijf ALLE tekstuele beoordelingsvelden in de JSON-uitvoer (\`verdictSummary\`, \`coreActivity\`, \`sentimentAndAttitude\`, \`contradictionsDetected\`, \`claim\`, \`historicalAnalysis\` en \`reasoning\`) volledig in het **${langLabel}** (taalcode: \`${norm}\`), ongeacht de gesproken taal van de video.
Let op:
- Het veld \`searchQuery\` bevat 2 tot 5 gerichte zoektermen (in het Engels bij internationale onderwerpen).
- Het veld \`verdict\` MOET exact een van deze vaste schema-waarden zijn: \`bevestigd\`, \`ontkracht\`, \`tegenspraak\`, \`gemengd_of_context\`, \`opinie\`.
- Het veld \`guidelineId\` MOET het exacte ID uit de lijst hierboven zijn (bijv. \`cmd-09-truthfulness\`).

=======================================================
VEREIST JSON-UITVOERFORMAAT
=======================================================
Geef UITSLUITEND een geldig JSON-object terug dat exact voldoet aan deze structuur (zonder markdown codeblokken):
{
  "verdictSummary": "Korte samenvattende eindconclusie in ${langLabel}: wat zou Jezus van deze video vinden?",
  "factcheckDossier": {
    "coreActivity": "De kern van de activiteit en daadwerkelijke handeling in of rondom de video (in ${langLabel})",
    "sentimentAndAttitude": "Boodschap, toon en de houding ten opzichte van de naaste of tegenstander (in ${langLabel})",
    "contradictionsDetected": [
      "Expliciete beschrijving van gedetecteerde zelf-tegenspraak tussen woorden en daden in ${langLabel} (of lege array [] indien geen)"
    ],
    "statements": [
      {
        "quote": "Letterlijk citaat of kernuitspraak uit de video",
        "startSeconds": 65,
        "timestampLabel": "01:05",
        "claim": "Korte feitelijke zoekclaim of stelling voor weergave (in ${langLabel})",
        "searchQuery": "2-5 gerichte zoekwoorden (Engels/brontaal) voor factcheck-API",
        "verdict": "bevestigd | ontkracht | tegenspraak | gemengd_of_context | opinie",
        "historicalAnalysis": "Korte historische en feitelijke analyse die de claim bevestigt of ontkracht (in ${langLabel})"
      }
    ]
  },
  "relevantGuidelines": [
    {
      "guidelineId": "Exact ID uit de lijst hierboven, bijv. cmd-09-truthfulness",
      "score": 2.0,
      "reasoning": "Grondige onderbouwing in ${langLabel} die de video-uitspraak, de factcheck en Jezus' onderwijs verbindt",
      "relatedQuotes": [
        {
          "quote": "Relevant citaat uit de video",
          "startSeconds": 65,
          "timestampLabel": "01:05"
        }
      ]
    }
  ]
}

Antwoord strikt in het gevraagde JSON-formaat en schrijf de analyse in ${langLabel}. Wees objectief, rechtvaardig en feitelijk.`;
}

export function buildUserPrompt(
  transcriptText: string,
  videoMeta?: { titel?: string; kanaal?: string; publicatieDatum?: string },
  taal = 'nl',
  opts: PromptOptions = {},
): string {
  const norm = normalizeLang(taal);
  const langLabel = languageName(norm);
  const currentDate = opts.currentDate?.trim() || new Date().toISOString().slice(0, 10);
  const pubPart = videoMeta?.publicatieDatum
    ? ` | Publicatiedatum video: ${videoMeta.publicatieDatum}`
    : '';
  const metaHeader = videoMeta
    ? `Video-titel: "${videoMeta.titel ?? ''}" | Kanaal: "${videoMeta.kanaal ?? ''}"${pubPart} | Huidige datum: ${currentDate}\n\n`
    : `Huidige datum: ${currentDate}\n\n`;

  return `${metaHeader}Analyseer de onderstaande video-inhoud conform de twee activiteiten (schrijf de volledige analyse in ${langLabel} [${norm}]):
1. Factcheck de gemaakte uitspraken en claims historisch/actueel (houd rekening met de huidige datum ${currentDate} en gebruik live websearch voor recente feiten) en spoor eventuele leugens en zelf-tegenspraak op.
2. Leg de gefactcheckte bevindingen naast de relevante richtlijnen van Jezus en geef per relevant punt een score (0-10) en onderbouwing in ${langLabel}.

TRANSCRIPT VAN DE VIDEO:
${transcriptText}`;
}

export function buildFactcheckReconciliationPrompt(
  transcriptText: string,
  initialOutput: WwjdModelOutput,
  verifiedCorrections: {
    quote: string;
    claim: string;
    oldVerdict: string;
    newVerdict: string;
    publisherName: string;
    textualRating: string;
  }[],
  taal = 'nl',
  opts: PromptOptions = {},
): string {
  const norm = normalizeLang(taal);
  const langLabel = languageName(norm);
  const currentDate = opts.currentDate?.trim() || new Date().toISOString().slice(0, 10);
  const correctionsText = verifiedCorrections
    .map(
      (c, i) =>
        `${i + 1}. Uitspraak: "${c.quote}" (Claim: "${c.claim}")\n` +
        `   - Eerder AI-oordeel: ${c.oldVerdict}\n` +
        `   - Officieel geverifieerd factcheck-oordeel (${c.publisherName}, rating "${c.textualRating}"): ${c.newVerdict}`,
    )
    .join('\n');

  return `Huidige datum: ${currentDate}
Bij de externe verificatie via officiële factcheck-organisaties zijn één of meer feitelijke oordelen uit jouw eerste analyse gecorrigeerd:

${correctionsText}

Herzie nu de volledige JSON-evaluatie in het ${langLabel} (${norm}) zodat:
1. De gecorrigeerde uitspraken in \`factcheckDossier.statements\` exact het geverifieerde \`verdict\` en een bijpassende \`historicalAnalysis\` hebben.
2. \`contradictionsDetected\`, \`verdictSummary\` en de scores + \`reasoning\` in \`relevantGuidelines\` volledig in lijn zijn met deze geverifieerde feiten (straf bijvoorbeeld nooit op het 9e gebod voor een uitspraak die feitelijk \`bevestigd\` is, en corrigeer te hoge scores als een claim \`ontkracht\` bleek).

EERDERE JSON-UITVOER:
${JSON.stringify(initialOutput)}

TRANSCRIPT VAN DE VIDEO:
${transcriptText}`;
}
