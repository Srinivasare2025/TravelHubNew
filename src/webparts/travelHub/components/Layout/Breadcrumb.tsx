import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';

export interface IBreadcrumbCrumb {
  label: string;
  route?: string;
}

export interface IBreadcrumbProps {
  items: IBreadcrumbCrumb[];
  /** 'light' renders white/translucent-white text for use on a dark Hero background; default suits a white page background. */
  variant?: 'default' | 'light';
}

/** "Home / X / Y" — every page except Home renders this with its own trail. */
export const Breadcrumb: React.FC<IBreadcrumbProps> = ({ items, variant = 'default' }) => (
  <nav className={[styles.breadcrumb, variant === 'light' ? styles.light : ''].join(' ').trim()} aria-label="Breadcrumb">
    <Link to="/">Home</Link>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        <span className={styles.sep}>/</span>
        {item.route && i < items.length - 1 ? (
          <Link to={item.route}>{item.label}</Link>
        ) : (
          <span className={styles.current}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);
