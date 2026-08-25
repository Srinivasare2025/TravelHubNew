import * as React from 'react';
import { useThemeContext } from '../../state/ThemeContext';
import { FIXED_PALETTE } from '../../theme/themes';

/**
 * Every SCSS module in the app reads colors exclusively via CSS custom
 * properties (never a hard-coded hex value) — but as of the Sky/Dark/Cream
 * theme model, only two of them actually vary by theme: `--th-bg` (the page
 * canvas background) and `--th-page-text` (its matching legible text color,
 * always a contrasting pair per theme — see `src/theme/themes.ts`). Those
 * two are for things painted *directly on the page canvas*: this div's own
 * `background`/`color`, and the global chrome (Header/TopNav, which read
 * `--th-bg` for their own background and must use `--th-page-text` — never
 * `--th-text` — for anything sitting on it).
 *
 * `--th-text` (note: *not* `--th-page-text`) stays fixed, alongside
 * `--th-primary`/`--th-secondary`/`--th-text-muted`/`--th-border`/
 * `--th-card-bg` — the former "Gold & Navy" brand default — because ~90
 * existing call sites pair `--th-text` with `--th-card-bg` (always-white
 * cards, dropdowns, form controls), and those pairings must stay fixed
 * together regardless of theme. Mixing the two up is exactly what broke
 * before this change (Header/TopNav hardcoded a white background while
 * their *theme-driven* text intentionally went near-white in the old Black
 * theme) — the fix is keeping "fixed-on-fixed" and "theme-on-theme" pairs
 * strictly separate, never fixed-background-with-theme-text or vice versa.
 *
 * The --th-accent-* properties below are the same kind of fixed exception,
 * predating this change: the mockup uses a distinct color per page section
 * (Leisure/Wellness teal, SAP Concur blue, Sustainability green, Policies
 * bronze, emergency/alert red) that was never meant to shift with the
 * theme picker either.
 */
export const ThemedRoot: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { theme } = useThemeContext();
  const style: React.CSSProperties & Record<string, string> = {
    '--th-bg': theme.palette.background,
    '--th-page-text': theme.palette.text,
    // Fixed regardless of theme — see doc comment above.
    '--th-primary': FIXED_PALETTE.primary,
    '--th-secondary': FIXED_PALETTE.secondary,
    '--th-text': FIXED_PALETTE.text,
    '--th-text-muted': FIXED_PALETTE.textMuted,
    '--th-border': FIXED_PALETTE.border,
    '--th-card-bg': FIXED_PALETTE.cardBackground,
    '--th-accent-teal': '#0b5d5b',
    '--th-accent-blue': '#12629c',
    '--th-accent-green': '#2f6f4f',
    '--th-accent-bronze': '#a97c3f',
    '--th-accent-red': '#c0392b',
    /** Lighter-than-secondary navy blue — Home's Quick Access icon/text (a plain icon+label row, not a colored badge). */
    '--th-accent-navy-light': '#1d5079',
    /**
     * Cormorant Garamond / Noto Sans / Noto Naskh Arabic, self-hosted via the @font-face
     * bank in src/styles/_fonts.scss (imported once per web part bundle). Same rule as the
     * colors above: every screen references one of these three, never a literal font stack.
     */
    '--font-display': "'Cormorant Garamond', Georgia, serif",
    '--font-display-ar': "'Noto Naskh Arabic', 'Amiri', serif",
    '--font-body': "'Noto Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    background: 'var(--th-bg)',
    color: 'var(--th-page-text)',
    fontFamily: 'var(--font-body)',
    minHeight: '100%'
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
