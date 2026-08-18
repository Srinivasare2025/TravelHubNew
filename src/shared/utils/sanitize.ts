import DOMPurify from 'dompurify';

/**
 * Every rich-text field in this solution (PolicyBody, FAQ Answer, News Body)
 * is HTML authored by Contributors through the Admin rich-text-ish textarea
 * and rendered back out via dangerouslySetInnerHTML. Sanitizing here is the
 * one place that stands between a stored-XSS payload (a Contributor account
 * that's been phished, or a rogue field edit via a raw REST call) and every
 * visitor's browser — never render a rich-text field without it.
 */
export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'a', 'br', 'span', 'div', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });
}
