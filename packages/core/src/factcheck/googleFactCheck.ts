import type { FactcheckVerdict, WebSource } from '../engine/types';

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

  // Eerst: Misleidend / Gedeeltelijk waar / Uit context (voordat we op los 'onwaar' testen)
  if (
    /misleading|misleidend|half true|mostly false|partly|grotendeels onwaar|overdreven|exaggerated|context/i.test(
      r,
    )
  ) {
    return 'gemengd_of_context';
  }

  // Waar / Juist
  if (/^true$|^waar$|^correct$|^juist$|accurate|verified|bevestigd/i.test(r)) {
    return 'bevestigd';
  }

  // Onwaar / Fake / Weerlegd
  if (
    /false|onwaar|incorrect|untrue|fake|niet waar|inaccurat|leugen|hoax|fabricated|pants on fire/i.test(
      r,
    )
  ) {
    return 'ontkracht';
  }

  return 'gemengd_of_context';
}

export async function searchGoogleFactCheck(
  query: string,
  apiKey: string,
  deps: { fetch?: typeof fetch } = {},
): Promise<FactCheckMatch | null> {
  if (!apiKey || !query.trim()) return null;

  const doFetch = deps.fetch ?? globalThis.fetch.bind(globalThis);
  const url = new URL(FACTCHECK_API_URL);
  url.searchParams.set('query', query.trim());
  url.searchParams.set('key', apiKey.trim());

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

    // Find the first claim with a review
    for (const claim of data.claims) {
      const review = claim.claimReview?.[0];
      if (review && review.url && review.textualRating) {
        const verdict = mapTextualRatingToVerdict(review.textualRating);
        return {
          claimText: claim.text,
          claimant: claim.claimant,
          publisherName: review.publisher?.name ?? 'Factcheck organisatie',
          reviewUrl: review.url,
          textualRating: review.textualRating,
          verdict,
          sources: [
            {
              title:
                review.title ??
                `${review.publisher?.name ?? 'Factcheck'}: "${review.textualRating}"`,
              url: review.url,
            },
          ],
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}
