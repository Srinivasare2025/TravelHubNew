import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { LoadingSpinner, EmptyState } from '../../../../shared/components';
import { IPendingApprovalItem } from '../../../../models';
import styles from './DashboardPage.module.scss'; // reuses .panel/.approvalItem — identical visual language

export const ApprovalsPage: React.FC<{ onReview: (item: IPendingApprovalItem) => void }> = ({ onReview }) => {
  const { service } = useServiceContext();
  const [items, setItems] = React.useState<IPendingApprovalItem[] | undefined>(undefined);

  React.useEffect(() => {
    service.getPendingApprovals().then(setItems).catch(() => setItems([]));
  }, [service]);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}><h3>All Pending Approvals</h3></div>
      {!items && <LoadingSpinner />}
      {items && items.length === 0 && <EmptyState message="Nothing pending approval." icon="CheckMark" />}
      {items && items.map((a) => (
        <div key={`${a.listName}-${a.Id}`} className={styles.approvalItem}>
          <span className={styles.approvalIcon}><Icon iconName={a.kind === 'Policy' ? 'Shield' : 'ReadingMode'} /></span>
          <div className={styles.approvalBody}>
            <h5>{a.Title}</h5>
            <span>{a.kind} &middot; Submitted by {a.Author} &middot; {new Date(a.Modified).toLocaleDateString()}</span>
          </div>
          <button type="button" onClick={() => onReview(a)}>Review</button>
        </div>
      ))}
    </div>
  );
};
