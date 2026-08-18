import { ISharePointService } from './ISharePointService';
import { IAnalyticsPoint, IAppConfig, IPageViewEvent } from '../models';

export interface ITopContentRow {
  reference: string;
  interactions: number;
}

/**
 * Thin aggregation layer over ISharePointService for the Admin
 * Dashboard/Analytics pages — keeps the "group TravelHubPageViews rows by
 * ItemReference" logic in one tested place instead of duplicated in two
 * page components.
 */
export class AnalyticsService {
  constructor(private sharePointService: ISharePointService, private config: IAppConfig) {}

  public getChartSeries(rangeDays: number): Promise<IAnalyticsPoint[]> {
    return this.sharePointService.getPageViewAnalytics(rangeDays);
  }

  public async getTopContent(limit = 10): Promise<ITopContentRow[]> {
    const rows = await this.sharePointService.getAllItems<IPageViewEvent>(
      this.config.lists.pageViews,
      "?$select=ItemReference,EventType&$top=5000"
    );
    const counts: Record<string, number> = {};
    rows.forEach((r) => {
      if (!r.ItemReference) return;
      counts[r.ItemReference] = (counts[r.ItemReference] || 0) + 1;
    });
    return Object.keys(counts)
      .map((reference) => ({ reference, interactions: counts[reference] }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, limit);
  }
}
