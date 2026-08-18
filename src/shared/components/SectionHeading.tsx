import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './SectionHeading.module.scss';

export interface ISectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllRoute?: string;
  viewAllLabel?: string;
  onViewAllClick?: () => void;
}

export const SectionHeading: React.FC<ISectionHeadingProps> = ({ title, subtitle, viewAllRoute, viewAllLabel = 'View All', onViewAllClick }) => (
  <div className={styles.heading}>
    <div>
      <h2>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    {(viewAllRoute || onViewAllClick) && (
      viewAllRoute
        ? <Link to={viewAllRoute} onClick={onViewAllClick}>{viewAllLabel} &rarr;</Link>
        : <a onClick={onViewAllClick}>{viewAllLabel} &rarr;</a>
    )}
  </div>
);
