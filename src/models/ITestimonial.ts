import { IUrlFieldValue } from './Common';

/** Maps 1:1 to the TravelTestimonials list — Home Alternate's "What Our Travelers Say" carousel. */
export interface ITestimonial {
  Id: number;
  Quote: string;
  Name: string;
  Role: string;
  Photo?: IUrlFieldValue;
  SortOrder: number;
}
