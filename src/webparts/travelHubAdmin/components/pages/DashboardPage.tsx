import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { LoadingSpinner, EmptyState } from '../../../../shared/components';
import { LineChart } from '../charts/LineChart';
import { IPendingApprovalItem, IAnalyticsPoint } from '../../../../models';
import styles from './DashboardPage.module.scss';

interface IStatCard {
  label: string;
  value: number;
  delta?: number;
  sub?: string;
  icon: string;
}

export const DashboardPage: React.FC<{ onNavigate: (key: string) => void }> = ({ onNavigate }) => {
  const { service, config } = useServiceContext();
  const [cards, setCards] = React.useState<IStatCard[] | undefined>(undefined);
  const [approvals, setApprovals] = React.useState<IPendingApprovalItem[] | undefined>(undefined);
  const [chartDays, setChartDays] = React.useState(30);
  const [series, setSeries] = React.useState<IAnalyticsPoint[] | undefined>(undefined);

  React.useEffect(() => {
    const L = config.lists;
    Promise.all([
      service.getListItemCount(L.policies), service.getRecentItemCount(L.policies, 30),
      service.getListItemCount(L.news), service.getListItemCount(L.promotions),
      service.getRecentItemCount(L.news, 30), service.getRecentItemCount(L.promotions, 30),
      service.getListItemCount(L.guides), service.getListItemCount(L.forms),
      service.getRecentItemCount(L.guides, 30), service.getRecentItemCount(L.forms, 30),
      service.getListItemCount(L.faqs), service.getRecentItemCount(L.faqs, 30),
      service.getGroupUserCount(config.groups.admins), service.getGroupUserCount(config.groups.contributors)
    ]).then(([policies, policiesNew, news, promos, newsNew, promosNew, guides, forms, guidesNew, formsNew, faqs, faqsNew, admins, contributors]) => {
      setCards([
        { label: 'Total Pages', value: policies, delta: policiesNew, icon: 'Shield' },
        { label: 'News & Announcements', value: news + promos, delta: newsNew + promosNew, icon: 'News' },
        { label: 'Resources', value: guides + forms, delta: guidesNew + formsNew, icon: 'ReadingMode' },
        { label: 'FAQ Items', value: faqs, delta: faqsNew, icon: 'Help' },
        { label: 'Users', value: admins + contributors, sub: 'Editors & Contributors', icon: 'People' }
      ]);
    }).catch(() => setCards([]));

    service.getPendingApprovals().then((rows) => setApprovals(rows.slice(0, 5))).catch(() => setApprovals([]));
  }, [service, config]);

  React.useEffect(() => {
    service.getPageViewAnalytics(chartDays).then(setSeries).catch(() => setSeries([]));
  }, [service, chartDays]);

  return (
    <div>
      <div className={styles.statCards}>
        {!cards && [1, 2, 3, 4, 5].map((i) => <div key={i} className={styles.statSkeleton} />)}
        {cards && cards.map((c) => (
          <div key={c.label} className={styles.statCard}>
            <Icon iconName={c.icon} className={styles.statIcon} />
            <div className={styles.statValue}>{c.value}</div>
            <div className={styles.statLabel}>{c.label}</div>
            <div className={c.delta ? styles.statDelta : styles.statDeltaFlat}>
              {c.delta != null ? (c.delta > 0 ? `+${c.delta} this month` : 'No change this month') : c.sub}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cols}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Pending Approvals</h3>
            <a onClick={() => onNavigate('approvals')}>View All &rarr;</a>
          </div>
          {!approvals && <LoadingSpinner />}
          {approvals && approvals.length === 0 && <EmptyState message="Nothing pending approval." icon="CheckMark" />}
          {approvals && approvals.map((a) => (
            <div key={`${a.listName}-${a.Id}`} className={styles.approvalItem}>
              <span className={styles.approvalIcon}><Icon iconName={a.kind === 'Policy' ? 'Shield' : 'ReadingMode'} /></span>
              <div className={styles.approvalBody}>
                <h5>{a.Title}</h5>
                <span>{a.kind} &middot; Submitted by {a.Author} &middot; {new Date(a.Modified).toLocaleDateString()}</span>
              </div>
              <button type="button" onClick={() => onNavigate('approvals')}>Review</button>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>Content Analytics</h3>
            <div className={styles.range}>
              {[7, 30, 90].map((d) => (
                <button key={d} className={chartDays === d ? styles.rangeActive : undefined} onClick={() => setChartDays(d)}>{d} Days</button>
              ))}
            </div>
          </div>
          {series ? <LineChart series={series} /> : <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};
