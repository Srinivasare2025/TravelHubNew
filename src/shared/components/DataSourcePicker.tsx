import * as React from 'react';
import { IconButton, Callout, DirectionalHint, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import { DataSourceService, DataSourceMode } from '../../services/DataSourceService';
import { getEffectiveDataSourceMode } from '../../services/ServiceFactory';
import styles from './DataSourcePicker.module.scss';

const dataSourceService = new DataSourceService();

const OPTIONS: IChoiceGroupOption[] = [
  { key: 'mock', text: 'Sample Data (Demo / Testing)' },
  { key: 'live', text: 'Live SharePoint Data' }
];

/**
 * Lets whoever is at the keyboard force Sample Data (safe for a demo or
 * local testing, even against a brand-new site with no lists provisioned
 * yet) or Live SharePoint Data, overriding the auto-detected default —
 * personal, per-browser, no SharePoint Admin rights required (see
 * DataSourceService). Switching re-fetches everything from the chosen
 * source, which is simplest and most reliable as a full page reload.
 */
export const DataSourcePicker: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<DataSourceMode>(() => getEffectiveDataSourceMode());
  const isOverride = dataSourceService.getPersonalOverride() !== undefined;
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const selectMode = (next: DataSourceMode): void => {
    if (next === mode) { setOpen(false); return; }
    dataSourceService.setPersonalOverride(next);
    window.location.reload();
  };

  const resetToAuto = (): void => {
    dataSourceService.clearPersonalOverride();
    window.location.reload();
  };

  return (
    <div ref={buttonRef} className={styles.wrap}>
      <IconButton
        iconProps={{ iconName: mode === 'mock' ? 'TestBeaker' : 'Cloud' }}
        title={mode === 'mock' ? 'Data source: Sample Data (Demo / Testing)' : 'Data source: Live SharePoint Data'}
        ariaLabel="Choose a data source"
        onClick={() => setOpen(!open)}
        className={styles.trigger}
      />
      {open && (
        <Callout
          target={buttonRef.current}
          onDismiss={() => setOpen(false)}
          directionalHint={DirectionalHint.bottomRightEdge}
          gapSpace={8}
        >
          <div className={styles.panel}>
            <div className={styles.panelHeader}>Data Source</div>
            <ChoiceGroup
              selectedKey={mode}
              options={OPTIONS}
              onChange={(_, opt) => { if (opt) { setMode(opt.key as DataSourceMode); selectMode(opt.key as DataSourceMode); } }}
            />
            <p className={styles.hint}>Switching reloads the page.</p>
            {isOverride && (
              <button type="button" className={styles.resetLink} onClick={resetToAuto}>
                Use automatic detection
              </button>
            )}
          </div>
        </Callout>
      )}
    </div>
  );
};
