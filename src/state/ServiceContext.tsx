import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISharePointService } from '../services/ISharePointService';
import { ConfigService } from '../services/ConfigService';
import { createSharePointService, createConfigService } from '../services/ServiceFactory';
import { IAppConfig, DEFAULT_APP_CONFIG } from '../models';

export interface IServiceContextValue {
  service: ISharePointService;
  config: IAppConfig;
  loading: boolean;
  error: string | undefined;
  /** Re-reads TravelHubConfig and re-scopes the service if siteUrl changed — call after Settings saves. */
  refreshConfig: () => Promise<void>;
  /** The web part's own site (not `config.siteUrl`, which may point elsewhere for content lists) — used to build the current user's profile-photo URL. */
  webAbsoluteUrl: string;
}

const ServiceContext = React.createContext<IServiceContextValue | undefined>(undefined);

/**
 * Bootstraps the data layer once per app load:
 *   1. A "bootstrap" service, scoped to the current site with default list
 *      names, reads TravelHubConfig (config rows always live on the current
 *      site — see SharePointService's spCurrentSite comment).
 *   2. ConfigService turns those rows into a typed IAppConfig.
 *   3. A second service call re-scopes to config.siteUrl if the Admin set
 *      an override, so every content read/write after this point targets
 *      the right site.
 * Every page/component below just calls useService() — none of them know
 * or care whether siteUrl is overridden.
 */
export const ServiceProvider: React.FC<{ context: WebPartContext; children: React.ReactNode }> = ({ context, children }) => {
  const [state, setState] = React.useState<{ service: ISharePointService; config: IAppConfig } | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const bootstrapService = createSharePointService(context, DEFAULT_APP_CONFIG);
      const configService: ConfigService = createConfigService(bootstrapService);
      const config = await configService.getConfig();
      const service = createSharePointService(context, config);
      setState({ service, config });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Travel Hub configuration.');
      // Still let the app render against defaults rather than a blank page.
      setState({ service: createSharePointService(context, DEFAULT_APP_CONFIG), config: DEFAULT_APP_CONFIG });
    } finally {
      setLoading(false);
    }
  }, [context]);

  React.useEffect(() => {
    load().catch(() => { /* handled in load() */ });
  }, [load]);

  const value: IServiceContextValue | undefined = state
    ? { service: state.service, config: state.config, loading, error, refreshConfig: load, webAbsoluteUrl: context.pageContext.web.absoluteUrl }
    : undefined;

  if (!value) return null; // brief flash before first config load resolves

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export function useServiceContext(): IServiceContextValue {
  const ctx = React.useContext(ServiceContext);
  if (!ctx) throw new Error('useServiceContext must be used within a ServiceProvider');
  return ctx;
}
