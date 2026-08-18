import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, StatStrip, IconFeatureGrid, SectionHeading, CTABand, LoadingSpinner } from '../../../../shared/components';
import { heroPlaceholderImage, photoPlaceholderImage } from '../../../../assets/images';
import { IOffer } from '../../../../models';
import styles from './MeetingsEventsPage.module.scss';

const WE_HELP = ['Venue selection', 'Accommodation & travel', 'F&B & catering', 'AV & technical support', 'Event planning & coordination', 'Delegate management', 'On-site support'];

const CITIES = ['All Cities', 'Riyadh', 'Jeddah', 'Dammam', 'Tabuk', 'Umluj'];

const INTERNATIONAL = [
  { city: 'Dubai', tag: 'Premium venues for world-class events' },
  { city: 'London', tag: 'Iconic locations for every business occasion.' },
  { city: 'Italy', tag: 'Timeless elegance for memorable events' },
  { city: 'Milano', tag: 'Style, sophistication and seamless service' }
];

const WHY_US = [
  { icon: 'People', title: 'Dedicated Support', description: 'A single point of contact for your event needs.' },
  { icon: 'Money', title: 'Best Value', description: 'Competitive rates and added value for your events.' },
  { icon: 'Settings', title: 'Customized Solutions', description: 'Tailored packages to match your requirements.' },
  { icon: 'Leaf', title: 'Sustainability Focused', description: 'Eco-conscious venues and responsible events.' },
  { icon: 'Globe', title: 'Global Reach', description: 'Access to top hotels and venues worldwide.' }
];

export const MeetingsEventsPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [hotels, setHotels] = React.useState<IOffer[] | undefined>(undefined);
  const [cityFilter, setCityFilter] = React.useState('All Cities');

  React.useEffect(() => {
    service.getOffers('Hotel Partner').then(setHotels);
    service.logEvent('PageView', '/meetings-events').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!hotels) return <LoadingSpinner />;

  const grouped: Record<string, IOffer[]> = {};
  hotels.forEach((h) => {
    const city = h.Tags?.[0] || 'Other';
    if (cityFilter !== 'All Cities' && city !== cityFilter) return;
    (grouped[city] = grouped[city] || []).push(h);
  });

  return (
    <div>
      <Hero
        breadcrumbItems={[{ label: 'Meetings, Events & Conference' }]}
        title="Meetings, Events & Conferences"
        highlight="Inspiring venues. Seamless experiences."
        description="End-to-end support for all your corporate meetings, events and conferences with our trusted hotel partners worldwide."
        backgroundImageUrl={heroPlaceholderImage(theme.palette.secondary, theme.palette.primary)}
        media={(
          <div className={styles.helpPanel}>
            <h5>We help you with</h5>
            <ul>{WE_HELP.map((w) => <li key={w}><Icon iconName="SkypeCircleCheck" /> {w}</li>)}</ul>
          </div>
        )}
        infoStrip={(
          <div className={styles.benefitRow}>
            <div><Icon iconName="People" /><span>Wide Network of Partner Hotels</span></div>
            <div><Icon iconName="FavoriteStar" /><span>Preferred Rates & Exclusive Benefits</span></div>
            <div><Icon iconName="CalendarAgenda" /><span>End-to-End Event Support</span></div>
            <div><Icon iconName="Shield" /><span>Quality & Service You Can Trust</span></div>
            <div><Icon iconName="Leaf" /><span>Sustainable Event Options</span></div>
          </div>
        )}
      />

      <div className={styles.body}>
        <StatStrip
          stats={[
            { value: '150+', label: 'Partner Hotels' },
            { value: '20+', label: 'Countries' },
            { value: '500+', label: 'Events Supported' },
            { value: '100%', label: 'Commitment to Excellence', valueColor: 'primary' }
          ]}
        />

        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Our Partner Hotels in Saudi Arabia</h2>
          <div className={styles.cityTabs}>
            {CITIES.map((c) => (
              <button key={c} type="button" className={cityFilter === c ? styles.tabActive : undefined} onClick={() => setCityFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        {Object.keys(grouped).map((city) => (
          <div key={city} className={styles.citySection}>
            <SectionHeading title={city} viewAllLabel={`View all ${city} hotels`} />
            <div className={styles.hotelGrid}>
              {grouped[city].map((h) => (
                <div key={h.Id} className={styles.hotelTile} style={{ backgroundImage: `url('${photoPlaceholderImage(h.Title, theme.palette.primary, theme.palette.secondary)}')` }}>
                  <span>{h.Title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <h2 className={styles.sectionTitle}>Our International Hotel Partners</h2>
        <div className={styles.intlGrid}>
          {INTERNATIONAL.map((c) => (
            <div key={c.city} className={styles.intlTile} style={{ backgroundImage: `url('${photoPlaceholderImage(c.city, theme.palette.secondary, theme.palette.primary)}')` }}>
              <div><strong>{c.city}</strong><p>{c.tag}</p><a>View Hotels <Icon iconName="ChevronRightSmall" /></a></div>
            </div>
          ))}
          <div className={`${styles.intlTile} ${styles.intlExplore}`}>
            <Icon iconName="Globe" />
            <strong>Explore All Global Partners</strong>
            <a>View All Countries <Icon iconName="ChevronRightSmall" /></a>
          </div>
        </div>

        <IconFeatureGrid accent="secondary" columns={5} items={WHY_US} />

        <CTABand
          variant="rich"
          icon="Headset"
          title="Let's plan your next successful event."
          description="Our events team is here to help you every step of the way."
          ctaLabel="Contact Events Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
