/**
 * SAP Concur page content. Kept as one aggregate read (`getSapConcurInfo()`)
 * rather than several list-backed calls, since the SAP Concur page's system
 * status / popular topics / training resources are one coherent editorial
 * unit maintained together in practice (a single "SAP Concur Support" config
 * item), not independently-authored list rows like Policies/News.
 */
export interface ISapConcurTrainingResource {
  icon: string;
  title: string;
  description: string;
}

export interface ISapConcurTopic {
  label: string;
}

export interface ISapConcurSystemStatus {
  status: 'Operational' | 'Degraded' | 'Outage';
  lastUpdated: string;
  message: string;
}

export interface ISapConcurStats {
  trips: number;
  expenses: number;
  approvals: number;
}

export interface ISapConcurInfo {
  systemStatus: ISapConcurSystemStatus;
  popularTopics: ISapConcurTopic[];
  trainingResources: ISapConcurTrainingResource[];
  stats: ISapConcurStats;
}
