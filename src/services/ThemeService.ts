import { ThemeKey } from '../models';
import { THEMES } from '../theme/themes';

const STORAGE_KEY = 'travelHub.themeOverride';

/**
 * Theme resolution order: this browser's personal override (localStorage)
 * > the site-wide default an Admin set in Settings > the hard-coded
 * fallback. Personal overrides are per-browser/per-user by design — nobody
 * needs write access to anything to pick a theme they like.
 */
export class ThemeService {
  public getPersonalOverride(): ThemeKey | undefined {
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value && value in THEMES ? (value as ThemeKey) : undefined;
    } catch {
      return undefined; // localStorage unavailable (privacy mode, etc.)
    }
  }

  public setPersonalOverride(theme: ThemeKey): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore — theme just won't persist across sessions in this browser.
    }
  }

  public clearPersonalOverride(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }

  public resolveEffectiveTheme(siteDefault: ThemeKey): ThemeKey {
    const override = this.getPersonalOverride();
    return override ?? siteDefault ?? 'goldNavy';
  }
}
