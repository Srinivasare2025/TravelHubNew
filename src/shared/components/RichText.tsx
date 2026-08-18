import * as React from 'react';
import { sanitizeHtml } from '../utils/sanitize';

export interface IRichTextProps {
  html: string | undefined;
  className?: string;
}

/** The only place in the app that uses dangerouslySetInnerHTML — always via sanitizeHtml(). */
export const RichText: React.FC<IRichTextProps> = ({ html, className }) => (
  // eslint-disable-next-line react/no-danger
  <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
);
