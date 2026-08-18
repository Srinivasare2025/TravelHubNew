export type PageViewEventType = 'PageView' | 'DocumentDownload' | 'LinkClick' | 'SearchQuery';

/** Maps 1:1 to the TravelHubPageViews list. */
export interface IPageViewEvent {
  Id?: number;
  Title: string;
  UserLoginName: string;
  EventType: PageViewEventType;
  ItemReference: string;
  EventDateTime: string;
}

export interface IPendingApprovalItem {
  Id: number;
  Title: string;
  Modified: string;
  Author: string;
  listName: string;
  kind: 'Policy' | 'Guide';
}
