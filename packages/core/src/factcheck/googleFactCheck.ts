import { EngineError, type FactcheckVerdict, type WebSource } from '../engine/types';

export interface FactCheckClaimReview {
  publisher: {
    name: string;
    site?: string;
  };
  url: string;
  title?: string;
  textualRating: string;
  reviewDate?: string;
  languageCode?: string;
}

export interface FactCheckClaim {
  text: string;
  claimant?: string;
  claimDate?: string;
  claimReview?: FactCheckClaimReview[];
}

export interface GoogleFactCheckApiResponse {
  claims?: FactCheckClaim[];
  nextPageToken?: string;
}

export interface FactCheckMatch {
  claimText: string;
  claimant?: string;
  publisherName: string;
  reviewUrl: string;
  textualRating: string;
  verdict: FactcheckVerdict;
  reviewDate?: string;
  sources: WebSource[];
}

export interface FactCheckSearchOptions {
  fetch?: typeof fetch;
  languageCode?: string;
  referenceDate?: string | Date;
  maxStatusAgeDays?: number;
}

const FACTCHECK_API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

export function mapTextualRatingToVerdict(rating: string): FactcheckVerdict {
  const r = rating.toLowerCase().trim();
  if (!r) {
    return 'gemengd_of_context';
  }

  // 1. Zelf-tegenspraak / Flip-flop
  if (
    /\b(tegenspraak|zelf-?tegenspraak|tegenstrijdig|contradict\w*|full\s+flop|flip[\s-]*flop)\b/i.test(
      r,
    )
  ) {
    return 'tegenspraak';
  }

  // 2. Opinie
  if (/\b(opinie|opinion|mening)\b/i.test(r)) {
    return 'opinie';
  }

  // 3. Misleidend / Gedeeltelijk waar / Uit context / Onbevestigd (voordat we op los 'waar'/'onwaar' testen)
  if (
    /misleading|misleidend|half[\s-]*(true|waar|flip)|mostly\s+false|grotendeels\s+onwaar|partly|partially|gedeeltelijk|\bdeels\b|overdreven|exaggerated|context|verband|nuance|unverified|onbevestigd|niet\s+bevestigd|unproven|onbewezen|unsupported|gemengd|mixed|needs\s+context|mist\s+context/i.test(
      r,
    )
  ) {
    return 'gemengd_of_context';
  }

  // 4. Onwaar / Fake / Weerlegd (vóór 'bevestigd' zodat 'inaccurate', 'not true', 'niet waar' nooit op positieve woorden matchen)
  if (
    /false|onwaar|incorrect|onjuist|untrue|not\s+true|niet\s+(waar|juist|correct|accuraat)|klopt\s+niet|fake|nep|inaccurat\w*|not\s+accurate|leugen|hoax|fabricated|verzonnen|pants\s+on\s+fire|pinocchio|ontkracht|weerlegd|debunk\w*|refut\w*|fout|verkeerd|scam|satire/i.test(
      r,
    )
  ) {
    return 'ontkracht';
  }

  // 5. Waar / Juist / Bevestigd
  if (
    /\b(true|mostly\s+true|waar|grotendeels\s+waar|correct|juist|accurate|accuraat|verified|bevestigd|klopt|feit|fact)\b/i.test(
      r,
    )
  ) {
    return 'bevestigd';
  }

  return 'gemengd_of_context';
}

const STOPWORDS = new Set([
  'de',
  'het',
  'een',
  'van',
  'en',
  'in',
  'op',
  'is',
  'was',
  'zijn',
  'dat',
  'die',
  'voor',
  'met',
  'als',
  'aan',
  'om',
  'ook',
  'niet',
  'naar',
  'bij',
  'uit',
  'maar',
  'over',
  'door',
  'sinds',
  'the',
  'and',
  'for',
  'that',
  'with',
  'from',
  'are',
  'has',
  'have',
  'been',
  'was',
  'were',
  'this',
  'not',
  'about',
  'since',
  'after',
]);

const LIFE_STATUS_REGEX =
  /\b(died|dead|death|overleden|overlijden|gestorven|dood|passed\s+away|still\s+alive|leeft\s+nog|in\s+leven)\b/i;

export function extractSignificantTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export function isClaimRelevantToQuery(query: string, claim: FactCheckClaim): boolean {
  const qTokens = extractSignificantTokens(query);
  if (qTokens.length === 0) return true;

  const reviewTitles = (claim.claimReview ?? [])
    .map((r) => r?.title ?? '')
    .filter(Boolean)
    .join(' ');
  const candidateText = `${claim.text ?? ''} ${claim.claimant ?? ''} ${reviewTitles}`;
  const cTokens = extractSignificantTokens(candidateText);
  if (cTokens.length === 0) return true;

  const cSet = new Set(cTokens);
  for (const qt of qTokens) {
    if (cSet.has(qt)) return true;
    if (
      qt.length >= 4 &&
      cTokens.some((ct) => ct.length >= 4 && (ct.includes(qt) || qt.includes(ct)))
    ) {
      return true;
    }
  }
  return false;
}

export function isStaleStatusReview(
  query: string,
  claim: FactCheckClaim,
  review: FactCheckClaimReview,
  verdict: FactcheckVerdict,
  referenceDate: Date = new Date(),
  maxStatusAgeDays = 180,
): boolean {
  if (verdict !== 'ontkracht') return false;
  const combinedText = `${query} ${claim.text ?? ''} ${review.title ?? ''}`;
  if (!LIFE_STATUS_REGEX.test(combinedText)) return false;

  const rawDate = review.reviewDate || claim.claimDate;
  if (!rawDate) return false;

  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return false;

  const ageMs = referenceDate.getTime() - parsed.getTime();
  const maxAgeMs = maxStatusAgeDays * 24 * 60 * 60 * 1000;
  return ageMs > maxAgeMs;
}

export async function searchGoogleFactCheck(
  query: string,
  apiKey: string,
  deps: FactCheckSearchOptions = {},
): Promise<FactCheckMatch | null> {
  const trimmedQuery = query?.trim();
  const trimmedKey = apiKey?.trim();
  if (!trimmedKey || !trimmedQuery) return null;

  const doFetch = deps.fetch ?? globalThis.fetch.bind(globalThis);
  const url = new URL(FACTCHECK_API_URL);
  url.searchParams.set('query', trimmedQuery);
  url.searchParams.set('key', trimmedKey);
  if (deps.languageCode?.trim()) {
    url.searchParams.set('languageCode', deps.languageCode.trim());
  }

  const refDate =
    deps.referenceDate instanceof Date
      ? deps.referenceDate
      : deps.referenceDate
        ? new Date(deps.referenceDate)
        : new Date();
  const validRefDate = Number.isNaN(refDate.getTime()) ? new Date() : refDate;
  const maxStatusAgeDays = deps.maxStatusAgeDays ?? 180;

  try {
    const res = await doFetch(url.toString(), {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as GoogleFactCheckApiResponse;
    if (!data.claims || data.claims.length === 0) {
      return null;
    }

    // Find the first relevant claim with at least one valid, non-stale review
    for (const claim of data.claims) {
      if (!isClaimRelevantToQuery(trimmedQuery, claim)) {
        continue;
      }

      const validReviews = (claim.claimReview ?? []).filter((r) => {
        if (!r?.url?.trim() || !r?.textualRating?.trim()) return false;
        const v = mapTextualRatingToVerdict(r.textualRating.trim());
        return !isStaleStatusReview(trimmedQuery, claim, r, v, validRefDate, maxStatusAgeDays);
      });

      const primaryReview = validReviews[0];
      if (primaryReview) {
        const rating = primaryReview.textualRating.trim();
        const verdict = mapTextualRatingToVerdict(rating);
        const publisherName =
          primaryReview.publisher?.name?.trim() ||
          primaryReview.publisher?.site?.trim() ||
          'Factcheck organisatie';

        const seenUrls = new Set<string>();
        const sources: WebSource[] = [];
        for (const rev of validReviews) {
          const revUrl = rev.url.trim();
          if (seenUrls.has(revUrl)) continue;
          seenUrls.add(revUrl);
          const revPub = rev.publisher?.name?.trim() || rev.publisher?.site?.trim() || 'Factcheck';
          sources.push({
            title: rev.title?.trim() || `${revPub}: "${rev.textualRating.trim()}"`,
            url: revUrl,
          });
        }

        return {
          claimText: claim.text,
          claimant: claim.claimant,
          publisherName,
          reviewUrl: primaryReview.url.trim(),
          textualRating: rating,
          verdict,
          reviewDate: primaryReview.reviewDate ?? claim.claimDate,
          sources,
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function testFactCheckConnection(
  apiKey: string,
  deps: { fetch?: typeof fetch; timeoutMs?: number } = {},
): Promise<void> {
  const trimmedKey = apiKey?.trim();
  if (!trimmedKey) {
    throw new EngineError('auth', 'Vul eerst een Fact Check API-sleutel in.');
  }
  const doFetch = deps.fetch ?? globalThis.fetch.bind(globalThis);
  const url = new URL(FACTCHECK_API_URL);
  url.searchParams.set('query', 'test');
  url.searchParams.set('pageSize', '1');
  url.searchParams.set('key', trimmedKey);

  let res: Response;
  try {
    res = await doFetch(url.toString(), {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      signal: AbortSignal.timeout(deps.timeoutMs ?? 15_000),
    });
  } catch (e) {
    throw new EngineError('network', 'Geen verbinding met de Google Fact Check API.', {
      details: String(e),
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new EngineError(
      'auth',
      'De Fact Check API-sleutel is ongeldig of de Fact Check Tools API is niet ingeschakeld in Google Cloud.',
      { status: res.status, details: text.slice(0, 300) },
    );
  }
}
