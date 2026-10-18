import { EngineError, type FactcheckVerdict, type WebSource } from '../engine/types';

export interface FactCheckClaimReview {
  publisher: {
    name: string;
    site?: string;
  };
  url: string;
  title?: string;
  textualRating: string;
}

export interface FactCheckClaim {
  text: string;
  claimant?: string;
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
  sources: WebSource[];
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

export async function searchGoogleFactCheck(
  query: string,
  apiKey: string,
  deps: { fetch?: typeof fetch; languageCode?: string } = {},
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

    // Find the first claim with at least one valid review
    for (const claim of data.claims) {
      const validReviews = (claim.claimReview ?? []).filter(
        (r) => Boolean(r?.url?.trim()) && Boolean(r?.textualRating?.trim()),
      );
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
