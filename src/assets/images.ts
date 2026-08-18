/**
 * Sample/placeholder background images, generated as inline SVG data URIs so
 * the solution ships fully self-contained (no external image host, no extra
 * assets to upload before the first render looks good). Every call site that
 * uses these treats them strictly as a *fallback*: as soon as a real
 * BannerImage / ThumbnailImage / heroImageUrl is set on the SharePoint item
 * (or in Admin > Settings), that real URL is used instead — see each page
 * component's `img ? img : sampleImageFor(...)` pattern.
 *
 * Generation is theme-aware (takes the two brand colors as input) so a
 * placeholder never looks wrong against the White/Black/Ocean themes the
 * way a hard-coded gold/navy image would.
 */

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function gradientDefs(id: string, from: string, to: string): string {
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient>`;
}

/** Wide hero banner: gradient + abstract skyline + plane trail. */
export function heroPlaceholderImage(primary: string, secondary: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500">
  <defs>${gradientDefs('heroGrad', secondary, primary)}</defs>
  <rect width="1600" height="500" fill="url(#heroGrad)"/>
  <g opacity="0.16" fill="#ffffff">
    <rect x="80" y="320" width="60" height="180"/>
    <rect x="160" y="260" width="70" height="240"/>
    <rect x="250" y="300" width="50" height="200"/>
    <rect x="1250" y="280" width="65" height="220"/>
    <rect x="1340" y="330" width="55" height="170"/>
    <rect x="1420" y="250" width="80" height="250"/>
  </g>
  <g opacity="0.5" stroke="#ffffff" stroke-width="3" fill="none">
    <path d="M120,150 Q500,60 900,140 T1500,120"/>
  </g>
  <g transform="translate(880,110) rotate(18)" fill="#ffffff" opacity="0.85">
    <path d="M0 0 L46 6 L58 0 L46 -6 Z M6 -2 L6 -20 L14 -14 L14 2 Z M6 6 L6 24 L14 18 L14 2 Z"/>
  </g>
</svg>`.trim();
  return svgToDataUri(svg);
}

/** Small card thumbnail: gradient + a simple icon glyph (kept generic — no external icon font needed here). */
export function cardPlaceholderImage(primary: string, secondary: string, variant: 'news' | 'update' | 'event' | 'promo' | 'exclusive' | 'upcoming' | 'announcement'): string {
  const icons: Record<string, string> = {
    news: '<circle cx="0" cy="0" r="22"/><rect x="-30" y="26" width="60" height="6" rx="3"/>',
    update: '<path d="M-20,-4 a20,20 0 1 1 4,16 l6,-2 M-20,-4 l0,-14 l14,4"/>',
    event: '<rect x="-24" y="-20" width="48" height="40" rx="4"/><rect x="-24" y="-8" width="48" height="4"/><line x1="-14" y1="-26" x2="-14" y2="-16"/><line x1="14" y1="-26" x2="14" y2="-16"/>',
    promo: '<path d="M-26,0 L0,-24 L26,0 L0,24 Z"/>',
    exclusive: '<path d="M0,-24 L6,-8 L24,-8 L10,4 L15,22 L0,10 L-15,22 L-10,4 L-24,-8 L-6,-8 Z"/>',
    upcoming: '<rect x="-24" y="-20" width="48" height="40" rx="4"/><rect x="-24" y="-8" width="48" height="4"/><circle cx="10" cy="10" r="3"/>',
    announcement: '<path d="M-24,-10 L4,-10 L4,-20 L26,0 L4,20 L4,10 L-24,10 Z"/>'
  };
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 260">
  <defs>${gradientDefs('cardGrad', secondary, primary)}</defs>
  <rect width="500" height="260" fill="url(#cardGrad)"/>
  <g opacity="0.22" fill="#ffffff">
    <circle cx="420" cy="40" r="90"/>
    <circle cx="60" cy="230" r="70"/>
  </g>
  <g transform="translate(250,130)" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" opacity="0.9">
    ${icons[variant] || icons.news}
  </g>
</svg>`.trim();
  return svgToDataUri(svg);
}

export function offerBannerPlaceholderImage(primary: string, secondary: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320">
  <defs>${gradientDefs('offerGrad', secondary, primary)}</defs>
  <rect width="1200" height="320" fill="url(#offerGrad)"/>
  <g opacity="0.18" fill="#ffffff">
    <circle cx="1050" cy="60" r="120"/>
    <circle cx="950" cy="260" r="80"/>
  </g>
</svg>`.trim();
  return svgToDataUri(svg);
}

/**
 * Aerial resort/coastline-style hero variant (water + palm silhouettes +
 * sun glow) used by the image-backed heroes on Home, Leisure Travel,
 * Wellness and similar pages — a different mood than `heroPlaceholderImage`
 * (which is city-skyline themed), same self-contained SVG-data-URI approach.
 */
export function resortHeroPlaceholderImage(primary: string, secondary: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500">
  <defs>${gradientDefs('resortGrad', secondary, primary)}<linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/></linearGradient></defs>
  <rect width="1600" height="500" fill="url(#resortGrad)"/>
  <circle cx="1300" cy="120" r="70" fill="#ffffff" opacity="0.18"/>
  <path d="M0,340 Q200,300 400,340 T800,340 T1200,340 T1600,340 L1600,500 L0,500 Z" fill="url(#waterGrad)"/>
  <path d="M0,390 Q220,350 440,390 T880,390 T1320,390 T1600,390 L1600,500 L0,500 Z" fill="#ffffff" opacity="0.12"/>
  <g opacity="0.4" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M120,420 Q140,340 90,300"/>
    <path d="M120,420 Q100,350 60,330"/>
    <path d="M120,420 Q150,360 180,350"/>
  </g>
  <g opacity="0.3" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none" transform="translate(1420,30)">
    <path d="M120,420 Q140,340 90,300"/>
    <path d="M120,420 Q100,350 60,330"/>
    <path d="M120,420 Q150,360 180,350"/>
  </g>
</svg>`.trim();
  return svgToDataUri(svg);
}

/**
 * Simple initials-on-gradient placeholder for people/hotel photos (team
 * members, testimonials, partner-hotel tiles) — `seedLabel` supplies the 1-2
 * letters drawn in the center.
 */
export function photoPlaceholderImage(seedLabel: string, primary: string, secondary: string): string {
  const initials = (seedLabel || '?').split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <defs>${gradientDefs('photoGrad', secondary, primary)}</defs>
  <rect width="300" height="300" fill="url(#photoGrad)"/>
  <text x="150" y="172" font-family="Georgia, serif" font-size="96" fill="#ffffff" fill-opacity="0.9" text-anchor="middle">${initials}</text>
</svg>`.trim();
  return svgToDataUri(svg);
}

/**
 * Brand mark used in the Header in place of a real logo file (none
 * available offline) — a stylized concentric swirl echoing the mockup's
 * fingerprint/wave logo motif, rendered directly in the current primary
 * color so it always matches the active theme.
 */
export function brandMarkSvg(color: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <g fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" opacity="0.92">
    <path d="M24 4 C13 4 4 13 4 24"/>
    <path d="M24 10 C17 10 10 17 10 24"/>
    <path d="M24 16 C21 16 16 21 16 24"/>
    <path d="M24 4 C35 4 44 13 44 24"/>
    <path d="M24 10 C31 10 38 17 38 24"/>
    <path d="M24 16 C27 16 32 21 32 24"/>
    <path d="M4 24 C4 35 13 44 24 44"/>
    <path d="M44 24 C44 35 35 44 24 44"/>
  </g>
</svg>`.trim();
  return svgToDataUri(svg);
}
