import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, IconButton, Icon } from '@fluentui/react';
import { ISectionConfig } from './sectionDefinitions';
import { ModerationStatus, ModerationStatusLabel } from '../../../../models';
import { EmptyState } from '../../../../shared/components';
import styles from './SectionTable.module.scss';

// Items here are loosely-typed SharePoint list-item dictionaries — the same
// generic-admin-engine tradeoff the config-driven approach makes everywhere.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyItem = Record<string, any>;

export interface ISectionTableProps {
  section: ISectionConfig;
  items: AnyItem[];
  isAdmin: boolean;
  isContributor: boolean;
  onEdit: (item: AnyItem) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const MODERATION_CLASS: Record<ModerationStatus, string> = {
  [ModerationStatus.Approved]: styles.pillApproved,
  [ModerationStatus.Denied]: styles.pillRejected,
  [ModerationStatus.Pending]: styles.pillPending,
  [ModerationStatus.Draft]: styles.pillDraft
};

export const SectionTable: React.FC<ISectionTableProps> = ({ section, items, isAdmin, isContributor, onEdit, onDelete, onApprove, onReject }) => {
  if (items.length === 0) {
    return <EmptyState message='Nothing here yet. Click "Add New" to create the first item.' icon={section.icon} />;
  }

  const columns: IColumn[] = section.columns.map((c) => ({
    key: c.name,
    name: c.label,
    fieldName: c.name,
    minWidth: 100,
    maxWidth: 220,
    isResizable: true,
    onRender: (item: AnyItem) => {
      const v = item[c.name];
      if (c.type === 'date') return v ? new Date(v).toLocaleDateString() : '';
      if (c.type === 'bool') return v ? <Icon iconName="CheckMark" className={styles.yes} /> : <Icon iconName="Cancel" className={styles.no} />;
      return String(v ?? '');
    }
  }));

  if (section.moderation) {
    columns.push({
      key: 'status', name: 'Status', fieldName: 'OData__ModerationStatus', minWidth: 90, maxWidth: 100,
      onRender: (item: AnyItem) => {
        const status: ModerationStatus = item.OData__ModerationStatus;
        return <span className={`${styles.pill} ${MODERATION_CLASS[status] || styles.pillDraft}`}>{ModerationStatusLabel[status] ?? '—'}</span>;
      }
    });
  }

  columns.push({
    key: 'actions', name: 'Actions', fieldName: '', minWidth: 140, maxWidth: 160,
    onRender: (item: AnyItem) => (
      <div className={styles.actions}>
        {section.isLibrary && item.FileRef && (
          <a href={item.FileRef} target="_blank" rel="noopener noreferrer" title="Open document" className={styles.iconBtn}>
            <Icon iconName="View" />
          </a>
        )}
        {isContributor && <IconButton iconProps={{ iconName: 'Edit' }} title="Edit" onClick={() => onEdit(item)} />}
        {section.moderation && isAdmin && item.OData__ModerationStatus === ModerationStatus.Pending && (
          <>
            <IconButton iconProps={{ iconName: 'CheckMark' }} title="Approve" onClick={() => onApprove(item.Id)} />
            <IconButton iconProps={{ iconName: 'Cancel' }} title="Reject" onClick={() => onReject(item.Id)} />
          </>
        )}
        {isAdmin && <IconButton iconProps={{ iconName: 'Delete' }} title="Delete" onClick={() => onDelete(item.Id)} />}
      </div>
    )
  });

  return (
    <div className={styles.tableWrap}>
      <DetailsList
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        getKey={(item: AnyItem) => String(item.Id)}
      />
    </div>
  );
};
