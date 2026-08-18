import * as React from 'react';
import { useThemeContext } from '../../../../state/ThemeContext';
import { IAnalyticsPoint } from '../../../../models';
import { EmptyState } from '../../../../shared/components';
import styles from './LineChart.module.scss';

export interface ILineChartProps {
  series: IAnalyticsPoint[];
  width?: number;
  height?: number;
}

/** Hand-rolled inline SVG line chart — no charting library dependency, matches the HTML build's approach. */
export const LineChart: React.FC<ILineChartProps> = ({ series, width = 480, height = 220 }) => {
  const { theme } = useThemeContext();

  if (series.length === 0) return <EmptyState message="No page-view activity recorded in this range yet." icon="LineChart" />;

  const padding = { top: 16, right: 16, bottom: 26, left: 34 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;
  const maxVal = Math.max(1, ...series.map((d) => Math.max(d.pageViews, d.uniqueUsers)));
  const stepX = series.length > 1 ? w / (series.length - 1) : 0;

  const pointsFor = (field: 'pageViews' | 'uniqueUsers'): string =>
    series.map((d, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + h - (d[field] / maxVal) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

  const gridLines = [0, 1, 2, 3, 4].map((g) => {
    const gy = padding.top + (h / 4) * g;
    return <line key={g} x1={padding.left} y1={gy} x2={width - padding.right} y2={gy} stroke={theme.palette.border} strokeWidth={1} />;
  });

  const labelEvery = Math.max(1, Math.ceil(series.length / 6));
  const xLabels = series.map((d, i) => {
    if (i % labelEvery !== 0) return null;
    const x = padding.left + i * stepX;
    const label = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return <text key={i} x={x} y={height - 6} fontSize={10} fill={theme.palette.textMuted} textAnchor="middle">{label}</text>;
  });

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        {gridLines}
        <polyline points={pointsFor('pageViews')} fill="none" stroke={theme.palette.secondary} strokeWidth={2.5} />
        <polyline points={pointsFor('uniqueUsers')} fill="none" stroke={theme.palette.primary} strokeWidth={2.5} />
        {xLabels}
      </svg>
      <div className={styles.legend}>
        <span><i style={{ background: theme.palette.secondary }} /> Page Views</span>
        <span><i style={{ background: theme.palette.primary }} /> Unique Users</span>
      </div>
    </div>
  );
};
