import * as React from 'react';

let gradientSeq = 0;

export interface ITrendPoint {
  label: string;
  value: number;
}

export interface ITrendAreaChartProps {
  points: ITrendPoint[];
  color?: string;
  width?: number;
  height?: number;
}

/** Hand-rolled inline SVG area/line trend chart — used by Dashboard's "Spend Trend" panel. */
export const TrendAreaChart: React.FC<ITrendAreaChartProps> = ({ points, color = 'var(--th-secondary)', width = 480, height = 200 }) => {
  // Unique per instance so multiple charts on one page never share (and silently
  // collide on) the same <linearGradient> id — React 17 predates useId().
  const gradientId = React.useRef(`trendFill-${++gradientSeq}`).current;
  const padding = { top: 14, right: 10, bottom: 24, left: 34 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;
  const maxVal = Math.max(1, ...points.map((p) => p.value));
  const stepX = points.length > 1 ? w / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + h - (p.value / maxVal) * h
  }));
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${padding.top + h} L${coords[0].x.toFixed(1)},${padding.top + h} Z`;

  const gridLines = [0, 1, 2, 3].map((g) => {
    const gy = padding.top + (h / 3) * g;
    return <line key={g} x1={padding.left} y1={gy} x2={width - padding.right} y2={gy} stroke="var(--th-border)" strokeWidth={1} />;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {gridLines}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} />
      {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={3} fill={color} />)}
      {points.map((p, i) => (
        <text key={i} x={padding.left + i * stepX} y={height - 6} fontSize={10} fill="var(--th-text-muted)" textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  );
};
