import * as React from 'react';
import { Icon, Callout, DirectionalHint, Persona, PersonaSize } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useUserContext } from '../../../../state/UserContext';
import { ThemePicker, DataSourcePicker } from '../../../../shared/components';
import { brandMarkSvg } from '../../../../assets/images';
import { FIXED_PALETTE } from '../../../../theme/themes';
import { ISearchResultItem, INotification } from '../../../../models';
import styles from './Header.module.scss';

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week(s) ago`;
}

export const Header: React.FC = () => {
  const { service, config, webAbsoluteUrl } = useServiceContext();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [results, setResults] = React.useState<ISearchResultItem[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const searchTimer = React.useRef<number>();

  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const bellRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    service.getRecentNotifications().then(setNotifications).catch(() => setNotifications([]));
  }, [service]);

  const onSearchChange = (value: string): void => {
    setSearchTerm(value);
    window.clearTimeout(searchTimer.current);
    if (!value || value.length < 2) { setShowResults(false); setResults([]); return; }
    searchTimer.current = window.setTimeout(() => {
      service.search(value).then((r) => { setResults(r); setShowResults(true); }).catch(() => setResults([]));
    }, 350);
  };

  // Search results are real SharePoint document/page URLs (absolute http(s) in
  // production; the mock service returns internal '#/...' routes for local
  // preview) — react-router's navigate() only understands internal routes, so
  // an absolute URL needs a real browser navigation instead.
  const goToSearchResult = (path: string): void => {
    if (path.startsWith('#') || path.startsWith('/')) navigate(path.replace(/^#/, ''));
    else window.location.href = path;
  };

  const initials = user ? user.Title.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() : '?';
  // SharePoint's own user-photo endpoint — resolves the *real* signed-in
  // user's photo on a live site. Against the local/mock user (an email that
  // doesn't exist in the tenant) it 404s and Persona falls back to
  // initials automatically, which is exactly the desired workbench behavior.
  const photoUrl = user?.Email ? `${webAbsoluteUrl}/_layouts/15/userphoto.aspx?size=L&username=${encodeURIComponent(user.Email)}` : undefined;
  const orgName = config.organizationName || 'Red Sea Global';
  const [orgFirst, ...orgRest] = orgName.split(' ');

  return (
    <header className={styles.header}>
      <div className={styles.row1}>
        <a className={styles.brand} onClick={() => navigate('/')} role="button" tabIndex={0}>
          <img className={styles.logo} src={config.logoUrl || brandMarkSvg(FIXED_PALETTE.primary)} alt="" aria-hidden="true" />
          <span className={styles.brandText}>
            <span className={styles.org}>{orgFirst}</span>
            {orgRest.length > 0 && <span className={styles.product}>{orgRest.join(' ')}</span>}
          </span>
        </a>

        <div className={styles.search}>
          <Icon iconName="Search" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search travel resources..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => results.length && setShowResults(true)}
            onBlur={() => window.setTimeout(() => setShowResults(false), 150)}
          />
          {showResults && (
            <div className={styles.searchResults}>
              {results.length === 0 && <div className={styles.searchEmpty}>No matches found.</div>}
              {results.map((r, i) => (
                <div key={i} className={styles.searchResultItem} onMouseDown={() => goToSearchResult(r.path)}>
                  <strong>{r.title}</strong>
                  <span>{r.summary}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <DataSourcePicker />
          <ThemePicker />
          <div ref={bellRef} className={styles.notifWrap}>
            <button type="button" className={styles.iconBtn} onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifications">
              <Icon iconName="Ringer" />
              {notifications.length > 0 && <span className={styles.badge}>{notifications.length}</span>}
            </button>
            {notifOpen && (
              <Callout target={bellRef.current} onDismiss={() => setNotifOpen(false)} directionalHint={DirectionalHint.bottomRightEdge} gapSpace={8}>
                <div className={styles.notifPanel}>
                  <div className={styles.notifHeader}>Notifications</div>
                  {notifications.length === 0 && <div className={styles.notifEmpty}>No new notifications.</div>}
                  {notifications.map((n, i) => (
                    <div key={i} className={styles.notifItem} onClick={() => { navigate(n.route); setNotifOpen(false); }}>
                      <strong>{n.Title}</strong>
                      <span>{n.kind} · {timeAgo(n.date)}</span>
                    </div>
                  ))}
                </div>
              </Callout>
            )}
          </div>
          <div className={styles.profile}>
            <Persona text={user ? user.Title : 'Loading…'} size={PersonaSize.size32} imageUrl={photoUrl} imageInitials={initials} />
          </div>
        </div>
      </div>
    </header>
  );
};
