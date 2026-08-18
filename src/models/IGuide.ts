import { ModerationStatus, IMultiChoiceValue } from './Common';

export type GuideType = 'Concur Booking' | 'Expense Claim' | 'Visa Process' | 'Timesheet' | 'General';
export type AudienceRole = 'Employee' | 'Manager' | 'Admin' | 'Contributor';

/** Maps 1:1 to the TravelGuides document library. */
export interface IGuide {
  Id: number;
  Title: string;
  GuideType: GuideType;
  AudienceRole?: IMultiChoiceValue;
  Summary: string;
  IsFeatured: boolean;
  PublishDate?: string;
  FileRef: string;
  FileLeafRef: string;
  Modified: string;
  OData__ModerationStatus: ModerationStatus;
}

export type IGuideInput = Partial<Pick<IGuide, 'Title' | 'GuideType' | 'Summary' | 'PublishDate' | 'IsFeatured'>> & {
  AudienceRole?: string[];
};

export const GUIDE_TYPES: GuideType[] = ['Concur Booking', 'Expense Claim', 'Visa Process', 'Timesheet', 'General'];
export const AUDIENCE_ROLES: AudienceRole[] = ['Employee', 'Manager', 'Admin', 'Contributor'];
