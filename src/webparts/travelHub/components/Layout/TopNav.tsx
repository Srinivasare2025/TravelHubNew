import * as React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@fluentui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../navigation/navConfig';
import styles from './TopNav.module.scss';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 860px)';

export const TopNav: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | undefined>(undefined);
  const [dropdownPos, setDropdownPos] = React.useState<{ top: number; left: number } | undefined>(undefined);
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia?.(MOBILE_BREAKPOINT_QUERY).matches
  );
  const itemRefs = React.useRef<Record<string, HTMLLIElement | null>>({});
  const navRef = React.useRef<HTMLUListElement | null>(null);

  const isChildActive = (children: { route: string }[]): boolean =>
    children.some((c) => location.pathname === c.route || location.pathname.startsWith(`${c.route}/`));

  React.useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const onChange = (): void => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // .nav needs its horizontal scrollbar back (there are 9 top-level items — this is what lets
  // the ones that don't fit scroll into view), but overflow-x:auto forces overflow-y to clip too
  // (a CSS spec rule, not fixable via overflow-y: visible) — and `position: fixed` alone wasn't
  // enough to escape that on a real SharePoint modern page (the popup still rendered pinned
  // inside the shallow nav bar). SharePoint's own canvas/section wrappers can establish a new
  // containing block (e.g. via a transform) outside this component's control, which traps even
  // fixed-position descendants. A React portal straight to `document.body` sidesteps that
  // entirely — see the desktop/`!isMobile` branch below — so the dropdown can genuinely overlap
  // whatever's under it (the Hero image included), positioned from the trigger <li>'s own rect.
  // Mobile keeps the dropdown as a normal DOM child (never portaled) since there it's meant to
  // expand inline within the stacked hamburger menu, not float as a popup.
  const openAt = (key: string): void => {
    const el = itemRefs.current[key];
    if (el) {
      const rect = el.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom, left: rect.left });
    }
    setOpenDropdown(key);
  };
  const closeDropdown = (): void => setOpenDropdown(undefined);

  // A fixed-position dropdown doesn't move with the page, so its measured coordinates go stale
  // the moment the nav (or the page) scrolls, or the viewport resizes — simplest correct
  // behavior is to close it rather than track it.
  React.useEffect(() => {
    const navEl = navRef.current;
    if (!navEl || openDropdown === undefined) return;
    const onScrollOrResize = (): void => closeDropdown();
    navEl.addEventListener('scroll', onScrollOrResize);
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      navEl.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [openDropdown]);

  return (
    <nav className={`${styles.row2} ${mobileOpen ? styles.navOpen : ''}`}>
      <button type="button" className={styles.navToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
        <Icon iconName="GlobalNavButton" />
      </button>
      <ul className={styles.nav} ref={navRef}>
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            // Some dropdown parents also have their own page (e.g. "Leisure
            // Travel" links to /leisure-travel AND drops down to "Wellness
            // Beyond Office"); others are pure groupings with no page of
            // their own (e.g. "Support"). Both render the same markup, the
            // label is just a NavLink instead of a plain span when a route exists.
            const isOpen = openDropdown === item.key;
            const dropdown = (
              <div
                className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ''}`}
                style={!isMobile && isOpen && dropdownPos ? { top: dropdownPos.top, left: dropdownPos.left } : undefined}
                onMouseEnter={() => openAt(item.key)}
                onMouseLeave={closeDropdown}
              >
                {item.children.map((child) => (
                  <NavLink key={child.key} to={child.route} onClick={() => { closeDropdown(); setMobileOpen(false); }}>
                    {child.label}
                  </NavLink>
                ))}
              </div>
            );
            return (
              <li
                key={item.key}
                ref={(el) => { itemRefs.current[item.key] = el; }}
                className={`${styles.hasDropdown} ${isChildActive(item.children) ? styles.active : ''}`}
                onMouseEnter={() => openAt(item.key)}
                onMouseLeave={closeDropdown}
              >
                {item.route ? (
                  <NavLink to={item.route} onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                    {item.label}
                  </NavLink>
                ) : (
                  <span className={styles.navLabel}>{item.label}</span>
                )}
                <button
                  type="button"
                  className={styles.caret}
                  onClick={() => (isOpen ? closeDropdown() : openAt(item.key))}
                  aria-label={`Toggle ${item.label} submenu`}
                  aria-expanded={isOpen}
                >
                  <Icon iconName="ChevronDown" style={{ fontSize: 9 }} />
                </button>
                {isMobile ? dropdown : createPortal(dropdown, document.body)}
              </li>
            );
          }
          return (
            <li key={item.key}>
              <NavLink to={item.route as string} end={item.route === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
