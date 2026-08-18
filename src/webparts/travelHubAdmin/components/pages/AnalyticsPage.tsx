import * as React from 'react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { createAnalyticsService } from '../../../../services/ServiceFactory';
import { LoadingSpinner, EmptyState } from '../../../../shared/components';
import { LineChart } from '../charts/LineChart';
import { IAnalyticsPoint } from '../../../../models';
import { ITopContentRow } from '../../../../services/AnalyticsService';
import dashboardStyles from './DashboardPage.module.scss';
import styles from './AnalyticsPage.module.scss';

export const AnalyticsPage: React.FC = () => {
  const { service, config } = useServiceContext();
  const analyticsService = React.useMemo(() => createAnalyticsService(service, config), [service, config]);

  const [days, setDays] = React.useState(30);
  const [series, setSeries] = React.useState<IAnalyticsPoint[] | undefined>(undefined);
  const [topContent, setTopContent] = React.useState<ITopContentRow[] | undefined>(undefined);

  React.useEffect(() => {
    analyticsService.getChartSeries(days).then(setSeries).catch(() => setSeries([]));
  }, [analyticsService, days]);

  React.useEffect(() => {
    analyticsService.getTopContent(10).then(setTopContent).catch(() => setTopContent([]));
  }, [analyticsService]);

  return (
    <div>
      <div className={dashboardStyles.panel} style={{ marginBottom: 18 }}>
        <div className={dashboardStyles.panelHeader}>
          <h3>Traffic Over Time</h3>
          <div className={dashboardStyles.range}>
            {[7, 30, 90].map((d) => (
              <button key={d} className={days === d ? dashboardStyles.rangeActive : undefined} onClick={() => setDays(d)}>{d} Days</button>
            ))}
          </div>
        </div>
        {series ? <LineChart series={series} width={900} height={280} /> : <LoadingSpinner />}
      </div>

      <div className={dashboardStyles.panel}>
        <div className={dashboardStyles.panelHeader}><h3>Most Viewed Content</h3></div>
        {!topContent && <LoadingSpinner />}
        {topContent && topContent.length === 0 && <EmptyState message="No activity recorded yet." icon="LineChart" />}
        {topContent && topContent.length > 0 && (
          <table className={styles.table}>
            <thead><tr><th>Item</th><th>Interactions</th></tr></thead>
            <tbody>
              {topContent.map((t) => <tr key={t.reference}><td>{t.reference}</td><td>{t.interactions}</td></tr>)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
