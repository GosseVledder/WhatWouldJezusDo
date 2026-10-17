import { z } from 'zod';
import { DEFAULT_MODELS } from './engine/config';

export const wwjdSettingsSchema = z.object({
  /** Extensie: aan/uit-schakelaar */
  actief: z.boolean().catch(true),
  provider: z.enum(['claude', 'gemini']).catch('gemini'),
  models: z
    .object({
      claude: z.string().min(1).catch(DEFAULT_MODELS.claude),
      gemini: z.string().min(1).catch(DEFAULT_MODELS.gemini),
    })
    .catch({ ...DEFAULT_MODELS }),
  /** Google Fact Check Tools API primair inschakelen */
  googleFactCheckActief: z.boolean().catch(true),
  /** Automatisch analyseren bij openen van een videopagina */
  automatisch: z.boolean().catch(true),
  /** Taal van de beoordeling en UI */
  taal: z.string().min(2).catch('nl'),
  debugLog: z.boolean().catch(false),
  paneelIngeklapt: z.boolean().catch(false),
});

export type WwjdSettings = z.infer<typeof wwjdSettingsSchema>;

export const DEFAULT_WWJD_SETTINGS: WwjdSettings = wwjdSettingsSchema.parse({});

export function parseWwjdSettings(raw: unknown): WwjdSettings {
  return wwjdSettingsSchema.parse(raw && typeof raw === 'object' ? raw : {});
}
