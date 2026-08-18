import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useServiceContext } from '../../../../state/ServiceContext';
import { Hero, StatStrip, CTABand, LoadingSpinner, DonutChart, BarChart, TrendAreaChart } from '../../../../shared/components';
import { IDashboardAnalytics, IDashboardFilters } from '../../../../models';
import styles from './TravelDashboardPage.module.scss';

export const TravelDashboardPage: React.FC = () => {
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [data, setData] = React.useState<IDashboardAnalytics | undefined>(undefined);
  const [filters, setFilters] = React.useState<IDashboardFilters>({ dateRangeLabel: 'Apr 1 – Apr 30, 2024', businessUnit: 'All', region: 'All' });

  React.useEffect(() => {
    service.getDashboardAnalytics(filters).then(setData);
  }, [service, filters]);

  React.useEffect(() => {
    service.logEvent('PageView', '/dashboard').catch(() => { /* non-fatal */ });
  }, [service]);

  if (!data) return <LoadingSpinner />;

  return (
    <div>
      <Hero
        compact
        breadcrumbItems={[{ label: 'Travel Dashboard & Analytics' }]}
        title="Travel Dashboard & Analytics"
        highlight="Data that drives smarter travel decisions."
        description="Real-time insights on spend, savings, policy compliance, sustainability and traveler experience across Red Sea Global."
        media={(
          <div className={styles.filterPanel}>
            <div><span>Date Range</span><div className={styles.filterField}>{filters.dateRangeLabel} <Icon iconName="Calendar" /></div></div>
            <div>
              <span>Business Unit</span>
              <select value={filters.businessUnit} onChange={(e) => setFilters({ ...filters, businessUnit: e.target.value })}>
                <option>All</option><option>Development</option><option>Operations</option><option>Corporate Services</option>
              </select>
            </div>
            <div>
              <span>Region</span>
              <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
                <option>All</option><option>Middle East</option><option>Europe</option><option>Asia Pacific</option>
              </select>
            </div>
            <a onClick={() => setFilters({ dateRangeLabel: 'Apr 1 – Apr 30, 2024', businessUnit: 'All', region: 'All' })}><Icon iconName="Refresh" /> Reset Filters</a>
          </div>
        )}
      />

      <div className={styles.body}>
        <StatStrip stats={data.kpis.map((k) => ({ icon: k.icon, value: k.value, label: k.label, deltaLabel: `${k.deltaLabel} ${k.compareLabel}`, deltaUp: k.deltaDirection === 'up' }))} />

        <div className={styles.twoCol}>
          <div className={styles.panel}>
            <h3>Spend Overview</h3>
            <p className={styles.panelSub}>Total spend (SAR)</p>
            <BarChart
              points={data.spendSeries.map((s) => ({ label: s.label, bar: s.spend, line: s.savings }))}
              barLegend="Spend (SAR)"
              lineLegend="Savings (SAR)"
            />
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHeaderRow}><h3>Spend by Category</h3><a>View Details <Icon iconName="ChevronRightSmall" /></a></div>
            <p className={styles.panelSub}>Total spend (SAR)</p>
            <DonutChart
              centerValue={data.spendTotal}
              centerLabel="SAR"
              slices={data.categoryBreakdown.map((c) => ({ label: c.label, pct: c.pct, color: c.color, valueLabel: `${c.amount}M (${c.pct}%)` }))}
            />
          </div>
        </div>

        <div className={styles.threeCol}>
          <div className={styles.panel}>
            <div className={styles.panelHeaderRow}><h3>Top Destinations by Spend</h3><a>View All <Icon iconName="ChevronRightSmall" /></a></div>
            <p className={styles.panelSub}>Total spend (SAR)</p>
            <BarChart horizontal points={data.topDestinations.map((d) => ({ label: d.label, bar: d.amount }))} valueFormatter={(v) => `${v}M`} />
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHeaderRow}><h3>Spend Trend</h3><a>View Details <Icon iconName="ChevronRightSmall" /></a></div>
            <p className={styles.panelSub}>Total spend (SAR)</p>
            <TrendAreaChart points={data.spendSeries.map((s) => ({ label: s.label, value: s.spend }))} />
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHeaderRow}><h3>Policy Compliance</h3><a>View Details <Icon iconName="ChevronRightSmall" /></a></div>
            <DonutChart
              centerValue={`${data.compliancePct}%`}
              centerLabel="Compliant"
              size={150}
              slices={data.complianceBreakdown.map((c) => ({ label: c.label, pct: c.pct, color: c.color, valueLabel: `${c.pct}% (${c.amount}M)` }))}
            />
            <div className={styles.complianceNote}><Icon iconName="LikeSolid" /> {data.complianceNote}</div>
          </div>
        </div>

        <div className={styles.twoCol}>
          <div className={styles.panel}>
            <div className={styles.panelHeaderRow}><h3>Spend by Business Unit</h3><a>View All <Icon iconName="ChevronRightSmall" /></a></div>
            <p className={styles.panelSub}>Total spend (SAR)</p>
            <table className={styles.table}>
              <thead><tr><th>Business Unit</th><th>Spend (SAR)</th><th>% of Total</th><th>vs Last Month</th></tr></thead>
              <tbody>
                {data.businessUnitRows.map((r) => (
                  <tr key={r.unit}>
                    <td>{r.unit}</td>
                    <td>{r.spend}M</td>
                    <td>{r.pctOfTotal}%</td>
                    <td className={r.vsLastMonthUp ? styles.up : styles.down}>{r.vsLastMonthLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className={styles.panel} style={{ marginBottom: 16 }}>
              <div className={styles.panelHeaderRow}><h3>Traveler Experience <span className={styles.panelHint}>(Last 30 Days)</span></h3><a>View All <Icon iconName="ChevronRightSmall" /></a></div>
              <StatStrip variant="plain" stats={data.travelerExperience.map((t) => ({ icon: t.icon, value: t.value, label: t.label, deltaLabel: t.deltaLabel, deltaUp: t.deltaUp }))} />
            </div>
            <div className={styles.panel}>
              <div className={styles.panelHeaderRow}><h3>Top Routes by Spend</h3><a>View All <Icon iconName="ChevronRightSmall" /></a></div>
              <table className={styles.table}>
                <thead><tr><th>Route</th><th>Spend (SAR)</th><th>Trips</th><th>Avg Ticket (SAR)</th></tr></thead>
                <tbody>
                  {data.topRoutes.map((r) => (
                    <tr key={r.route}><td>{r.route}</td><td>{r.spend}M</td><td>{r.trips}</td><td>{r.avgTicket.toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeaderRow}><h3>Sustainability Impact</h3><a>View Details <Icon iconName="ChevronRightSmall" /></a></div>
          <StatStrip variant="plain" stats={data.sustainabilityImpact.map((s) => ({ icon: s.icon, value: s.value, label: s.label, deltaLabel: s.deltaLabel }))} />
        </div>

        <CTABand
          variant="rich"
          icon="Lightbulb"
          title="Data. Insights. Impact."
          description="We turn data into actionable insights to make travel smarter, safer and more sustainable."
          ctaLabel="Request a Custom Report"
          onCtaClick={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
};
