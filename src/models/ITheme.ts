export type ThemeKey = 'goldNavy' | 'white' | 'black' | 'ocean';

export interface IThemeDefinition {
  key: ThemeKey;
  label: string;
  /** True for themes with a dark surface — drives light-text overrides in a few components. */
  isDark: boolean;
  palette: {
    primary: string; // accent / brand color
    secondary: string; // headings, dark surfaces
    background: string;
    text: string;
    textMuted: string;
    border: string;
    cardBackground: string;
  };
}
