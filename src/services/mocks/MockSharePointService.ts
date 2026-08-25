import { ISharePointService } from '../ISharePointService';
import { createMockStore, mockGroupMembers, mockSapConcurInfo, mockDashboardAnalytics, IMockStore } from './mockData';
import {
  IPolicy,
  IForm,
  IFaq,
  IPromotion,
  INewsItem,
  IQuickLink,
  IResourceItem,
  ISharePointUser,
  IAnalyticsPoint,
  IPendingApprovalItem,
  INotification,
  ISearchResultItem,
  IMediaFile,
  ModerationStatus,
  PageViewEventType,
  IOffer,
  OfferCategory,
  ISapConcurInfo,
  ICateringMenu,
  ISustainabilityMetric,
  ITeamMember,
  ITestimonial,
  IDashboardAnalytics,
  IDashboardFilters,
  IHeroSlide
} from '../../models';

/**
 * Local-workbench-only implementation of ISharePointService, backed by an
 * in-memory store instead of real SharePoint REST calls. ServiceFactory
 * picks this automatically when `Environment.type === EnvironmentType.Local`
 * (i.e. `gulp serve` / the local workbench) — never in a real SharePoint
 * page. Every method mirrors the real SharePointService's filtering logic
 * so page components behave identically against both.
 */
export class MockSharePointService implements ISharePointService {
  private store: IMockStore = createMockStore();
  private mediaFiles: IMediaFile[] = [];
  private configRows: Record<string, string> = {};
  private nextId: Record<string, number> = {
    TravelPolicies: 100, TravelGuides: 100, TravelForms: 100, TravelFAQs: 100,
    TravelPromotions: 100, TravelNews: 100, TravelQuickLinks: 100,
    TravelOffers: 100, TravelCateringMenus: 100, TravelSustainabilityMetrics: 100,
    TravelServicesTeam: 100, TravelTestimonials: 100
  };

  public async getActivePromotions(top = 6): Promise<IPromotion[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.store.TravelPromotions
      .filter((p) => p.IsActive && p.EndDate >= today)
      .sort((a, b) => a.Priority - b.Priority)
      .slice(0, top);
  }

  public async getAllPromotions(): Promise<IPromotion[]> {
    return this.store.TravelPromotions.slice().sort((a, b) => a.Priority - b.Priority);
  }

  public async getQuickLinks(): Promise<IQuickLink[]> {
    return this.store.TravelQuickLinks.slice().sort((a, b) => a.SortOrder - b.SortOrder);
  }

  public async getFeaturedNews(top = 6): Promise<INewsItem[]> {
    return this.store.TravelNews.slice().sort((a, b) => +new Date(b.PublishDate) - +new Date(a.PublishDate)).slice(0, top);
  }

  public async getPublishedFaqs(): Promise<IFaq[]> {
    return this.store.TravelFAQs.filter((f) => f.IsPublished);
  }

  public async getPolicies(category?: string): Promise<IPolicy[]> {
    return this.store.TravelPolicies.filter(
      (p) => p.OData__ModerationStatus === ModerationStatus.Approved && (!category || p.PolicyCategory === category)
    );
  }

  public async getPolicyById(id: number): Promise<IPolicy> {
    const item = this.store.TravelPolicies.filter((p) => p.Id === id)[0];
    if (!item) throw new Error(`Policy ${id} not found`);
    return item;
  }

  public async getRelatedFormsByCategory(formCategory: string): Promise<IForm[]> {
    return this.store.TravelForms.filter((f) => f.FormCategory === formCategory);
  }

  public async getRelatedPolicies(category: string, excludeId: number): Promise<IPolicy[]> {
    return this.store.TravelPolicies.filter((p) => p.PolicyCategory === category && p.Id !== excludeId).slice(0, 5);
  }

  public async getAllResources(): Promise<IResourceItem[]> {
    const guides: IResourceItem[] = this.store.TravelGuides.map((g) => ({
      Id: g.Id, Title: g.Title, Category: g.GuideType, Summary: g.Summary, FileRef: g.FileRef,
      FileLeafRef: g.FileLeafRef, Modified: g.Modified, ResourceType: 'Guide'
    }));
    const forms: IResourceItem[] = this.store.TravelForms.map((f) => ({
      Id: f.Id, Title: f.Title, Category: f.FormCategory, Summary: f.Instructions || '', FileRef: f.FileRef,
      FileLeafRef: f.FileLeafRef, Modified: f.Modified, ResourceType: 'Form'
    }));
    return guides.concat(forms);
  }

  public async getCurrentUser(): Promise<ISharePointUser> {
    return { Id: 6, Title: 'Sandeep Kumar', Email: 'sandeep@example.com', LoginName: 'i:0#.f|membership|sandeep@example.com' };
  }

  public async getCurrentUserGroups(): Promise<string[]> {
    return ['Travel Hub Admins'];
  }

  public async getRecentNotifications(): Promise<INotification[]> {
    const news: INotification[] = this.store.TravelNews.slice(0, 3).map((n) => ({ Title: n.Title, date: n.PublishDate, kind: 'News', route: '/news' }));
    const promos: INotification[] = this.store.TravelPromotions.filter((p) => p.IsActive).slice(0, 2).map((p) => ({ Title: p.Title, date: p.StartDate, kind: 'Promotion', route: '/promotions' }));
    return news.concat(promos).sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5);
  }

  public async logEvent(_eventType: PageViewEventType, _itemReference: string): Promise<void> {
    return;
  }

  public async search(term: string): Promise<ISearchResultItem[]> {
    const all: ISearchResultItem[] = [
      ...this.store.TravelPolicies.map((p) => ({ title: p.Title, path: '#/policies', summary: p.Summary })),
      ...this.store.TravelOffers.map((o) => ({ title: o.Title, path: '#/leisure-travel', summary: o.Description }))
    ];
    return all.filter((r) => r.title.toLowerCase().indexOf(term.toLowerCase()) !== -1).slice(0, 8);
  }

  public async getOffers(category?: OfferCategory): Promise<IOffer[]> {
    return this.store.TravelOffers
      .filter((o) => !category || o.Category === category)
      .slice()
      .sort((a, b) => a.SortOrder - b.SortOrder);
  }

  public async getSapConcurInfo(): Promise<ISapConcurInfo> {
    return mockSapConcurInfo;
  }

  public async getCateringMenus(): Promise<ICateringMenu[]> {
    return this.store.TravelCateringMenus.slice().sort((a, b) => a.SortOrder - b.SortOrder);
  }

  public async getSustainabilityMetrics(): Promise<ISustainabilityMetric[]> {
    return this.store.TravelSustainabilityMetrics.slice().sort((a, b) => a.SortOrder - b.SortOrder);
  }

  public async getTeamMembers(): Promise<ITeamMember[]> {
    return this.store.TravelServicesTeam.slice().sort((a, b) => a.SortOrder - b.SortOrder);
  }

  public async getTestimonials(): Promise<ITestimonial[]> {
    return this.store.TravelTestimonials.slice().sort((a, b) => a.SortOrder - b.SortOrder);
  }

  public async getHeroImages(pageKey?: string): Promise<IHeroSlide[]> {
    const rows = (this.store.TravelHeroImages as IHeroSlide[])
      .filter((r) => r.IsActive)
      .sort((a, b) => a.SortOrder - b.SortOrder);
    if (!pageKey) return rows;
    return rows.filter((r) => r.TargetPages?.results?.includes(pageKey) || r.TargetPages?.results?.includes('all'));
  }

  // Filters are accepted for API-shape parity with the real service; the
  // mock returns one fixed, mockup-accurate snapshot regardless of filter
  // values (there's no underlying transactional data to actually re-slice).
  public async getDashboardAnalytics(_filters?: IDashboardFilters): Promise<IDashboardAnalytics> {
    return mockDashboardAnalytics;
  }

  public async getAllItems<T>(listName: string): Promise<T[]> {
    return ((this.store[listName] as unknown[]) || []).slice().sort((a: unknown, b: unknown) => {
      const ai = (a as { Id: number }).Id;
      const bi = (b as { Id: number }).Id;
      return bi - ai;
    }) as T[];
  }

  public async createItem<T>(listName: string, fields: Record<string, unknown>): Promise<T> {
    this.nextId[listName] = (this.nextId[listName] || 100) + 1;
    const item = { Id: this.nextId[listName], OData__ModerationStatus: ModerationStatus.Pending, Modified: new Date().toISOString(), ...fields };
    (this.store[listName] as unknown[]).unshift(item);
    return item as unknown as T;
  }

  public async updateItem(listName: string, id: number, fields: Record<string, unknown>): Promise<void> {
    const list = this.store[listName] as Array<Record<string, unknown>>;
    const item = list && list.filter((i) => i.Id === id)[0];
    if (item) Object.assign(item, fields, { Modified: new Date().toISOString() });
  }

  public async deleteItem(listName: string, id: number): Promise<void> {
    this.store[listName] = ((this.store[listName] as Array<{ Id: number }>) || []).filter((i) => i.Id !== id);
  }

  public async setModerationStatus(listName: string, id: number, status: number): Promise<void> {
    const list = this.store[listName] as Array<Record<string, unknown>>;
    const item = list && list.filter((i) => i.Id === id)[0];
    if (item) item.OData__ModerationStatus = status;
  }

  public async uploadFileToLibrary(listName: string, file: File, fields: Record<string, unknown>): Promise<number> {
    this.nextId[listName] = (this.nextId[listName] || 100) + 1;
    const item = { Id: this.nextId[listName], OData__ModerationStatus: ModerationStatus.Pending, FileRef: '#', FileLeafRef: file.name, Modified: new Date().toISOString(), ...fields };
    (this.store[listName] as unknown[]).unshift(item);
    return item.Id;
  }

  public async uploadImageAsset(file: File): Promise<string> {
    const url = URL.createObjectURL(file);
    this.mediaFiles.unshift({ Name: file.name, ServerRelativeUrl: url, TimeLastModified: new Date().toISOString() });
    return url;
  }

  public async resolveUser(_loginOrEmail: string): Promise<number> {
    return 1;
  }

  public async getListItemCount(listName: string): Promise<number> {
    return ((this.store[listName] as unknown[]) || []).length;
  }

  public async getRecentItemCount(listName: string, days: number): Promise<number> {
    const since = Date.now() - days * 86400000;
    return ((this.store[listName] as Array<{ Modified?: string }>) || []).filter((i) => new Date(i.Modified || Date.now()).getTime() >= since).length;
  }

  public async getGroupUserCount(groupName: string): Promise<number> {
    return (mockGroupMembers[groupName] || []).length;
  }

  public async getGroupMembers(groupName: string): Promise<ISharePointUser[]> {
    return mockGroupMembers[groupName] || [];
  }

  public async getPendingApprovals(): Promise<IPendingApprovalItem[]> {
    const tag = (rows: Array<{ Id: number; Title: string; Modified: string; OData__ModerationStatus: ModerationStatus }>, listName: string, kind: 'Policy' | 'Guide'): IPendingApprovalItem[] =>
      rows.filter((r) => r.OData__ModerationStatus === ModerationStatus.Pending)
        .map((r) => ({ Id: r.Id, Title: r.Title, Modified: r.Modified, Author: 'Preview User', listName, kind }));
    return tag(this.store.TravelPolicies, 'TravelPolicies', 'Policy')
      .concat(tag(this.store.TravelGuides, 'TravelGuides', 'Guide'))
      .sort((a, b) => +new Date(b.Modified) - +new Date(a.Modified));
  }

  public async getPageViewAnalytics(rangeDays: number): Promise<IAnalyticsPoint[]> {
    const since = Date.now() - rangeDays * 86400000;
    const byDay: Record<string, { views: number; users: Record<string, boolean> }> = {};
    this.store.TravelHubPageViews.forEach((row) => {
      if (new Date(row.EventDateTime).getTime() < since) return;
      const day = row.EventDateTime.split('T')[0];
      if (!byDay[day]) byDay[day] = { views: 0, users: {} };
      byDay[day].views++;
      byDay[day].users[row.UserLoginName] = true;
    });
    return Object.keys(byDay).sort().map((date) => ({ date, pageViews: byDay[date].views, uniqueUsers: Object.keys(byDay[date].users).length }));
  }

  public async getMediaLibraryFiles(): Promise<IMediaFile[]> {
    return this.mediaFiles;
  }

  public async deleteMediaFile(serverRelativeUrl: string): Promise<void> {
    this.mediaFiles = this.mediaFiles.filter((f) => f.ServerRelativeUrl !== serverRelativeUrl);
  }

  public async getConfigRows(): Promise<Record<string, string>> {
    return this.configRows;
  }

  public async saveConfigRows(rows: Record<string, string>): Promise<void> {
    this.configRows = { ...this.configRows, ...rows };
  }

  public getListWebRelativeUrl(listName: string): string {
    return `#/admin/${listName}`;
  }
}
