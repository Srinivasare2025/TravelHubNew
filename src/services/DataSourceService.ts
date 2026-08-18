export type DataSourceMode = 'mock' | 'live';

const STORAGE_KEY = 'travelHub.dataSourceOverride';

/**
 * Personal, per-browser override of mock-vs-live data (localStorage, same
 * pattern as ThemeService's personal theme override) — lets whoever is
 * running a demo force Sample Data even on a real SharePoint page (so a
 * partially-provisioned tenant never shows blank sections), or force Live
 * Data to verify real list wiring, without needing SharePoint Admin rights
 * to change anything. Resolution order (see ServiceFactory): this override
 * > auto-detection (local/hosted-workbench → mock, any real page → live).
 */
export class DataSourceService {
  public getPersonalOverride(): DataSourceMode | undefined {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value === 'mock' || value === 'live' ? value : undefined;
    } catch {
      return undefined; // localStorage unavailable (privacy mode, etc.)
    }
  }

  public setPersonalOverride(mode: DataSourceMode): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore — choice just won't persist across sessions in this browser.
    }
  }

  public clearPersonalOverride(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }
}
