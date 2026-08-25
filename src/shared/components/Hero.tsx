import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, IBreadcrumbCrumb } from '../../webparts/travelHub/components/Layout/Breadcrumb';
import styles from './Hero.module.scss';

export interface IHeroCta {
  label: string;
  icon?: string;
  to?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline';
  /** Per-button color override (mockup's Home hero mixes navy/teal/blue/gold/white buttons in one row) — a CSS color/var() value. */
  accentColor?: string;
}

export interface IHeroProps {
  /** Omit entirely for the Home page's big hero, which shows no breadcrumb. */
  breadcrumbItems?: IBreadcrumbCrumb[];
  eyebrow?: string;
  title: string;
  /** Secondary, gold-colored heading line under the title (e.g. "RSG Destination Hotels & Offers"). */
  highlight?: string;
  description?: React.ReactNode;
  /** Switches to the photographic-image variant (cover + dark gradient overlay); omit for the plain solid-navy variant. */
  backgroundImageUrl?: string;
  ctas?: IHeroCta[];
  /** Right-side slot: search box, device mockup, checklist panel, illustration. */
  media?: React.ReactNode;
  /** Optional card row that visually overlaps the hero's bottom edge (the "4-benefit strip" pattern used on most inner pages). */
  infoStrip?: React.ReactNode;
  /** Shorter hero used by every inner page; Home/Home Alternate omit this for the full-height variant. */
  compact?: boolean;
  className?: string;
}

/**
 * The one hero/banner shape reused by all 12 pages — a plain solid-navy
 * variant (most inner pages) or a photographic variant (Home, Leisure
 * Travel, Wellness, Meetings & Events, Sustainability) via
 * `backgroundImageUrl`, both composed from the same slots so per-page
 * differences stay in what's passed in, not in a forked component.
 */
export const Hero: React.FC<IHeroProps> = ({
  breadcrumbItems, eyebrow, title, highlight, description, backgroundImageUrl, ctas, media, infoStrip, compact, className
}) => {
  const navigate = useNavigate();
  const runCta = (cta: IHeroCta): void => {
    if (cta.onClick) cta.onClick();
    else if (cta.to) navigate(cta.to);
  };

  return (
    <section
      className={[styles.hero, compact ? styles.compact : '', backgroundImageUrl ? styles.imageVariant : styles.solidVariant, className || ''].join(' ').trim()}
      style={backgroundImageUrl ? { backgroundImage: `linear-gradient(100deg, rgba(4,37,60,0.88), rgba(4,37,60,0.55)), url('${backgroundImageUrl}')` } : undefined}
    >
      <div className={styles.inner}>
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} variant="light" />}
        <div className={styles.row}>
          <div className={styles.text}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            <h1>{title}</h1>
            {highlight && <div className={styles.highlight}>{highlight}</div>}
            {description && <p>{description}</p>}
            {ctas && ctas.length > 0 && (
              <div className={styles.ctaRow}>
                {ctas.map((cta, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cta.variant === 'outline' ? styles.ctaOutline : styles.ctaSolid}
                    // accentColor sets a CSS var Hero.module.scss mixes to ~90% opacity for the button's
                    // own background (color-mix), so each button reads clearly as its brand color — with
                    // just enough transparency for the hero photo to show through a little, not a heavy
                    // glass/blur effect. Text stays white; the border gets the fully-opaque accent for a crisp edge.
                    style={cta.accentColor ? ({ '--cta-accent': cta.accentColor, borderColor: cta.accentColor } as React.CSSProperties) : undefined}
                    onClick={() => runCta(cta)}
                  >
                    {cta.icon && <Icon iconName={cta.icon} className={styles.ctaIcon} />}
                    <span className={styles.ctaLabel}>{cta.label}</span>
                    <Icon iconName="ChevronRightSmall" className={styles.ctaArrow} />
                  </button>
                ))}
              </div>
            )}
          </div>
          {media && <div className={styles.media}>{media}</div>}
        </div>
      </div>
      {infoStrip && <div className={styles.infoStripWrap}><div className={styles.infoStrip}>{infoStrip}</div></div>}
    </section>
  );
};
