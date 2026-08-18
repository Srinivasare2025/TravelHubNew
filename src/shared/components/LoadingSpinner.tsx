import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div style={{ padding: '40px 0', textAlign: 'center' }}>
    <Spinner size={SpinnerSize.medium} label={label} />
  </div>
);
