import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './LinkCardGrid.module.scss';

export interface ILinkCardItem {
  icon: string;
  title: string;
  description?: string;
  linkLabel: string;
  onClick?: () => void;
}

export interface ILinkCardGridProps {
  items: ILinkCardItem[];
  columns?: 2 | 3 | 4;
}

/**
 * Icon + title + description + "View X →" cards — covers Policies'
 * Subsidiaries, Travel Care's Helpful Resources, and Visa Support's Popular
 * Destinations / Useful Information.
 */
export const LinkCardGrid: React.FC<ILinkCardGridProps> = ({ items, columns = 2 }) => (
  <div className={styles.grid} style={{ '--cols': columns } as React.CSSProperties}>
    {items.map((item, i) => (
      <div key={i} className={styles.card} onClick={item.onClick} role={item.onClick ? 'button' : undefined} tabIndex={item.onClick ? 0 : undefined}>
        <span className={styles.iconBadge}><Icon iconName={item.icon} /></span>
        <div className={styles.body}>
          <h4>{item.title}</h4>
          {item.description && <p>{item.description}</p>}
          <span className={styles.link}>{item.linkLabel} <Icon iconName="ChevronRightSmall" /></span>
        </div>
      </div>
    ))}
  </div>
);
