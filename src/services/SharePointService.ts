import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI } from '@pnp/sp';
import { SPFx } from '@pnp/sp/behaviors/spfx';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/lists/web';
import '@pnp/sp/items';
import '@pnp/sp/files';
import '@pnp/sp/files/web';
import '@pnp/sp/folders';
import '@pnp/sp/folders/web';
import '@pnp/sp/site-users';
import '@pnp/sp/site-users/web';
import '@pnp/sp/site-groups';
import '@pnp/sp/site-groups/web';
import '@pnp/sp/search';

import { ISharePointService } from './ISharePointService';
import {
  IPolicy,
  IGuide,
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
  IAppConfig,
  IOffer,
  OfferCategory,
  ISapConcurInfo,
  ICateringMenu,
  ISustainabilityMetric,
  ITeamMember,
  ITestimonial,
  IDashboardAnalytics,
  IDashboardFilters
} from '../models';
import { mockSapConcurInfo, mockDashboardAnalytics } from './mocks/mockData';

/** Escapes a value for safe interpolation into a single-quoted OData literal. */
function odataString(value: string): string {
  return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * Real SharePoint REST implementation, built on PnPjs v3 (@pnp/sp) scoped
 * to the SPFx context. Targets `config.siteUrl` when the Admin has set one
 * in Settings (the lists live in a different site than this web part), and
 * falls back to the current site otherwise — see IAppConfig for why.
 */
export class SharePointService implements ISharePointService {
  /** Scoped to config.siteUrl when set — the content lists (Policies, Guides, ...). */
  private sp: SPFI;
  /**
   * Always scoped to the site the web part is actually placed on, regardless
   * of any siteUrl override — TravelHubConfig itself can't be "redirected"
   * (that would make discovering the override circular), so config reads/
   * writes always go through this instance instead of `this.sp`.
   */
  private spCurrentSite: SPFI;
  private webServerRelativeUrl: string;

  constructor(private context: WebPartContext, private config: IAppConfig) {
    const targetUrl = config.siteUrl && config.siteUrl.trim() !== '' ? config.siteUrl.trim() : context.pageContext.web.absoluteUrl;
    this.sp = spfi(targetUrl).using(SPFx(context as never));
    this.spCurrentSite = targetUrl === context.pageContext.web.absoluteUrl
      ? this.sp
      : spfi(context.pageContext.web.absoluteUrl).using(SPFx(context as never));
    try {
      this.webServerRelativeUrl = new URL(targetUrl).pathname.replace(/\/$/, '');
    } catch {
      this.webServerRelativeUrl = context.pageContext.web.serverRelativeUrl;
    }
  }

  // ---- Public read paths --------------------------------------------------

  public async getActivePromotions(top = 6): Promise<IPromotion[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.sp.web.lists.getByTitle(this.config.lists.promotions).items
      .filter(`IsActive eq 1 and EndDate ge datetime${odataString(today)}`)
      .orderBy('Priority', true)
      .top(top)() as Promise<IPromotion[]>;
  }

  public async getAllPromotions(): Promise<IPromotion[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.promotions).items.orderBy('Priority', true).top(500)() as Promise<IPromotion[]>;
  }

  public async getQuickLinks(): Promise<IQuickLink[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.quickLinks).items.orderBy('SortOrder', true).top(100)() as Promise<IQuickLink[]>;
  }

  public async getFeaturedNews(top = 6): Promise<INewsItem[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.news).items.orderBy('PublishDate', false).top(top)() as Promise<INewsItem[]>;
  }

  public async getPublishedFaqs(): Promise<IFaq[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.faqs).items
      .filter('IsPublished eq 1')
      .orderBy('Category', true)
      .orderBy('SortOrder', true)
      .top(300)() as Promise<IFaq[]>;
  }

  public async getPolicies(category?: string): Promise<IPolicy[]> {
    const filter = `OData__ModerationStatus eq 0${category ? ` and PolicyCategory eq ${odataString(category)}` : ''}`;
    return this.sp.web.lists.getByTitle(this.config.lists.policies).items
      .select('Id', 'Title', 'PolicyCategory', 'Modified', 'FileRef', 'FileLeafRef', 'IsFeatured')
      .filter(filter)
      .orderBy('Title', true)
      .top(500)() as Promise<IPolicy[]>;
  }

  public async getPolicyById(id: number): Promise<IPolicy> {
    return this.sp.web.lists.getByTitle(this.config.lists.policies).items.getById(id)
      .select(
        'Id', 'Title', 'PolicyCategory', 'Region', 'EffectiveDate', 'ExpiryDate', 'PolicyVersion',
        'Summary', 'PolicyBody', 'IsFeatured', 'FileRef', 'FileLeafRef', 'Modified', 'ReviewedBy/Title'
      )
      .expand('ReviewedBy')() as Promise<IPolicy>;
  }

  public async getRelatedFormsByCategory(formCategory: string): Promise<IForm[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.forms).items
      .filter(`FormCategory eq ${odataString(formCategory)}`)
      .top(10)() as Promise<IForm[]>;
  }

  public async getRelatedPolicies(category: string, excludeId: number): Promise<IPolicy[]> {
    const all = await this.getPolicies(category);
    return all.filter((p) => p.Id !== excludeId).slice(0, 5);
  }

  public async getAllResources(): Promise<IResourceItem[]> {
    const [guides, forms] = await Promise.all([
      this.sp.web.lists.getByTitle(this.config.lists.guides).items
        .select('Id', 'Title', 'GuideType', 'Summary', 'FileRef', 'FileLeafRef', 'Modified')
        .filter('OData__ModerationStatus eq 0')
        .top(500)() as Promise<IGuide[]>,
      this.sp.web.lists.getByTitle(this.config.lists.forms).items
        .select('Id', 'Title', 'FormCategory', 'Instructions', 'FileRef', 'FileLeafRef', 'Modified')
        .top(500)() as Promise<IForm[]>
    ]);
    const guideItems: IResourceItem[] = guides.map((g) => ({
      Id: g.Id, Title: g.Title, Category: g.GuideType, Summary: g.Summary, FileRef: g.FileRef,
      FileLeafRef: g.FileLeafRef, Modified: g.Modified, ResourceType: 'Guide'
    }));
    const formItems: IResourceItem[] = forms.map((f) => ({
      Id: f.Id, Title: f.Title, Category: f.FormCategory, Summary: f.Instructions || '', FileRef: f.FileRef,
      FileLeafRef: f.FileLeafRef, Modified: f.Modified, ResourceType: 'Form'
    }));
    return guideItems.concat(formItems);
  }

  private cachedUser: ISharePointUser | undefined;

  public async getCurrentUser(): Promise<ISharePointUser> {
    if (this.cachedUser) return this.cachedUser;
    const u = await this.sp.web.currentUser();
    this.cachedUser = { Id: u.Id, Title: u.Title, Email: u.Email, LoginName: u.LoginName };
    return this.cachedUser;
  }

  public async getCurrentUserGroups(): Promise<string[]> {
    const groups = await this.sp.web.currentUser.groups();
    return groups.map((g: { Title: string }) => g.Title);
  }

  public async getRecentNotifications(): Promise<INotification[]> {
    const [news, promos] = await Promise.all([
      this.sp.web.lists.getByTitle(this.config.lists.news).items.select('Id', 'Title', 'PublishDate').orderBy('PublishDate', false).top(3)() as Promise<INewsItem[]>,
      this.sp.web.lists.getByTitle(this.config.lists.promotions).items.select('Id', 'Title', 'StartDate').filter('IsActive eq 1').orderBy('StartDate', false).top(3)() as Promise<IPromotion[]>
    ]);
    const newsNotifications: INotification[] = news.map((n) => ({ Title: n.Title, date: n.PublishDate, kind: 'News', route: '/news' }));
    const promoNotifications: INotification[] = promos.map((p) => ({ Title: p.Title, date: p.StartDate, kind: 'Promotion', route: '/promotions' }));
    return newsNotifications.concat(promoNotifications).sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 5);
  }

  public async logEvent(eventType: PageViewEventType, itemReference: string): Promise<void> {
    const user = await this.getCurrentUser();
    await this.sp.web.lists.getByTitle(this.config.lists.pageViews).items.add({
      Title: `PageView-${new Date().toISOString()}`,
      UserLoginName: user.LoginName,
      EventType: eventType,
      ItemReference: itemReference || '',
      EventDateTime: new Date().toISOString()
    });
  }

  public async getOffers(category?: OfferCategory): Promise<IOffer[]> {
    const filter = category ? `Category eq ${odataString(category)}` : undefined;
    let items = this.sp.web.lists.getByTitle(this.config.lists.offers).items.orderBy('SortOrder', true).top(500);
    if (filter) items = items.filter(filter);
    return items() as Promise<IOffer[]>;
  }

  public async getCateringMenus(): Promise<ICateringMenu[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.cateringMenus).items.orderBy('SortOrder', true).top(50)() as Promise<ICateringMenu[]>;
  }

  public async getSustainabilityMetrics(): Promise<ISustainabilityMetric[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.sustainabilityMetrics).items.orderBy('SortOrder', true).top(50)() as Promise<ISustainabilityMetric[]>;
  }

  public async getTeamMembers(): Promise<ITeamMember[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.team).items.orderBy('SortOrder', true).top(50)() as Promise<ITeamMember[]>;
  }

  public async getTestimonials(): Promise<ITestimonial[]> {
    return this.sp.web.lists.getByTitle(this.config.lists.testimonials).items.orderBy('SortOrder', true).top(50)() as Promise<ITestimonial[]>;
  }

  /**
   * SAP Concur page content is one editorial unit, not list rows, so it's
   * stored as a single JSON blob in the shared TravelHubConfig key/value
   * list (key 'SapConcurInfo') rather than a new dedicated list — same
   * pattern `getConfigRows`/`saveConfigRows` already use for site settings.
   * Falls back to the shipped sample content (identical to what the mock
   * service returns) if the config row hasn't been created yet, so the page
   * still renders correctly on a freshly-provisioned site.
   */
  public async getSapConcurInfo(): Promise<ISapConcurInfo> {
    try {
      const rows = await this.spCurrentSite.web.lists.getByTitle('TravelHubConfig').items
        .filter(`Title eq ${odataString('SapConcurInfo')}`).select('ConfigValue').top(1)() as Array<{ ConfigValue: string }>;
      if (rows[0]) return JSON.parse(rows[0].ConfigValue) as ISapConcurInfo;
    } catch {
      // fall through to sample content
    }
    return mockSapConcurInfo;
  }

  /**
   * Same JSON-blob-in-TravelHubConfig approach as `getSapConcurInfo` for
   * now (key 'DashboardAnalytics') — a real deployment would replace this
   * with actual spend/booking aggregation queries once Finance/Concur data
   * lands in SharePoint or a downstream reporting source; `filters` is
   * already threaded through the interface for that future wiring.
   */
  public async getDashboardAnalytics(_filters?: IDashboardFilters): Promise<IDashboardAnalytics> {
    try {
      const rows = await this.spCurrentSite.web.lists.getByTitle('TravelHubConfig').items
        .filter(`Title eq ${odataString('DashboardAnalytics')}`).select('ConfigValue').top(1)() as Array<{ ConfigValue: string }>;
      if (rows[0]) return JSON.parse(rows[0].ConfigValue) as IDashboardAnalytics;
    } catch {
      // fall through to sample content
    }
    return mockDashboardAnalytics;
  }

  public async search(term: string): Promise<ISearchResultItem[]> {
    if (!term || term.length < 2) return [];
    const kql = `(Title:${term}* OR ${term}*) AND Path:${this.context.pageContext.web.absoluteUrl}*`;
    const results = await this.sp.search({
      Querytext: kql,
      RowLimit: 8,
      SelectProperties: ['Title', 'Path', 'HitHighlightedSummary']
    });
    return results.PrimarySearchResults.map((r) => ({
      title: r.Title || r.Path || '',
      path: r.Path || '#',
      summary: (r.HitHighlightedSummary || '').replace(/<c0>|<\/c0>|<ddd\/>/g, '')
    }));
  }

  // ---- Generic admin CRUD --------------------------------------------------

  public async getAllItems<T>(listName: string, query?: string): Promise<T[]> {
    // `query` is an optional raw "?$select=...&$filter=..." string for callers
    // that need full control (e.g. AnalyticsService); parsed back into the
    // fluent builder so every request still goes through the same PnPjs pipeline.
    let items = this.sp.web.lists.getByTitle(listName).items.top(500).orderBy('Id', false);
    if (query) {
      const params = new URLSearchParams(query.replace(/^\?/, ''));
      const select = params.get('$select');
      const filter = params.get('$filter');
      const top = params.get('$top');
      if (select) items = items.select(...select.split(','));
      if (filter) items = items.filter(filter);
      if (top) items = items.top(Number(top));
    }
    return items() as Promise<T[]>;
  }

  public async createItem<T>(listName: string, fields: Record<string, unknown>): Promise<T> {
    const result = await this.sp.web.lists.getByTitle(listName).items.add(fields);
    return result.data as T;
  }

  public async updateItem(listName: string, id: number, fields: Record<string, unknown>): Promise<void> {
    await this.sp.web.lists.getByTitle(listName).items.getById(id).update(fields);
  }

  public async deleteItem(listName: string, id: number): Promise<void> {
    await this.sp.web.lists.getByTitle(listName).items.getById(id).delete();
  }

  public async setModerationStatus(listName: string, id: number, status: ModerationStatus, comment = ''): Promise<void> {
    await this.sp.web.lists.getByTitle(listName).items.getById(id).update({
      OData__ModerationStatus: status,
      OData__ModerationComments: comment
    });
  }

  public async uploadFileToLibrary(listName: string, file: File, fields: Record<string, unknown>): Promise<number> {
    const folderUrl = `${this.webServerRelativeUrl}/${listName}`;
    const buffer = await file.arrayBuffer();
    const addResult = await this.sp.web.getFolderByServerRelativePath(folderUrl).files.addUsingPath(file.name, buffer, { Overwrite: true });
    const item = await addResult.file.listItemAllFields.select('Id')() as { Id: number };
    await this.updateItem(listName, item.Id, fields);
    return item.Id;
  }

  public async uploadImageAsset(file: File): Promise<string> {
    const folderUrl = this.config.uploadsFolderUrl || `${this.webServerRelativeUrl}/SiteAssets/travelhub/uploads`;
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const buffer = await file.arrayBuffer();
    const addResult = await this.sp.web.getFolderByServerRelativePath(folderUrl).files.addUsingPath(safeName, buffer, { Overwrite: true });
    return addResult.data.ServerRelativeUrl;
  }

  public async resolveUser(loginOrEmail: string): Promise<number> {
    const result = await this.sp.web.ensureUser(loginOrEmail);
    return result.data.Id;
  }

  // ---- Admin dashboard aggregates ------------------------------------------

  public async getListItemCount(listName: string): Promise<number> {
    const list = await this.sp.web.lists.getByTitle(listName).select('ItemCount')();
    return list.ItemCount;
  }

  public async getRecentItemCount(listName: string, days: number): Promise<number> {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const items = await this.sp.web.lists.getByTitle(listName).items
      .select('Id')
      .filter(`Created ge datetime${odataString(since)}`)
      .top(5000)();
    return items.length;
  }

  public async getGroupUserCount(groupName: string): Promise<number> {
    const users = await this.sp.web.siteGroups.getByName(groupName).users.select('Id')();
    return users.length;
  }

  public async getGroupMembers(groupName: string): Promise<ISharePointUser[]> {
    const users = await this.sp.web.siteGroups.getByName(groupName).users.select('Id', 'Title', 'Email', 'LoginName')();
    return users.map((u: { Id: number; Title: string; Email: string; LoginName: string }) => ({ Id: u.Id, Title: u.Title, Email: u.Email, LoginName: u.LoginName }));
  }

  public async getPendingApprovals(): Promise<IPendingApprovalItem[]> {
    const select = ['Id', 'Title', 'Modified', 'Author/Title'];
    const [policies, guides] = await Promise.all([
      this.sp.web.lists.getByTitle(this.config.lists.policies).items.select(...select).expand('Author').filter('OData__ModerationStatus eq 2').orderBy('Modified', false).top(25)(),
      this.sp.web.lists.getByTitle(this.config.lists.guides).items.select(...select).expand('Author').filter('OData__ModerationStatus eq 2').orderBy('Modified', false).top(25)()
    ]);
    const tag = (rows: Array<{ Id: number; Title: string; Modified: string; Author?: { Title: string } }>, listName: string, kind: 'Policy' | 'Guide'): IPendingApprovalItem[] =>
      rows.map((r) => ({ Id: r.Id, Title: r.Title, Modified: r.Modified, Author: r.Author ? r.Author.Title : 'Unknown', listName, kind }));
    return tag(policies, this.config.lists.policies, 'Policy')
      .concat(tag(guides, this.config.lists.guides, 'Guide'))
      .sort((a, b) => +new Date(b.Modified) - +new Date(a.Modified));
  }

  public async getPageViewAnalytics(rangeDays: number): Promise<IAnalyticsPoint[]> {
    const since = new Date(Date.now() - rangeDays * 86400000).toISOString();
    const rows = await this.sp.web.lists.getByTitle(this.config.lists.pageViews).items
      .select('EventDateTime', 'UserLoginName')
      .filter(`EventDateTime ge datetime${odataString(since)}`)
      .top(5000)() as Array<{ EventDateTime: string; UserLoginName: string }>;

    const byDay: Record<string, { views: number; users: Record<string, boolean> }> = {};
    rows.forEach((row) => {
      const day = row.EventDateTime.split('T')[0];
      if (!byDay[day]) byDay[day] = { views: 0, users: {} };
      byDay[day].views++;
      byDay[day].users[row.UserLoginName] = true;
    });
    return Object.keys(byDay).sort().map((date) => ({ date, pageViews: byDay[date].views, uniqueUsers: Object.keys(byDay[date].users).length }));
  }

  public async getMediaLibraryFiles(): Promise<IMediaFile[]> {
    const folderUrl = this.config.uploadsFolderUrl || `${this.webServerRelativeUrl}/SiteAssets/travelhub/uploads`;
    const files = await this.sp.web.getFolderByServerRelativePath(folderUrl).files.select('Name', 'ServerRelativeUrl', 'TimeLastModified')();
    return (files as IMediaFile[]).sort((a, b) => +new Date(b.TimeLastModified) - +new Date(a.TimeLastModified));
  }

  public async deleteMediaFile(serverRelativeUrl: string): Promise<void> {
    await this.sp.web.getFileByServerRelativePath(serverRelativeUrl).delete();
  }

  // ---- Config (TravelHubConfig key/value list) -----------------------------

  public async getConfigRows(): Promise<Record<string, string>> {
    const items = await this.spCurrentSite.web.lists.getByTitle('TravelHubConfig').items.select('Title', 'ConfigValue').top(200)() as Array<{ Title: string; ConfigValue: string }>;
    const rows: Record<string, string> = {};
    items.forEach((i) => { rows[i.Title] = i.ConfigValue; });
    return rows;
  }

  public async saveConfigRows(rows: Record<string, string>): Promise<void> {
    const list = this.spCurrentSite.web.lists.getByTitle('TravelHubConfig');
    const existing = await list.items.select('Id', 'Title')() as Array<{ Id: number; Title: string }>;
    const existingByKey: Record<string, number> = {};
    existing.forEach((i) => { existingByKey[i.Title] = i.Id; });

    const ops = Object.keys(rows).map(async (key) => {
      const value = rows[key];
      if (existingByKey[key] != null) {
        await list.items.getById(existingByKey[key]).update({ ConfigValue: value });
      } else {
        await list.items.add({ Title: key, ConfigValue: value });
      }
    });
    await Promise.all(ops);
  }

  public getListWebRelativeUrl(listName: string): string {
    return `${this.webServerRelativeUrl}/${listName}/AllItems.aspx`;
  }
}
