import * as React from 'react';
import { ThemeProvider as FluentThemeProvider, createTheme, ITheme as IFluentTheme } from '@fluentui/react';
import { ThemeKey, IThemeDefinition } from '../models';
import { THEMES } from '../theme/themes';
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

function toFluentTheme(def: IThemeDefinition): IFluentTheme {
  return createTheme({
    palette: {
      themePrimary: def.palette.primary,
      themeDarker: def.palette.secondary,
      neutralLighter: def.isDark ? '#23262c' : '#f5f3ef',
      neutralLight: def.isDark ? '#2c2f36' : '#eceae5',
      white: def.palette.cardBackground,
      neutralPrimary: def.palette.text,
      neutralSecondary: def.palette.textMuted,
      neutralTertiary: def.palette.textMuted,
      neutralLighterAlt: def.isDark ? '#1b1e23' : '#faf9f7'
    },
    defaultFontStyle: { fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif' },
    isInverted: def.isDark
  });
}

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
  const fluentTheme = React.useMemo(() => toFluentTheme(theme), [theme]);

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
      <FluentThemeProvider theme={fluentTheme} style={{ background: 'transparent' }}>
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
