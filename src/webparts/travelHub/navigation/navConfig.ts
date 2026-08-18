export interface INavChildItem {
  key: string;
  label: string;
  route: string;
}

export interface INavItem {
  key: string;
  label: string;
  route?: string;
  children?: INavChildItem[];
}

/**
 * The primary nav for the 12-page mockup IA. Reconciled from each mockup
 * page's own breadcrumb trail (the more authoritative signal — the
 * mockup's literal top-nav label lists drift slightly page to page):
 * Wellness Beyond Office breadcrumbs under Leisure Travel, Catering
 * Services and Visa Support both breadcrumb under "Support". "Home
 * Alternate" is a design-alternative page, not a real nav destination —
 * it's linked from the Footer instead. "Dashboard" isn't shown in the
 * mockup's inner-page nav bars but gets its own top-level slot here for
 * discoverability. See docs/ARCHITECTURE.md for how to add another page.
 */
export const NAV_ITEMS: INavItem[] = [
  { key: 'home', label: 'Home', route: '/' },
  {
    key: 'leisure-travel',
    label: 'Leisure Travel',
    route: '/leisure-travel',
    children: [
      { key: 'wellness', label: 'Wellness Beyond Office', route: '/wellness' }
    ]
  },
  { key: 'sap-concur', label: 'SAP Concur', route: '/sap-concur' },
  { key: 'meetings-events', label: 'Meetings & Events', route: '/meetings-events' },
  { key: 'policies', label: 'Policies', route: '/policies' },
  { key: 'travel-care', label: 'Travel Care', route: '/travel-care' },
  { key: 'sustainability', label: 'Sustainability', route: '/sustainability' },
  {
    key: 'support',
    label: 'Support',
    children: [
      { key: 'catering', label: 'Catering Services', route: '/catering' },
      { key: 'visa-support', label: 'Visa Support', route: '/visa-support' }
    ]
  },
  { key: 'dashboard', label: 'Dashboard', route: '/dashboard' }
];
