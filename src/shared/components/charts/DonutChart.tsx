import * as React from 'react';
import styles from './DonutChart.module.scss';

export interface IDonutSlice {
  label: string;
  pct: number;
  color: string;
  valueLabel?: string;
}

export interface IDonutChartProps {
  slices: IDonutSlice[];
  centerValue?: string;
  centerLabel?: string;
  size?: number;
}

/**
 * Hand-rolled inline SVG donut chart (stroke-dasharray technique, no
 * charting library) — mirrors the existing pattern in
 * `travelHubAdmin/components/charts/LineChart.tsx`. Used by the Dashboard
 * page's "Spend by Category" and "Policy Compliance" panels.
 */
export const DonutChart: React.FC<IDonutChartProps> = ({ slices, centerValue, centerLabel, size = 180 }) => {
  const stroke = size * 0.16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className={styles.wrap}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--th-border)" strokeWidth={stroke} />
        {slices.map((s, i) => {
          const dash = (s.pct / 100) * circumference;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap={slices.length === 1 ? 'round' : 'butt'}
            />
          );
          offsetAcc += dash;
          return el;
        })}
        {centerValue && (
          <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize={size * 0.115} fontWeight={700} fill="var(--th-text)" fontFamily="Georgia, serif">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={size / 2} y={size / 2 + 18} textAnchor="middle" fontSize={size * 0.06} fill="var(--th-text-muted)">
            {centerLabel}
          </text>
        )}
      </svg>
      <ul className={styles.legend}>
        {slices.map((s, i) => (
          <li key={i}>
            <i style={{ background: s.color }} />
            <span>{s.label}</span>
            {s.valueLabel && <b>{s.valueLabel}</b>}
          </li>
        ))}
      </ul>
    </div>
  );
};
