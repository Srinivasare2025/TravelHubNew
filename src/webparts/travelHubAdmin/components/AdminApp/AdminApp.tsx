import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { initializeIcons } from '@fluentui/react';
import { ServiceProvider, useServiceContext } from '../../../../state/ServiceContext';
import { ThemeContextProvider } from '../../../../state/ThemeContext';
import { UserContextProvider, useUserContext } from '../../../../state/UserContext';
import { ThemedRoot, LoadingSpinner, EmptyState, useToasts, ToastHost } from '../../../../shared/components';
import { Sidebar, NAV_ORDER } from '../AdminShell/Sidebar';
import { SectionsPage, SECTIONS } from '../sections';
import { DashboardPage, ApprovalsPage, AnalyticsPage, MediaLibraryPage, SettingsPage, UsersPermissionsPage } from '../pages';
import { IPendingApprovalItem } from '../../../../models';
import styles from './AdminApp.module.scss';

initializeIcons();

export interface IAdminAppProps {
  context: WebPartContext;
}

const AdminShell: React.FC = () => {
  const { isAdmin, isContributor, loading: userLoading } = useUserContext();
  const { loading: configLoading, error: configError } = useServiceContext();
  const [active, setActive] = React.useState('dashboard');
  const [toasts, showToast] = useToasts();

  if (userLoading || configLoading) return <ThemedRoot className={styles.gateWrap}><LoadingSpinner label="Loading Admin Dashboard…" /></ThemedRoot>;

  if (!isContributor) {
    return (
      <ThemedRoot className={styles.gateWrap}>
        <EmptyState message="You need Travel Hub Contributor or Admin access to manage content. Contact the Travel team if you believe this is a mistake." icon="Lock" />
      </ThemedRoot>
    );
  }

  const navEntry = NAV_ORDER.filter((n) => n.key === active)[0];
  const section = SECTIONS.filter((s) => s.key === active)[0];

  const onReviewApproval = (item: IPendingApprovalItem): void => {
    const sectionForItem = SECTIONS.filter((s) => s.listNameKey === (item.kind === 'Policy' ? 'policies' : 'guides'))[0];
    setActive(sectionForItem.key);
    // The section's own table shows the item with an Edit button; deep-linking straight
    // into the edit panel from here would need SectionsPage to accept a pre-opened id —
    // a reasonable next enhancement (see docs/ARCHITECTURE.md) — for now this takes the
    // admin straight to the right list, one click from Edit on the exact row.
  };

  return (
    <ThemedRoot className={styles.root}>
      {configError && (
        <div className={styles.configWarning}>Configuration couldn&rsquo;t be fully loaded ({configError}) — showing defaults.</div>
      )}
      <div className={styles.layout}>
        <Sidebar active={active} roleLabel={isAdmin ? 'Admin' : 'Contributor'} onSelect={setActive} />
        <div className={styles.main}>
          {navEntry?.type === 'section' && section && <SectionsPage sectionKey={section.key} onToast={showToast} />}
          {active === 'dashboard' && <DashboardPage onNavigate={setActive} />}
          {active === 'approvals' && <ApprovalsPage onReview={onReviewApproval} />}
          {active === 'analytics' && <AnalyticsPage />}
          {active === 'media' && <MediaLibraryPage onToast={showToast} />}
          {active === 'settings' && <SettingsPage onToast={showToast} />}
          {active === 'users' && <UsersPermissionsPage />}
        </div>
      </div>
      <ToastHost toasts={toasts} />
    </ThemedRoot>
  );
};

export const AdminApp: React.FC<IAdminAppProps> = ({ context }) => (
  <ServiceProvider context={context}>
    <ThemeContextProvider>
      <UserContextProvider>
        <AdminShell />
      </UserContextProvider>
    </ThemeContextProvider>
  </ServiceProvider>
);
