import { IUrlFieldValue } from './Common';

export type BannerType = 'Limited Time' | 'Exclusive' | 'Upcoming Event' | 'Announcement';

/** Maps 1:1 to the TravelPromotions list. */
export interface IPromotion {
  Id: number;
  Title: string;
  Description: string;
  BannerImage?: IUrlFieldValue;
  LinkURL?: IUrlFieldValue;
  BannerType: BannerType;
  StartDate: string;
  EndDate: string;
  Priority: number;
  IsActive: boolean;
  Modified: string;
}

export type IPromotionInput = Partial<
  Pick<IPromotion, 'Title' | 'Description' | 'LinkURL' | 'BannerType' | 'StartDate' | 'EndDate' | 'Priority' | 'IsActive'>
> & { BannerImage?: string };

export const BANNER_TYPES: BannerType[] = ['Limited Time', 'Exclusive', 'Upcoming Event', 'Announcement'];
