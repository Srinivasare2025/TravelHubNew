import * as React from 'react';
import { Hero, IHeroProps } from './Hero';
import { useServiceContext } from '../../state/ServiceContext';
import { resortHeroPlaceholderImage } from '../../assets/images';
import { FIXED_PALETTE } from '../../theme/themes';
import { IHeroSlide } from '../../models';
import styles from './HeroCarousel.module.scss';

const AUTO_ADVANCE_MS = 6000;

export interface IHeroCarouselProps {
  /** Route slug this screen is known by in TargetPages (e.g. 'home') — see HERO_TARGET_PAGES. */
  pageKey: string;
  /**
   * The page's existing static Hero content/props, used unchanged whenever this page has zero
   * active/targeted slides configured in the TravelHeroImages list — so a page nobody's
   * configured slides for yet keeps looking exactly as it did before the carousel existed.
   */
  fallback: IHeroProps;
}

/**
 * Wraps the plain `Hero` component with an auto-advancing, SharePoint-list-backed carousel —
 * only used where a page opts in (currently Home; see HomePage.tsx). Every other page keeps
 * rendering a single static `<Hero>` untouched, so this carries zero risk for the other 10
 * pages. Falls back to `fallback` (today's hardcoded hero) when the list has nothing for this
 * page yet, so an unconfigured screen never breaks or shows an empty hero.
 */
export const HeroCarousel: React.FC<IHeroCarouselProps> = ({ pageKey, fallback }) => {
  const { service } = useServiceContext();
  const [slides, setSlides] = React.useState<IHeroSlide[] | undefined>(undefined);
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    service.getHeroImages(pageKey).then((s) => { if (!cancelled) setSlides(s); }).catch(() => { if (!cancelled) setSlides([]); });
    return () => { cancelled = true; };
  }, [service, pageKey]);

  const prefersReducedMotion = React.useMemo(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  React.useEffect(() => {
    if (!slides || slides.length < 2 || paused || prefersReducedMotion) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [slides, paused, prefersReducedMotion]);

  // Still loading, or nothing configured for this page — render the page's existing static hero.
  if (!slides || slides.length === 0) return <Hero {...fallback} />;

  const slide = slides[Math.min(active, slides.length - 1)];
  const heroProps: IHeroProps = {
    eyebrow: slide.Eyebrow,
    title: slide.Title,
    highlight: slide.Highlight,
    description: slide.Description,
    backgroundImageUrl: slide.Image?.Url || resortHeroPlaceholderImage(FIXED_PALETTE.primary, FIXED_PALETTE.secondary),
    // The button/link row is real site navigation, not per-slide promo content — it stays
    // `fallback`'s fixed set (same buttons, same routes, same colors as before the carousel)
    // on every slide, rather than swapping to each slide's own CtaLabel/CtaUrl.
    ctas: fallback.ctas
  };

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Hero {...heroProps} />
      {slides.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Hero slides">
          {slides.map((s, i) => (
            <button
              key={s.Id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show slide ${i + 1}: ${s.Title}`}
              className={i === active ? styles.dotActive : styles.dot}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
