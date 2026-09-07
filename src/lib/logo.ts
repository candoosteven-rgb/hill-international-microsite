import { isRemoteUrl } from "@/lib/image";

// Per-development logo files referenced in the design source (`*-logo-white.png`,
// `pasted-<timestamp>-0.png`, etc.) were generated as one-off images inside the
// Claude Design canvas tool and were never saved as portable files — there is no
// session or asset store this app can retrieve them from. Since they're simple
// text wordmarks (not photography of a specific building or person), a generated
// SVG wordmark is a reasonable stand-in rather than a placeholder box: swap
// `resolveLogo()` for the real file the moment one exists.
export function resolveLogo(logo: string | undefined | null, name: string): string | null {
  if (!logo) return null;
  if (isRemoteUrl(logo)) return logo;

  const safeName = name.replace(/[<>&]/g, "");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80" viewBox="0 0 320 80">
    <text x="0" y="42" font-family="Inter, sans-serif" font-size="30" font-weight="800" letter-spacing="-0.5" fill="#F9F5F3">${safeName}</text>
    <rect x="0" y="56" width="46" height="4" rx="2" fill="#C1560F"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
