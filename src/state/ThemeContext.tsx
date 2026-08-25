import * as React from 'react';
import { ThemeProvider as FluentThemeProvider, createTheme, ITheme as IFluentTheme } from '@fluentui/react';
import { ThemeKey, IThemeDefinition } from '../models';
import { THEMES, FIXED_PALETTE } from '../theme/themes';
import { ThemeService } from '../services/ThemeService';
import { useServiceContext } from './ServiceContext';

export interface IThemeContextValue {
  themeKey: ThemeKey;
  theme: IThemeDefinition;
  availableThemes: IThemeDefinition[];
  setTheme: (key: ThemeKey) => void;
  /** True if the user has a personal override that differs from the site default. */
  isPersonalOverride: boolean;
  resetToSiteDefault: () => void;
}

const ThemeContext = React.createContext<IThemeContextValue | undefined>(undefined);
const themeService = new ThemeService();

// Fluent-rendered controls (Callout, Dropdown, Persona etc., wrapped in
// FluentThemeProvider below) are exactly the kind of "control" that stays
// fixed regardless of Sky/Dark/Cream (see ThemedRoot's doc comment) — so
// unlike the old 4-theme model, this Fluent palette no longer varies by
// theme at all (no more `def.isDark` branching into dark neutrals/inverted
// mode); it's computed once from the same FIXED_PALETTE every other fixed
// card/control color comes from.
const FLUENT_THEME: IFluentTheme = createTheme({
  palette: {
    themePrimary: FIXED_PALETTE.primary,
    themeDarker: FIXED_PALETTE.secondary,
    neutralLighter: '#f5f3ef',
    neutralLight: '#eceae5',
    white: FIXED_PALETTE.cardBackground,
    neutralPrimary: FIXED_PALETTE.text,
    neutralSecondary: FIXED_PALETTE.textMuted,
    neutralTertiary: FIXED_PALETTE.textMuted,
    neutralLighterAlt: '#faf9f7'
  },
  defaultFontStyle: { fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif' },
  isInverted: false
});

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useServiceContext();
  const [themeKey, setThemeKey] = React.useState<ThemeKey>(() => themeService.resolveEffectiveTheme(config.defaultTheme));

  React.useEffect(() => {
    // If there's no personal override, follow the site default as an Admin changes it.
    if (!themeService.getPersonalOverride()) setThemeKey(config.defaultTheme);
  }, [config.defaultTheme]);

  const setTheme = React.useCallback((key: ThemeKey) => {
    themeService.setPersonalOverride(key);
    setThemeKey(key);
  }, []);

  const resetToSiteDefault = React.useCallback(() => {
    themeService.clearPersonalOverride();
    setThemeKey(config.defaultTheme);
  }, [config.defaultTheme]);

  const theme = THEMES[themeKey];

  const value: IThemeContextValue = {
    themeKey,
    theme,
    availableThemes: Object.keys(THEMES).map((k) => THEMES[k as ThemeKey]),
    setTheme,
    isPersonalOverride: !!themeService.getPersonalOverride(),
    resetToSiteDefault
  };

  return (
    <ThemeContext.Provider value={value}>
      <FluentThemeProvider theme={FLUENT_THEME} style={{ background: 'transparent' }}>
        {children}
      </FluentThemeProvider>
    </ThemeContext.Provider>
  );
};

export function useThemeContext(): IThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within a ThemeContextProvider');
  return ctx;
}
