// Design-handoff imagery referenced local `uploads/...` paths that were not
// included in the asset bundle (see README: "should be re-sourced as owned
// assets/CDN in production"). Hotlinked hill.co.uk/millerhare.com URLs are
// real and used as-is; local-only references fall back to a generated brand
// placeholder so every card/gallery still renders a picture.

const PALETTE: [string, string][] = [
  ["#16313D", "#0E2028"],
  ["#28567A", "#16313D"],
  ["#C1560F", "#8a3d09"],
  ["#6FA8D6", "#28567A"],
  ["#C98A6B", "#8a5636"],
  ["#1F3A47", "#0D1214"],
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function isRemoteUrl(src?: string | null): boolean {
  return !!src && /^https?:\/\//.test(src);
}

export function placeholderFor(seed: string, label?: string): string {
  const [a, b] = PALETTE[hash(seed) % PALETTE.length];
  const angle = hash(seed + "a") % 360;
  const safeLabel = (label || "").replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="100%" stop-color="${b}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <circle cx="${120 + (hash(seed + "x") % 560)}" cy="${100 + (hash(seed + "y") % 400)}" r="180" fill="rgba(255,255,255,0.05)"/>
    ${safeLabel ? `<text x="40" y="548" font-family="Inter, sans-serif" font-size="26" font-weight="700" letter-spacing="0.5" fill="rgba(249,245,243,0.55)">${safeLabel}</text>` : ""}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function resolveImage(src: string | undefined | null, label?: string): string {
  if (isRemoteUrl(src)) return src as string;
  return placeholderFor(src || label || "hill", label);
}
