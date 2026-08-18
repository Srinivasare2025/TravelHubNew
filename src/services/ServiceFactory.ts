import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISharePointService } from './ISharePointService';
import { SharePointService } from './SharePointService';
import { MockSharePointService } from './mocks/MockSharePointService';
import { ConfigService } from './ConfigService';
import { AnalyticsService } from './AnalyticsService';
import { IAppConfig } from '../models';

let cachedSharePointService: ISharePointService | undefined;
let cachedConfig: IAppConfig | undefined;

/**
 * Single place that decides real-vs-mock. Every component asks this factory
 * for a service instance instead of `new`-ing SharePointService directly —
 * that's what lets the whole app run in the local workbench (`gulp serve`)
 * with zero SharePoint connectivity, and is the only file that would need
 * to change if a different mocking strategy were ever needed.
 */
export function isLocalEnvironment(): boolean {
  return Environment.type === EnvironmentType.Local;
}

export function createSharePointService(context: WebPartContext, config: IAppConfig): ISharePointService {
  if (isLocalEnvironment()) {
    if (!cachedSharePointService) cachedSharePointService = new MockSharePointService();
    return cachedSharePointService;
  }
  // Real service is re-created if the resolved siteUrl changes (e.g. after
  // an Admin edits Settings and the app re-fetches config).
  if (!cachedSharePointService || cachedConfig?.siteUrl !== config.siteUrl) {
    cachedSharePointService = new SharePointService(context, config);
    cachedConfig = config;
  }
  return cachedSharePointService;
}

export function createAnalyticsService(sharePointService: ISharePointService, config: IAppConfig): AnalyticsService {
  return new AnalyticsService(sharePointService, config);
}

export function createConfigService(sharePointService: ISharePointService): ConfigService {
  return new ConfigService(sharePointService);
}
