export type FaqCategory = 'Booking' | 'Expense' | 'Visa' | 'Travel Policy' | 'Other';

/** Maps 1:1 to the TravelFAQs list. */
export interface IFaq {
  Id: number;
  Title: string;
  /** Rich-text HTML — must be sanitized (DOMPurify) before rendering. */
  Answer: string;
  Category: FaqCategory;
  SortOrder: number;
  IsPublished: boolean;
}

export type IFaqInput = Partial<Pick<IFaq, 'Title' | 'Answer' | 'Category' | 'SortOrder' | 'IsPublished'>>;

export const FAQ_CATEGORIES: FaqCategory[] = ['Booking', 'Expense', 'Visa', 'Travel Policy', 'Other'];
