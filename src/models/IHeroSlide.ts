import { IUrlFieldValue, IMultiChoiceValue } from './Common';

/**
 * Maps 1:1 to the TravelHeroImages list — configurable Hero carousel slides.
 * `TargetPages` lets an editor pick which screen(s) a slide appears on (any
 * of `HERO_TARGET_PAGES`'s route slugs, or `'all'` for every screen); a page
 * with zero active/targeted slides falls back to `IAppConfig.heroImageUrl`
 * (see `HeroCarousel`), so nothing breaks for a page nobody's configured yet.
 */
export interface IHeroSlide {
  Id: number;
  Title: string;
  Eyebrow?: string;
  Highlight?: string;
  Description?: string;
  /** Falls back to a generated placeholder (see HeroCarousel) when unset, same convention as IOffer.Image/ITestimonial.Photo. */
  Image?: IUrlFieldValue;
  CtaLabel?: string;
  CtaUrl?: IUrlFieldValue;
  TargetPages: IMultiChoiceValue;
  SortOrder: number;
  IsActive: boolean;
}

/**
 * The route slugs `TargetPages` can hold (mirrors the routes in
 * `App.tsx`), plus `'all'` for every screen — kept here so provisioning and
 * any future Admin edit form for this list stay in sync with the router.
 */
export const HERO_TARGET_PAGES = [
  'all',
  'home',
  'home-alternate',
  'leisure-travel',
  'wellness',
  'sap-concur',
  'meetings-events',
  'policies',
  'travel-care',
  'sustainability',
  'catering',
  'visa-support',
  'dashboard'
];
