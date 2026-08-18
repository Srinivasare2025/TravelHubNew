import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Hero, IconFeatureGrid, CTABand, LoadingSpinner } from '../../../../shared/components';
import { ISapConcurInfo } from '../../../../models';
import styles from './SapConcurPage.module.scss';

const HELP_TILES = [
  { icon: 'ReadingMode', title: 'User Guides', description: 'Step-by-step guides to help you complete tasks with ease.', linkLabel: 'View Guides' },
  { icon: 'PlayerPlay', title: 'Training Videos', description: 'Watch short videos and learn at your own pace.', linkLabel: 'View Videos' },
  { icon: 'Help', title: 'FAQs', description: 'Find answers to common questions quickly.', linkLabel: 'View FAQs' },
  { icon: 'Megaphone', title: "What's New", description: 'Stay up to date with the latest features and updates.', linkLabel: "View What's New" },
  { icon: 'CellPhone', title: 'Mobile App Support', description: 'Get help with the SAP Concur mobile application.', linkLabel: 'Learn More' },
  { icon: 'Repair', title: 'Troubleshooting', description: 'Resolve common issues and errors yourself.', linkLabel: 'Get Help' }
];

const POPULAR_TOPICS_FALLBACK = ['How to Book Travel', 'How to Create an Expense Report', 'How to Upload Receipts', 'Company Card Integration', 'Approval Workflow', 'Travel Policy Compliance'];

export const SapConcurPage: React.FC = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [info, setInfo] = React.useState<ISapConcurInfo | undefined>(undefined);

  React.useEffect(() => {
    service.getSapConcurInfo().then(setInfo);
    service.logEvent('PageView', '/sap-concur').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!info) return <LoadingSpinner />;
  const topics = info.popularTopics.length ? info.popularTopics.map((t) => t.label) : POPULAR_TOPICS_FALLBACK;

  return (
    <div>
      <Hero
        compact
        breadcrumbItems={[{ label: 'SAP Concur' }]}
        title="SAP Concur Support"
        highlight="Everything you need to work smarter with SAP Concur."
        description="User guides, training, FAQs and expert support – all in one place."
        media={(
          <div className={styles.deviceMock}>
            <div className={styles.laptop}>
              <div className={styles.laptopBar}>SAP Concur</div>
              <div className={styles.laptopStats}>
                <div><b>{info.stats.trips}</b><span>Trips</span></div>
                <div><b>{info.stats.expenses}</b><span>Expenses</span></div>
                <div><b>{info.stats.approvals}</b><span>Approvals</span></div>
              </div>
            </div>
          </div>
        )}
      />

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>How can we help you?</h2>
        <IconFeatureGrid accent="blue" columns={6} items={HELP_TILES.map((t) => ({ ...t, onClick: () => navigate('/sap-concur') }))} />

        <div className={styles.threeCol}>
          <div className={styles.panel}>
            <h3>Popular Topics</h3>
            {topics.map((t) => (
              <div key={t} className={styles.topicRow}>{t} <Icon iconName="ChevronRightSmall" /></div>
            ))}
            <a className={styles.seeAll}>See all topics <Icon iconName="ChevronRightSmall" /></a>
          </div>
          <div className={styles.panel}>
            <h3>Training & Resources</h3>
            {info.trainingResources.map((r) => (
              <div key={r.title} className={styles.resourceRow}>
                <span className={styles.resourceIcon}><Icon iconName={r.icon} /></span>
                <div><strong>{r.title}</strong><p>{r.description}</p></div>
                <Icon iconName="ChevronRightSmall" />
              </div>
            ))}
            <a className={styles.seeAll}>View all training <Icon iconName="ChevronRightSmall" /></a>
          </div>
          <div className={styles.helpPanel}>
            <h3>Need more help?</h3>
            <p>Our SAP Concur support team is here for you.</p>
            <div className={styles.helpItem}><Icon iconName="Headset" /><div><strong>Contact SAP Concur Support</strong><p>For technical issues and system related queries.</p><a>Submit a Case <Icon iconName="ChevronRightSmall" /></a></div></div>
            <div className={styles.helpItem}><Icon iconName="Mail" /><div><strong>Email Support</strong><p>concur.support@rsg.com</p></div></div>
            <div className={styles.helpItem}><Icon iconName="Phone" /><div><strong>Call Support</strong><p>+966 12 345 1111</p></div></div>
            <button type="button" onClick={() => navigate('/travel-care')}>Contact Travel Services Team <Icon iconName="ChevronRightSmall" /></button>
          </div>
        </div>

        <div className={styles.statusPanel}>
          <div className={styles.statusLeft}>
            <span className={styles.statusDot}><Icon iconName="SkypeCircleCheck" /></span>
            <div>
              <h4>{info.systemStatus.status === 'Operational' ? 'All Systems Operational' : info.systemStatus.status}</h4>
              <p>Last updated: {info.systemStatus.lastUpdated}</p>
              <span>{info.systemStatus.message}</span>
            </div>
          </div>
          <button type="button" className={styles.outlineBtn}>View System Status <Icon iconName="ChevronRightSmall" /></button>
        </div>

        <CTABand
          variant="light"
          icon="Lightbulb"
          title="Tips & Best Practices"
          description="Explore tips to save time, stay compliant and make the most of SAP Concur."
          ctaLabel="Explore Tips"
        />
      </div>
    </div>
  );
};
