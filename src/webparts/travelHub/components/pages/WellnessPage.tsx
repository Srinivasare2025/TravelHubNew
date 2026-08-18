import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, OfferCard, SectionHeading, CTABand, LoadingSpinner } from '../../../../shared/components';
import { resortHeroPlaceholderImage, cardPlaceholderImage } from '../../../../assets/images';
import { IOffer } from '../../../../models';
import styles from './WellnessPage.module.scss';

const PILLARS = [
  { icon: 'Brain', title: 'Mind', description: 'Mental wellbeing, mindfulness and digital detox' },
  { icon: 'Fitness', title: 'Body', description: 'Fitness, movement and active lifestyle' },
  { icon: 'Health', title: 'Recovery', description: 'SPA, relaxation and quality restorative time' },
  { icon: 'FamilyEvent', title: 'Family', description: 'Family time, staycations and shared experiences' },
  { icon: 'EatDrink', title: 'Nutrition', description: 'Healthy dining guidance and nutrition support' },
  { icon: 'Trackers', title: 'Adventure', description: 'Explore, connect with nature and stay active' },
  { icon: 'Flower', title: 'Sustainability', description: 'Responsible travel and eco-friendly experiences' }
];

const RETREATS = [
  { country: 'Maldives', tag: 'Ocean Wellness' },
  { country: 'Bali', tag: 'Yoga & Mindfulness' },
  { country: 'Switzerland', tag: 'Medical Wellness' },
  { country: 'Thailand', tag: 'Detox & Rebalance' },
  { country: 'Austria', tag: 'Alpine Recovery' }
];

const BENEFITS = [
  { icon: 'Money', title: 'Exclusive Rates', description: 'Special employee rates at partner hotels.' },
  { icon: 'DocumentSet', title: 'Easy Booking', description: 'Book through our travel portal or contact our team.' },
  { icon: 'Settings', title: 'Flexible Options', description: 'Day passes, staycations or full retreats.' },
  { icon: 'ReceiptForecast', title: 'Earn & Track Benefits', description: 'Track your wellness journeys and savings.' }
];

export const WellnessPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [offers, setOffers] = React.useState<IOffer[] | undefined>(undefined);

  React.useEffect(() => {
    service.getOffers('Wellness').then(setOffers);
    service.logEvent('PageView', '/wellness').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!offers) return <LoadingSpinner />;

  const byTag = (tag: string): IOffer[] => offers.filter((o) => o.Tags?.includes(tag));
  const renderOffer = (o: IOffer): React.ReactElement => (
    <OfferCard
      key={o.Id}
      title={o.Title}
      description={o.Description}
      imageUrl={o.Image?.Url || cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, 'exclusive')}
      badge={o.Badge}
      badgeVariant={o.BadgeVariant}
      price={o.Price}
      ctaLabel={o.CtaLabel}
    />
  );

  return (
    <div>
      <Hero
        breadcrumbItems={[{ label: 'Leisure Travel', route: '/leisure-travel' }, { label: 'Wellness Beyond Office' }]}
        title="Wellness Beyond Office"
        highlight="Recharge. Reconnect. Perform Better."
        description="A holistic wellbeing initiative by Travel Services – F&A in partnership with premium hotels and destinations. Exclusive experiences for a healthier you and your family."
        backgroundImageUrl={resortHeroPlaceholderImage(theme.palette.primary, theme.palette.secondary)}
        media={<div className={styles.wellBadge}><Icon iconName="Flower" /><span>Wellbeing today for a better tomorrow</span></div>}
        infoStrip={(
          <div className={styles.benefitRow}>
            <div><Icon iconName="Health" /><span>Employee Wellbeing</span></div>
            <div><Icon iconName="Brain" /><span>Mind, Body & Balance</span></div>
            <div><Icon iconName="FamilyEvent" /><span>Family Wellbeing</span></div>
            <div><Icon iconName="FavoriteStar" /><span>Exclusive Experiences</span></div>
            <div><Icon iconName="Globe" /><span>Sustainable Travel</span></div>
          </div>
        )}
      />

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>Our Wellness Pillars</h2>
        <p className={styles.sub}>A holistic approach to your wellbeing.</p>
        <IconFeatureGrid accent="green" columns={7} items={PILLARS} />

        <SectionHeading title="Riyadh Hotels" subtitle="Urban wellness escapes, close to home." viewAllLabel="View all packages" onViewAllClick={() => navigate('/wellness')} />
        <div className={styles.offerGrid6}>{byTag('Riyadh Hotels').map(renderOffer)}</div>

        <div className={styles.twoCol}>
          <div>
            <SectionHeading title="Red Sea Destination Hotels" subtitle="Reconnect with nature. Rejuvenate by the sea." />
            <div className={styles.offerGrid3}>{byTag('Red Sea Destination Hotels').map(renderOffer)}</div>
          </div>
          <div>
            <SectionHeading title="International Retreats & Resorts" subtitle="Curated wellness retreats across the globe." />
            <div className={styles.retreatGrid}>
              {RETREATS.map((r) => (
                <div key={r.country} className={styles.retreatTile}>
                  <Icon iconName="Globe" />
                  <strong>{r.country}</strong>
                  <span>{r.tag}</span>
                </div>
              ))}
            </div>
            <a className={styles.seeAll} onClick={() => navigate('/wellness')}>Explore our international wellness retreats <Icon iconName="ChevronRightSmall" /></a>
          </div>
        </div>

        <SectionHeading title="Popular Wellness Packages" subtitle="Curated experiences for every need." viewAllLabel="View all packages" onViewAllClick={() => navigate('/wellness')} />
        <div className={styles.offerGrid4}>{byTag('Popular Packages').map(renderOffer)}</div>

        <div className={styles.benefitsBand}>
          {BENEFITS.map((b) => (
            <div key={b.title} className={styles.benefitTile}><Icon iconName={b.icon} /><div><strong>{b.title}</strong><p>{b.description}</p></div></div>
          ))}
          <div className={styles.viewBenefitsTile} onClick={() => navigate('/wellness')} role="button" tabIndex={0}>
            <strong>View My Benefits</strong>
            <span>See your eligibility, savings and past bookings.</span>
            <Icon iconName="ChevronRightSmall" />
          </div>
        </div>

        <CTABand
          variant="light"
          icon="Headset"
          title="We are here to help you plan your wellness journey."
          description="Our Travel Services team is ready to assist you."
          ctaLabel="Contact Travel Services Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
