# Travel Hub — SPFx Solution (React + Fluent UI + TypeScript)

A full SharePoint Framework rebuild of the Travel Hub portal for **SharePoint Online**: two web
parts — the public **Travel Hub** app (Home, Book Travel, Policies, Resources, FAQs, Promotions &
Events, News, plus 3 sample "Travel Info" dropdown pages) and a separate **Travel Hub Admin**
content-management dashboard — sharing one service layer, one set of TypeScript models, and one
theming system, all built on `@pnp/sp` against real SharePoint lists.

**Verified, not just written:** `npx tsc --noEmit` and `npx eslint src/**/*.{ts,tsx}` both exit 0
across the whole `src/` tree — see "Verification" below for exactly what that does and doesn't
prove, and the one dependency-level security advisory that's documented rather than silently
patched.

## Architecture at a glance

```
src/
├── models/        TypeScript interfaces mirroring every SharePoint list 1:1 (IPolicy, IFaq, ...)
├── services/       ISharePointService (interface) → SharePointService (real, @pnp/sp) or
│                   MockSharePointService (local workbench only) — see ServiceFactory.ts
├── state/          React Context: ServiceContext (data+config), ThemeContext, UserContext
├── theme/          4 built-in theme presets (Gold & Navy / White / Black / Ocean Blue)
├── assets/         Theme-aware sample SVG images (hero/card placeholders — always overridden
│                   by a real SharePoint image the moment one is set)
├── shared/         Cross-web-part UI atoms (Pagination, ContentCard, RichText, ThemePicker, ...)
└── webparts/
    ├── travelHub/          The public SPA — one web part, client-routed (react-router HashRouter)
    │   └── components/pages/   One component per page (see below)
    └── travelHubAdmin/     The Admin Dashboard — a separate bundle on purpose (keeps admin
        └── components/         code out of every visitor's download)
```

**Why one web part for the whole public site, not nine?** Simpler to deploy — add it once to one
modern page — while still keeping "each page is its own component" true structurally: every route
in `App.tsx` maps to its own file under `components/pages/`. See `docs/ARCHITECTURE.md` for how to
add a 10th page or a 5th theme.

**Why is content management ("provision for admin to configure...") a SharePoint list, not just
web part properties?** A `TravelHubConfig` list (Title=key, ConfigValue=value), edited from
**Admin > Settings**, applies site-wide the instant it's saved — no editing every page the web part
is placed on, no redeploy. See `IAppConfig` (`src/models/IAppConfig.ts`) for every setting it
covers: site URL override, all 8 list names, all 3 group names, uploads folder, hero image,
default theme, organization name.

## What's in this package

```
travel-hub-spfx/
├── README.md, docs/ARCHITECTURE.md
├── package.json, tsconfig.json, gulpfile.js, .eslintrc.js, .yo-rc.json
├── config/                    package-solution.json, serve.json, config.json
├── .vscode/                   launch.json, settings.json, extensions.json — see "VS Code" below
├── provisioning/
│   ├── TravelHub-Schema.md            9 lists/libraries, column-by-column
│   └── Create-TravelHubLists-SPO.ps1  PnP.PowerShell provisioning script (SPO only)
└── src/                        (see architecture diagram above)
```

## Prerequisites

- **Node.js 18 LTS** (SPFx 1.18.x's supported runtime — SPFx tooling actively refuses to run on
  Node 20+/22 in some versions and definitely refuses on very new majors; if your machine's default
  Node is newer, install [nvm-windows](https://github.com/coreybutler/nvm-windows) or
  [nvm](https://github.com/nvm-sh/nvm) and run `nvm install 18.20.4 && nvm use 18.20.4` before
  anything else here).
- A SharePoint Online tenant you can provision lists on and (eventually) upload a package to the
  tenant App Catalog.
- [PnP.PowerShell](https://pnp.github.io/powershell/) for provisioning: `Install-Module PnP.PowerShell -Scope CurrentUser`.

## Step 1 — Provision the SharePoint lists

```powershell
.\provisioning\Create-TravelHubLists-SPO.ps1 -SiteUrl "https://contoso.sharepoint.com/sites/TravelHub"
```

Creates all 9 lists/libraries (see `provisioning/TravelHub-Schema.md`), the 3 SharePoint groups,
the Media Library upload folder, and turns on the audit trail. Seed a few `TravelQuickLinks` rows
(Category = Booking, pointing at your Concur deep links) before moving on so the app isn't empty on
first load — `IconClass` values are **Fluent UI icon names** (e.g. `Airplane`, `CityNext`, `Car`),
not Font Awesome classes.

## Step 2 — Local setup

```bash
npm install
gulp trust-dev-cert
```

Edit `config/serve.json`'s `initialPage` and `.vscode/launch.json`'s two `url` fields to point at
your actual tenant's workbench, e.g. `https://contoso.sharepoint.com/sites/TravelHub/_layouts/15/workbench.aspx`.

```bash
gulp serve
```

This opens the **local workbench** in your default browser. Because `Environment.type` is `Local`
there, `ServiceFactory` automatically wires up `MockSharePointService` instead of hitting real
SharePoint — you can click through every page (including Admin, pre-seeded as an Admin role) with
zero SharePoint connectivity. Add the "Travel Hub" or "Travel Hub Admin" web part from the toolbox
to try it.

To test against **real SharePoint data**, use the **hosted workbench** instead — the same
`gulp serve` command, but open the `initialPage` URL you configured above (SharePoint's own
workbench page) instead of `https://localhost:4321/temp/workbench.html`. There, `Environment.type`
is `SharePoint`, so `ServiceFactory` uses the real `SharePointService` against your provisioned
lists.

## Step 3 — Deploying to SharePoint Online

```bash
npm run dist
```

This runs `gulp bundle --ship` then `gulp package-solution --ship`, producing
`solution/travel-hub-spfx.sppkg`.

1. Upload `travel-hub-spfx.sppkg` to your tenant's **App Catalog** (or a site collection app
   catalog). `skipFeatureDeployment: true` in `config/package-solution.json` means it's available
   tenant-wide immediately — no "Deploy" click needed per site beyond the initial upload prompt.
2. On the target site: **Site Contents → New → App**, install "travel-hub-spfx-client-side-solution".
3. Add the **Travel Hub** web part to a modern page — that's the whole public site (Home, Book
   Travel, Policies, Resources, FAQs, Promotions & Events, News, Travel Info dropdown) in one drop.
4. Add the **Travel Hub Admin** web part to a **separate page not linked from public navigation** —
   membership of *Travel Hub Admins*/*Travel Hub Contributors* is the real access gate (a
   Visitor who finds the URL gets an in-app "you need access" message, and every underlying REST
   call still 403s regardless of what the UI shows), but there's no reason to advertise the URL.
5. Sign in as an Admin/Contributor, open the Admin page, and fill in **Settings** — hero image,
   organization name, default theme, and (if your lists live on a different site than the web
   parts) the Lists Site URL override.

### API permission approval

This solution only calls SharePoint REST via `@pnp/sp` scoped to the SPFx context (`SPFx()`
behavior) — no Microsoft Graph calls, no external APIs. **No tenant API permission approval step
is required** in the SharePoint Admin Center.

## VS Code — recommended workflow

The `.vscode/` folder ships with:
- **extensions.json** — recommends the ESLint and Prettier extensions; VS Code will prompt to
  install them on first open.
- **launch.json** — two debug configurations ("Hosted workbench (Edge)" / "(Chrome)") that run
  `gulp serve` and attach the debugger to the real hosted workbench URL you configured in Step 2,
  so you can set breakpoints directly in your `.tsx` source (source maps are wired up).
- **settings.json** — points VS Code's TypeScript language service at the project's own
  `node_modules/typescript` (keeps IntelliSense in sync with the pinned compiler version) and hides
  generated `lib`/`temp`/`*.scss.ts` clutter from the file explorer and search.

To debug: `F5` (or Run and Debug → pick a configuration) — it starts `gulp serve` and opens the
browser automatically.

## Pushing this to GitHub

```bash
cd travel-hub-spfx
git init
git add .
git commit -m "Initial commit: Travel Hub SPFx solution"
```

Then either via the GitHub CLI:
```bash
gh repo create your-org/travel-hub-spfx --private --source=. --remote=origin --push
```
or manually: create an empty repo on GitHub, then
```bash
git remote add origin https://github.com/your-org/travel-hub-spfx.git
git branch -M main
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `lib`, `dist`, `temp`, `solution`, and the generated
`*.scss.ts` files — nothing build-generated gets committed.

## Theming

Four built-in presets (`src/theme/themes.ts`): **Gold & Navy** (brand default), **White**,
**Black**, **Ocean Blue`. Any signed-in user can pick their own via the palette icon in the header
(`ThemePicker`) — it's stored in that browser's `localStorage`, so it's a personal preference, not
a setting that needs any permission. An Admin sets the **site-wide default** any user without a
personal override sees, from Admin > Settings. Every component reads colors exclusively through 7
CSS custom properties (`--th-primary/secondary/bg/text/text-muted/border/card-bg`), set at runtime
by `ThemedRoot` — see `docs/ARCHITECTURE.md` for how to add a 5th theme.

## Security

- **XSS:** every rich-text field (`PolicyBody`, FAQ `Answer`, News `Body`) is HTML authored by
  Contributors and rendered back out — the *only* `dangerouslySetInnerHTML` in the codebase is
  inside `RichText.tsx`, which always routes through `sanitizeHtml()` (DOMPurify, allow-listed tags/
  attributes) first. Verified: `grep -r dangerouslySetInnerHTML src/` returns exactly that one file.
- **Reverse tabnabbing:** every `target="_blank"` link carries `rel="noopener noreferrer"`.
- **Open redirects:** search results are routed through `goToSearchResult()` (`Header.tsx`), which
  only hands a path to react-router's internal `navigate()` when it's actually an internal route
  (`#/...` or `/...`) — an absolute URL (a real document/page from SharePoint Search) gets a normal
  browser navigation instead, so nothing ever silently treats attacker-influenced search text as an
  internal route target.
- **Type safety:** `tsconfig.json` has `strict: true`; the one narrowly-scoped `as unknown as T`
  cast (in `MockSharePointService.createItem`, workbench-only code) is commented explaining why a
  generic mock store can't be statically typed tighter there.
- **Known dependency advisory (documented, not silently patched):** `npm audit` flags
  `react-router`/`react-router-dom` 6.x (moderate, open-redirect + an SSR-hydration issue that
  doesn't apply — this app never uses server-side rendering). The only fix is react-router v7, which
  requires React ≥18; SPFx 1.18.2 officially ships/supports React 17, so jumping majors here would
  be a bigger, separately-tested toolchain upgrade, not a drop-in patch. In practice, every
  `<Link to=…>`/`navigate(…)` call in this app uses a hard-coded route or a same-origin path — never
  user-supplied redirect input — so the open-redirect vector doesn't have a path to exploit as this
  code is written. Revisit when SPFx officially moves to React 18 (SPFx 1.20+).
- **Known toolchain-only advisory (not fixable from this project):** `npm audit` also flags
  `requirejs` (high, prototype pollution) via `@microsoft/sp-loader` → `@microsoft/sp-webpart-base`
  — this is Microsoft's own SPFx 1.18.x dependency chain (present in every current SPFx 1.18 project,
  not something this solution's `package.json` pulls in directly), used for the framework's own
  module loading inside the SharePoint page, not shipped as part of this web part's own runtime
  logic. `npm audit fix --force` "resolves" it only by jumping to `sp-webpart-base@1.23.2`, a
  different SPFx generator major outside this package's tested/pinned toolchain version — track
  Microsoft's SPFx release notes rather than force-upgrading this project's core framework version
  on your own.

## Verification

Both commands below were actually run against this exact source tree before delivery, not just
described:
```bash
npx tsc --noEmit -p .      # exit 0 — zero type errors across every .ts/.tsx file
npx eslint "src/**/*.{ts,tsx}"   # exit 0 — zero lint errors/warnings
```
Note `tsc --noEmit` alone doesn't prove the SPFx *bundle* builds cleanly (that also runs the sass
subtask, the SPFx-specific lint profile in `--ship` mode, and webpack) — run `npm run dist` yourself
once you've pointed `config/serve.json` at your real tenant, per Step 3, and treat that as the final
gate before shipping to production.
