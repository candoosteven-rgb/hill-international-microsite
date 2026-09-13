---
name: apple-design
description: Apple-style design principles (clarity, deference, depth) and a concrete review checklist for this site's UI work, grounded in this repo's actual Tailwind tokens and conventions. Use this whenever styling or reviewing a component, picking spacing/color/type, adding a pill/badge/card/modal, adding motion or animation, or judging whether a UI change "looks right" - even if the user doesn't say "design" or "Apple" explicitly (e.g. "make this stand out more", "this feels cluttered", "tighten up the spacing", "add a hover state"). Do NOT use this for content/copy decisions, data/backend logic, or deployment - it's about visual and interaction design only.
---

# Apple-style design principles for this site

Apple's Human Interface Guidelines boil down to three tenets that transfer well to any UI, including a real-estate marketing microsite like this one:

- **Clarity** — text is legible at every size, icons are precise, and every element earns its place. Negative space isn't empty, it's what makes the content readable.
- **Deference** — the UI's job is to help people see the homes and act (register interest, browse a gallery), not to show off the UI. Color, chrome, and effects support that content instead of competing with it.
- **Depth** — layering and motion should communicate structure (this is above that, this leads to that), not decorate for its own sake.

Read these as a lens for judging a design decision, not a checklist to blindly satisfy. When a user asks for something that cuts against a tenet (e.g. "make it huge and neon"), do what they ask — this skill is for the many cases where the request is open-ended ("make this stand out", "clean this up") and you're filling in the specifics.

## This repo's existing language

Before inventing something new, match what's already here — consistency beats novelty on a site like this.

**Color** (`src/app/globals.css` `:root`, and used ad-hoc via Tailwind arbitrary values throughout `src/components/`):
- Ink scale: `#0e2028` (950) → `#1f3a47` (600, most-used body/heading color) for dark surfaces and text
- `#f9f5f3` off-white for text/backgrounds on dark surfaces
- `#c1560f` (rust) — the one saturated accent, reserved for primary CTAs and "act now" moments (register/submit buttons, required-field markers use a softer `#e6a98c` derivative)
- `#c98a6b` (terracotta) and `#6fa8d6` (blue) — secondary accents, used sparingly (icons, live-status pill)
- A pale/translucent version of a color (e.g. `rgba(201,138,107,0.2)`) reads as a *quiet* state (coming-soon); a solid fill reads as an *active* one (live, primary CTA) — pick deliberately, don't default to translucent just because it looks "softer"

**Type**: Inter throughout, with `-apple-system` in the fallback stack (`body { font-family: var(--font-inter), Inter, -apple-system, sans-serif; }`). Headings use tight letter-spacing (`-0.03em` to `-0.045em`) and `clamp()` for fluid sizing (e.g. `clamp(21px,4.5vw,55px)`) — prefer `clamp()` over fixed breakpoint jumps for anything hero-sized.

**Shape**: pills (`rounded-full`) for statuses, tags, and buttons; large radii (`rounded-[18px]` to `rounded-[32px]`) for cards and panels. Don't introduce a new radius value without a reason — pick from what's already in the component you're near.

**Motion** (`globals.css` keyframes `hi-rise`, `hi-pop`, `hi-fade`, `hi-pulse`, `hi-check`): everything uses `cubic-bezier(0.2, 0.7, 0.2, 1)` — a fast-out, gentle-settle curve — at 0.22–0.7s. Reuse these keyframes/classes before writing a new animation; a new easing curve or duration will feel inconsistent even if no one can say why.

**Reduced motion**: `globals.css` has a `@media (prefers-reduced-motion: reduce)` block, and `Trust.tsx`'s count-up hook checks `window.matchMedia("(prefers-reduced-motion: reduce)")` before animating. Any new non-trivial animation (counting, parallax, auto-playing carousels) needs the same guard — either the CSS media query (for pure-CSS animation) or the JS check (for animation driven by state/RAF).

## Practical checklist

Run through this when writing or reviewing a UI change:

**Clarity**
- [ ] Is there one clear focal point, or is everything competing for attention? (e.g. don't add a shadow, a bright color, *and* a badge to the same element unless it's genuinely the single most important thing on screen)
- [ ] Does text have enough contrast against its background at both normal and hover/pressed states? On a photo or gradient background, is there a scrim/overlay guaranteeing legibility, or are you trusting the photo to always be dark/light enough?
- [ ] Are icons paired with text (or at minimum an `aria-label`) rather than standing alone unlabeled?

**Deference**
- [ ] Does this element's visual weight match its actual importance? A secondary action (e.g. "Compare") should not out-shout the primary one (e.g. "Register interest").
- [ ] Is color used to mean something (status, primary action) rather than just decoration? If you're reaching for the rust accent, ask whether this is really the one thing per screen that should pull the eye.
- [ ] Would removing this border/shadow/background actually hurt legibility, or is it just visual noise inherited from a template?

**Depth**
- [ ] Do overlapping/floating elements (sticky nav, modals, the "Want to know more?" panel) have a shadow and z-index that make their stacking order obvious at a glance?
- [ ] Is motion used to explain a state change (something opening, something confirming) rather than just for flourish? If you'd struggle to explain in one sentence *why* something animates, reconsider it.
- [ ] Are blur/scrim effects (gradient overlays on hero images, the nav's backdrop-blur) consistent in strength with similar effects elsewhere on the page?

**Consistency**
- [ ] Did you reuse an existing color/radius/spacing/animation value from a nearby component before inventing a new one?
- [ ] If this is a status/label pill, does it follow the existing pattern (solid fill + white text for "active/important" states, as the Live pill uses; translucent for "quiet" states)?
- [ ] Does this component behave the same way in all four languages (EN/TR/ZH/AR), including RTL for Arabic (`[dir="rtl"]` flips text-align — check anything using directional icons like arrows)?

**Accessibility**
- [ ] Tap targets: interactive elements (buttons, checkboxes, links) should be comfortably tappable — this codebase already bumped form checkboxes to 18×18px because the browser default was too small; apply the same bar (roughly 18px minimum for a bare control, larger if it's the only hit target) to anything new.
- [ ] Focus states: can someone tab to this control and see where focus is? Don't remove a `:focus` outline without providing a visible replacement.
- [ ] Motion: does anything auto-playing (carousels, count-ups, parallax) respect `prefers-reduced-motion`?
- [ ] Color contrast: is body text at least ~4.5:1 against its background, and large/bold text at least ~3:1? Pale washes (like the old Live pill background) are the usual place this breaks — check contrast whenever background opacity is under ~30%.

**Restraint** (the fastest way to violate "deference")
- [ ] Could this be done with one visual change instead of three? (E.g. "make it stand out" was solved here with a solid fill + one shadow — not a solid fill + a shadow + a border + a larger size + a new color.)
- [ ] Are you adding a new shadow/gradient/animation because the design calls for it, or because it's easy to add? When in doubt, ship the simpler version and see if anything actually feels missing.
