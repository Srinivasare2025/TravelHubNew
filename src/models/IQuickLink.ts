import { IUrlFieldValue } from './Common';

export type QuickLinkCategory = 'Booking' | 'Policy' | 'Support' | 'Expense';

/** Maps 1:1 to the TravelQuickLinks list. */
export interface IQuickLink {
  Id: number;
  Title: string;
  URL: IUrlFieldValue;
  IconClass?: string;
  Category: QuickLinkCategory;
  SortOrder: number;
  OpenInNewTab: boolean;
}

export type IQuickLinkInput = Partial<Pick<IQuickLink, 'Title' | 'IconClass' | 'Category' | 'SortOrder' | 'OpenInNewTab'>> & {
  URL?: string;
};

export const QUICK_LINK_CATEGORIES: QuickLinkCategory[] = ['Booking', 'Policy', 'Support', 'Expense'];

/**
 * A "Travel Info" nav dropdown child — sample static content shipped with
 * the solution (see TravelInfoChildPages/). Not list-backed; each child
 * page pulls its own real data from the relevant list (e.g. Visa
 * Requirements filters TravelResources by category), so the *content* is
 * dynamic even though the menu structure itself is a code-defined sample.
 */
export interface INavChild {
  key: string;
  label: string;
  route: string;
  icon?: string;
}
