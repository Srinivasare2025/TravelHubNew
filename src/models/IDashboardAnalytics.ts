/**
 * Aggregate shape for the public Travel Dashboard & Analytics page
 * (`getDashboardAnalytics()`), distinct from the internal Admin web part's
 * own page-view analytics (`IAnalyticsPoint` / `getPageViewAnalytics`).
 * Returned as one object because every section on the page reacts to the
 * same three filters (date range / business unit / region) together.
 */
export interface IDashboardFilters {
  dateRangeLabel?: string;
  businessUnit?: string;
  region?: string;
}

export interface IDashboardKpi {
  icon: string;
  label: string;
  value: string;
  compareLabel: string;
  deltaLabel: string;
  deltaDirection: 'up' | 'down';
}

export interface ISpendMonthPoint {
  label: string; // e.g. 'Nov '23'
  spend: number; // SAR, millions
  savings: number; // SAR, millions
}

export interface ICategorySlice {
  label: string;
  amount: number; // SAR, millions
  pct: number;
  color: string;
}

export interface IDestinationSpend {
  label: string;
  amount: number; // SAR, millions
}

export interface IComplianceSlice {
  label: string;
  pct: number;
  amount: number; // SAR, millions
  color: string;
}

export interface IBusinessUnitRow {
  unit: string;
  spend: number; // SAR, millions
  pctOfTotal: number;
  vsLastMonthLabel: string;
  vsLastMonthUp: boolean;
}

export interface ITravelerExperienceStat {
  icon: string;
  label: string;
  value: string;
  deltaLabel: string;
  deltaUp: boolean;
}

export interface ITopRouteRow {
  route: string;
  spend: number; // SAR, millions
  trips: number;
  avgTicket: number; // SAR
}

export interface ISustainabilityImpactStat {
  icon: string;
  value: string;
  label: string;
  deltaLabel: string;
}

export interface IDashboardAnalytics {
  kpis: IDashboardKpi[];
  spendSeries: ISpendMonthPoint[];
  spendTotal: string;
  categoryBreakdown: ICategorySlice[];
  topDestinations: IDestinationSpend[];
  complianceBreakdown: IComplianceSlice[];
  compliancePct: number;
  complianceNote: string;
  businessUnitRows: IBusinessUnitRow[];
  travelerExperience: ITravelerExperienceStat[];
  topRoutes: ITopRouteRow[];
  sustainabilityImpact: ISustainabilityImpactStat[];
}
