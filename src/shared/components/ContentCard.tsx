import * as React from 'react';
import styles from './ContentCard.module.scss';

export interface IContentCardProps {
  title: string;
  summary?: string;
  imageUrl: string; // always resolved by the caller (real image or sample placeholder — see src/assets/images.ts)
  pillLabel?: string;
  ribbonLabel?: string;
  ribbonVariant?: 'limited' | 'exclusive' | 'event' | 'announcement';
  metaRight?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

/** The one card shape reused across News, Promotions and (in grid mode) Resources. */
export const ContentCard: React.FC<IContentCardProps> = ({ title, summary, imageUrl, pillLabel, ribbonLabel, ribbonVariant, metaRight, footer, onClick }) => (
  <div className={styles.card} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
    {ribbonLabel && <span className={`${styles.ribbon} ${ribbonVariant ? styles[ribbonVariant] : ''}`}>{ribbonLabel}</span>}
    <div className={styles.thumb} style={{ backgroundImage: `url('${imageUrl}')` }} />
    <div className={styles.body}>
      <h4>{title}</h4>
      {summary && <p>{summary}</p>}
      <div className={styles.metaRow}>
        {pillLabel && <span className={styles.pill}>{pillLabel}</span>}
        {metaRight}
      </div>
      {footer}
    </div>
  </div>
);
