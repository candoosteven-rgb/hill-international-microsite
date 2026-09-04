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

## Known gap: imagery

The design handoff's local `uploads/...` image references were not included in the asset bundle (see the handoff's own README: *"should be re-sourced as owned assets/CDN in production, not hotlinked"*). Two kinds of image sources exist in the data:

- **Hotlinked absolute URLs** (`hill.co.uk`, `millerhare.com`, Twemoji flag CDN) — used as-is.
- **Local-only `uploads/...` paths** — no source file exists for these, so `src/lib/image.ts` renders a deterministic brand-coloured placeholder (an inline SVG, no network request) instead of a broken image.

Before shipping, swap `resolveImage()`/`placeholderFor()` calls for real, owned assets (ideally served from a CMS or CDN) using the same `uploads/...` paths as keys.

## Design tokens

Colours, type scale, spacing and radii follow the handoff's documented tokens (deep teal/ink darks, off-white text, rust/terracotta accents, Inter typeface, pill buttons, glass cards on dark sections, scroll-reveal animation). Tokens are defined as CSS custom properties and utility classes in `src/app/globals.css`, with component-level values as Tailwind arbitrary values.
