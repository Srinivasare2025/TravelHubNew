import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, OfferCard, IconFeatureGrid, SectionHeading, CTABand, LoadingSpinner } from '../../../../shared/components';
import { resortHeroPlaceholderImage, cardPlaceholderImage, photoPlaceholderImage } from '../../../../assets/images';
import { IOffer } from '../../../../models';
import styles from './LeisureTravelPage.module.scss';

const CATEGORIES = [
  { icon: 'CityNext', title: 'RSG Destination Stays', description: 'Exclusive hotels in RSG destinations' },
  { icon: 'Airplane', title: 'Airline Discounts', description: 'Special fares on selected airlines' },
  { icon: 'Health', title: 'Spa & Wellness Offers', description: 'Relax and rejuvenate with exclusive access' },
  { icon: 'Coffee', title: 'Dining Privileges', description: 'Enjoy dining benefits at partner hotels' },
  { icon: 'FamilyEvent', title: 'Family Packages', description: 'Memorable stays for the whole family' },
  { icon: 'Tag', title: 'Seasonal Promotions', description: 'Limited time offers and discounts' }
];

const DESTINATIONS = ['Jeddah', 'AlUla', 'Dubai', 'Abha', 'Maldives', 'Istanbul'];

export const LeisureTravelPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [offers, setOffers] = React.useState<IOffer[] | undefined>(undefined);

  React.useEffect(() => {
    service.getOffers('Leisure').then(setOffers);
    service.logEvent('PageView', '/leisure-travel').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!offers) return <LoadingSpinner />;

  return (
    <div>
      <Hero
        breadcrumbItems={[{ label: 'Leisure Travel' }]}
        title="Leisure Travel"
        highlight="RSG Destination Hotels & Offers"
        description="Exclusive travel benefits for you and your family. Explore destinations, offers and experiences handpicked for our RSG family."
        backgroundImageUrl={resortHeroPlaceholderImage(theme.palette.secondary, theme.palette.primary)}
        infoStrip={(
          <div className={styles.benefitRow}>
            <div><Icon iconName="Tag" /><div><strong>Exclusive Employee Rates</strong><span>Special rates at premium hotels</span></div></div>
            <div><Icon iconName="SkypeCircleCheck" /><div><strong>Trusted & Curated Partners</strong><span>Carefully selected for your comfort</span></div></div>
            <div><Icon iconName="GiftboxSolid" /><div><strong>Family & Friends Welcome</strong><span>Enjoy benefits with your loved ones</span></div></div>
            <div><Icon iconName="Calendar" /><div><strong>Year-round Savings</strong><span>Offers available all year long</span></div></div>
          </div>
        )}
      />

      <div className={styles.body}>
        <div className={styles.searchPanel}>
          <div>
            <h3>Find your perfect getaway</h3>
            <p>Search exclusive hotel offers and packages.</p>
          </div>
          <a className={styles.outlineLink} onClick={() => navigate('/leisure-travel')}>View All Destinations <Icon iconName="ChevronRightSmall" /></a>
        </div>
        <div className={styles.searchBar}>
          <div className={styles.searchField}><Icon iconName="MapPin" /><input placeholder="Where do you want to go?" readOnly /></div>
          <div className={styles.searchField}><Icon iconName="Calendar" /><input placeholder="Check-in — Check-out" readOnly /></div>
          <div className={styles.searchField}><Icon iconName="Contact" /><input placeholder="2 Guests, 1 Room" readOnly /></div>
          <button type="button">Search Offers</button>
        </div>

        <SectionHeading title="Featured Offers" viewAllLabel="See all offers" onViewAllClick={() => navigate('/leisure-travel')} />
        <div className={styles.offerGrid}>
          {offers.map((o) => (
            <OfferCard
              key={o.Id}
              title={o.Title}
              subtitle={o.Location}
              description={o.Description}
              imageUrl={o.Image?.Url || cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, 'promo')}
              badge={o.Badge}
              badgeVariant={o.BadgeVariant}
              price={o.Price}
              priceNote={o.PriceNote}
              ctaLabel={o.CtaLabel}
            />
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Explore by Category</h2>
        <IconFeatureGrid accent="teal" columns={6} items={CATEGORIES} />

        <CTABand
          variant="light"
          icon="CrownSolid"
          title="Exclusive benefits, always"
          description="As part of the RSG family, you get access to exclusive rates, added benefits and unforgettable experiences."
          ctaLabel="View My Benefits"
        />

        <SectionHeading title="Popular Destinations" viewAllLabel="See all destinations" onViewAllClick={() => navigate('/leisure-travel')} />
        <div className={styles.destGrid}>
          {DESTINATIONS.map((d) => (
            <div key={d} className={styles.destTile} style={{ backgroundImage: `url('${photoPlaceholderImage(d, theme.palette.primary, theme.palette.secondary)}')` }}>
              <span>{d}</span>
            </div>
          ))}
        </div>

        <CTABand
          variant="light"
          icon="World"
          title="Need help planning your trip?"
          description="Our Travel Services team is here to help you plan the perfect getaway."
          ctaLabel="Contact Travel Services"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
