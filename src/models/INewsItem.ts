import { IUrlFieldValue } from './Common';

export type NewsCategory = 'News' | 'Update' | 'Event';

/** Maps 1:1 to the TravelNews list. */
export interface INewsItem {
  Id: number;
  Title: string;
  Summary: string;
  /** Rich-text HTML — must be sanitized (DOMPurify) before rendering. */
  Body?: string;
  Category: NewsCategory;
  PublishDate: string;
  ThumbnailImage?: IUrlFieldValue;
  IsFeatured: boolean;
  Modified: string;
}

export type INewsItemInput = Partial<Pick<INewsItem, 'Title' | 'Summary' | 'Body' | 'Category' | 'PublishDate' | 'IsFeatured'>> & {
  ThumbnailImage?: string;
};

export const NEWS_CATEGORIES: NewsCategory[] = ['News', 'Update', 'Event'];
