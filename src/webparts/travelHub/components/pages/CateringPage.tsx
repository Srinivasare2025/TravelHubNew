import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useThemeContext } from '../../../../state/ThemeContext';
import { Hero, IconFeatureGrid, ProcessSteps, CTABand, LoadingSpinner } from '../../../../shared/components';
import { cardPlaceholderImage } from '../../../../assets/images';
import { ICateringMenu } from '../../../../models';
import styles from './CateringPage.module.scss';

const FEATURES = [
  { icon: 'CalendarAgenda', title: 'Perfect for meetings, workshops, trainings and events' },
  { icon: 'Health', title: 'Healthy, fresh & high-quality ingredients' },
  { icon: 'Globe', title: 'A variety of local & international options' },
  { icon: 'EditNote', title: 'Tailored to your event needs' },
  { icon: 'Clock', title: 'Seamless coordination from start to finish' }
];

const ORDER_STEPS = [
  { icon: 'DocumentSet', title: 'Submit Request', description: 'Share your event details (min. 48 hrs in advance).' },
  { icon: 'ReceiptCheck', title: 'Menu Confirmation', description: 'We confirm menu, numbers and arrangements.' },
  { icon: 'DeliveryTruck', title: 'Delivery & Setup', description: 'Timely delivery and professional setup at your venue.' },
  { icon: 'EmojiNeutral', title: 'Enjoy', description: 'Delicious food, seamless service, happy attendees!' }
];

const WHY_US = [
  { icon: 'FavoriteStar', title: '5-Star Quality', description: 'From world-class hotels' },
  { icon: 'Contact', title: 'Experienced Chefs', description: 'Expertise in every bite' },
  { icon: 'Shield', title: 'Hygiene & Safety', description: 'Highest standards' },
  { icon: 'Repair', title: 'Flexible & Reliable', description: 'Tailored to your needs' },
  { icon: 'Flower', title: 'Sustainable Choices', description: 'Responsibly sourced wherever possible' }
];

const LUNCH_COLUMNS = [
  { title: 'Starters (Select 1)', items: ['Lentil soup', 'Caesar salad', 'Fattoush salad', 'Hummus with pita'] },
  { title: 'Main Course (Select 1)', items: ['Grilled chicken with lemon sauce', 'Beef tenderloin with pepper sauce', 'Seafood pasta', 'Vegetable lasagna'] },
  { title: 'Sides', items: ['Steamed rice', 'Roasted vegetables', 'Mashed potatoes'] },
  { title: 'Desserts (Select 1)', items: ['Tiramisu', 'Chocolate mousse', 'Fruit platter', 'Crème brûlée'] }
];

export const CateringPage: React.FC = () => {
  const { service } = useServiceContext();
  const { theme } = useThemeContext();
  const navigate = useNavigate();
  const [menus, setMenus] = React.useState<ICateringMenu[] | undefined>(undefined);

  React.useEffect(() => {
    service.getCateringMenus().then(setMenus);
    service.logEvent('PageView', '/catering').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!menus) return <LoadingSpinner />;

  return (
    <div>
      <Hero
        breadcrumbItems={[{ label: 'Support' }, { label: 'Catering Services' }]}
        title="Catering Services"
        highlight="Exceptional Catering. Every Meeting. Every Time."
        description="Travel Services – F&A partners with Marriott Riyadh and Mövenpick Hotel Riyadh to bring you premium catering for your meetings and events."
        media={(
          <div className={styles.partnerPanel}>
            <span>Our Hotel Partners</span>
            <div className={styles.partnerLogos}>
              <strong>MARRIOTT<br /><small>RIYADH</small></strong>
              <strong>MÖVENPICK<br /><small>HOTEL RIYADH</small></strong>
            </div>
          </div>
        )}
        infoStrip={(
          <div className={styles.benefitRow}>
            <div><Icon iconName="FavoriteStar" /><span>Premium Quality & Taste</span></div>
            <div><Icon iconName="Contact" /><span>Professional Service</span></div>
            <div><Icon iconName="Clock" /><span>On-time Delivery & Setup</span></div>
            <div><Icon iconName="EditNote" /><span>Customizable Menus</span></div>
          </div>
        )}
      />

      <div className={styles.body}>
        <IconFeatureGrid accent="bronze" columns={5} items={FEATURES.map((f) => ({ icon: f.icon, title: f.title }))} />

        <h2 className={styles.sectionTitle}>Our Catering Menus</h2>
        <p className={styles.sub}>Curated menus by Marriott Riyadh & Mövenpick Hotel Riyadh to make every break and meal a delightful experience.</p>
        <div className={styles.menuGrid}>
          {menus.map((m) => (
            <div key={m.Id} className={styles.menuCard}>
              <div className={styles.menuHeader}><span><Icon iconName="EatDrink" /></span><div><strong>{m.Name}</strong><em>{m.Description}</em></div></div>
              <ul>{m.Items.map((it) => <li key={it}>{it}</li>)}</ul>
              <div className={styles.menuPhoto} style={{ backgroundImage: `url('${cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, 'promo')}')` }} />
            </div>
          ))}
        </div>

        <div className={styles.lunchPanel}>
          <div className={styles.lunchHeader}>
            <span><Icon iconName="EatDrink" /></span>
            <div><strong>Lunch Menu</strong><em>Per Person</em></div>
          </div>
          <div className={styles.lunchPhoto} style={{ backgroundImage: `url('${cardPlaceholderImage(theme.palette.primary, theme.palette.secondary, 'event')}')` }} />
          <div className={styles.lunchColumns}>
            {LUNCH_COLUMNS.map((c) => (
              <div key={c.title}>
                <h5>{c.title}</h5>
                <ul>{c.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.orderRow}>
          <div className={styles.orderSteps}>
            <h3>How to Place an Order</h3>
            <ProcessSteps steps={ORDER_STEPS} />
          </div>
          <div className={styles.assistPanel}>
            <Icon iconName="Headset" />
            <h4>Need Assistance?</h4>
            <p>Our team is here to help you plan the perfect catering experience.</p>
            <button type="button" onClick={() => navigate('/travel-care')}>Contact Us <Icon iconName="ChevronRightSmall" /></button>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Why Choose Our Catering Partners?</h2>
        <IconFeatureGrid accent="green" columns={5} items={WHY_US} />

        <CTABand
          variant="light"
          icon="Mail"
          title="Questions about catering?"
          description="Contact the Travel Services Team for assistance planning your next event."
          ctaLabel="Contact Travel Team"
          onCtaClick={() => navigate('/travel-care')}
        />
      </div>
    </div>
  );
};
