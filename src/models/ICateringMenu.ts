import { IUrlFieldValue } from './Common';

/** Maps 1:1 to the TravelCateringMenus list. */
export interface ICateringMenu {
  Id: number;
  Name: string;
  Description: string;
  Items: string[];
  Image?: IUrlFieldValue;
  SortOrder: number;
}
