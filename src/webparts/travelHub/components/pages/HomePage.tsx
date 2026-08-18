import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, StatStrip, SectionHeading, CTABand, LoadingSpinner } from '../../../../shared/components';
import { resortHeroPlaceholderImage, photoPlaceholderImage } from '../../../../assets/images';
import { INewsItem, ITeamMember } from '../../../../models';
import styles from './HomePage.module.scss';

const QUICK_ACCESS: Array<{ icon: string; title: string; route: string }> = [
  { icon: 'Suitcase', title: 'Business Travel', route: '/sap-concur' },
  { icon: 'Sunny', title: 'Leisure Travel', route: '/leisure-travel' },
  { icon: 'Devices3', title: 'SAP Concur', route: '/sap-concur' },
  { icon: 'DocumentApproval', title: 'Travel Policy', route: '/policies' },
  { icon: 'ContactCard', title: 'Visa Support', route: '/visa-support' },
  { icon: 'HomeGroup', title: 'Relocation Travel', route: '/travel-care' },
  { icon: 'ReceiptForecast', title: 'Expense Claims', route: '/sap-concur' },
  { icon: 'Shield', title: 'Travel Insurance', route: '/travel-care' },
  { icon: 'Headset', title: 'Emergency Assistance – Travel Care', route: '/travel-care' },
  { icon: 'Leaf', title: 'Sustainability Green Travel', route: '/sustainability' },
  { icon: 'CityNext', title: 'RSG Destination Hotels & Offers', route: '/leisure-travel' },
  { icon: 'Health', title: 'Wellness Beyond Office', route: '/wellness' }
];

const INFO_COLUMNS: Array<{ icon: string; title: string; items: string[]; route: string }> = [
  { icon: 'CalendarAgenda', title: 'Before Travel', items: ['Policy & eligibility', 'Approval process', 'Booking process', 'Visa requirements', 'Allowances & limits'], route: '/policies' },
  { icon: 'Airplane', title: 'During Travel', items: ['Support contacts', 'Changes / cancellations', 'Travel alerts', 'Emergencies', '24/7 Travel Care'], route: '/travel-care' },
  { icon: 'ReceiptForecast', title: 'After Travel', items: ['Expense claims', 'SAP Concur', 'Reimbursement', 'Reporting', 'Trip closure'], route: '/sap-concur' }
];

export const HomePage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [news, setNews] = React.useState<INewsItem[]>([]);
  const [team, setTeam] = React.useState<ITeamMember[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([service.getFeaturedNews(4), service.getTeamMembers()]).then(([n, t]) => {
      if (cancelled) return;
      setNews(n);
      setTeam(t);
    }).finally(() => { if (!cancelled) setLoading(false); });
    service.logEvent('PageView', '/home').catch(() => { /* non-fatal */ });
    return () => { cancelled = true; };
  }, [service]);

  if (loading) return <LoadingSpinner label="Loading Travel Hub…" />;

  return (
    <div className={styles.page}>
      <Hero
        eyebrow="Welcome to"
        title="Travel Services – F&A"
        highlight="Your Partner in Every Journey"
        description="Your one-stop hub for business and leisure travel. Guidance, tools, policies and support – everything you need for a seamless travel experience."
        backgroundImageUrl={resortHeroPlaceholderImage(theme.palette.primary, theme.palette.secondary)}
        ctas={[
          { label: 'Book Business Travel', icon: 'Suitcase', to: '/sap-concur', accentColor: 'var(--th-secondary)' },
          { label: 'Leisure Travel Offers', icon: 'Sunny', to: '/leisure-travel', accentColor: 'var(--th-accent-teal)' },
          { label: 'SAP Concur Support', icon: 'Devices3', to: '/sap-concur', accentColor: 'var(--th-accent-blue)' },
          { label: 'Travel Policy', icon: 'DocumentApproval', to: '/policies', accentColor: 'var(--th-accent-bronze)' },
          { label: 'Emergency Assistance – Travel Care', icon: 'Headset', to: '/travel-care', variant: 'outline' },
          { label: 'Contact Travel Team', icon: 'ContactCardSettings', to: '/travel-care', variant: 'outline' }
        ]}
      />

      <div className={styles.body}>
        <SectionHeading title="Quick Access" viewAllRoute="/leisure-travel" viewAllLabel="View all services" />
        <IconFeatureGrid columns={5} items={QUICK_ACCESS.map((q) => ({ icon: q.icon, title: q.title, onClick: () => navigate(q.route) }))} />

        <h2 className={styles.plainHeading}>I&rsquo;m looking for information&hellip;</h2>
        <div className={styles.infoCols}>
          {INFO_COLUMNS.map((col) => (
            <div key={col.title} className={styles.infoCol} onClick={() => navigate(col.route)}>
              <div className={styles.infoHeader}><Icon iconName={col.icon} /> <h4>{col.title}</h4></div>
              <ul>{col.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <span className={styles.infoArrow}><Icon iconName="ChevronRightSmall" /></span>
            </div>
          ))}
        </div>

        <div className={styles.promoRow}>
          <div className={`${styles.promoCard} ${styles.promoDark}`}>
            <h4>SAP Concur Hub</h4>
            <p>Everything you need to work smarter with SAP Concur.</p>
            <ul>
              <li><Icon iconName="CheckMark" /> User Guides</li>
              <li><Icon iconName="CheckMark" /> Training Videos</li>
              <li><Icon iconName="CheckMark" /> FAQs</li>
              <li><Icon iconName="CheckMark" /> What&rsquo;s New</li>
              <li><Icon iconName="CheckMark" /> Mobile App Support</li>
              <li><Icon iconName="CheckMark" /> Troubleshooting</li>
            </ul>
            <button type="button" onClick={() => navigate('/sap-concur')}>Go to Concur Hub <Icon iconName="ChevronRightSmall" /></button>
          </div>
          <div className={`${styles.promoCard} ${styles.promoLight}`}>
            <h4>Green Travel</h4>
            <p>Promoting sustainability tourism for a better future.</p>
            <ul>
              <li><Icon iconName="CheckMark" /> Sustainable travel tips</li>
              <li><Icon iconName="CheckMark" /> Eco-friendly choices</li>
              <li><Icon iconName="CheckMark" /> Reduce carbon footprint</li>
              <li><Icon iconName="CheckMark" /> Green hotel partners</li>
              <li><Icon iconName="CheckMark" /> Our commitment</li>
            </ul>
            <button type="button" onClick={() => navigate('/sustainability')}>Explore Green Travel <Icon iconName="ChevronRightSmall" /></button>
          </div>
          <div className={`${styles.promoCard} ${styles.promoTan}`}>
            <h4>RSG Destination Hotels & Offers</h4>
            <p>Exclusive rates at RSG destinations for employees and their families.</p>
            <ul>
              <li><Icon iconName="CityNext" /> Red Sea Destination Hotels</li>
              <li><Icon iconName="Money" /> Special Employee Rates</li>
              <li><Icon iconName="FamilyEvent" /> Family & Staycation Offers</li>
            </ul>
            <button type="button" onClick={() => navigate('/leisure-travel')}>View Hotels & Offers <Icon iconName="ChevronRightSmall" /></button>
          </div>
        </div>

        <SectionHeading title="Travel News & Updates" viewAllRoute="/dashboard" />
        <div className={styles.newsList}>
          {news.length === 0 && <p className={styles.empty}>No news published yet.</p>}
          {news.map((n) => (
            <div key={n.Id} className={styles.newsItem}>
              <div className={styles.newsThumb} style={{ backgroundImage: `url('${photoPlaceholderImage(n.Category, theme.palette.primary, theme.palette.secondary)}')` }} />
              <div>
                <h5>{n.Title}</h5>
                <p>{n.Summary}</p>
                <span>{new Date(n.PublishDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className={styles.plainHeading}>Travel Services at a Glance</h2>
        <StatStrip
          stats={[
            { value: '90%', label: 'Employee Satisfaction', deltaLabel: 'Excellent' },
            { value: '78%', label: 'SAP Concur Adoption', deltaLabel: '▲ 12% vs last quarter' },
            { value: 'SAR 24.6M', label: 'Travel Spend (MTD)', deltaLabel: '▼ 8% vs last month', deltaUp: false },
            { value: 'SAR 18.7M', label: 'Savings Delivered (YTD)', deltaLabel: '▲ 15% vs last year' },
            { value: '2,850 tCO₂', label: 'CO₂ Emissions (YTD)', deltaLabel: '▼ 18% vs last year', deltaUp: false },
            { value: '95%', label: 'SLA Performance', deltaLabel: 'Meeting our commitments' },
            { value: '12,842', label: 'Bookings Managed (YTD)', deltaLabel: '▲ 10% vs last year' }
          ]}
        />

        <SectionHeading title="Meet the Travel Services Team" viewAllLabel="View full team" onViewAllClick={() => navigate('/travel-care')} />
        <div className={styles.teamGrid}>
          {team.map((m) => (
            <div key={m.Id} className={styles.teamCard}>
              <div className={styles.teamPhoto} style={{ backgroundImage: `url('${m.Photo?.Url || photoPlaceholderImage(m.Name, theme.palette.primary, theme.palette.secondary)}')` }} />
              <h5>{m.Name}</h5>
              <p>{m.Role}</p>
              <div className={styles.teamIcons}>
                {m.Email && <a href={`mailto:${m.Email}`}><Icon iconName="Mail" /></a>}
                {m.Phone && <a href={`tel:${m.Phone}`}><Icon iconName="Phone" /></a>}
                {m.LinkedInUrl && <a href={m.LinkedInUrl}><Icon iconName="LinkedInLogo" /></a>}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.richBand}>
          <div>
            <h3>We&rsquo;re here for you – 24/7 Travel Care</h3>
          </div>
          <div className={styles.richContacts}>
            <div>
              <Icon iconName="Health" />
              <div>
                <strong>Emergency Travel (24/7 Travel Care)</strong>
                <p>For urgent travel assistance anytime, anywhere.</p>
                <span>+966 12 345 0000</span>
              </div>
            </div>
            <div>
              <Icon iconName="Headset" />
              <div>
                <strong>ATS Hotline</strong>
                <p>For immediate support with your travel needs.</p>
                <span>+966 12 345 1111</span>
              </div>
            </div>
          </div>
          <div className={styles.richList}>
            <div><Icon iconName="Health" /> Medical Assistance <b>+966 12 345 0001</b></div>
            <div><Icon iconName="Clock" /> After-Hours Support <b>+966 12 345 0002</b></div>
            <div><Icon iconName="Bank" /> ATS Emergency Line <b>+966 12 345 0003</b></div>
          </div>
          <div className={styles.richBadge}>
            <Icon iconName="Shield" />
            <p>Your safety is our priority. Travel with confidence, we are with you every step.</p>
          </div>
        </div>

        <CTABand
          variant="light"
          icon="ContactCardSettings"
          title="Need something else?"
          description="Our Travel Services team is here to help with anything travel-related."
          ctaLabel="Contact Travel Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
