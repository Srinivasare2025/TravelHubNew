import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Hero, LinkCardGrid, CTABand, LoadingSpinner } from '../../../../shared/components';
import { IPolicy } from '../../../../models';
import styles from './PoliciesPage.module.scss';

const SUBSIDIARIES = [
  { icon: 'CityNext', title: 'Amarak', description: 'View travel policies and guidelines applicable to Amarak.' },
  { icon: 'Shield', title: 'Red Sea Security', description: 'View travel policies and guidelines applicable to Red Sea Security.' },
  { icon: 'Leaf', title: 'Nursery', description: 'View travel policies and guidelines applicable to Nursery.' },
  { icon: 'People', title: 'CCC', description: 'View travel policies and guidelines applicable to CCC.' }
];

export const PoliciesPage: React.FC = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [policies, setPolicies] = React.useState<IPolicy[] | undefined>(undefined);

  React.useEffect(() => {
    service.getPolicies().then(setPolicies).catch(() => setPolicies([]));
    service.logEvent('PageView', '/policies').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!policies) return <LoadingSpinner />;
  const featured = policies.filter((p) => p.IsFeatured)[0] || policies[0];

  return (
    <div>
      <Hero
        compact
        breadcrumbItems={[{ label: 'Policies' }]}
        title="Policies"
        media={<Icon iconName="PageListSolid" className={styles.heroIcon} />}
      />

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>Policy Documents</h2>
        <p className={styles.sub}>Access and download our official travel policy documents.</p>

        {featured && (
          <div className={styles.docPanel}>
            <div className={styles.docLeft}>
              <span className={styles.docIcon}><Icon iconName="PageListSolid" /></span>
              <div>
                <h4>{featured.Title}</h4>
                <p>{featured.Summary}</p>
                <a className={styles.downloadBtn} href={featured.FileRef} title="Download">
                  <Icon iconName="Download" /> Download Policy
                </a>
              </div>
            </div>
            <div className={styles.docMeta}>
              <div><Icon iconName="Calendar" /><div><span>Effective Date</span><strong>{featured.EffectiveDate ? new Date(featured.EffectiveDate).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}</strong></div></div>
              <div><Icon iconName="History" /><div><span>Last Reviewed</span><strong>{new Date(featured.Modified).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div></div>
              <div><Icon iconName="TextDocument" /><div><span>Version</span><strong>{featured.PolicyVersion || '1.0'}</strong></div></div>
            </div>
          </div>
        )}

        <h2 className={styles.sectionTitle}>Subsidiaries</h2>
        <p className={styles.sub}>Select your subsidiary to view applicable travel policies and guidelines.</p>
        <LinkCardGrid items={SUBSIDIARIES.map((s) => ({ ...s, linkLabel: 'View Policies' }))} />

        <CTABand
          variant="light"
          icon="Mail"
          title="Questions about our policies?"
          description="Contact the Travel Services Team for assistance."
          ctaLabel="Contact Travel Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
