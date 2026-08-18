import * as React from 'react';
import { Icon } from '@fluentui/react';
import { SECTIONS } from '../sections/sectionDefinitions';
import styles from './Sidebar.module.scss';

export interface INavEntry {
  type: 'custom' | 'section' | 'heading';
  key: string;
  label: string;
  icon?: string;
}

export const NAV_ORDER: INavEntry[] = [
  { type: 'custom', key: 'dashboard', label: 'Dashboard', icon: 'ViewDashboard' },
  { type: 'heading', key: 'content-heading', label: 'Content' },
  ...SECTIONS.map((s) => ({ type: 'section' as const, key: s.key, label: s.label, icon: s.icon })),
  { type: 'custom', key: 'media', label: 'Media Library', icon: 'FileImage' },
  { type: 'custom', key: 'approvals', label: 'Approvals', icon: 'CheckList' },
  { type: 'custom', key: 'analytics', label: 'Analytics', icon: 'LineChart' },
  { type: 'custom', key: 'settings', label: 'Settings', icon: 'Settings' },
  { type: 'custom', key: 'users', label: 'Users & Permissions', icon: 'People' }
];

export const Sidebar: React.FC<{ active: string; roleLabel: string; onSelect: (key: string) => void }> = ({ active, roleLabel, onSelect }) => (
  <div className={styles.sidebar}>
    <div className={styles.header}>
      <Icon iconName="Airplane" /> Admin
      <span className={styles.roleBadge}>{roleLabel}</span>
    </div>
    <nav>
      {NAV_ORDER.map((entry) => {
        if (entry.type === 'heading') return <div key={entry.key} className={styles.heading}>{entry.label}</div>;
        return (
          <button
            key={entry.key}
            type="button"
            className={active === entry.key ? styles.navLinkActive : styles.navLink}
            onClick={() => onSelect(entry.key)}
          >
            <Icon iconName={entry.icon} /> <span>{entry.label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);
