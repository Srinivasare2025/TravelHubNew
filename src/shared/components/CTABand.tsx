import * as React from 'react';
import { Icon } from '@fluentui/react';
import styles from './CTABand.module.scss';

export interface ICTABandProps {
  icon?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** 'rich' = full-bleed dark navy band (Home's 24/7 Travel Care); 'light' = tint panel used at the bottom of every inner page; 'alert' = red emergency band (Travel Care). */
  variant?: 'rich' | 'light' | 'alert';
  children?: React.ReactNode;
}

/**
 * Closing contact-team bar reused at the bottom of every page (and, in
 * 'alert' variant, for Travel Care's "In case of an emergency" band).
 */
export const CTABand: React.FC<ICTABandProps> = ({ icon, title, description, ctaLabel, onCtaClick, variant = 'light', children }) => (
  <div className={[styles.band, styles[variant]].join(' ')}>
    <div className={styles.left}>
      {icon && <span className={styles.iconWrap}><Icon iconName={icon} /></span>}
      <div>
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        {children}
      </div>
    </div>
    {ctaLabel && (
      <button type="button" className={styles.cta} onClick={onCtaClick}>
        {ctaLabel} <Icon iconName="ChevronRightSmall" />
      </button>
    )}
  </div>
);
