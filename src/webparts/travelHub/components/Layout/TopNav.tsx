import * as React from 'react';
import { Icon } from '@fluentui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../navigation/navConfig';
import styles from './TopNav.module.scss';

export const TopNav: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | undefined>(undefined);

  const isChildActive = (children: { route: string }[]): boolean =>
    children.some((c) => location.pathname === c.route || location.pathname.startsWith(`${c.route}/`));

  return (
    <nav className={`${styles.row2} ${mobileOpen ? styles.navOpen : ''}`}>
      <button type="button" className={styles.navToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
        <Icon iconName="GlobalNavButton" />
      </button>
      <ul className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            // Some dropdown parents also have their own page (e.g. "Leisure
            // Travel" links to /leisure-travel AND drops down to "Wellness
            // Beyond Office"); others are pure groupings with no page of
            // their own (e.g. "Support"). Both render the same markup, the
            // label is just a NavLink instead of a plain span when a route exists.
            return (
              <li key={item.key} className={`${styles.hasDropdown} ${isChildActive(item.children) ? styles.active : ''}`}>
                {item.route ? (
                  <NavLink to={item.route} onClick={() => setMobileOpen(false)} className={({ isActive }) => (isActive ? styles.activeLink : undefined)}>
                    {item.label}
                  </NavLink>
                ) : (
                  <span className={styles.navLabel}>{item.label}</span>
                )}
                <button type="button" className={styles.caret} onClick={() => setOpenDropdown(openDropdown === item.key ? undefined : item.key)} aria-label={`Toggle ${item.label} submenu`}>
                  <Icon iconName="ChevronDown" style={{ fontSize: 9 }} />
                </button>
                <div className={`${styles.dropdown} ${openDropdown === item.key ? styles.dropdownOpen : ''}`}>
                  {item.children.map((child) => (
                    <NavLink key={child.key} to={child.route} onClick={() => { setOpenDropdown(undefined); setMobileOpen(false); }}>
                      {child.label}
                    </NavLink>
                  ))}
                </div>
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
