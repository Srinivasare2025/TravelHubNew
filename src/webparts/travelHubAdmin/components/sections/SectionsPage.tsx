import * as React from 'react';
import { PrimaryButton, Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { useUserContext } from '../../../../state/UserContext';
import { LoadingSpinner, ErrorState } from '../../../../shared/components';
import { SECTIONS, ISectionConfig } from './sectionDefinitions';
import { SectionTable } from './SectionTable';
import { SectionForm } from './SectionForm';
import styles from './SectionsPage.module.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyItem = Record<string, any>;

export const SectionsPage: React.FC<{ sectionKey: string; onToast: (msg: string, isError?: boolean) => void }> = ({ sectionKey, onToast }) => {
  const { service, config } = useServiceContext();
  const { isAdmin, isContributor } = useUserContext();
  const section = SECTIONS.filter((s) => s.key === sectionKey)[0] as ISectionConfig;

  const [items, setItems] = React.useState<AnyItem[] | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<AnyItem | undefined>(undefined);

  const listName = config.lists[section.listNameKey];

  const load = React.useCallback(() => {
    setError(undefined);
    service.getAllItems<AnyItem>(listName, `?$select=${section.select}&$top=500&$orderby=Id desc`)
      .then(setItems)
      .catch(() => setError("Could not load this list. You may not have access, or it hasn't been provisioned yet."));
  }, [service, listName, section.select]);

  React.useEffect(() => { setItems(undefined); load(); }, [load]);

  const openAdd = (): void => { setEditingItem(undefined); setFormOpen(true); };
  const openEdit = (item: AnyItem): void => { setEditingItem(item); setFormOpen(true); };

  const onDelete = (id: number): void => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    service.deleteItem(listName, id).then(() => { onToast('Item deleted.'); load(); }, () => onToast('Delete failed — check your permissions.', true));
  };
  const onApprove = (id: number): void => {
    service.setModerationStatus(listName, id, 0).then(() => { onToast('Item approved and published.'); load(); }, () => onToast('Approval failed — check your permissions.', true));
  };
  const onReject = (id: number): void => {
    service.setModerationStatus(listName, id, 1, 'Rejected by admin').then(() => { onToast('Item rejected.'); load(); }, () => onToast('Rejection failed — check your permissions.', true));
  };

  return (
    <div>
      <div className={styles.topbar}>
        <h2><Icon iconName={section.icon} /> {section.label}</h2>
        {isContributor && <PrimaryButton text="Add New" iconProps={{ iconName: 'Add' }} onClick={openAdd} />}
      </div>

      {error && <ErrorState message={error} />}
      {!error && !items && <LoadingSpinner />}
      {!error && items && (
        <SectionTable
          section={section}
          items={items}
          isAdmin={isAdmin}
          isContributor={isContributor}
          onEdit={openEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}

      <SectionForm
        section={section}
        item={editingItem}
        isOpen={formOpen}
        onDismiss={() => setFormOpen(false)}
        onSaved={() => { setFormOpen(false); onToast(editingItem ? 'Changes saved.' : 'Created.'); load(); }}
      />
    </div>
  );
};
