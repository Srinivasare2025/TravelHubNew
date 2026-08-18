/** Maps 1:1 to the TravelSustainabilityMetrics list — Sustainability page's "Our Impact" stat row. */
export interface ISustainabilityMetric {
  Id: number;
  Icon: string;
  Value: string;
  Label: string;
  DeltaLabel?: string;
  SortOrder: number;
}
