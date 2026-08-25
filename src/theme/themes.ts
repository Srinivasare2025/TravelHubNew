import { IThemeDefinition, ThemeKey } from '../models';

/**
 * The fixed, theme-independent brand colors every card/control/generated-placeholder-image
 * uses regardless of the selected Sky/Dark/Cream mode (see ThemedRoot's doc comment) — the
 * single source of truth for the values ThemedRoot sets on `--th-primary`/`--th-secondary`/
 * `--th-text`/`--th-text-muted`/`--th-border`/`--th-card-bg`, and for the ~10 page/component
 * files that generate placeholder images from `theme.palette.primary`/`.secondary` (those
 * colors are brand-fixed now, not theme-derived, so they read this constant directly instead).
 */
export const FIXED_PALETTE = {
  primary: '#b89c66',
  secondary: '#04253c',
  text: '#04253c',
  textMuted: '#7b8794',
  border: '#e8e5e0',
  cardBackground: '#ffffff'
};

/**
 * Built-in theme presets. Each one only changes the page canvas background and its
 * matching legible text color — cards/buttons/controls are fixed regardless of which
 * theme is active (see ThemedRoot's doc comment). Adding a 4th mode is: add an entry
 * here, done — ThemePicker and ThemeContext pick it up automatically.
 */
export const THEMES: Record<ThemeKey, IThemeDefinition> = {
  sky: {
    key: 'sky',
    label: 'Sky',
    isDark: false,
    palette: {
      background: '#eaf4fa',
      text: '#04253c'
    }
  },
  dark: {
    key: 'dark',
    label: 'Dark',
    isDark: true,
    palette: {
      background: '#121417',
      text: '#f0f0f0'
    }
  },
  cream: {
    key: 'cream',
    label: 'Cream',
    isDark: false,
    palette: {
      background: '#faf6ec',
      text: '#04253c'
    }
  }
};

export const THEME_LIST: IThemeDefinition[] = Object.keys(THEMES).map((k) => THEMES[k as ThemeKey]);

/** Applies a theme's palette as CSS custom properties on a container element. */
export function applyThemeToElement(el: HTMLElement, theme: IThemeDefinition): void {
  el.style.setProperty('--th-bg', theme.palette.background);
  el.style.setProperty('--th-text', theme.palette.text);
}
