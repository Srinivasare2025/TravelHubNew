import { IListNameConfig, POLICY_CATEGORIES, REGIONS, GUIDE_TYPES, AUDIENCE_ROLES, FORM_CATEGORIES, FAQ_CATEGORIES, BANNER_TYPES, NEWS_CATEGORIES, QUICK_LINK_CATEGORIES } from '../../../../models';

export type FieldType = 'text' | 'textarea' | 'richtext' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'number' | 'url' | 'file' | 'image' | 'iconpicker';

export interface ISectionField {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  requiredOnCreate?: boolean;
  defaultChecked?: boolean;
}

export interface ISectionColumn {
  name: string;
  label: string;
  type?: 'date' | 'bool' | 'text';
}

export interface ISectionConfig {
  key: string;
  label: string;
  icon: string;
  listNameKey: keyof IListNameConfig;
  isLibrary: boolean;
  moderation: boolean;
  select: string;
  columns: ISectionColumn[];
  fields: ISectionField[];
}

/**
 * The single source of truth the generic SectionTable + SectionForm engine
 * reads from — the same idea as TH.Admin.sections in the HTML/JS build,
 * ported to TypeScript. Add a new manageable content type by adding one
 * entry here (see docs/ARCHITECTURE.md) instead of a new page.
 * `listNameKey` resolves through config.lists at render time, so a renamed
 * list (via Admin > Settings) is picked up without a code change.
 */
export const SECTIONS: ISectionConfig[] = [
  {
    key: 'policies', label: 'Travel Policies', icon: 'Shield', listNameKey: 'policies',
    isLibrary: true, moderation: true,
    select: 'Id,Title,PolicyCategory,Region,EffectiveDate,ExpiryDate,PolicyVersion,Summary,PolicyBody,IsFeatured,FileRef,FileLeafRef,Modified,OData__ModerationStatus',
    columns: [
      { name: 'Title', label: 'Title' },
      { name: 'PolicyCategory', label: 'Category' },
      { name: 'Modified', label: 'Last Modified', type: 'date' },
      { name: 'IsFeatured', label: 'Featured', type: 'bool' }
    ],
    fields: [
      { name: 'file', label: 'Policy Document', type: 'file', requiredOnCreate: true },
      { name: 'Title', label: 'Title', type: 'text', required: true },
      { name: 'PolicyCategory', label: 'Category', type: 'select', options: POLICY_CATEGORIES },
      { name: 'Region', label: 'Region', type: 'select', options: REGIONS },
      { name: 'EffectiveDate', label: 'Effective Date', type: 'date' },
      { name: 'ExpiryDate', label: 'Expiry Date', type: 'date' },
      { name: 'PolicyVersion', label: 'Version', type: 'text' },
      { name: 'Summary', label: 'Summary (short blurb for list/card views)', type: 'textarea' },
      { name: 'PolicyBody', label: 'Full Policy Body (shown on the detail page)', type: 'richtext' },
      { name: 'IsFeatured', label: 'Show on homepage highlight', type: 'checkbox' }
    ]
  },
  {
    key: 'guides', label: 'Guides & How-Tos', icon: 'ReadingMode', listNameKey: 'guides',
    isLibrary: true, moderation: true,
    select: 'Id,Title,GuideType,AudienceRole,Summary,IsFeatured,PublishDate,FileRef,FileLeafRef,OData__ModerationStatus',
    columns: [
      { name: 'Title', label: 'Title' },
      { name: 'GuideType', label: 'Type' },
      { name: 'PublishDate', label: 'Published', type: 'date' },
      { name: 'IsFeatured', label: 'Featured', type: 'bool' }
    ],
    fields: [
      { name: 'file', label: 'Guide Document', type: 'file', requiredOnCreate: true },
      { name: 'Title', label: 'Title', type: 'text', required: true },
      { name: 'GuideType', label: 'Guide Type', type: 'select', options: GUIDE_TYPES },
      { name: 'AudienceRole', label: 'Audience Role(s)', type: 'multiselect', options: AUDIENCE_ROLES },
      { name: 'Summary', label: 'Summary', type: 'textarea' },
      { name: 'PublishDate', label: 'Publish Date', type: 'date' },
      { name: 'IsFeatured', label: 'Show on homepage highlight', type: 'checkbox' }
    ]
  },
  {
    key: 'forms', label: 'Downloadable Forms', icon: 'DocumentSet', listNameKey: 'forms',
    isLibrary: true, moderation: false,
    select: 'Id,Title,FormCategory,Region,Instructions,FileRef,FileLeafRef',
    columns: [
      { name: 'Title', label: 'Title' },
      { name: 'FormCategory', label: 'Category' },
      { name: 'Region', label: 'Region' }
    ],
    fields: [
      { name: 'file', label: 'Form Document', type: 'file', requiredOnCreate: true },
      { name: 'Title', label: 'Title', type: 'text', required: true },
      { name: 'FormCategory', label: 'Category', type: 'select', options: FORM_CATEGORIES },
      { name: 'Region', label: 'Region', type: 'select', options: REGIONS },
      { name: 'Instructions', label: 'Instructions', type: 'textarea' }
    ]
  },
  {
    key: 'faqs', label: 'FAQs', icon: 'Help', listNameKey: 'faqs',
    isLibrary: false, moderation: false,
    select: 'Id,Title,Answer,Category,SortOrder,IsPublished',
    columns: [
      { name: 'Title', label: 'Question' },
      { name: 'Category', label: 'Category' },
      { name: 'SortOrder', label: 'Order' },
      { name: 'IsPublished', label: 'Published', type: 'bool' }
    ],
    fields: [
      { name: 'Title', label: 'Question', type: 'text', required: true },
      { name: 'Answer', label: 'Answer', type: 'richtext' },
      { name: 'Category', label: 'Category', type: 'select', options: FAQ_CATEGORIES },
      { name: 'SortOrder', label: 'Sort Order', type: 'number' },
      { name: 'IsPublished', label: 'Published', type: 'checkbox', defaultChecked: true }
    ]
  },
  {
    key: 'promotions', label: 'Promotions & Announcements', icon: 'Megaphone', listNameKey: 'promotions',
    isLibrary: false, moderation: false,
    select: 'Id,Title,Description,BannerImage,LinkURL,BannerType,StartDate,EndDate,Priority,IsActive',
    columns: [
      { name: 'Title', label: 'Title' },
      { name: 'BannerType', label: 'Type' },
      { name: 'StartDate', label: 'Start', type: 'date' },
      { name: 'EndDate', label: 'End', type: 'date' },
      { name: 'IsActive', label: 'Active', type: 'bool' }
    ],
    fields: [
      { name: 'Title', label: 'Headline', type: 'text', required: true },
      { name: 'Description', label: 'Description', type: 'textarea' },
      { name: 'BannerImage', label: 'Banner Image', type: 'image' },
      { name: 'LinkURL', label: 'Link URL', type: 'url' },
      { name: 'BannerType', label: 'Type', type: 'select', options: BANNER_TYPES },
      { name: 'StartDate', label: 'Start Date', type: 'date' },
      { name: 'EndDate', label: 'End Date', type: 'date' },
      { name: 'Priority', label: 'Priority (lower shows first)', type: 'number' },
      { name: 'IsActive', label: 'Active', type: 'checkbox', defaultChecked: true }
    ]
  },
  {
    key: 'news', label: 'News & Updates', icon: 'News', listNameKey: 'news',
    isLibrary: false, moderation: false,
    select: 'Id,Title,Summary,Body,Category,PublishDate,ThumbnailImage,IsFeatured',
    columns: [
      { name: 'Title', label: 'Title' },
      { name: 'Category', label: 'Category' },
      { name: 'PublishDate', label: 'Published', type: 'date' },
      { name: 'IsFeatured', label: 'Featured', type: 'bool' }
    ],
    fields: [
      { name: 'Title', label: 'Headline', type: 'text', required: true },
      { name: 'Summary', label: 'Summary', type: 'textarea' },
      { name: 'Body', label: 'Full Article', type: 'richtext' },
      { name: 'Category', label: 'Category', type: 'select', options: NEWS_CATEGORIES },
      { name: 'PublishDate', label: 'Publish Date', type: 'date' },
      { name: 'ThumbnailImage', label: 'Thumbnail Image', type: 'image' },
      { name: 'IsFeatured', label: 'Featured', type: 'checkbox' }
    ]
  },
  {
    key: 'quickLinks', label: 'Quick Links', icon: 'Link', listNameKey: 'quickLinks',
    isLibrary: false, moderation: false,
    select: 'Id,Title,URL,IconClass,Category,SortOrder,OpenInNewTab',
    columns: [
      { name: 'Title', label: 'Label' },
      { name: 'Category', label: 'Category' },
      { name: 'SortOrder', label: 'Order' }
    ],
    fields: [
      { name: 'Title', label: 'Tile Label', type: 'text', required: true },
      { name: 'URL', label: 'Destination URL', type: 'url', required: true },
      { name: 'IconClass', label: 'Icon (Fluent UI icon name, e.g. Airplane)', type: 'iconpicker' },
      { name: 'Category', label: 'Category', type: 'select', options: QUICK_LINK_CATEGORIES },
      { name: 'SortOrder', label: 'Sort Order', type: 'number' },
      { name: 'OpenInNewTab', label: 'Open in new tab', type: 'checkbox', defaultChecked: true }
    ]
  }
];

export const ICON_PRESETS = ['Airplane', 'CityNext', 'Car', 'ReceiptForecast', 'ContactCard', 'DocumentSet', 'Headset', 'Train', 'Ferry'];
