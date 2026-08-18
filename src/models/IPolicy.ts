import { ModerationStatus, IPersonFieldValue } from './Common';

export type PolicyCategory = 'General' | 'Expense' | 'Visa' | 'Booking' | 'Health & Safety' | 'Sustainability';
export type Region = 'Global' | 'APAC' | 'EMEA' | 'AMER';

/** Maps 1:1 to the TravelPolicies document library. */
export interface IPolicy {
  Id: number;
  Title: string;
  PolicyCategory: PolicyCategory;
  Region?: Region;
  EffectiveDate?: string;
  ExpiryDate?: string;
  PolicyVersion?: string;
  Summary: string;
  /** Rich-text HTML — must be sanitized (DOMPurify) before rendering. */
  PolicyBody?: string;
  IsFeatured: boolean;
  FileRef: string;
  FileLeafRef: string;
  Modified: string;
  ReviewedBy?: IPersonFieldValue;
  OData__ModerationStatus: ModerationStatus;
}

/** Fields the Admin create/edit form submits — everything except server-computed ones. */
export type IPolicyInput = Partial<
  Pick<
    IPolicy,
    'Title' | 'PolicyCategory' | 'Region' | 'EffectiveDate' | 'ExpiryDate' | 'PolicyVersion' | 'Summary' | 'PolicyBody' | 'IsFeatured'
  >
>;

export const POLICY_CATEGORIES: PolicyCategory[] = ['General', 'Expense', 'Visa', 'Booking', 'Health & Safety', 'Sustainability'];
export const REGIONS: Region[] = ['Global', 'APAC', 'EMEA', 'AMER'];
