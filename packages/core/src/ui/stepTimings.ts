// Time per analysis step: a running clock in the step list, plus "usually ~40 s" learned from
// earlier analyses with the same AI model on this device.
import type { AnalysisStep } from '../engine/types';
import type { KeyValue } from '../onboarding/keyStore';

export type StepDurations = Partial<Record<AnalysisStep, number>>;

/** What the step list needs to show times; plain data, so it can cross extension messages. */
export interface StepTiming {
  /** Epoch ms at which the active step started. */
  startedAt: number;
  /** Measured duration (ms) of the steps already done. */
  done: StepDurations;
  /** Typical duration (ms) per step from earlier analyses; empty on the first analysis. */
  expected: StepDurations;
}

/** Follows the steps of one analysis and measures how long each took. */
export function createStepClock(expected: StepDurations = {}, now: () => number = Date.now) {
  let current: AnalysisStep | undefined;
  let startedAt = 0;
  const done: StepDurations = {};
  return {
    /** Call on every progress step; returns the timing for the step list. */
    step(step: AnalysisStep): StepTiming {
      if (step !== current) {
        const t = now();
        if (current) done[current] = t - startedAt;
        current = step;
        startedAt = t;
      }
      return { startedAt, done: { ...done }, expected };
    },
    /** Ends the last step; returns all measured durations. */
    finish(): StepDurations {
      if (current) done[current] = now() - startedAt;
      current = undefined;
      return { ...done };
    },
  };
}

export interface StepTimingStore {
  /** Typical duration per step (median of the last runs) for this provider and model. */
  expected(modelKey: string): Promise<StepDurations>;
  /** Adds the durations of a finished analysis. */
  record(modelKey: string, durations: StepDurations): Promise<void>;
}

const STORE_KEY = 'stepTimings';

type History = Record<string, Partial<Record<AnalysisStep, number[]>>>;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** Durations of the last `keep` analyses per model, on top of a KeyValue store. */
export function createStepTimingStore(kv: KeyValue, keep = 5): StepTimingStore {
  const read = async (): Promise<History> => {
    try {
      const parsed: unknown = JSON.parse((await kv.get(STORE_KEY)) ?? '{}');
      return parsed && typeof parsed === 'object' ? (parsed as History) : {};
    } catch {
      return {};
    }
  };
  return {
    async expected(modelKey) {
      const runs = (await read())[modelKey] ?? {};
      const out: StepDurations = {};
      for (const [step, list] of Object.entries(runs) as [AnalysisStep, unknown][]) {
        const valid = Array.isArray(list)
          ? list.filter((n): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 0)
          : [];
        if (valid.length) out[step] = median(valid);
      }
      return out;
    },
    async record(modelKey, durations) {
      const all = await read();
      const runs = all[modelKey] ?? {};
      for (const [step, ms] of Object.entries(durations) as [AnalysisStep, number][]) {
        runs[step] = [...(runs[step] ?? []), Math.round(ms)].slice(-keep);
      }
      all[modelKey] = runs;
      await kv.set(STORE_KEY, JSON.stringify(all));
    },
  };
}

/** "0:23" for a running clock. */
export function formatClock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** "3 s", "40 s", "1:30 min": rounded for a typical duration. */
export function formatDuration(ms: number): string {
  const s = Math.max(1, Math.round(ms / 1000));
  if (s < 10) return `${s} s`;
  if (Math.round(s / 5) * 5 < 60) return `${Math.round(s / 5) * 5} s`;
  const rounded = Math.round(s / 10) * 10;
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')} min`;
}
