import * as React from 'react';
import { useThemeContext } from '../../state/ThemeContext';

/**
 * Every SCSS module in the app reads colors exclusively via 7 CSS custom
 * properties (--th-primary/secondary/bg/text/text-muted/border/card-bg) —
 * never a hard-coded hex value — so switching themes is just re-setting
 * these on one wrapping element. This is that element.
 *
 * The --th-accent-* properties below are a deliberate, scoped exception to
 * that rule (mirroring the moderation-status pill precedent): the mockup
 * uses a distinct color per page section (Leisure/Wellness teal, SAP Concur
 * blue, Sustainability green, Policies bronze, emergency/alert red) that
 * isn't meant to shift with the White/Black/Ocean theme picker, so they're
 * fixed values, not sourced from `theme.palette`.
 */
export const ThemedRoot: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { theme } = useThemeContext();
  const style: React.CSSProperties & Record<string, string> = {
    '--th-primary': theme.palette.primary,
    '--th-secondary': theme.palette.secondary,
    '--th-bg': theme.palette.background,
    '--th-text': theme.palette.text,
    '--th-text-muted': theme.palette.textMuted,
    '--th-border': theme.palette.border,
    '--th-card-bg': theme.palette.cardBackground,
    '--th-accent-teal': '#0b5d5b',
    '--th-accent-blue': '#12629c',
    '--th-accent-green': '#2f6f4f',
    '--th-accent-bronze': '#a97c3f',
    '--th-accent-red': '#c0392b',
    /** Lighter-than-secondary navy blue — Home's Quick Access icon/text (a plain icon+label row, not a colored badge). */
    '--th-accent-navy-light': '#1d5079',
    background: 'var(--th-bg)',
    color: 'var(--th-text)',
    minHeight: '100%'
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};
