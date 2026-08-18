import * as React from 'react';
import {
  Panel, PanelType, PrimaryButton, DefaultButton, TextField, Dropdown, IDropdownOption,
  Toggle, DatePicker, Icon, Spinner, MessageBar, MessageBarType
} from '@fluentui/react';
import { ISectionConfig, ISectionField, ICON_PRESETS } from './sectionDefinitions';
import { useServiceContext } from '../../../../state/ServiceContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyItem = Record<string, any>;

export interface ISectionFormProps {
  section: ISectionConfig;
  item?: AnyItem; // undefined = "Add New"
  isOpen: boolean;
  onDismiss: () => void;
  onSaved: () => void;
}

function fieldValueFromItem(item: AnyItem | undefined, field: ISectionField): unknown {
  if (!item) return field.type === 'checkbox' ? !!field.defaultChecked : field.type === 'multiselect' ? [] : '';
  const name = field.name;
  if (field.type === 'url' || field.type === 'image') return item[name]?.Url || '';
  if (field.type === 'multiselect') return item[name]?.results || [];
  if (field.type === 'date') return item[name] ? new Date(item[name]) : undefined;
  return item[name] ?? '';
}

export const SectionForm: React.FC<ISectionFormProps> = ({ section, item, isOpen, onDismiss, onSaved }) => {
  const { service, config } = useServiceContext();
  const [values, setValues] = React.useState<Record<string, unknown>>({});
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [uploadingImage, setUploadingImage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const initial: Record<string, unknown> = {};
    section.fields.forEach((f) => { if (f.type !== 'file') initial[f.name] = fieldValueFromItem(item, f); });
    setValues(initial);
    setFile(undefined);
    setError(undefined);
  }, [section, item, isOpen]);

  const set = (name: string, value: unknown): void => setValues((v) => ({ ...v, [name]: value }));

  const onImageUpload = (field: ISectionField, files: FileList | null): void => {
    const f = files?.[0];
    if (!f) return;
    setUploadingImage(field.name);
    service.uploadImageAsset(f).then((url) => { set(field.name, url); setUploadingImage(undefined); })
      .catch(() => { setError('Image upload failed.'); setUploadingImage(undefined); });
  };

  const renderField = (field: ISectionField): React.ReactNode => {
    const value = values[field.name];
    switch (field.type) {
      case 'textarea':
      case 'richtext':
        return (
          <TextField
            key={field.name}
            label={field.label}
            multiline
            rows={field.type === 'richtext' ? 6 : 3}
            value={String(value ?? '')}
            onChange={(_, v) => set(field.name, v || '')}
          />
        );
      case 'select': {
        const options: IDropdownOption[] = (field.options || []).map((o) => ({ key: o, text: o }));
        return (
          <Dropdown
            key={field.name}
            label={field.label}
            selectedKey={String(value ?? '')}
            options={options}
            onChange={(_, opt) => set(field.name, opt?.key)}
          />
        );
      }
      case 'multiselect': {
        const options: IDropdownOption[] = (field.options || []).map((o) => ({ key: o, text: o }));
        const selected = Array.isArray(value) ? (value as string[]) : [];
        return (
          <Dropdown
            key={field.name}
            label={field.label}
            multiSelect
            selectedKeys={selected}
            options={options}
            onChange={(_, opt) => {
              if (!opt) return;
              const next = opt.selected ? [...selected, String(opt.key)] : selected.filter((k) => k !== opt.key);
              set(field.name, next);
            }}
          />
        );
      }
      case 'checkbox':
        return <Toggle key={field.name} label={field.label} checked={!!value} onChange={(_, checked) => set(field.name, !!checked)} />;
      case 'date':
        return (
          <DatePicker
            key={field.name}
            label={field.label}
            value={value as Date | undefined}
            onSelectDate={(d) => set(field.name, d || undefined)}
          />
        );
      case 'number':
        return (
          <TextField
            key={field.name}
            label={field.label}
            type="number"
            value={value === undefined || value === null ? '' : String(value)}
            onChange={(_, v) => set(field.name, v === '' ? undefined : Number(v))}
          />
        );
      case 'url':
        return <TextField key={field.name} label={field.label} placeholder="https://..." value={String(value ?? '')} onChange={(_, v) => set(field.name, v || '')} />;
      case 'file':
        return (
          <div key={field.name}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
              {field.label}{field.requiredOnCreate && !item ? ' *' : ''}
            </label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
            {item && item.FileLeafRef && <div style={{ fontSize: 11, color: 'var(--th-text-muted)', marginTop: 4 }}>Current file: {item.FileLeafRef} (leave blank to keep it)</div>}
          </div>
        );
      case 'image':
        return (
          <div key={field.name} style={{ marginBottom: 12 }}>
            <TextField
              label={field.label}
              placeholder="https://... or upload below"
              value={String(value ?? '')}
              onChange={(_, v) => set(field.name, v || '')}
            />
            <input type="file" accept="image/*" onChange={(e) => onImageUpload(field, e.target.files)} style={{ marginTop: 6 }} />
            {uploadingImage === field.name && <Spinner label="Uploading..." />}
          </div>
        );
      case 'iconpicker':
        return (
          <div key={field.name} style={{ marginBottom: 12 }}>
            <TextField label={field.label} value={String(value ?? '')} onChange={(_, v) => set(field.name, v || '')} />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {ICON_PRESETS.map((ic) => (
                <button key={ic} type="button" onClick={() => set(field.name, ic)} title={ic}
                  style={{ width: 32, height: 32, border: '1px solid var(--th-border)', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>
                  <Icon iconName={ic} />
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <TextField
            key={field.name}
            label={field.label}
            required={field.required}
            value={String(value ?? '')}
            onChange={(_, v) => set(field.name, v || '')}
          />
        );
    }
  };

  const buildFields = (): Record<string, unknown> => {
    const fields: Record<string, unknown> = {};
    section.fields.forEach((f) => {
      if (f.type === 'file') return;
      const v = values[f.name];
      if (f.type === 'multiselect') { fields[f.name] = { results: v || [] }; return; }
      if (f.type === 'date') { fields[f.name] = v ? (v as Date).toISOString() : null; return; }
      if (f.type === 'url' || f.type === 'image') { fields[f.name] = v ? { Url: v, Description: v } : null; return; }
      fields[f.name] = v;
    });
    return fields;
  };

  const onSubmit = async (): Promise<void> => {
    setError(undefined);
    const missingRequired = section.fields.find((f) => f.required && !values[f.name]);
    if (missingRequired) { setError(`${missingRequired.label} is required.`); return; }

    setSaving(true);
    try {
      const listName = config.lists[section.listNameKey];
      const fields = buildFields();
      if (section.isLibrary) {
        if (!item) {
          if (!file) { setError('Please choose a file to upload.'); setSaving(false); return; }
          await service.uploadFileToLibrary(listName, file, fields);
        } else {
          await service.updateItem(listName, item.Id, fields);
        }
      } else if (!item) {
        await service.createItem(listName, fields);
      } else {
        await service.updateItem(listName, item.Id, fields);
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed — check your permissions and required fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.custom}
      customWidth="420px"
      headerText={`${item ? 'Edit' : 'Add New'} ${section.label.replace(/s$/, '')}`}
      onRenderFooterContent={() => (
        <div style={{ display: 'flex', gap: 8 }}>
          <PrimaryButton text={saving ? 'Saving...' : 'Save'} onClick={onSubmit} disabled={saving} />
          <DefaultButton text="Cancel" onClick={onDismiss} disabled={saving} />
        </div>
      )}
      isFooterAtBottom
    >
      {error && <MessageBar messageBarType={MessageBarType.error} styles={{ root: { marginBottom: 12 } }}>{error}</MessageBar>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {section.fields.map(renderField)}
      </div>
    </Panel>
  );
};
