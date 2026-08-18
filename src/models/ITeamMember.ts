import { IUrlFieldValue } from './Common';

/** Maps 1:1 to the TravelServicesTeam list — Home page's "Meet the Travel Services Team". */
export interface ITeamMember {
  Id: number;
  Name: string;
  Role: string;
  Photo?: IUrlFieldValue;
  Email?: string;
  Phone?: string;
  LinkedInUrl?: string;
  SortOrder: number;
}
