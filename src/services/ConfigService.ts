import { ISharePointService } from './ISharePointService';
import { IAppConfig, DEFAULT_APP_CONFIG, DEFAULT_LIST_NAMES, DEFAULT_GROUP_NAMES, ThemeKey } from '../models';

/**
 * Converts the flat key/value rows stored in the TravelHubConfig list into a
 * typed IAppConfig (and back). This is the "provision for admin to
 * configure site URL, lists and other dependency configuration" requirement —
 * every field here is editable from Admin > Settings without a redeploy.
 */
export class ConfigService {
  constructor(private sharePointService: ISharePointService) {}

  public async getConfig(): Promise<IAppConfig> {
    let rows: Record<string, string> = {};
    try {
      rows = await this.sharePointService.getConfigRows();
    } catch {
      // TravelHubConfig list not provisioned yet (or no access) — fall back to defaults
      // so the app is still usable with the standard list names.
      rows = {};
    }

    return {
      siteUrl: rows.siteUrl ?? DEFAULT_APP_CONFIG.siteUrl,
      lists: {
        policies: rows.list_policies ?? DEFAULT_LIST_NAMES.policies,
        guides: rows.list_guides ?? DEFAULT_LIST_NAMES.guides,
        forms: rows.list_forms ?? DEFAULT_LIST_NAMES.forms,
        faqs: rows.list_faqs ?? DEFAULT_LIST_NAMES.faqs,
        promotions: rows.list_promotions ?? DEFAULT_LIST_NAMES.promotions,
        news: rows.list_news ?? DEFAULT_LIST_NAMES.news,
        quickLinks: rows.list_quickLinks ?? DEFAULT_LIST_NAMES.quickLinks,
        pageViews: rows.list_pageViews ?? DEFAULT_LIST_NAMES.pageViews,
        offers: rows.list_offers ?? DEFAULT_LIST_NAMES.offers,
        cateringMenus: rows.list_cateringMenus ?? DEFAULT_LIST_NAMES.cateringMenus,
        sustainabilityMetrics: rows.list_sustainabilityMetrics ?? DEFAULT_LIST_NAMES.sustainabilityMetrics,
        team: rows.list_team ?? DEFAULT_LIST_NAMES.team,
        testimonials: rows.list_testimonials ?? DEFAULT_LIST_NAMES.testimonials,
        heroImages: rows.list_heroImages ?? DEFAULT_LIST_NAMES.heroImages
      },
      groups: {
        admins: rows.group_admins ?? DEFAULT_GROUP_NAMES.admins,
        contributors: rows.group_contributors ?? DEFAULT_GROUP_NAMES.contributors,
        visitors: rows.group_visitors ?? DEFAULT_GROUP_NAMES.visitors
      },
      uploadsFolderUrl: rows.uploadsFolderUrl ?? DEFAULT_APP_CONFIG.uploadsFolderUrl,
      heroImageUrl: rows.heroImageUrl ?? DEFAULT_APP_CONFIG.heroImageUrl,
      logoUrl: rows.logoUrl ?? DEFAULT_APP_CONFIG.logoUrl,
      defaultTheme: (rows.defaultTheme as ThemeKey) ?? DEFAULT_APP_CONFIG.defaultTheme,
      organizationName: rows.organizationName ?? DEFAULT_APP_CONFIG.organizationName
    };
  }

  public async saveConfig(config: IAppConfig): Promise<void> {
    const rows: Record<string, string> = {
      siteUrl: config.siteUrl,
      list_policies: config.lists.policies,
      list_guides: config.lists.guides,
      list_forms: config.lists.forms,
      list_faqs: config.lists.faqs,
      list_promotions: config.lists.promotions,
      list_news: config.lists.news,
      list_quickLinks: config.lists.quickLinks,
      list_pageViews: config.lists.pageViews,
      list_offers: config.lists.offers,
      list_cateringMenus: config.lists.cateringMenus,
      list_sustainabilityMetrics: config.lists.sustainabilityMetrics,
      list_team: config.lists.team,
      list_testimonials: config.lists.testimonials,
      list_heroImages: config.lists.heroImages,
      group_admins: config.groups.admins,
      group_contributors: config.groups.contributors,
      group_visitors: config.groups.visitors,
      uploadsFolderUrl: config.uploadsFolderUrl,
      heroImageUrl: config.heroImageUrl,
      logoUrl: config.logoUrl,
      defaultTheme: config.defaultTheme,
      organizationName: config.organizationName
    };
    await this.sharePointService.saveConfigRows(rows);
  }
}
