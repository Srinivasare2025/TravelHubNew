/**
 * Shared value shapes that mirror how SharePoint REST actually serializes
 * certain field types — kept separate from the per-list models so every
 * model can reuse them instead of redefining the same shape.
 */

/** SharePoint Hyperlink / Picture field value. */
export interface IUrlFieldValue {
  Url: string;
  Description?: string;
}

/** SharePoint Person field value, trimmed to what the UI actually uses. */
export interface IPersonFieldValue {
  Id?: number;
  Title: string;
  EMail?: string;
  LoginName?: string;
}

/** SharePoint MultiChoice field value as returned by REST (verbose OData). */
export interface IMultiChoiceValue {
  results: string[];
}

/**
 * Built-in list-item moderation status (OData__ModerationStatus).
 * Numeric values match SharePoint's SP.ModerationStatusType exactly —
 * do not renumber these.
 */
export enum ModerationStatus {
  Approved = 0,
  Denied = 1,
  Pending = 2,
  Draft = 3
}

export const ModerationStatusLabel: Record<ModerationStatus, string> = {
  [ModerationStatus.Approved]: 'Approved',
  [ModerationStatus.Denied]: 'Rejected',
  [ModerationStatus.Pending]: 'Pending',
  [ModerationStatus.Draft]: 'Draft'
};

/** Minimal shape returned by `/currentuser` and `/siteusers`. */
export interface ISharePointUser {
  Id: number;
  Title: string;
  Email: string;
  LoginName: string;
}

/** A single day's rollup used by the Admin analytics chart. */
export interface IAnalyticsPoint {
  date: string; // yyyy-MM-dd
  pageViews: number;
  uniqueUsers: number;
}
