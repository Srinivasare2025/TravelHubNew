import { IUrlFieldValue } from './Common';

/**
 * Generic "featured card" shape reused across every travel/wellness/hotel
 * tile grid in the new mockup (Leisure Travel's Featured Offers, Wellness's
 * hotel & package rows, Meetings & Events' partner hotel tiles) — one model
 * instead of three near-identical ones, distinguished at query time by
 * `Category`/`Tags`.
 */
export type OfferCategory = 'Leisure' | 'Wellness' | 'Hotel Partner';
export type OfferBadgeVariant = 'limited' | 'exclusive' | 'event' | 'announcement';

/** Maps 1:1 to the TravelOffers list. */
export interface IOffer {
  Id: number;
  Title: string;
  Subtitle?: string;
  Description: string;
  Category: OfferCategory;
  /** Free-form facets used for client-side filtering, e.g. city name, 'Riyadh Hotels', 'Red Sea Destination Hotels'. */
  Tags?: string[];
  Image?: IUrlFieldValue;
  Price?: string;
  PriceNote?: string;
  Badge?: string;
  BadgeVariant?: OfferBadgeVariant;
  Location?: string;
  CtaLabel?: string;
  SortOrder: number;
}

export type IOfferInput = Partial<
  Pick<IOffer, 'Title' | 'Subtitle' | 'Description' | 'Category' | 'Tags' | 'Price' | 'PriceNote' | 'Badge' | 'BadgeVariant' | 'Location' | 'CtaLabel' | 'SortOrder'>
> & { Image?: string };

export const OFFER_CATEGORIES: OfferCategory[] = ['Leisure', 'Wellness', 'Hotel Partner'];
