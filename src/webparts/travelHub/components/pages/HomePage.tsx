import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, StatStrip, SectionHeading, LoadingSpinner } from '../../../../shared/components';
import { resortHeroPlaceholderImage, photoPlaceholderImage, cardPlaceholderImage, deviceMockupPlaceholderImage } from '../../../../assets/images';
import { INewsItem, ITeamMember, IQuickLink } from '../../../../models';
import styles from './HomePage.module.scss';

const INFO_COLUMNS: Array<{ icon: string; title: string; items: string[]; route: string; imageVariant: 'event' | 'journey' | 'receipt' }> = [
  { icon: 'CalendarAgenda', title: 'Before Travel', items: ['Policy & eligibility', 'Approval process', 'Booking process', 'Visa requirements', 'Allowances & limits'], route: '/policies', imageVariant: 'event' },
  { icon: 'Airplane', title: 'During Travel', items: ['Support contacts', 'Changes / cancellations', 'Travel alerts', 'Emergencies', '24/7 Travel Care'], route: '/travel-care', imageVariant: 'journey' },
  { icon: 'ReceiptForecast', title: 'After Travel', items: ['Expense claims', 'SAP Concur', 'Reimbursement', 'Reporting', 'Trip closure'], route: '/sap-concur', imageVariant: 'receipt' }
];

/** Left icon + big number + delta indicator, e.g. "▲ 12% vs last quarter" — mirrors the mockup's Travel Services at a Glance cards. */
const GLANCE_STATS: Array<{ icon: string; value: string; label: string; deltaLabel: string; deltaUp?: boolean; valueColor?: 'primary' | 'secondary' }> = [
  { icon: 'Like', value: '90%', label: 'Employee Satisfaction', deltaLabel: 'Excellent' },
  { icon: 'Devices3', value: '78%', label: 'SAP Concur Adoption', deltaLabel: '▲ 12% vs last quarter' },
  { icon: 'Money', value: 'SAR 24.6M', label: 'Travel Spend (MTD)', deltaLabel: '▼ 8% vs last month', deltaUp: false },
  { icon: 'Bank', value: 'SAR 18.7M', label: 'Savings Delivered (YTD)', deltaLabel: '▲ 15% vs last year' },
  { icon: 'Flower', value: '2,850 tCO₂', label: 'CO₂ Emissions (YTD)', deltaLabel: '▼ 18% vs last year', deltaUp: false },
  { icon: 'Ribbon', value: '95%', label: 'SLA Performance', deltaLabel: 'Meeting our commitments' },
  { icon: 'Airplane', value: '12,842', label: 'Bookings Managed (YTD)', deltaLabel: '▲ 10% vs last year' }
];

/** Medical / After-hours / ATS emergency lines shown pipe-separated in the 24/7 Travel Care band. */
const EMERGENCY_LINES: Array<{ icon: string; label: string; phone: string }> = [
  { icon: 'Health', label: 'Medical Assistance', phone: '+966 12 345 0001' },
  { icon: 'Clock', label: 'After-Hours Support', phone: '+966 12 345 0002' },
  { icon: 'Bank', label: 'ATS Emergency Line', phone: '+966 12 345 0003' }
];

export const HomePage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [news, setNews] = React.useState<INewsItem[]>([]);
  const [team, setTeam] = React.useState<ITeamMember[]>([]);
  const [quickLinks, setQuickLinks] = React.useState<IQuickLink[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([service.getFeaturedNews(4), service.getTeamMembers(), service.getQuickLinks()]).then(([n, t, q]) => {
      if (cancelled) return;
      setNews(n);
      setTeam(t);
      setQuickLinks(q);
    }).finally(() => { if (!cancelled) setLoading(false); });
    service.logEvent('PageView', '/home').catch(() => { /* non-fatal */ });
    return () => { cancelled = true; };
  }, [service]);

  if (loading) return <LoadingSpinner label="Loading Travel Hub…" />;

  // Top 4 Travel Services team members, photo-left / details-right.
  const topTeam = team.slice(0, 4);

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
        <IconFeatureGrid
          columns={4}
          layout="horizontal"
          items={quickLinks.map((q) => ({ icon: q.IconClass || 'Link', title: q.Title, onClick: () => navigate(q.URL.Url.replace(/^#/, '')) }))}
        />

        <h2 className={styles.plainHeading}>I&rsquo;m looking for information&hellip;</h2>
        <div className={styles.infoCols}>
          {INFO_COLUMNS.map((col) => (
            <div key={col.title} className={styles.infoCol} onClick={() => navigate(col.route)}>
              <div className={styles.infoLeft}>
                <div className={styles.infoHeader}><Icon iconName={col.icon} /> <h4>{col.title}</h4></div>
                <ul>{col.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
              <div
                className={styles.infoImage}
                style={{ backgroundImage: `url('${cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, col.imageVariant)}')` }}
              />
              <span className={styles.infoArrow}><Icon iconName="ChevronRightSmall" /></span>
            </div>
          ))}
        </div>

        <div className={styles.promoRow}>
          <div
            className={`${styles.promoCard} ${styles.promoDark}`}
            style={{
              backgroundImage:
                `linear-gradient(100deg, ${theme.palette.secondary} 0%, ${theme.palette.secondary} 44%, rgba(4,37,60,0.55) 72%, rgba(4,37,60,0.15) 100%), ` +
                `url('${deviceMockupPlaceholderImage(theme.palette.primary, theme.palette.secondary)}')`
            }}
          >
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
            <div className={styles.promoSplit}>
              <div className={styles.promoContent}>
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
              <div
                className={styles.promoImage}
                style={{ backgroundImage: `url('${cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, 'leaf')}')` }}
              />
            </div>
          </div>

          <div className={`${styles.promoCard} ${styles.promoTan}`}>
            <div className={styles.promoSplit}>
              <div className={styles.promoContent}>
                <h4>RSG Destination Hotels & Offers</h4>
                <p>Exclusive rates at RSG destinations for employees and their families.</p>
                <ul>
                  <li><Icon iconName="CityNext" /> Red Sea Destination Hotels</li>
                  <li><Icon iconName="Money" /> Special Employee Rates</li>
                  <li><Icon iconName="FamilyEvent" /> Family & Staycation Offers</li>
                </ul>
                <button type="button" onClick={() => navigate('/leisure-travel')}>View Hotels & Offers <Icon iconName="ChevronRightSmall" /></button>
              </div>
              <div
                className={styles.promoImage}
                style={{ backgroundImage: `url('${cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, 'hotel')}')` }}
              />
            </div>
          </div>

          <div className={`${styles.promoCard} ${styles.promoNews}`}>
            <div className={styles.promoNewsHead}>
              <h4>Travel News & Updates</h4>
              <button type="button" onClick={() => navigate('/dashboard')}>View all <Icon iconName="ChevronRightSmall" /></button>
            </div>
            <div className={styles.newsList}>
              {news.length === 0 && <p className={styles.empty}>No news published yet.</p>}
              {news.map((n) => (
                <div key={n.Id} className={styles.newsItem}>
                  <div className={styles.newsThumb} style={{ backgroundImage: `url('${photoPlaceholderImage(n.Category, theme.palette.primary, theme.palette.secondary)}')` }} />
                  <div className={styles.newsBody}>
                    <h5>{n.Title}</h5>
                    <p>{n.Summary}</p>
                  </div>
                  <span className={styles.newsDate}>{new Date(n.PublishDate).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className={styles.plainHeading}>Travel Services at a Glance</h2>
        <StatStrip
          stats={GLANCE_STATS.map((s) => ({
            icon: s.icon, value: s.value, label: s.label, deltaLabel: s.deltaLabel, deltaUp: s.deltaUp, valueColor: s.valueColor
          }))}
        />

        <SectionHeading title="Meet the Travel Services Team" viewAllLabel="View full team" onViewAllClick={() => navigate('/travel-care')} />
        <div className={styles.teamGrid}>
          {topTeam.map((m) => (
            <div key={m.Id} className={styles.teamCard}>
              <div className={styles.teamPhoto} style={{ backgroundImage: `url('${m.Photo?.Url || photoPlaceholderImage(m.Name, theme.palette.primary, theme.palette.secondary)}')` }} />
              <div className={styles.teamInfo}>
                <h5>{m.Name}</h5>
                <p>{m.Role}</p>
                {m.Department && <p className={styles.teamDept}>{m.Department}</p>}
                <div className={styles.teamIcons}>
                  {m.Email && <a href={`mailto:${m.Email}`} title={m.Email}><Icon iconName="Mail" /></a>}
                  {m.Phone && <a href={`tel:${m.Phone}`} title={m.Phone}><Icon iconName="Phone" /></a>}
                  {m.LinkedInUrl && <a href={m.LinkedInUrl} target="_blank" rel="noreferrer" title="LinkedIn"><Icon iconName="LinkedInLogo" /></a>}
                </div>
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
            {EMERGENCY_LINES.map((l, i) => (
              <React.Fragment key={l.label}>
                {i > 0 && <span className={styles.richPipe} aria-hidden="true">|</span>}
                <div><Icon iconName={l.icon} /> {l.label} <b>{l.phone}</b></div>
              </React.Fragment>
            ))}
          </div>
          <div className={styles.richBadge}>
            <Icon iconName="Shield" />
            <p>Your safety is our priority. Travel with confidence, we are with you every step.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
