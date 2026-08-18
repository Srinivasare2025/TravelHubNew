import * as React from 'react';
import styles from './BarChart.module.scss';

export interface IBarChartPoint {
  label: string;
  bar: number;
  line?: number;
}

export interface IBarChartProps {
  points: IBarChartPoint[];
  barColor?: string;
  lineColor?: string;
  barLegend?: string;
  lineLegend?: string;
  width?: number;
  height?: number;
  /** Horizontal ranking-bar mode (plain CSS bars, no SVG) — used for "Top Destinations by Spend". */
  horizontal?: boolean;
  valueFormatter?: (v: number) => string;
}

/**
 * Vertical SVG bar chart with an optional overlaid line series ("Spend
 * Overview": Spend bars + Savings line), or — via `horizontal` — a simple
 * ranked horizontal-bar list ("Top Destinations by Spend"). One component
 * because both read the same `IBarChartPoint[]` shape.
 */
export const BarChart: React.FC<IBarChartProps> = ({
  points, barColor = 'var(--th-secondary)', lineColor = 'var(--th-primary)', barLegend, lineLegend,
  width = 480, height = 220, horizontal, valueFormatter = (v) => String(v)
}) => {
  if (horizontal) {
    const max = Math.max(1, ...points.map((p) => p.bar));
    return (
      <div className={styles.hList}>
        {points.map((p, i) => (
          <div key={i} className={styles.hRow}>
            <span className={styles.hLabel}>{p.label}</span>
            <div className={styles.hTrack}>
              <div className={styles.hFill} style={{ width: `${(p.bar / max) * 100}%`, background: barColor }} />
            </div>
            <span className={styles.hValue}>{valueFormatter(p.bar)}</span>
          </div>
        ))}
      </div>
    );
  }

  const padding = { top: 16, right: 10, bottom: 26, left: 34 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;
  const maxVal = Math.max(1, ...points.map((p) => Math.max(p.bar, p.line || 0)));
  const bandWidth = w / points.length;
  const barWidth = Math.min(34, bandWidth * 0.5);

  const linePoints = points.map((p, i) => {
    const x = padding.left + bandWidth * i + bandWidth / 2;
    const y = padding.top + h - ((p.line || 0) / maxVal) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const gridLines = [0, 1, 2, 3].map((g) => {
    const gy = padding.top + (h / 3) * g;
    return <line key={g} x1={padding.left} y1={gy} x2={width - padding.right} y2={gy} stroke="var(--th-border)" strokeWidth={1} />;
  });

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        {gridLines}
        {points.map((p, i) => {
          const x = padding.left + bandWidth * i + (bandWidth - barWidth) / 2;
          const barH = (p.bar / maxVal) * h;
          const y = padding.top + h - barH;
          return <rect key={i} x={x} y={y} width={barWidth} height={barH} rx={3} fill={barColor} />;
        })}
        {points.some((p) => p.line != null) && <polyline points={linePoints} fill="none" stroke={lineColor} strokeWidth={2.5} />}
        {points.some((p) => p.line != null) && points.map((p, i) => {
          const x = padding.left + bandWidth * i + bandWidth / 2;
          const y = padding.top + h - ((p.line || 0) / maxVal) * h;
          return <circle key={i} cx={x} cy={y} r={3.2} fill={lineColor} />;
        })}
        {points.map((p, i) => {
          const x = padding.left + bandWidth * i + bandWidth / 2;
          return <text key={i} x={x} y={height - 6} fontSize={10} fill="var(--th-text-muted)" textAnchor="middle">{p.label}</text>;
        })}
      </svg>
      {(barLegend || lineLegend) && (
        <div className={styles.legend}>
          {barLegend && <span><i style={{ background: barColor }} /> {barLegend}</span>}
          {lineLegend && <span><i style={{ background: lineColor }} /> {lineLegend}</span>}
        </div>
      )}
    </div>
  );
};
