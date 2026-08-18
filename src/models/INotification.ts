export interface INotification {
  Title: string;
  date: string;
  kind: 'News' | 'Promotion';
  route: string;
}

export interface ISearchResultItem {
  title: string;
  path: string;
  summary: string;
}

export interface IMediaFile {
  Name: string;
  ServerRelativeUrl: string;
  TimeLastModified: string;
}
