import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, StatStrip, CTABand, LoadingSpinner } from '../../../../shared/components';
import { resortHeroPlaceholderImage } from '../../../../assets/images';
import { ISustainabilityMetric } from '../../../../models';
import styles from './SustainabilityPage.module.scss';

const COMMITMENT = [
  { icon: 'Leaf', accent: 'green' as const, title: 'Reduce', description: 'We aim to reduce our carbon footprint by making smarter travel choices and optimizing our resources.' },
  { icon: 'Refresh', accent: 'blue' as const, title: 'Responsible', description: 'We partner with suppliers who share our values and follow responsible and ethical practices.' },
  { icon: 'People', accent: 'bronze' as const, title: 'Support', description: 'We support local communities and contribute to the economic and social well-being of our destinations.' },
  { icon: 'Globe', accent: 'green' as const, title: 'Sustainable', description: 'We promote sustainable solutions and encourage our travelers to be part of the change.' }
];

const GUIDELINES = ['Choose direct flights when possible', 'Use public transportation or shared transfers', 'Book eco-friendly hotels and accommodations', 'Minimize single-use plastics and waste', 'Conserve energy and water during your stay', 'Offset your carbon emissions where possible'];

export const SustainabilityPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [metrics, setMetrics] = React.useState<ISustainabilityMetric[] | undefined>(undefined);

  React.useEffect(() => {
    service.getSustainabilityMetrics().then(setMetrics);
    service.logEvent('PageView', '/sustainability').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!metrics) return <LoadingSpinner />;

  return (
    <div>
      <Hero
        breadcrumbItems={[{ label: 'Sustainability' }]}
        title="Sustainability"
        highlight="Travel today, protect tomorrow"
        description="We are committed to responsible travel that reduces our impact and supports a better future for generations to come."
        backgroundImageUrl={resortHeroPlaceholderImage(theme.palette.secondary, theme.palette.primary)}
        media={<div className={styles.leafBadge}><Icon iconName="Leaf" /></div>}
      />

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>Our Commitment</h2>
        <p className={styles.sub}>We integrate sustainability into our travel programs to minimize environmental impact, support local communities and promote responsible business practices.</p>
        <IconFeatureGrid columns={4} items={COMMITMENT} />

        <div className={styles.guidelinesPanel}>
          <div>
            <h3>Our Sustainable Travel Guidelines</h3>
            <p>Simple actions can make a big difference. Please follow these guidelines to travel more sustainably.</p>
            <ul>{GUIDELINES.map((g) => <li key={g}><Icon iconName="SkypeCircleCheck" /> {g}</li>)}</ul>
          </div>
          <div className={styles.guidelinesArt}>
            <Icon iconName="Globe" />
            <Icon iconName="Airplane" className={styles.artPlane} />
            <Icon iconName="LuggageCheckedIn" className={styles.artBag} />
            <Icon iconName="RecycleBin" className={styles.artRecycle} />
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Our Impact</h2>
        <StatStrip stats={metrics.map((m) => ({ icon: m.Icon, value: m.Value, label: m.Label, deltaLabel: m.DeltaLabel }))} />

        <CTABand
          variant="light"
          icon="Leaf"
          title="Together, we can build a more sustainable future."
          description="Thank you for travelling responsibly with Red Sea Global."
          ctaLabel="Learn More About Our Initiatives"
          onCtaClick={() => navigate('/sustainability')}
        />
      </div>
    </div>
  );
};
