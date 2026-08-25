export type ThemeKey = 'sky' | 'dark' | 'cream';

export interface IThemeDefinition {
  key: ThemeKey;
  label: string;
  /** True for themes with a dark surface — drives light-text overrides in a few components. */
  isDark: boolean;
  /**
   * Only the page canvas background + legible text color shift per theme — every card,
   * button, table etc. stays fixed (see ThemedRoot's `--th-primary`/`--th-secondary`/
   * `--th-text-muted`/`--th-border`/`--th-card-bg`), so switching Sky/Dark/Cream changes
   * the page's overall mode/mood without ever making any control's own text illegible.
   */
  palette: {
    background: string;
    text: string;
  };
}
