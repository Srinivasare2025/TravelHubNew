import { ISharePointService } from './ISharePointService';
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
} from '../models';

/**
 * Wraps the real SharePointService so that "Live SharePoint Data" mode never
 * shows a blank section or an unhandled error just because one list isn't
 * provisioned yet on this tenant — every *read* falls back to Sample Data
 * (MockSharePointService) if the real call fails, logging a console warning
 * so it's still obvious in dev tools which lists are missing.
 *
 * Writes (createItem, updateItem, uploadFileToLibrary, ...) are deliberately
 * NOT wrapped — silently redirecting a failed write to the in-memory mock
 * store would look like it saved when it didn't, which is worse than the
 * error it would otherwise surface. Those pass straight through to the real
 * service and fail exactly as they would without this wrapper.
 */
export class ResilientSharePointService implements ISharePointService {
  constructor(private real: ISharePointService, private mock: ISharePointService) {}

  private async withFallback<T>(methodName: string, real: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
      return await real();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`[Travel Hub] "${methodName}" failed against SharePoint (list not provisioned, or no access) — showing Sample Data for this section instead.`, e);
      return fallback();
    }
  }

  // ---- Read paths: fall back to Sample Data on failure ----
  public getActivePromotions(top?: number): Promise<IPromotion[]> {
    return this.withFallback('getActivePromotions', () => this.real.getActivePromotions(top), () => this.mock.getActivePromotions(top));
  }
  public getAllPromotions(): Promise<IPromotion[]> {
    return this.withFallback('getAllPromotions', () => this.real.getAllPromotions(), () => this.mock.getAllPromotions());
  }
  public getQuickLinks(): Promise<IQuickLink[]> {
    return this.withFallback('getQuickLinks', () => this.real.getQuickLinks(), () => this.mock.getQuickLinks());
  }
  public getFeaturedNews(top?: number): Promise<INewsItem[]> {
    return this.withFallback('getFeaturedNews', () => this.real.getFeaturedNews(top), () => this.mock.getFeaturedNews(top));
  }
  public getPublishedFaqs(): Promise<IFaq[]> {
    return this.withFallback('getPublishedFaqs', () => this.real.getPublishedFaqs(), () => this.mock.getPublishedFaqs());
  }
  public getPolicies(category?: string): Promise<IPolicy[]> {
    return this.withFallback('getPolicies', () => this.real.getPolicies(category), () => this.mock.getPolicies(category));
  }
  public getPolicyById(id: number): Promise<IPolicy> {
    return this.withFallback('getPolicyById', () => this.real.getPolicyById(id), () => this.mock.getPolicyById(id));
  }
  public getRelatedFormsByCategory(formCategory: string): Promise<IForm[]> {
    return this.withFallback('getRelatedFormsByCategory', () => this.real.getRelatedFormsByCategory(formCategory), () => this.mock.getRelatedFormsByCategory(formCategory));
  }
  public getRelatedPolicies(category: string, excludeId: number): Promise<IPolicy[]> {
    return this.withFallback('getRelatedPolicies', () => this.real.getRelatedPolicies(category, excludeId), () => this.mock.getRelatedPolicies(category, excludeId));
  }
  public getAllResources(): Promise<IResourceItem[]> {
    return this.withFallback('getAllResources', () => this.real.getAllResources(), () => this.mock.getAllResources());
  }
  public getCurrentUser(): Promise<ISharePointUser> {
    return this.withFallback('getCurrentUser', () => this.real.getCurrentUser(), () => this.mock.getCurrentUser());
  }
  public getCurrentUserGroups(): Promise<string[]> {
    return this.withFallback('getCurrentUserGroups', () => this.real.getCurrentUserGroups(), () => this.mock.getCurrentUserGroups());
  }
  public getRecentNotifications(): Promise<INotification[]> {
    return this.withFallback('getRecentNotifications', () => this.real.getRecentNotifications(), () => this.mock.getRecentNotifications());
  }
  public search(term: string): Promise<ISearchResultItem[]> {
    return this.withFallback('search', () => this.real.search(term), () => this.mock.search(term));
  }
  public getOffers(category?: OfferCategory): Promise<IOffer[]> {
    return this.withFallback('getOffers', () => this.real.getOffers(category), () => this.mock.getOffers(category));
  }
  public getSapConcurInfo(): Promise<ISapConcurInfo> {
    return this.withFallback('getSapConcurInfo', () => this.real.getSapConcurInfo(), () => this.mock.getSapConcurInfo());
  }
  public getCateringMenus(): Promise<ICateringMenu[]> {
    return this.withFallback('getCateringMenus', () => this.real.getCateringMenus(), () => this.mock.getCateringMenus());
  }
  public getSustainabilityMetrics(): Promise<ISustainabilityMetric[]> {
    return this.withFallback('getSustainabilityMetrics', () => this.real.getSustainabilityMetrics(), () => this.mock.getSustainabilityMetrics());
  }
  public getTeamMembers(): Promise<ITeamMember[]> {
    return this.withFallback('getTeamMembers', () => this.real.getTeamMembers(), () => this.mock.getTeamMembers());
  }
  public getTestimonials(): Promise<ITestimonial[]> {
    return this.withFallback('getTestimonials', () => this.real.getTestimonials(), () => this.mock.getTestimonials());
  }
  public getHeroImages(pageKey?: string): Promise<IHeroSlide[]> {
    return this.withFallback('getHeroImages', () => this.real.getHeroImages(pageKey), () => this.mock.getHeroImages(pageKey));
  }
  public getDashboardAnalytics(filters?: IDashboardFilters): Promise<IDashboardAnalytics> {
    return this.withFallback('getDashboardAnalytics', () => this.real.getDashboardAnalytics(filters), () => this.mock.getDashboardAnalytics(filters));
  }
  public getAllItems<T>(listName: string, query?: string): Promise<T[]> {
    return this.withFallback('getAllItems', () => this.real.getAllItems<T>(listName, query), () => this.mock.getAllItems<T>(listName, query));
  }
  public getListItemCount(listName: string): Promise<number> {
    return this.withFallback('getListItemCount', () => this.real.getListItemCount(listName), () => this.mock.getListItemCount(listName));
  }
  public getRecentItemCount(listName: string, days: number): Promise<number> {
    return this.withFallback('getRecentItemCount', () => this.real.getRecentItemCount(listName, days), () => this.mock.getRecentItemCount(listName, days));
  }
  public getGroupUserCount(groupName: string): Promise<number> {
    return this.withFallback('getGroupUserCount', () => this.real.getGroupUserCount(groupName), () => this.mock.getGroupUserCount(groupName));
  }
  public getGroupMembers(groupName: string): Promise<ISharePointUser[]> {
    return this.withFallback('getGroupMembers', () => this.real.getGroupMembers(groupName), () => this.mock.getGroupMembers(groupName));
  }
  public getPendingApprovals(): Promise<IPendingApprovalItem[]> {
    return this.withFallback('getPendingApprovals', () => this.real.getPendingApprovals(), () => this.mock.getPendingApprovals());
  }
  public getPageViewAnalytics(rangeDays: number): Promise<IAnalyticsPoint[]> {
    return this.withFallback('getPageViewAnalytics', () => this.real.getPageViewAnalytics(rangeDays), () => this.mock.getPageViewAnalytics(rangeDays));
  }
  public getMediaLibraryFiles(): Promise<IMediaFile[]> {
    return this.withFallback('getMediaLibraryFiles', () => this.real.getMediaLibraryFiles(), () => this.mock.getMediaLibraryFiles());
  }
  public getConfigRows(): Promise<Record<string, string>> {
    return this.withFallback('getConfigRows', () => this.real.getConfigRows(), () => this.mock.getConfigRows());
  }

  // ---- Writes and the one synchronous helper: pass straight through, no fallback ----
  public logEvent(eventType: PageViewEventType, itemReference: string): Promise<void> {
    return this.real.logEvent(eventType, itemReference);
  }
  public createItem<T>(listName: string, fields: Record<string, unknown>): Promise<T> {
    return this.real.createItem<T>(listName, fields);
  }
  public updateItem(listName: string, id: number, fields: Record<string, unknown>): Promise<void> {
    return this.real.updateItem(listName, id, fields);
  }
  public deleteItem(listName: string, id: number): Promise<void> {
    return this.real.deleteItem(listName, id);
  }
  public setModerationStatus(listName: string, id: number, status: number, comment?: string): Promise<void> {
    return this.real.setModerationStatus(listName, id, status, comment);
  }
  public uploadFileToLibrary(listName: string, file: File, fields: Record<string, unknown>): Promise<number> {
    return this.real.uploadFileToLibrary(listName, file, fields);
  }
  public uploadImageAsset(file: File): Promise<string> {
    return this.real.uploadImageAsset(file);
  }
  public resolveUser(loginOrEmail: string): Promise<number> {
    return this.real.resolveUser(loginOrEmail);
  }
  public deleteMediaFile(serverRelativeUrl: string): Promise<void> {
    return this.real.deleteMediaFile(serverRelativeUrl);
  }
  public saveConfigRows(rows: Record<string, string>): Promise<void> {
    return this.real.saveConfigRows(rows);
  }
  public getListWebRelativeUrl(listName: string): string {
    return this.real.getListWebRelativeUrl(listName);
  }
}
