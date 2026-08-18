import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, CTABand, LoadingSpinner } from '../../../../shared/components';
import { resortHeroPlaceholderImage, photoPlaceholderImage } from '../../../../assets/images';
import { ITestimonial } from '../../../../models';
import styles from './HomeAlternatePage.module.scss';

const CATEGORY_CARDS = [
  { icon: 'Airplane', accent: 'primary' as const, title: 'Business Travel', description: 'Plan, book and manage your business travel with ease and compliance.', route: '/sap-concur' },
  { icon: 'Sunny', accent: 'teal' as const, title: 'Leisure Travel', description: 'Exclusive deals on hotels, experiences and holiday packages.', route: '/leisure-travel' },
  { icon: 'Shield', accent: 'bronze' as const, title: 'Travel Care', description: 'Your safety and wellbeing is our top priority, 24/7 everywhere.', route: '/travel-care' },
  { icon: 'Leaf', accent: 'green' as const, title: 'Sustainability', description: 'Travel responsibly. Together, we build a sustainable future.', route: '/sustainability' },
  { icon: 'Headset', accent: 'blue' as const, title: 'Support Center', description: 'Get quick help, find guides, FAQs and expert support.', route: '/sap-concur' }
];

const TIPS = [
  { icon: 'MailReminder', title: 'Book Smart, Save More', description: 'Book early to get the best fares and hotel rates.' },
  { icon: 'Certificate', title: 'Stay Policy Compliant', description: 'Always check travel class and hotel entitlements before you book.' },
  { icon: 'DocumentSet', title: 'Use Concur Smartly', description: 'Attach receipts on the go and submit expenses on time.' },
  { icon: 'LuggageCheckedIn', title: 'Pack Light, Travel Right', description: 'Avoid extra baggage fees and travel more comfortably.' },
  { icon: 'Health', title: 'Wellness on the Go', description: 'Small habits on the road can make a big difference to your wellbeing.' }
];

const WHATS_NEW = [
  { title: 'New Hotel Partners in Riyadh', description: 'Enjoy exclusive rates and benefits with our new partner hotels.' },
  { title: 'Wellness Beyond Office', description: 'New spa, fitness and F&B offers now available.' },
  { title: 'Updated Travel Policy', description: 'Key updates to travel policy and approval matrix.' },
  { title: 'Sustainability Update', description: "Learn how we're driving sustainable travel at RSG." }
];

export const HomeAlternatePage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [testimonials, setTestimonials] = React.useState<ITestimonial[]>([]);
  const [activeTestimonial, setActiveTestimonial] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    service.getTestimonials().then((t) => { if (!cancelled) setTestimonials(t); }).finally(() => { if (!cancelled) setLoading(false); });
    service.logEvent('PageView', '/home-alternate').catch(() => { /* non-fatal */ });
    return () => { cancelled = true; };
  }, [service]);

  if (loading) return <LoadingSpinner label="Loading Travel Hub…" />;

  return (
    <div className={styles.page}>
      <Hero
        eyebrow="Travel Services – F&A"
        title="Your Partner in Every Journey"
        highlight="TRAVEL 360"
        description="Smart travel. Seamless experiences. Supporting you at every step."
        backgroundImageUrl={resortHeroPlaceholderImage(theme.palette.secondary, theme.palette.primary)}
        media={(
          <div className={styles.quickPanel}>
            {[
              { icon: 'Airplane', title: 'Book Travel', desc: 'Flights, hotels and more', route: '/sap-concur' },
              { icon: 'ReceiptForecast', title: 'Expense Claim', desc: 'Submit and track your expenses', route: '/sap-concur' },
              { icon: 'DocumentApproval', title: 'Policies', desc: 'Guidelines and procedures', route: '/policies' },
              { icon: 'Health', title: 'Travel Care', desc: 'Safety, wellbeing and support', route: '/travel-care' },
              { icon: 'Sunny', title: 'Leisure Travel', desc: 'RSG offers, escapes and experiences', route: '/leisure-travel' },
              { icon: 'Devices3', title: 'SAP Concur', desc: 'Access help and resources', route: '/sap-concur' }
            ].map((q) => (
              <div key={q.title} className={styles.quickTile} onClick={() => navigate(q.route)} role="button" tabIndex={0}>
                <Icon iconName={q.icon} />
                <strong>{q.title}</strong>
                <span>{q.desc}</span>
              </div>
            ))}
          </div>
        )}
      />

      <div className={styles.body}>
        <div className={styles.announceBar}>
          <Icon iconName="Megaphone" />
          <strong>Announcements</strong>
          <span>New Wellness Beyond Office offers now live for Riyadh & Red Sea destinations.</span>
          <a onClick={() => navigate('/wellness')}>View All <Icon iconName="ChevronRightSmall" /></a>
        </div>

        <IconFeatureGrid
          columns={5}
          size="large"
          items={CATEGORY_CARDS.map((c) => ({ icon: c.icon, accent: c.accent, title: c.title, description: c.description, linkLabel: 'Explore', onClick: () => navigate(c.route) }))}
        />

        <div className={styles.threeCol}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}><h3>Travel Tips & Hacks</h3><a>View all tips</a></div>
            {TIPS.map((t) => (
              <div key={t.title} className={styles.tipRow}>
                <span className={styles.tipIcon}><Icon iconName={t.icon} /></span>
                <div><strong>{t.title}</strong><p>{t.description}</p></div>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}><h3>What&rsquo;s New</h3><a>View all updates</a></div>
            {WHATS_NEW.map((w) => (
              <div key={w.title} className={styles.newRow}>
                <div className={styles.newThumb} style={{ backgroundImage: `url('${photoPlaceholderImage(w.title, theme.palette.primary, theme.palette.secondary)}')` }} />
                <div><strong>{w.title}</strong><p>{w.description}</p></div>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}><h3>Your Next Trip, Simplified</h3></div>
            <div className={styles.searchTabs}>
              <span className={styles.tabActive}><Icon iconName="Airplane" /> Flights</span>
              <span><Icon iconName="CityNext" /> Hotels</span>
              <span><Icon iconName="Car" /> Cars</span>
            </div>
            <div className={styles.tripType}>
              <label><input type="radio" checked readOnly /> Round Trip</label>
              <label><input type="radio" readOnly /> One Way</label>
              <label><input type="radio" readOnly /> Multi-city</label>
            </div>
            <div className={styles.fieldGrid}>
              <div><span>From</span><input placeholder="Select origin" readOnly /></div>
              <div><span>To</span><input placeholder="Select destination" readOnly /></div>
              <div><span>Depart</span><input placeholder="Select date" readOnly /></div>
              <div><span>Return</span><input placeholder="Select date" readOnly /></div>
            </div>
            <div className={styles.travelersField}>
              <span>Travelers</span>
              <input value="1 Traveler, Economy" readOnly />
            </div>
            <button type="button" className={styles.searchBtn} onClick={() => navigate('/sap-concur')}>Search Flights</button>
            <a className={styles.fullOptions} onClick={() => navigate('/sap-concur')}>Go to full booking options <Icon iconName="ChevronRightSmall" /></a>
          </div>
        </div>

        <div className={styles.testimonials}>
          <div className={styles.panelHeader}><h3>What Our Travelers Say</h3><a>View all testimonials</a></div>
          <div className={styles.testimonialTrack}>
            {testimonials.map((t, i) => (
              <div key={t.Id} className={styles.testimonialCard} style={{ display: i === activeTestimonial ? undefined : 'none' }}>
                <Icon iconName="RightDoubleQuote" className={styles.quoteIcon} />
                <p>{t.Quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialPhoto} style={{ backgroundImage: `url('${t.Photo?.Url || photoPlaceholderImage(t.Name, theme.palette.primary, theme.palette.secondary)}')` }} />
                  <div><strong>{t.Name}</strong><span>{t.Role}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.dots}>
            {testimonials.map((t, i) => (
              <span key={t.Id} className={i === activeTestimonial ? styles.dotActive : undefined} onClick={() => setActiveTestimonial(i)} />
            ))}
          </div>
        </div>

        <div className={styles.contactRow}>
          <div className={styles.contactUrgent}>
            <Icon iconName="Warning" />
            <div>
              <strong>Need Emergency Help?</strong>
              <p>Contact our 24/7 Travel Care team anytime, anywhere.</p>
              <a onClick={() => navigate('/travel-care')}>Get Help <Icon iconName="ChevronRightSmall" /></a>
            </div>
          </div>
          <div className={styles.contactItem}><Icon iconName="Phone" /><div><strong>Global Toll Free</strong><span>+800 1234 5678</span><small>Available 24/7</small></div></div>
          <div className={styles.contactItem}><Icon iconName="Mail" /><div><strong>Email Us</strong><span>travelcare@rsg.com</span><small>We respond within 15 minutes</small></div></div>
          <div className={styles.contactItem}><Icon iconName="Phone" /><div><strong>Local Direct Line</strong><span>+966 12 345 0000</span><small>Available 24/7</small></div></div>
        </div>

        <CTABand
          variant="rich"
          icon="Shield"
          title="We are here for you, every step of the way."
          description="Your journey is our priority. Let's travel smart, safe and sustainable – together."
          ctaLabel="Contact Travel Services Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
