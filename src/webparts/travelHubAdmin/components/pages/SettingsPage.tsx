import * as React from 'react';
import { TextField, PrimaryButton, Dropdown, IDropdownOption, MessageBar, MessageBarType } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { createConfigService } from '../../../../services/ServiceFactory';
import { IAppConfig, ThemeKey } from '../../../../models';
import { THEME_LIST } from '../../../../theme/themes';
import dashboardStyles from './DashboardPage.module.scss';
import styles from './SettingsPage.module.scss';

const THEME_OPTIONS: IDropdownOption[] = THEME_LIST.map((t) => ({ key: t.key, text: t.label }));

/**
 * The "provision for admin to configure required details" screen — every
 * field here is a row in the TravelHubConfig list (see ConfigService),
 * applied site-wide the moment it's saved, no redeploy or web-part-property
 * editing required.
 */
export const SettingsPage: React.FC<{ onToast: (msg: string, isError?: boolean) => void }> = ({ onToast }) => {
  const { service, config, refreshConfig } = useServiceContext();
  const configService = React.useMemo(() => createConfigService(service), [service]);

  const [draft, setDraft] = React.useState<IAppConfig>(config);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => { setDraft(config); }, [config]);

  const set = <K extends keyof IAppConfig>(key: K, value: IAppConfig[K]): void => setDraft((d) => ({ ...d, [key]: value }));
  const setList = (key: keyof IAppConfig['lists'], value: string): void => setDraft((d) => ({ ...d, lists: { ...d.lists, [key]: value } }));
  const setGroup = (key: keyof IAppConfig['groups'], value: string): void => setDraft((d) => ({ ...d, groups: { ...d.groups, [key]: value } }));

  const onSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await configService.saveConfig(draft);
      await refreshConfig();
      onToast('Settings saved.');
    } catch {
      onToast('Save failed — check that TravelHubConfig exists and you have Contribute rights on it.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <MessageBar messageBarType={MessageBarType.info} styles={{ root: { marginBottom: 18 } }}>
        These settings apply site-wide the moment you save — no redeploy needed. They&rsquo;re stored in the
        <code className={styles.code}> TravelHubConfig</code> list.
      </MessageBar>

      <div className={dashboardStyles.panel} style={{ marginBottom: 18 }}>
        <div className={dashboardStyles.panelHeader}><h3>Site & Branding</h3></div>
        <div className={styles.grid}>
          <TextField
            label="Lists Site URL (leave blank to use the current site)"
            placeholder="https://tenant.sharepoint.com/sites/TravelHub"
            value={draft.siteUrl}
            onChange={(_, v) => set('siteUrl', v || '')}
          />
          <TextField label="Organization Name" value={draft.organizationName} onChange={(_, v) => set('organizationName', v || '')} />
          <TextField label="Hero Banner Image URL" placeholder="Leave blank to use the built-in sample" value={draft.heroImageUrl} onChange={(_, v) => set('heroImageUrl', v || '')} />
          <TextField label="Header Logo URL" placeholder="Leave blank to use the built-in generated mark" value={draft.logoUrl} onChange={(_, v) => set('logoUrl', v || '')} />
          <TextField label="Uploads Folder (server-relative)" placeholder="/sites/TravelHub/SiteAssets/travelhub/uploads" value={draft.uploadsFolderUrl} onChange={(_, v) => set('uploadsFolderUrl', v || '')} />
          <Dropdown
            label="Default Theme (site-wide — users can still override for themselves)"
            selectedKey={draft.defaultTheme}
            options={THEME_OPTIONS}
            onChange={(_, opt) => opt && set('defaultTheme', opt.key as ThemeKey)}
          />
        </div>
      </div>

      <div className={dashboardStyles.panel} style={{ marginBottom: 18 }}>
        <div className={dashboardStyles.panelHeader}><h3>List Name Mapping</h3></div>
        <p className={styles.hint}>Only change these if the underlying SharePoint lists were renamed — the schema/column shape must still match provisioning/TravelHub-Schema.md.</p>
        <div className={styles.grid}>
          <TextField label="Policies" value={draft.lists.policies} onChange={(_, v) => setList('policies', v || '')} />
          <TextField label="Guides" value={draft.lists.guides} onChange={(_, v) => setList('guides', v || '')} />
          <TextField label="Forms" value={draft.lists.forms} onChange={(_, v) => setList('forms', v || '')} />
          <TextField label="FAQs" value={draft.lists.faqs} onChange={(_, v) => setList('faqs', v || '')} />
          <TextField label="Promotions" value={draft.lists.promotions} onChange={(_, v) => setList('promotions', v || '')} />
          <TextField label="News" value={draft.lists.news} onChange={(_, v) => setList('news', v || '')} />
          <TextField label="Quick Links" value={draft.lists.quickLinks} onChange={(_, v) => setList('quickLinks', v || '')} />
          <TextField label="Page Views" value={draft.lists.pageViews} onChange={(_, v) => setList('pageViews', v || '')} />
        </div>
      </div>

      <div className={dashboardStyles.panel} style={{ marginBottom: 18 }}>
        <div className={dashboardStyles.panelHeader}><h3>Group Name Mapping</h3></div>
        <div className={styles.grid}>
          <TextField label="Admins group" value={draft.groups.admins} onChange={(_, v) => setGroup('admins', v || '')} />
          <TextField label="Contributors group" value={draft.groups.contributors} onChange={(_, v) => setGroup('contributors', v || '')} />
          <TextField label="Visitors group" value={draft.groups.visitors} onChange={(_, v) => setGroup('visitors', v || '')} />
        </div>
      </div>

      <PrimaryButton text={saving ? 'Saving...' : 'Save Settings'} onClick={onSave} disabled={saving} />
    </div>
  );
};
