import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './StatStrip.module.scss';

export interface IStat {
  icon?: string;
  value: string;
  label: string;
  deltaLabel?: string;
  deltaUp?: boolean;
  valueColor?: 'text' | 'primary' | 'secondary';
}

export interface IStatStripProps {
  stats: IStat[];
  /** Card-panel look (Travel Services at a Glance, Dashboard KPIs) vs a plain borderless row (Meetings & Events counters). */
  variant?: 'panel' | 'plain';
}

/**
 * Row of {icon?, value, label, delta?} stat cards — covers Travel Services
 * at a Glance, Our Impact, Dashboard KPI/Traveler-Experience/Sustainability
 * rows, and hotel-partner counters (150+/20+/500+/100%).
 */
export const StatStrip: React.FC<IStatStripProps> = ({ stats, variant = 'panel' }) => (
  <div className={[styles.strip, variant === 'plain' ? styles.plain : ''].join(' ').trim()}>
    {stats.map((s, i) => (
      <div key={i} className={styles.stat}>
        {s.icon && <Icon iconName={s.icon} className={styles.icon} />}
        <div className={[styles.value, s.valueColor === 'secondary' ? styles.secondary : s.valueColor === 'primary' ? styles.primary : ''].join(' ').trim()}>{s.value}</div>
        <div className={styles.label}>{s.label}</div>
        {s.deltaLabel && <div className={[styles.delta, s.deltaUp === false ? styles.down : styles.up].join(' ')}>{s.deltaLabel}</div>}
      </div>
    ))}
  </div>
);
