import * as React from 'react';
import { useServiceContext } from '../../../../state/ServiceContext';
import styles from './Footer.module.scss';

const FOOTER_LINKS = ['About Travel Services', 'Privacy Policy', 'Terms of Use', 'Compliance'];

/**
 * The plain link + copyright bar seen at the bottom of every page (About
 * Travel Services | Privacy Policy | Terms of Use | Compliance … © {year}
 * {org}. All rights reserved.), pipe-separated, no fill color of its own —
 * the richer "24/7 Travel Care" contact band on the Home page is
 * Home-specific content, not part of this global Footer.
 */
export const Footer: React.FC = () => {
  const { config } = useServiceContext();
  const year = new Date().getFullYear();
  const orgName = config.organizationName || 'Red Sea Global';

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.links}>
          {FOOTER_LINKS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <span className={styles.pipe} aria-hidden="true">|</span>}
              <a href="#">{label}</a>
            </React.Fragment>
          ))}
        </div>
        <div className={styles.copyright}>&copy; {year} {orgName}. All rights reserved.</div>
      </div>
    </footer>
  );
};
