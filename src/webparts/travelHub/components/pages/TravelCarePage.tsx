import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Hero, IconFeatureGrid, LinkCardGrid, CTABand } from '../../../../shared/components';
import styles from './TravelCarePage.module.scss';

const SUPPORT_TYPES = [
  { icon: 'Headset', title: 'Emergency Support', description: 'Immediate assistance for medical, security and travel emergencies.' },
  { icon: 'Health', title: 'Medical Assistance', description: 'Access to medical professionals and hospital support globally.' },
  { icon: 'Shield', title: 'Safety & Security', description: 'Risk alerts, security advice and real-time travel safety updates.' },
  { icon: 'Suitcase', title: 'Travel Support', description: 'Flight changes, travel disruptions and rebooking assistance.' },
  { icon: 'CommentUrgent', title: 'After-Hours Support', description: 'Round-the-clock support from our dedicated team.' }
];

const REGIONS = [
  { region: 'Middle East', phone: '+966 12 345 0000' },
  { region: 'Europe', phone: '+44 20 1234 5678' },
  { region: 'Asia Pacific', phone: '+65 3158 1234' },
  { region: 'Americas', phone: '+1 833 123 4567' },
  { region: 'Africa', phone: '+27 11 123 4567' }
];

const RESOURCES = [
  { icon: 'Certificate', title: 'Travel Safety Tips', description: 'Essential tips to help you stay safe while traveling.', linkLabel: 'View Tips' },
  { icon: 'Globe', title: 'Country Information', description: 'Access important information about your destination.', linkLabel: 'View Details' },
  { icon: 'Phone', title: 'Emergency Numbers', description: 'Important local emergency numbers by country.', linkLabel: 'View Numbers' },
  { icon: 'Help', title: 'FAQs', description: 'Find answers to common questions about travel care and support.', linkLabel: 'View FAQs' }
];

export const TravelCarePage: React.FC = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    service.logEvent('PageView', '/travel-care').catch(() => { /* non-fatal */ });
  }, [service]);

  return (
    <div>
      <Hero
        compact
        breadcrumbItems={[{ label: 'Travel Care' }]}
        title="Travel Care"
        highlight="We're here for you – 24/7"
        description="Dedicated support, anytime, anywhere. Your safety and peace of mind are our priority."
        media={<div className={styles.badge247}><Icon iconName="Headset" /><span>24/7</span></div>}
      />

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>How we support you</h2>
        <IconFeatureGrid accent="secondary" columns={5} items={SUPPORT_TYPES} />

        <div className={styles.alertBand}>
          <Icon iconName="WarningSolid" className={styles.alertIcon} />
          <div className={styles.alertText}>
            <strong>In case of an emergency</strong>
            <p>For immediate assistance, contact our emergency team anytime, anywhere.</p>
          </div>
          <div className={styles.alertContact}><Icon iconName="Phone" /><div><span>Global Toll Free</span><b>+800 1234 5678</b><small>Available 24/7</small></div></div>
          <div className={styles.alertContact}><Icon iconName="Phone" /><div><span>Local Direct Line</span><b>+966 12 345 0000</b><small>Available 24/7</small></div></div>
          <div className={styles.alertContact}><Icon iconName="Mail" /><div><span>Email Us</span><b>emergency@rsg.com</b></div></div>
        </div>

        <div className={styles.globalPanel}>
          <h3>24/7 Global Support</h3>
          <p>Our travel care team is available around the clock to support you across the world.</p>
          <div className={styles.regionRow}>
            {REGIONS.map((r) => (
              <div key={r.region}><Icon iconName="Globe" /><div><strong>{r.region}</strong><span>{r.phone}</span><small>Available 24/7</small></div></div>
            ))}
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Helpful Resources</h2>
        <LinkCardGrid columns={4} items={RESOURCES} />

        <CTABand
          variant="light"
          icon="Headset"
          title="Need immediate assistance?"
          description="Our team is ready to help you 24/7."
          ctaLabel="Contact Travel Care Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
