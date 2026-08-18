const STYLE_ELEMENT_ID = 'travelHubHideChromeStyle';

/**
 * SharePoint's own modern-page chrome — suite bar, site header, command
 * bar, quick launch, page title/comments — that this web part hides so it
 * reads as a full-page app instead of one section of a normal page.
 *
 * These are undocumented, unsupported DOM hooks (Microsoft publishes no
 * official way to hide them from a web part), so this is a best-effort
 * selector list assembled from the current modern-page markup; a future
 * SharePoint UI change could require updating it. Selectors that don't
 * match anything on a given tenant/page are simply no-ops.
 */
const CHROME_SELECTORS = [
  '#SuiteNavPtrn',
  '#O365_NavHeader',
  '#spSiteHeader',
  '[data-automationid="SiteHeader"]',
  '#spLeftNav',
  '.spAppBar',
  '#spCommandBar',
  '[data-automation-id="pageCommandBar"]',
  '[data-automation-id="pageHeader"]',
  '[data-automation-id="pageFooter"]',
  '.spPageCommentsWrapper'
];

/**
 * Injects (or removes) one global `<style>` tag that hides the selectors
 * above. Idempotent — safe to call repeatedly with the same `hide` value.
 * Callers must only pass `hide: true` while the page is in Read mode (never
 * Edit), so page owners always keep access to the command bar to configure
 * the page — see TravelHubWebPart's `isReadMode` prop.
 */
export function setFullPageChrome(hide: boolean): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(STYLE_ELEMENT_ID);
  if (!hide) {
    if (existing?.parentNode) existing.parentNode.removeChild(existing);
    return;
  }
  if (existing) return;
  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `${CHROME_SELECTORS.join(', ')} { display: none !important; }`;
  document.head.appendChild(style);
}
