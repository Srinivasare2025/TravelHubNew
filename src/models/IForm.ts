import { Region } from './IPolicy';

export type FormCategory = 'Visa' | 'Expense' | 'Booking Exception' | 'Reimbursement' | 'Other';

/** Maps 1:1 to the TravelForms document library. */
export interface IForm {
  Id: number;
  Title: string;
  FormCategory: FormCategory;
  Region?: Region;
  Instructions?: string;
  FileRef: string;
  FileLeafRef: string;
  Modified: string;
}

export type IFormInput = Partial<Pick<IForm, 'Title' | 'FormCategory' | 'Region' | 'Instructions'>>;

export const FORM_CATEGORIES: FormCategory[] = ['Visa', 'Expense', 'Booking Exception', 'Reimbursement', 'Other'];

/**
 * A unified shape the Resources page browses — TravelGuides and TravelForms
 * merged client-side (they're separate libraries because their metadata
 * differs, but end users just want one browsable "Resources" list).
 */
export interface IResourceItem {
  Id: number;
  Title: string;
  Category: string;
  Summary: string;
  FileRef: string;
  FileLeafRef: string;
  Modified: string;
  ResourceType: 'Guide' | 'Form';
}
