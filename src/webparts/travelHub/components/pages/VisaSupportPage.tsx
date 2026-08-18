import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, ProcessSteps, CTABand } from '../../../../shared/components';
import { resortHeroPlaceholderImage } from '../../../../assets/images';
import styles from './VisaSupportPage.module.scss';

const SERVICES = [
  { icon: 'FormLibrary', title: 'Visa Requirement Check', description: 'We verify the visa requirements for your destination based on your nationality and purpose of travel.' },
  { icon: 'DocumentSet', title: 'Document Guidance', description: 'Clear guidance on required documents and forms to ensure a smooth application process.' },
  { icon: 'Edit', title: 'Application Assistance', description: 'Step-by-step support to complete and submit your visa applications accurately.' },
  { icon: 'Clock', title: 'Tracking & Updates', description: 'We track your application and keep you updated at every stage.' },
  { icon: 'ContactCard', title: 'Visa Issuance & Collection', description: 'Support with visa issuance and safe delivery/collection of your documents.' },
  { icon: 'Headset', title: 'Post-Issuance Support', description: 'Assistance with changes, extensions or any post-issuance queries.' }
];

const STEPS = [
  { icon: 'Contact', title: 'Submit Request', description: 'Provide your travel details and destination.' },
  { icon: 'DocumentSet', title: 'Document Review', description: 'We review and confirm required documents.' },
  { icon: 'MailForward', title: 'Application Submission', description: 'We prepare and submit your application.' },
  { icon: 'HourGlass', title: 'Processing', description: 'We monitor the status and update you.' },
  { icon: 'ContactCard', title: 'Visa Issued', description: 'Receive your visa and travel with confidence.' }
];

const DESTINATIONS = [
  { country: 'United States', type: 'Business / B1-B2' },
  { country: 'United Kingdom', type: 'Standard Visitor / Business' },
  { country: 'Schengen Countries', type: 'Short Stay Visa (C)' }
];

const INFO_LINKS = ['Visa Policy Compliance — Understand company visa policies.', 'Travel Restrictions — Check the latest travel advisories.', 'Document Templates — Download commonly used forms.'];

export const VisaSupportPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    service.logEvent('PageView', '/visa-support').catch(() => { /* non-fatal */ });
  }, [service]);

  return (
    <div>
      <Hero
        breadcrumbItems={[{ label: 'Support' }, { label: 'Visa Support' }]}
        title="Visa Support"
        highlight="We make your travel seamless."
        description="Our Visa Support team is here to help you navigate visa requirements with ease so you can focus on what matters."
        backgroundImageUrl={resortHeroPlaceholderImage(theme.palette.secondary, theme.palette.primary)}
        infoStrip={(
          <div className={styles.benefitRow}>
            <div><Icon iconName="ContactCard" /><div><strong>Business & Assignment Visas</strong><span>Support for short-term business trips and long-term assignments.</span></div></div>
            <div><Icon iconName="Globe" /><div><strong>Global Coverage</strong><span>Assistance with visa requirements for destinations worldwide.</span></div></div>
            <div><Icon iconName="Clock" /><div><strong>Fast & Reliable</strong><span>Timely processing and updates to keep your travel on track.</span></div></div>
            <div><Icon iconName="Shield" /><div><strong>Compliant & Secure</strong><span>We ensure compliance with local regulations and company policies.</span></div></div>
          </div>
        )}
      />

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>Our Visa Support Services</h2>
        <IconFeatureGrid accent="bronze" columns={6} items={SERVICES} />

        <div className={styles.processPanel}>
          <h3>Visa Application Process</h3>
          <ProcessSteps steps={STEPS} />
        </div>

        <div className={styles.threeCol}>
          <div className={styles.panel}>
            <h3>Popular Destinations</h3>
            {DESTINATIONS.map((d) => (
              <div key={d.country} className={styles.destRow}>
                <span className={styles.flagDot} />
                <div><strong>{d.country}</strong><p>{d.type}</p></div>
              </div>
            ))}
            <a className={styles.seeAll}>View all countries <Icon iconName="ChevronRightSmall" /></a>
          </div>
          <div className={styles.panel}>
            <h3>Useful Information</h3>
            {INFO_LINKS.map((l) => {
              const [title, desc] = l.split(' — ');
              return (
                <div key={title} className={styles.infoRow}>
                  <Icon iconName="TextDocument" />
                  <div><strong>{title}</strong><p>{desc}</p></div>
                  <Icon iconName="ChevronRightSmall" className={styles.chevron} />
                </div>
              );
            })}
            <a className={styles.seeAll}>View all resources <Icon iconName="ChevronRightSmall" /></a>
          </div>
          <div className={styles.helpPanel}>
            <h3>Need Help?</h3>
            <p>Our Visa Support team is here for you.</p>
            <div className={styles.helpItem}><Icon iconName="Mail" /><div><strong>Email Us</strong><span>visa.support@rsg.com</span></div></div>
            <div className={styles.helpItem}><Icon iconName="Headset" /><div><strong>Call Us</strong><span>+966 12 345 1111</span><small>Sun – Thu, 8:00 AM – 6:00 PM (GMT+3)</small></div></div>
            <button type="button" onClick={() => navigate('/travel-care')}>Contact Visa Support Team <Icon iconName="ChevronRightSmall" /></button>
          </div>
        </div>

        <CTABand
          variant="light"
          icon="Mail"
          title="Have more questions about your visa?"
          description="Our Visa Support team is ready to help."
          ctaLabel="Contact Visa Support Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
