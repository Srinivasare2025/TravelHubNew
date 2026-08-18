# Travel Hub SPFx — SharePoint Online List Schema

Target: **SharePoint Online only** (this SPFx package doesn't run on SharePoint 2019 — see the
plain HTML/CSS/jQuery package if you need on-prem 2019 support). Provisioned via
`Create-TravelHubLists-SPO.ps1` using **PnP.PowerShell** (the modern, actively-maintained module).

Every list name and every SharePoint group name below is a **default**, not a hard requirement —
an Admin can rename them in Admin > Settings and `ConfigService` (`src/services/ConfigService.ts`)
resolves the real names at runtime from the `TravelHubConfig` list. The column *shape* (internal
names/types) must still match this document, though, since the TypeScript models in `src/models/`
map to it 1:1.

---

## 1. `TravelPolicies` (Document Library)
| Column | Type | Purpose |
|---|---|---|
| Title | Single line of text | Policy display name |
| PolicyCategory | Choice: General, Expense, Visa, Booking, Health & Safety, Sustainability | Drives the category sidebar |
| Region | Choice: Global, APAC, EMEA, AMER | Optional, not currently surfaced in the UI |
| EffectiveDate | Date Only | — |
| ExpiryDate | Date Only | — |
| PolicyVersion | Single line of text | e.g. "v2.3" |
| Summary | Multiple lines (plain) | Short blurb for list/card views |
| PolicyBody | Multiple lines (Enhanced/rich text) | Full policy sections, rendered on the detail page via `RichText` (DOMPurify-sanitized) |
| IsFeatured | Yes/No | Highlight on Home |
| ReviewedBy | Person | Shown as "Reviewed by" on the detail page |
| *(built-in)* Modified | — | "Last Modified" column/detail meta |
| *(built-in)* Moderation Status | — | Draft/Pending/Approved/Rejected — `ModerationStatus` enum in `src/models/Common.ts` |

**Library setting:** Versioning Settings → *Require content approval for submitted items* = Yes.

## 2. `TravelGuides` (Document Library)
Title, GuideType (Choice), AudienceRole (MultiChoice), Summary, IsFeatured, PublishDate,
+ built-in FileRef/FileLeafRef/Modified/Moderation Status. Same moderation setting as Policies.

## 3. `TravelForms` (Document Library)
Title, FormCategory (Choice), Region (Choice), Instructions. No moderation (low-risk reference docs).

## 4. `TravelFAQs` (Custom List)
Title (question), Answer (Note, rich text — sanitized on render), Category (Choice: Booking,
Expense, Visa, Travel Policy, Other), SortOrder (Number), IsPublished (Yes/No).

## 5. `TravelPromotions` (Custom List)
Title, Description, BannerImage (Hyperlink/Picture), LinkURL (Hyperlink), BannerType (Choice:
Limited Time, Exclusive, Upcoming Event, Announcement), StartDate, EndDate, Priority (Number),
IsActive (Yes/No).

## 6. `TravelNews` (Custom List)
Title, Summary, Body (Note, rich text — sanitized), Category (Choice: News, Update, Event),
PublishDate, ThumbnailImage (Hyperlink/Picture), IsFeatured (Yes/No).

## 7. `TravelQuickLinks` (Custom List)
Title, URL (Hyperlink), **IconClass** (Single line of text — a **Fluent UI icon name**, e.g.
`Airplane`, `CityNext`, `Car`; browse the full set at
[the Fluent UI icon gallery](https://developer.microsoft.com/fluentui#/styles/web/icons) — this
differs from the plain-HTML package, which used Font Awesome class names), Category (Choice:
Booking, Policy, Support, Expense), SortOrder (Number), OpenInNewTab (Yes/No).

## 8. `TravelHubPageViews` (Custom List)
Title, UserLoginName, EventType (Choice: PageView, DocumentDownload, LinkClick, SearchQuery),
ItemReference, EventDateTime (Date and Time). `WriteSecurity = 2` — users can add/read their own
rows only; Admins (Full Control) see everything, feeding the Dashboard/Analytics charts.

## 9. `TravelHubConfig` (Custom List) — new in the SPFx build
| Column | Type | Purpose |
|---|---|---|
| Title | Single line of text | The setting key, e.g. `siteUrl`, `list_policies`, `defaultTheme`, `heroImageUrl` |
| ConfigValue | Multiple lines (plain) | The setting's value |

This is the list behind **Admin > Settings** — see `IAppConfig` (`src/models/IAppConfig.ts`) for
every key `ConfigService` understands (site URL override, all 8 list names, all 3 group names,
uploads folder, hero image, default theme, organization name). Rows are created/updated
automatically the first time an Admin saves Settings — you don't need to seed it by hand.

**Important:** this list must live on the **same site the web parts are placed on**, even if you
set a `siteUrl` override to point the content lists elsewhere — see the comment in
`SharePointService.ts` above `spCurrentSite` for why.

---

## SharePoint Groups

| Group | Permission level |
|---|---|
| Travel Hub Visitors | Read |
| Travel Hub Contributors | Contribute |
| Travel Hub Admins | Full Control |

Group *names* are also configurable via `TravelHubConfig` (`group_admins`, `group_contributors`,
`group_visitors`) if your org already has differently-named groups — point them there instead of
renaming your groups.

## Media Library

`SiteAssets/travelhub/uploads` is the default folder the Admin "Media Library" screen and the
Promotion/News image-upload fields write to. The provisioning script creates it; override the path
via `uploadsFolderUrl` in Admin > Settings if you'd rather use a different library/folder.

## Audit Trail

`Set-PnPAuditing` in the provisioning script enables: Editing items, Checking out/in, Deleting/
restoring, Editing content types/columns, Editing users/permissions, Search. Review via
**Site Settings → Audit Log Reports**.
