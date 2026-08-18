import * as React from 'react';
import styles from './Toast.module.scss';

export interface IToastMessage {
  id: number;
  text: string;
  isError?: boolean;
}

let nextId = 1;

/** Simple toast queue hook — returns [toasts, showToast] for any component to use. */
export function useToasts(): [IToastMessage[], (text: string, isError?: boolean) => void] {
  const [toasts, setToasts] = React.useState<IToastMessage[]>([]);
  const showToast = React.useCallback((text: string, isError?: boolean) => {
    const id = nextId++;
    setToasts((t) => [...t, { id, text, isError }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return [toasts, showToast];
}

export const ToastHost: React.FC<{ toasts: IToastMessage[] }> = ({ toasts }) => (
  <div className={styles.host}>
    {toasts.map((t) => (
      <div key={t.id} className={t.isError ? styles.toastError : styles.toast}>{t.text}</div>
    ))}
  </div>
);
