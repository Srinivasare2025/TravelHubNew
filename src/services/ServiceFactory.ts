import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISharePointService } from './ISharePointService';
import { SharePointService } from './SharePointService';
import { MockSharePointService } from './mocks/MockSharePointService';
import { ResilientSharePointService } from './ResilientSharePointService';
import { DataSourceService, DataSourceMode } from './DataSourceService';
import { ConfigService } from './ConfigService';
import { AnalyticsService } from './AnalyticsService';
import { IAppConfig } from '../models';

let cachedSharePointService: ISharePointService | undefined;
let cachedConfig: IAppConfig | undefined;
let cachedMode: DataSourceMode | undefined;
const dataSourceService = new DataSourceService();

/**
 * Auto-detected default when nobody has explicitly picked a data source
 * (see DataSourcePicker): 'mock' for local/hosted-workbench testing, 'live'
 * on any real published page.
 */
function detectDefaultMode(): DataSourceMode {
  if (Environment.type === EnvironmentType.Local) return 'mock';
  // This SPFx toolchain version no longer ships the classic local workbench
  // (`temp/workbench.html` / @microsoft/sp-webpart-workbench was retired
  // after SPFx 1.12) — `gulp serve` now opens the *hosted* workbench on a
  // real tenant instead (see config/serve.json). There, Environment.type is
  // EnvironmentType.SharePoint (a genuine SharePoint page), not Local, even
  // though a brand-new site has none of these content lists provisioned
  // yet. Detect that one page by URL so `gulp serve` still defaults to mock
  // data there — without affecting any real published page.
  if (typeof window !== 'undefined' && /\/_layouts\/1[45]\/workbench\.aspx/i.test(window.location.pathname)) return 'mock';
  return 'live';
}

/**
 * Single place that decides real-vs-mock (and, for 'live', wraps the real
 * service so a missing/unprovisioned list falls back to Sample Data instead
 * of a blank section — see ResilientSharePointService). Resolution order:
 * DataSourcePicker's personal override (localStorage) > auto-detected
 * default. Every component asks this factory for a service instance
 * instead of `new`-ing SharePointService directly — that's the only thing
 * that would need to change if a different mocking strategy were ever needed.
 */
export function getEffectiveDataSourceMode(): DataSourceMode {
  return dataSourceService.getPersonalOverride() ?? detectDefaultMode();
}

/** @deprecated kept for readability at call sites that only care about the mock/live boolean, not the mode itself. */
export function isLocalEnvironment(): boolean {
  return getEffectiveDataSourceMode() === 'mock';
}

export function createSharePointService(context: WebPartContext, config: IAppConfig): ISharePointService {
  const mode = getEffectiveDataSourceMode();

  if (mode === 'mock') {
    if (!cachedSharePointService || cachedMode !== 'mock') {
      cachedSharePointService = new MockSharePointService();
      cachedMode = 'mock';
    }
    return cachedSharePointService;
  }

  // Real service (wrapped for resilience) is re-created if the resolved
  // siteUrl changes (e.g. after an Admin edits Settings and the app
  // re-fetches config) or if we just switched over from mock mode.
  if (!cachedSharePointService || cachedMode !== 'live' || cachedConfig?.siteUrl !== config.siteUrl) {
    const real = new SharePointService(context, config);
    cachedSharePointService = new ResilientSharePointService(real, new MockSharePointService());
    cachedConfig = config;
    cachedMode = 'live';
  }
  return cachedSharePointService;
}

export function createAnalyticsService(sharePointService: ISharePointService, config: IAppConfig): AnalyticsService {
  return new AnalyticsService(sharePointService, config);
}

export function createConfigService(sharePointService: ISharePointService): ConfigService {
  return new ConfigService(sharePointService);
}
