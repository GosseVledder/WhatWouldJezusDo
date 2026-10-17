export type BibleSourceType = 'Tien Geboden (OT)' | 'Uitspraak van Jezus (NT)' | 'Evangeliecontext';

export interface BibleSource {
  reference: string;
  type: BibleSourceType;
  quote: string;
  url: string;
}

export interface GuidelineEvaluationCriteria {
  score0to3: string; // Ernstige schending / tegengesteld aan Jezus' onderwijs
  score4to6: string; // Gematigd, twijfelachtig of deels in strijd
  score7to10: string; // Positief, voorbeeldig of in lijn met Jezus' onderwijs
}

export interface JesusGuideline {
  id: string;
  number: number;
  category: "Tien Geboden & Jezus' Verdieping" | 'Kernuitspraken en Richtlijnen van Jezus';
  title: string;
  shortSummary: string;
  broaderContext: string;
  evaluationCriteria: GuidelineEvaluationCriteria;
  sources: BibleSource[];
}
