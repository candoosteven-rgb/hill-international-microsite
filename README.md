# Hill International Microsite

A production recreation of the Hill International design handoff (`design_handoff_hill_international_microsite/`) — a multi-development real-estate marketing microsite covering Hill's portfolio across London, Cambridge, Oxford and Bristol, with browsing, filtering, comparison, favouriting, a register-interest lead-gen flow, and a full development detail page per project. Supports 4 languages (English, Turkish, Chinese, Arabic), including RTL layout for Arabic.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/data/*.json` — content extracted from the design source: 29 developments, the 4-language translation dictionary, team members, per-development detail-page data (facts, gallery, specification, plots, amenities, marketing suite, nearby developments), disclaimer copy, and confirmation-email copy.
- `src/lib/` — data typing/access (`data.ts`), the language context and translation helper (`i18n.tsx`), shared app state for favourites/compare/recently-viewed/modals (`app-state.tsx`), and a generated-placeholder image resolver (`image.ts`).
- `src/components/` — one component per section/screen (`Nav`, `Hero`, `Developments`, `DevCard`, `Standard`, `Trust`, `About`, `Environment`, `Team`, `Register`, `Footer`) plus the overlay screens (`DevOverviewModal`, `DevelopmentPage`, `CompareBar`, `CompareModal`, `ThankYouModal`).
- `src/app/page.tsx` — assembles the page under `LanguageProvider` and `AppStateProvider`.

## Content fidelity

All copy, development data, translations and interaction logic are extracted programmatically from the authoritative `.dc.html` design source (not retyped), so the four language dictionaries, the 29-development portfolio and every detail page are real content, not placeholders.

## Imagery

Real photos, per-development logos, and team headshots live in `public/uploads/`, matched to the `uploads/...` paths already referenced throughout `src/data/*.json` and a few components. `src/data/UPLOADS_MANIFEST.json` (generated from what's actually on disk) is checked by `resolveImage()`/`resolveLogo()` in `src/lib/image.ts` / `src/lib/logo.ts`: a real file is served as-is, anything still missing falls back to a deterministic brand-coloured placeholder SVG instead of a broken image. To add more real images, drop the file in `public/uploads/` under the exact path already referenced in the data, then regenerate the manifest (walk `public/uploads`, write relative paths to `UPLOADS_MANIFEST.json`).

## Enquiry capture (Register interest / Downloads gate)

The two lead-capture forms (`Register.tsx`, and the per-development "Downloads" gate in `DevelopmentPage.tsx`) POST to `/api/enquiry`, handled by a small Worker script (`worker/index.ts`) that runs alongside the static export — see `wrangler.jsonc`'s `main` + `assets` config. Requests that match a static file are served directly; everything else (just `/api/enquiry`) hits the Worker, which validates the payload and writes it to a Cloudflare D1 database (`hillinternational-enquiries`, binding `DB`).

Schema lives in `migrations/` (add a new `NNNN_*.sql` file rather than editing an applied one). **CI does not apply migrations** — the `CLOUDFARE_API_TOKEN` GitHub secret only has Workers permissions, not D1, so a `wrangler d1 migrations apply --remote` step in the workflow fails with a 7403 (and, worse, blocks every subsequent deploy step if left in). Until that token is widened (Cloudflare dashboard → the token's permissions → add "D1 Edit"), apply migrations by hand after adding one: `npx wrangler d1 migrations apply hillinternational-enquiries --remote` (needs a locally authenticated `wrangler`, e.g. `npx wrangler login`).

For local development: `npx wrangler dev` runs the Worker + a local D1 emulation together (`npx wrangler d1 migrations apply hillinternational-enquiries --local` first, once). Plain `next dev` / `next build` + static file serving won't have `/api/enquiry` available, since that only exists inside the Worker runtime.

**Not yet wired up:** email notifications on new enquiries. Submissions are reliably stored in D1, but nobody is notified when one comes in — someone needs to query the database (`npx wrangler d1 execute hillinternational-enquiries --remote --command "SELECT * FROM enquiries ORDER BY created_at DESC"`) to see them. Adding email requires either Cloudflare's own Email Service (needs the site's domain onboarded to Cloudflare DNS) or a third-party sender like Resend/Postmark (needs an account + API key).

## Design tokens

Colours, type scale, spacing and radii follow the handoff's documented tokens (deep teal/ink darks, off-white text, rust/terracotta accents, Inter typeface, pill buttons, glass cards on dark sections, scroll-reveal animation). Tokens are defined as CSS custom properties and utility classes in `src/app/globals.css`, with component-level values as Tailwind arbitrary values.
