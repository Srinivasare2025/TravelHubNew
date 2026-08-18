import * as React from 'react';
import { IconButton, Callout, DirectionalHint } from '@fluentui/react';
import { useThemeContext } from '../../state/ThemeContext';
import styles from './ThemePicker.module.scss';

/** Lets any user pick their own White/Black/Gold-Navy/Ocean theme — persists per-browser (see ThemeService). */
export const ThemePicker: React.FC = () => {
  const { themeKey, availableThemes, setTheme, isPersonalOverride, resetToSiteDefault } = useThemeContext();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={buttonRef} className={styles.wrap}>
      <IconButton
        iconProps={{ iconName: 'Color' }}
        title="Choose a theme"
        ariaLabel="Choose a theme"
        onClick={() => setOpen(!open)}
        className={styles.trigger}
      />
      {open && (
        <Callout
          target={buttonRef.current}
          onDismiss={() => setOpen(false)}
          directionalHint={DirectionalHint.bottomRightEdge}
          gapSpace={8}
        >
          <div className={styles.panel}>
            <div className={styles.panelHeader}>Theme</div>
            {availableThemes.map((t) => (
              <button
                key={t.key}
                type="button"
                className={t.key === themeKey ? styles.optionActive : styles.option}
                onClick={() => { setTheme(t.key); setOpen(false); }}
              >
                <span className={styles.swatch} style={{ background: `linear-gradient(135deg, ${t.palette.primary}, ${t.palette.secondary})` }} />
                {t.label}
              </button>
            ))}
            {isPersonalOverride && (
              <button type="button" className={styles.resetLink} onClick={() => { resetToSiteDefault(); setOpen(false); }}>
                Use site default
              </button>
            )}
          </div>
        </Callout>
      )}
    </div>
  );
};
