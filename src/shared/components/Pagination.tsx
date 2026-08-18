import * as React from 'react';
import { IconButton } from '@fluentui/react';
import styles from './Pagination.module.scss';

export interface IPaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const Pagination: React.FC<IPaginationProps> = ({ page, pageSize, totalCount, onPageChange, itemLabel = 'items' }) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  const pageButtons: number[] = [];
  for (let p = 1; p <= totalPages; p++) pageButtons.push(p);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>Showing {start} to {end} of {totalCount} {itemLabel}</span>
      <div className={styles.controls}>
        <IconButton iconProps={{ iconName: 'ChevronLeft' }} disabled={page <= 1} onClick={() => onPageChange(page - 1)} ariaLabel="Previous page" />
        {pageButtons.map((p) => (
          <button
            key={p}
            className={p === page ? styles.pageBtnActive : styles.pageBtn}
            onClick={() => onPageChange(p)}
            type="button"
          >
            {p}
          </button>
        ))}
        <IconButton iconProps={{ iconName: 'ChevronRight' }} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} ariaLabel="Next page" />
      </div>
    </div>
  );
};
