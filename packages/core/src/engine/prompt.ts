import { JESUS_GUIDELINES } from '../guidelines/jesus';

export function buildSystemPrompt(): string {
  const guidelinesSummary = JESUS_GUIDELINES.map(
    (g) =>
      `[${g.id}] (#${g.number}) "${g.title}"\n` +
      `  - Categorie: ${g.category}\n` +
      `  - Ruimere betekenis / Jezus' verdieping: ${g.broaderContext}\n` +
      `  - Score 0-3 criteria: ${g.evaluationCriteria.score0to3}\n` +
      `  - Score 4-6 criteria: ${g.evaluationCriteria.score4to6}\n` +
      `  - Score 7-10 criteria: ${g.evaluationCriteria.score7to10}`,
  ).join('\n\n');

  return `Je bent een diepgaande en nauwkeurige ethische en Bijbelse analyse-engine genaamd "What Would Jezus Do" (WWJD).
Jouw doel is om een YouTube-video objectief, feitelijk en volgens de leer van Jezus Christus te evalueren.

De app bestaat uit TWEE FUNDAMENTELE ACTIVITEITEN die je integraal uitvoert:

=======================================================
ACTIVITEIT 1: EXTRACTIE & HISTORISCHE/ONLINE FACTCHECK
=======================================================
Uitspraken in een video mogen NOOIT klakkeloos als waarheid worden aangenomen.
1. Haal de belangrijkste uitspraken, gebeurtenissen en beweringen uit de video, inclusief de exacte tijdcode [mm:ss] en startSeconds.
2. Voer een korte en snelle historische analyse / factcheck uit op elke claim:
   - Controleer of wat beweerd wordt over het algemeen als historisch of feitelijk correct (bevestigd) of onjuist (ontkracht) wordt beschouwd.
   - Bijvoorbeeld: als er beweerd wordt dat een verkiezing oneerlijk is verlopen of dat een land werd aangevallen, ga na wat de algemeen aanvaarde feiten zijn.
3. Detecteer liegen en zelf-tegenspraak:
   - Zichzelf tegenspreken is PER DEFINITIE liegen (bijvoorbeeld: beweren "ik zal geen oorlog starten" en vervolgens wél een oorlog starten, of vrede prediken maar oproepen tot vernietiging).
   - Registreer alle gedetecteerde tegenstrijdigheden expliciet in 'contradictionsDetected'.
4. Bepaal de kern van de activiteit (wat wordt er daadwerkelijk gedaan?) en het sentiment (de houding t.o.v. de ander/tegenstander: mededogen, liefde vs. haat, vernedering).

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
VEREIST JSON-UITVOERFORMAAT
=======================================================
Geef UITSLUITEND een geldig JSON-object terug dat exact voldoet aan deze structuur (zonder markdown codeblokken):
{
  "verdictSummary": "Korte samenvattende eindconclusie in het Nederlands: wat zou Jezus van deze video vinden?",
  "factcheckDossier": {
    "coreActivity": "De kern van de activiteit en daadwerkelijke handeling in of rondom de video",
    "sentimentAndAttitude": "Boodschap, toon en de houding ten opzichte van de naaste of tegenstander",
    "contradictionsDetected": [
      "Expliciete beschrijving van gedetecteerde zelf-tegenspraak tussen woorden en daden (of lege array [] indien geen)"
    ],
    "statements": [
      {
        "quote": "Letterlijk citaat of kernuitspraak uit de video",
        "startSeconds": 65,
        "timestampLabel": "01:05",
        "claim": "Korte feitelijke zoekclaim of stelling voor factchecking",
        "verdict": "bevestigd | ontkracht | tegenspraak | gemengd_of_context | opinie",
        "historicalAnalysis": "Korte historische en feitelijke analyse die de claim bevestigt of ontkracht"
      }
    ]
  },
  "relevantGuidelines": [
    {
      "guidelineId": "Exact ID uit de lijst hierboven, bijv. cmd-09-truthfulness",
      "score": 2.0,
      "reasoning": "Grondige onderbouwing die de video-uitspraak, de factcheck en Jezus' onderwijs verbindt",
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

Antwoord strikt in het gevraagde JSON-formaat. Wees objectief, rechtvaardig en feitelijk.`;
}

export function buildUserPrompt(
  transcriptText: string,
  videoMeta?: { titel?: string; kanaal?: string },
): string {
  const metaHeader = videoMeta
    ? `Video-titel: "${videoMeta.titel ?? ''}" | Kanaal: "${videoMeta.kanaal ?? ''}"\n\n`
    : '';

  return `${metaHeader}Analyseer de onderstaande video-inhoud conform de twee activiteiten:
1. Factcheck de gemaakte uitspraken en claims historisch/feitelijk en spoor eventuele leugens en zelf-tegenspraak op.
2. Leg de gefactcheckte bevindingen naast de relevante richtlijnen van Jezus en geef per relevant punt een score (0-10) en onderbouwing.

TRANSCRIPT VAN DE VIDEO:
${transcriptText}`;
}
