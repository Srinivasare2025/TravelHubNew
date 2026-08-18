import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './OfferCard.module.scss';

export interface IOfferCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  badge?: string;
  badgeVariant?: 'limited' | 'exclusive' | 'event' | 'announcement';
  price?: string;
  priceNote?: string;
  ctaLabel?: string;
  onClick?: () => void;
}

/**
 * Image card with ribbon badge, title, description, price line and an
 * always-visible CTA button — distinct from ContentCard's whole-card-click
 * pattern. Covers Leisure Travel's Featured Offers, Wellness's hotel &
 * package rows, and Meetings & Events' partner hotel tiles.
 */
export const OfferCard: React.FC<IOfferCardProps> = ({ title, subtitle, description, imageUrl, badge, badgeVariant, price, priceNote, ctaLabel, onClick }) => (
  <div className={styles.card}>
    {badge && <span className={[styles.ribbon, badgeVariant ? styles[badgeVariant] : ''].join(' ').trim()}>{badge}</span>}
    <div className={styles.thumb} style={{ backgroundImage: `url('${imageUrl}')` }} />
    <div className={styles.body}>
      <h4>{title}</h4>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      {description && <p>{description}</p>}
      <div className={styles.footer}>
        {price && (
          <div className={styles.priceBlock}>
            <span className={styles.price}>{price}</span>
            {priceNote && <span className={styles.priceNote}>{priceNote}</span>}
          </div>
        )}
        {ctaLabel && (
          <button type="button" className={styles.cta} onClick={onClick}>
            {ctaLabel} <Icon iconName="ChevronRightSmall" />
          </button>
        )}
      </div>
    </div>
  </div>
);
