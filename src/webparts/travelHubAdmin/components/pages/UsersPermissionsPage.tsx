import * as React from 'react';
import { Persona, PersonaSize } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { LoadingSpinner, EmptyState } from '../../../../shared/components';
import { ISharePointUser } from '../../../../models';
import dashboardStyles from './DashboardPage.module.scss';
import styles from './UsersPermissionsPage.module.scss';

const GROUP_ORDER: Array<{ key: 'admins' | 'contributors' | 'visitors' }> = [
  { key: 'admins' }, { key: 'contributors' }, { key: 'visitors' }
];

export const UsersPermissionsPage: React.FC = () => {
  const { service, config } = useServiceContext();
  const [members, setMembers] = React.useState<Record<string, ISharePointUser[] | undefined>>({});
  const [errors, setErrors] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    GROUP_ORDER.forEach(({ key }) => {
      const groupName = config.groups[key];
      service.getGroupMembers(groupName).then(
        (rows) => setMembers((m) => ({ ...m, [groupName]: rows })),
        () => setErrors((e) => ({ ...e, [groupName]: true }))
      );
    });
  }, [service, config]);

  return (
    <div>
      {GROUP_ORDER.map(({ key }) => {
        const groupName = config.groups[key];
        const rows = members[groupName];
        return (
          <div key={groupName} className={dashboardStyles.panel} style={{ marginBottom: 16 }}>
            <div className={dashboardStyles.panelHeader}>
              <h3>{groupName}</h3>
              {rows && <span className={styles.count}>{rows.length} member{rows.length === 1 ? '' : 's'}</span>}
            </div>
            {!rows && !errors[groupName] && <LoadingSpinner />}
            {errors[groupName] && <EmptyState message="Couldn't load members. Manage this group directly in SharePoint's People and Groups page." icon="Warning" />}
            {rows && rows.length === 0 && <EmptyState message="No members yet." icon="People" />}
            {rows && rows.map((m) => (
              <div key={m.Id} className={styles.member}>
                <Persona text={m.Title} size={PersonaSize.size32} />
                <span className={styles.email}>{m.Email}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
