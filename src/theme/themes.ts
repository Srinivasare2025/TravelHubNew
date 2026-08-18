import { IThemeDefinition, ThemeKey } from '../models';

/**
 * Built-in theme presets. Adding a 5th theme is: add an entry here, done —
 * ThemePicker, ThemeContext and every component that reads CSS custom
 * properties (--th-primary etc.) via ThemeContext pick it up automatically.
 */
export const THEMES: Record<ThemeKey, IThemeDefinition> = {
  goldNavy: {
    key: 'goldNavy',
    label: 'Gold & Navy (brand default)',
    isDark: false,
    palette: {
      primary: '#b89c66',
      secondary: '#04253c',
      background: '#ffffff',
      text: '#04253c',
      textMuted: '#7b8794',
      border: '#e8e5e0',
      cardBackground: '#ffffff'
    }
  },
  white: {
    key: 'white',
    label: 'White / Light',
    isDark: false,
    palette: {
      primary: '#2b6cb0',
      secondary: '#1a202c',
      background: '#ffffff',
      text: '#1a202c',
      textMuted: '#718096',
      border: '#e2e8f0',
      cardBackground: '#ffffff'
    }
  },
  black: {
    key: 'black',
    label: 'Black / Dark',
    isDark: true,
    palette: {
      primary: '#d4af6a',
      secondary: '#f5f5f5',
      background: '#121417',
      text: '#f0f0f0',
      textMuted: '#a3a9b3',
      border: '#2c2f36',
      cardBackground: '#1b1e23'
    }
  },
  ocean: {
    key: 'ocean',
    label: 'Ocean Blue',
    isDark: false,
    palette: {
      primary: '#0ea5b7',
      secondary: '#073b4c',
      background: '#ffffff',
      text: '#073b4c',
      textMuted: '#5b7c89',
      border: '#dcecef',
      cardBackground: '#ffffff'
    }
  }
};

export const THEME_LIST: IThemeDefinition[] = Object.keys(THEMES).map((k) => THEMES[k as ThemeKey]);

/** Applies a theme's palette as CSS custom properties on a container element. */
export function applyThemeToElement(el: HTMLElement, theme: IThemeDefinition): void {
  el.style.setProperty('--th-primary', theme.palette.primary);
  el.style.setProperty('--th-secondary', theme.palette.secondary);
  el.style.setProperty('--th-bg', theme.palette.background);
  el.style.setProperty('--th-text', theme.palette.text);
  el.style.setProperty('--th-text-muted', theme.palette.textMuted);
  el.style.setProperty('--th-border', theme.palette.border);
  el.style.setProperty('--th-card-bg', theme.palette.cardBackground);
}
