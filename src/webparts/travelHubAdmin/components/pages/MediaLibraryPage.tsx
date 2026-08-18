import * as React from 'react';
import { Icon } from '@fluentui/react';
import { useServiceContext } from '../../../../state/ServiceContext';
import { LoadingSpinner } from '../../../../shared/components';
import { IMediaFile } from '../../../../models';
import dashboardStyles from './DashboardPage.module.scss';
import styles from './MediaLibraryPage.module.scss';

export const MediaLibraryPage: React.FC<{ onToast: (msg: string, isError?: boolean) => void }> = ({ onToast }) => {
  const { service } = useServiceContext();
  const [files, setFiles] = React.useState<IMediaFile[] | undefined>(undefined);
  const [error, setError] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const load = React.useCallback(() => {
    service.getMediaLibraryFiles().then((f) => { setFiles(f); setError(false); }).catch(() => setError(true));
  }, [service]);

  React.useEffect(() => { load(); }, [load]);

  const onUpload = (fileList: FileList | null): void => {
    const file = fileList?.[0];
    if (!file) return;
    onToast('Uploading...');
    service.uploadImageAsset(file).then(() => { onToast('Uploaded.'); load(); }, () => onToast('Upload failed.', true));
  };

  const onDelete = (url: string): void => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this image? Anything still referencing it will show a broken image.')) return;
    service.deleteMediaFile(url).then(() => { onToast('Image deleted.'); load(); }, () => onToast('Delete failed.', true));
  };

  return (
    <div className={dashboardStyles.panel}>
      <div className={dashboardStyles.panelHeader}>
        <h3>Media Library</h3>
        <span style={{ fontSize: 11.5, color: 'var(--th-text-muted)' }}>Images uploaded from Promotions & News forms</span>
      </div>
      <div className={styles.grid}>
        <label className={styles.uploadCard}>
          <Icon iconName="CloudUpload" style={{ fontSize: 20 }} />
          Upload
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onUpload(e.target.files)} />
        </label>
        {!files && !error && <div style={{ gridColumn: '2 / -1' }}><LoadingSpinner /></div>}
        {error && <p className={styles.error}>Couldn&rsquo;t load the media library. Make sure the uploads folder exists (see Admin &gt; Settings).</p>}
        {files && files.length === 0 && <p className={styles.empty}>No images uploaded yet.</p>}
        {files && files.map((f) => (
          <div key={f.ServerRelativeUrl} className={styles.item}>
            <img src={f.ServerRelativeUrl} alt="" />
            <button type="button" className={styles.deleteBtn} title="Delete" onClick={() => onDelete(f.ServerRelativeUrl)}>
              <Icon iconName="Delete" />
            </button>
            <div className={styles.name}>{f.Name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
