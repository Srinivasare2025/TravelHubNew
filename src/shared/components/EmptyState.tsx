import * as React from 'react';
import { Icon, MessageBar, MessageBarType } from '@fluentui/react';

export const EmptyState: React.FC<{ message: string; icon?: string }> = ({ message, icon = 'Info' }) => (
  <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--th-text-muted)' }}>
    <Icon iconName={icon} style={{ fontSize: 22, marginBottom: 8, display: 'block' }} />
    <span>{message}</span>
  </div>
);

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <MessageBar messageBarType={MessageBarType.error}>{message}</MessageBar>
);
