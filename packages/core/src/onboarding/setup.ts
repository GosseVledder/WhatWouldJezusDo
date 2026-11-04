// Is setup finished? Both platforms ask the same question: the key for the chosen AI service
// and the Fact Check key must be present.
import type { ProviderId } from '../engine/types';
import type { KeyKind } from '../ui/keySteps';

export interface SetupStatus {
  /** Key of the chosen AI service is present. */
  llm: boolean;
  factcheck: boolean;
  complete: boolean;
  /** Missing keys, in the order of the welcome page. */
  missing: KeyKind[];
}

export function setupStatus(
  keys: Partial<Record<KeyKind, string>>,
  provider: ProviderId = 'gemini',
): SetupStatus {
  const llm = Boolean(keys[provider]?.trim());
  const factcheck = Boolean(keys.factcheck?.trim());
  const missing: KeyKind[] = [];
  if (!llm) missing.push(provider);
  if (!factcheck) missing.push('factcheck');
  return { llm, factcheck, complete: llm && factcheck, missing };
}
