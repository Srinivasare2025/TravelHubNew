import * as React from 'react';
import { useServiceContext } from '../../../../state/ServiceContext';
import styles from './Footer.module.scss';

/**
 * The plain link + copyright bar seen at the bottom of every mockup page
 * (About Travel Services / Privacy Policy / Terms of Use / Compliance … ©
 * {year} {org}. All rights reserved.) — the richer "24/7 Travel Care"
 * contact band on the mockup's Home page is Home-specific content
 * (a `CTABand` there), not part of the global Footer.
 */
export const Footer: React.FC = () => {
  const { config } = useServiceContext();
  const year = new Date().getFullYear();
  const orgName = config.organizationName || 'Red Sea Global';

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.links}>
          <a href="#">About Travel Services</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Compliance</a>
          <a href="#/home-alternate" className={styles.altLink}>Home (Alternate Layout)</a>
        </div>
        <div className={styles.copyright}>&copy; {year} {orgName}. All rights reserved.</div>
      </div>
    </footer>
  );
};
