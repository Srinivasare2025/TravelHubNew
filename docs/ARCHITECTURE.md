# Travel Hub SPFx — Extending the Solution

Concrete "add one of these" recipes, so future changes follow the same pattern the rest of the
codebase already uses instead of improvising a new one each time.

## Add a new public page

1. Create `src/webparts/travelHub/components/pages/MyPage.tsx` + `MyPage.module.scss`
   (`@import '../../../../shared/styles/page';` to reuse the common tile/table/panel classes).
2. Export it from `components/pages/index.ts`.
3. Add a `<Route path="/my-page" element={<MyPage />} />` inside the `<Route element={<Layout />}>`
   block in `App.tsx`.
4. Add a nav entry to `NAV_ITEMS` in `navigation/navConfig.ts` (top-level, or as a `children` entry
   under an existing dropdown).
5. If it needs new data, add the method to `ISharePointService` (interface), implement it in both
   `SharePointService` (real) and `MockSharePointService` (mock) — the interface is what keeps
   these two from drifting apart; TypeScript will error if you implement one and forget the other.

## Add a 4th "Travel Info" dropdown child

Same as above, plus register the child route in `navConfig.ts`'s `travel-info.children` array. Each
existing child (`VisaRequirementsPage.tsx` etc.) is a working example of "real page, filtered list,
own breadcrumb" — copy the pattern, not the specific filter.

## Add a new manageable content type in the Admin dashboard

1. Add the list to `provisioning/Create-TravelHubLists-SPO.ps1` and `TravelHub-Schema.md`.
2. Add the list's default name to `IListNameConfig`/`DEFAULT_LIST_NAMES` in `src/models/IAppConfig.ts`.
3. Add one entry to `SECTIONS` in `src/webparts/travelHubAdmin/components/sections/sectionDefinitions.ts`
   — columns for the table, fields for the add/edit form. That's it: `SectionTable`, `SectionForm`
   and `SectionsPage` are fully generic over this config, so a new list needs zero new React code.
4. Add a `{ type: 'section', ... }` entry is automatic — `Sidebar.tsx`'s `NAV_ORDER` maps over
   `SECTIONS` already, so a new section config entry shows up in the sidebar without touching
   `Sidebar.tsx`.

## Add a 5th theme

Add one entry to `THEMES` in `src/theme/themes.ts` (7 hex values + a label + `isDark`). It appears
in `ThemePicker` and Admin > Settings' theme dropdown automatically — both read `THEME_LIST`
(derived from `THEMES`), neither hard-codes the theme keys.

## Change how "recent" is defined for Dashboard stat-card deltas

`getRecentItemCount(listName, days)` in `ISharePointService` takes the day window as a parameter —
`DashboardPage.tsx` currently calls it with `30` for every card. Change the call sites, not the
service method.

## Point the app at lists on a different site

This is already built — set **Lists Site URL** in Admin > Settings. No code change needed; see the
comment above `spCurrentSite` in `SharePointService.ts` for the one constraint (`TravelHubConfig`
itself must stay on the site the web parts are placed on).

## Swap the hand-rolled SVG chart for a real charting library

`LineChart.tsx` takes `IAnalyticsPoint[]` (`{date, pageViews, uniqueUsers}[]`) — that shape already
matches what most charting libraries (Chart.js, `@fluentui/react-charting`, Recharts) expect as
input, so swapping the internals of that one file is the whole migration; `DashboardPage.tsx` and
`AnalyticsPage.tsx` don't need to change.

## Port to SPFx's newer React 18 baseline (SPFx 1.20+)

When you're ready: bump `react`/`react-dom` to 18, `@fluentui/react` stays on v8 (it supports React
18) or migrate to `@fluentui/react-components` (v9) for a deeper refresh, and `react-router-dom` can
move to v7 at the same time — this also resolves the react-router security advisory noted in the
main README, since the fix only ships for the React-18-only v7 line.

## Conventions this codebase follows (keep them)

- **Relative imports only**, never path-mapped absolute imports — SPFx's webpack config has no
  alias for whatever you'd put in `tsconfig.json`'s `paths`, so an absolute import would type-check
  but fail to bundle. See the comment removed from an earlier `tsconfig.json` draft if you're
  tempted to re-add one.
- **One `dangerouslySetInnerHTML`, in `RichText.tsx`, always via `sanitizeHtml()`.** Never add a
  second one — route new rich-text rendering through `<RichText html={...} />` instead.
- **Every color via the 7 `--th-*` CSS custom properties**, never a literal hex value in a
  `.module.scss` file — that's what makes theme-switching instant and total.
- **`ISharePointService` is the only thing a component may depend on for data** — never import
  `SharePointService` or `MockSharePointService` directly in a component; always go through
  `useServiceContext().service`, which is what lets `gulp serve`'s local workbench work at all.
