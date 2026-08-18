import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './IconFeatureGrid.module.scss';

export interface IIconFeatureItem {
  icon: string;
  title: string;
  description?: string;
  linkLabel?: string;
  onClick?: () => void;
  /** Per-item override of the grid-level `accent` (mockup's 5-category Home Alternate cards each use a different pastel icon color). */
  accent?: 'primary' | 'secondary' | 'teal' | 'blue' | 'green' | 'bronze';
}

export interface IIconFeatureGridProps {
  items: IIconFeatureItem[];
  /** Target column count at desktop width; grid always collapses responsively below that. */
  columns?: 3 | 4 | 5 | 6 | 7;
  /** Accent used for the icon badges — mirrors the mockup's per-section coloring. */
  accent?: 'primary' | 'secondary' | 'teal' | 'blue' | 'green' | 'bronze';
  /** Larger icon/tile variant, used for the handful of sections with only 4-5 big tiles. */
  size?: 'default' | 'large';
}

const ACCENT_VAR: Record<string, string> = {
  primary: 'var(--th-primary)', secondary: 'var(--th-secondary)', teal: 'var(--th-accent-teal)',
  blue: 'var(--th-accent-blue)', green: 'var(--th-accent-green)', bronze: 'var(--th-accent-bronze)'
};

/**
 * Responsive grid of icon+title(+description) tiles — covers Quick Access,
 * Explore by Category, Our Wellness Pillars, "How can we help", Visa
 * services, Sustainability commitment cards, Travel Care support types, etc.
 */
export const IconFeatureGrid: React.FC<IIconFeatureGridProps> = ({ items, columns = 4, accent = 'primary', size = 'default' }) => (
  <div className={[styles.grid, size === 'large' ? styles.large : ''].join(' ').trim()} style={{ '--cols': columns } as React.CSSProperties}>
    {items.map((item, i) => (
      <div
        key={i}
        className={styles.tile}
        onClick={item.onClick}
        role={item.onClick ? 'button' : undefined}
        tabIndex={item.onClick ? 0 : undefined}
      >
        <span className={styles.iconBadge} style={{ background: ACCENT_VAR[item.accent || accent] }}>
          <Icon iconName={item.icon} />
        </span>
        <h4>{item.title}</h4>
        {item.description && <p>{item.description}</p>}
        {item.linkLabel && <span className={styles.link}>{item.linkLabel} <Icon iconName="ChevronRightSmall" /></span>}
      </div>
    ))}
  </div>
);
