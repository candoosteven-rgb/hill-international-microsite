"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { devById, pageDataFor, priceLabelFor, statusMetaFor } from "@/lib/data";
import { autoFacts } from "@/lib/facts";
import { resolveImage, buildShots } from "@/lib/image";
import { resolveLogo } from "@/lib/logo";
import { useLanguage } from "@/lib/i18n";
import Icon from "@/components/Icon";
import { LOCATIONS, type LocationPin } from "@/data/LOCATIONS_MAP";

// Public Mapbox token, inlined at build time (see .github/workflows/deploy.yml
// -> the MAPBOX_TOKEN repo secret). Safe to ship client-side - public tokens
// are meant for this and are restricted by URL in the Mapbox dashboard, not
// by secrecy.
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

function factsFor(devId: string): { k: string; v: string }[] {
  const pd = pageDataFor(devId);
  const d = devById(devId);
  return pd?.facts?.length ? pd.facts : d ? autoFacts(d) : [];
}

function completionFor(devId: string): string | null {
  return factsFor(devId).find((f) => f.k === "f_completion")?.v || null;
}

function homesFor(devId: string): string | null {
  return factsFor(devId).find((f) => f.k === "f_types")?.v || null;
}

// The pin is a rounded square badge with a small downward-pointing
// triangular tail below it, overlapping it by TAIL_OVERLAP px to hide the
// hairline gap the badge's rounded corners would otherwise leave. Mapbox's
// marker `offset` has to shift this whole element up by *half its own
// total rendered height* (badge + tail - the overlap) so the tail's point
// (the part that should mark the real coordinate), not the element's own
// center, lands on the pin's actual lat/lng - not, as a first pass at this
// got wrong, half the badge alone plus the tail, which is only correct if
// the element's center coincides with the badge's own center, and it
// doesn't once the tail adds height below the badge.
const TAIL_OVERLAP = 2;
// Matches the badge's own border-2, so the tail's outline reads as a
// continuation of the same ring rather than a different thickness.
const TAIL_BORDER = 2;
function tailHeightFor(size: number): number {
  return Math.round(size * 0.22);
}
function pinTipOffset(size: number): number {
  return (size + tailHeightFor(size) + TAIL_BORDER - TAIL_OVERLAP) / 2;
}

// The CSS-triangle tail (the border trick: a zero-size box whose
// border-top paints a downward-pointing triangle) can't carry its own
// border the way the badge does, since the "border" is the whole shape -
// so this draws it as two stacked triangles instead: a larger one in the
// current status/active color sitting behind a smaller navy one offset by
// TAIL_BORDER, which reads as a TAIL_BORDER-wide outline around the tail,
// matching the badge's own ring instead of the tail just trailing off in
// plain navy with no outline at all.
function applyTailSize(tailOuterEl: HTMLSpanElement, tailInnerEl: HTMLSpanElement, size: number, color: string) {
  const innerH = tailHeightFor(size);
  const innerHalfWidth = Math.round(size * 0.16);
  const outerH = innerH + TAIL_BORDER;
  const outerHalfWidth = innerHalfWidth + TAIL_BORDER;
  tailOuterEl.style.borderLeft = `${outerHalfWidth}px solid transparent`;
  tailOuterEl.style.borderRight = `${outerHalfWidth}px solid transparent`;
  tailOuterEl.style.borderTop = `${outerH}px solid ${color}`;
  tailInnerEl.style.top = `${TAIL_BORDER}px`;
  tailInnerEl.style.borderLeft = `${innerHalfWidth}px solid transparent`;
  tailInnerEl.style.borderRight = `${innerHalfWidth}px solid transparent`;
  tailInnerEl.style.borderTop = `${innerH}px solid #16313D`;
}

// Builds one map pin as a plain DOM element for Mapbox's native Marker API,
// not a React-rendered/positioned one. Mapbox repositions this element
// itself on every camera move/zoom directly, continuously and without any
// React round-trip - the previous approach (recomputing every pin's
// position via map.project() on each "move" event and pushing it through
// React state) has reportedly left pins visibly desynced from the map (and
// their logos reportedly off-center within the badge) on at least one
// browser in ways this sandbox's Chromium couldn't reproduce or confirm a
// fix for - letting Mapbox own positioning entirely removes that whole
// class of bug rather than patching another guessed-at symptom of it.
function buildPinMarkerElement(opts: {
  ariaLabel: string;
  logo: string | null;
  initial: string;
  forceWhiteLogo: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}): {
  el: HTMLButtonElement;
  badgeEl: HTMLSpanElement;
  tailOuterEl: HTMLSpanElement;
  tailInnerEl: HTMLSpanElement;
  popupAnchorEl: HTMLDivElement;
} {
  // The outer element is the one Mapbox owns and positions via its own
  // transform - app code must never set a transform/rotation on this
  // element itself (a known, already-hit bug: doing so overwrites Mapbox's
  // own positioning transform and the marker jumps to the wrong spot).
  // Left unsized (no fixed width/height, padding/border/margin reset since
  // it's a <button>) so it shrink-wraps exactly around the badge+tail
  // below - which keeps it correctly sized as they resize between the
  // active/inactive states with no extra bookkeeping here, and keeps
  // Mapbox's own anchor="center" calculation (based on this element's
  // bounding box) matching pinTipOffset()'s assumptions about where the
  // badge and tail actually are.
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", opts.ariaLabel);
  el.className = "relative inline-flex flex-col items-center border-0 bg-transparent p-0 m-0 leading-none";

  // The badge itself carries the border, background and shadow/halo - its
  // own box-shadow must stay unclipped for the hover halo to be visible,
  // so the logo's corner-clipping lives on the separate `content` span
  // inside it instead of on badge directly (overflow-hidden on the same
  // element as a box-shadow clips the shadow too, cutting the halo off).
  const badge = document.createElement("span");
  badge.className =
    "block rounded-2xl border-2 transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] h-[60px] w-[60px] shadow-[0_2px_8px_rgba(15,32,39,0.3)]";
  badge.style.background = "#16313D";
  el.appendChild(badge);

  const content = document.createElement("span");
  content.className = "flex h-full w-full items-center justify-center overflow-hidden rounded-2xl";
  badge.appendChild(content);

  // The downward-pointing tail marking the pin's exact coordinate - two
  // stacked CSS triangles (see applyTailSize) so it can carry an outline
  // matching the badge's own border ring. tailWrap's own rendered size is
  // just tailOuter's (a normal-flow child); tailInner is positioned over
  // it absolutely, so it doesn't affect that sizing.
  const tailWrap = document.createElement("span");
  tailWrap.className = "relative block";
  tailWrap.style.marginTop = `-${TAIL_OVERLAP}px`;
  el.appendChild(tailWrap);

  const tailOuter = document.createElement("span");
  tailOuter.className = "block";
  tailOuter.style.width = "0";
  tailOuter.style.height = "0";
  tailWrap.appendChild(tailOuter);

  const tailInner = document.createElement("span");
  tailInner.className = "absolute left-1/2 -translate-x-1/2 block";
  tailInner.style.width = "0";
  tailInner.style.height = "0";
  tailWrap.appendChild(tailInner);

  applyTailSize(tailOuter, tailInner, 60, "#2E86D8");

  if (opts.logo) {
    const img = document.createElement("img");
    img.src = opts.logo;
    img.alt = "";
    img.className = "max-h-[72%] max-w-[72%] object-contain";
    if (opts.forceWhiteLogo) img.style.filter = "brightness(0) invert(1)";
    content.appendChild(img);
  } else {
    const initialEl = document.createElement("span");
    initialEl.className = "text-[25px] font-bold text-white/85";
    initialEl.textContent = opts.initial;
    content.appendChild(initialEl);
  }

  // Where the hover PreviewCard portals in (see LocationsMap) - a plain
  // child of the marker's own element, so Mapbox carries it along with the
  // marker automatically with no position syncing of our own needed. The
  // vertical translate is set imperatively (not via a Tailwind class) so
  // LocationsMap's hover-position effect can flip it below the pin near
  // the top edge of the viewport without fighting a class-driven transform.
  // Anchored to this element's own top (the badge's top edge, since the
  // badge is flush against it) rather than some fraction of a fixed outer
  // box, so it stays correct regardless of the badge/tail's current size.
  const popupAnchor = document.createElement("div");
  popupAnchor.className = "absolute left-1/2 top-0";
  popupAnchor.style.transform = "translate(-50%, -100%)";
  el.appendChild(popupAnchor);

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    opts.onClick();
  });
  el.addEventListener("mouseenter", opts.onMouseEnter);
  el.addEventListener("mouseleave", opts.onMouseLeave);

  return { el, badgeEl: badge, tailOuterEl: tailOuter, tailInnerEl: tailInner, popupAnchorEl: popupAnchor };
}

// Hover (mouse) shows this instantly; a tap/click on touch shows it too and
// keeps it open regardless of subsequent pointer movement - neither input
// depends on the other.
function PreviewCard({
  pin,
  onOpen,
  cardRef,
}: {
  pin: LocationPin;
  onOpen: (id: string) => void;
  cardRef?: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useLanguage();
  const d = devById(pin.id);
  if (!d) return null;

  const status = statusMetaFor(d, t);
  const price = priceLabelFor(d, t);
  const completion = completionFor(d.id);
  const hero = resolveImage(buildShots(d)[0], d.name);

  return (
    <div
      ref={cardRef}
      // text-left overrides the browser's default <button> UA style
      // (text-align: center), which otherwise cascades down into this
      // card since it's portaled as a DOM descendant of the pin's own
      // <button> marker element - the actual bug behind "some tiles are
      // centered, some are left" (DevModal/DevStripCard aren't inside a
      // button, so they were never affected).
      className="hi-float w-[280px] origin-bottom overflow-hidden rounded-[16px] bg-white text-left shadow-[0_12px_32px_rgba(15,32,39,0.28)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={hero} alt={d.name} className="h-[130px] w-full object-cover" />
      <div className="p-4">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <div className="text-[15px] font-bold tracking-tight text-[#1F3A47]">{d.name}</div>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>
        <div className="mb-3 text-[12px] text-[#8B979C]">{d.locationLabel || d.region}</div>

        <div className="mb-3.5 grid grid-cols-2 gap-x-3 gap-y-2">
          <div>
            {/* priceLabelFor() already returns a full, self-describing
                string for a real price ("From £x", "£x – £y") but also for
                the no-price-yet cases ("Price on request", "Coming soon",
                "About to launch") - a fixed "Price from" label above it
                read wrong for those. gbp() always prefixes "£" regardless
                of locale, so that's a reliable way to show the label only
                when there's an actual number under it. */}
            {price.includes("£") && (
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8B979C]">Price from</div>
            )}
            <div className="text-[13px] font-bold text-[#1F3A47]">{price}</div>
          </div>
          {completion && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8B979C]">Completion</div>
              <div className="text-[13px] font-bold text-[#1F3A47]">{completion}</div>
            </div>
          )}
        </div>

        {pin.external ? (
          <button
            type="button"
            onClick={() => onOpen(pin.id)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C1560F]"
          >
            Open development
            <Icon name="arrowRight" className="h-3 w-3" />
          </button>
        ) : (
          <Link href={pin.href} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C1560F]">
            Open development
            <Icon name="arrowRight" className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

// Tap/click on a pin or list row opens this - a centered popover fixed over
// the whole viewport (never anchored to the pin, so it can never land
// off-screen or "below the fold" regardless of where on the map that pin
// sits or how short the map is on a small screen), styled and animated
// exactly like the main site's CompareModal/DevCard (hi-fade backdrop,
// hi-pop card, hero + overlaid pills, rust price).
function DevModal({ pin, onClose, onOpen }: { pin: LocationPin; onClose: () => void; onOpen: (id: string) => void }) {
  const { t } = useLanguage();
  const d = devById(pin.id);
  if (!d) return null;

  const status = statusMetaFor(d, t);
  const price = priceLabelFor(d, t);
  const completion = completionFor(d.id);
  const homes = homesFor(d.id);
  const hero = resolveImage(buildShots(d)[0], d.name);

  const openDevelopment = () => {
    if (pin.external) onOpen(pin.id);
    onClose();
  };

  return (
    <div
      className="hi-fade fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6"
      style={{ background: "rgba(15,25,30,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="hi-pop relative max-h-[88vh] w-full max-w-[380px] overflow-y-auto rounded-[18px] bg-white shadow-[0_24px_60px_rgba(15,32,39,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1F3A47] shadow-[0_2px_8px_rgba(15,32,39,0.25)]"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>

        <div className="relative h-[180px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt={d.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-3.5 top-3.5 flex items-start gap-2">
            <span className="inline-flex min-w-0 items-start gap-1.5 rounded-full bg-[rgba(31,58,71,0.85)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              <Icon name="pin" className="mt-0.5 h-2.5 w-2.5 flex-none" />
              <span>{d.locationLabel || d.region}</span>
            </span>
            <span
              className="inline-flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.isLive && <span className="hi-pulse h-1.5 w-1.5 flex-none rounded-full bg-[#7CFFB2]" />}
              {status.label}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="mb-1.5 text-[19px] font-bold leading-tight tracking-tight text-[#1F3A47]">{d.name}</h3>
          <bdi className="mb-4 block text-[16px] font-bold tracking-tight text-[#C1560F]">{price}</bdi>

          <div className="grid grid-cols-2 gap-x-3 gap-y-3 border-t border-[#E3E9EC] pt-4">
            {homes && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8B979C]">Homes</div>
                <div className="text-[13.5px] font-semibold text-[#1F3A47]">{homes}</div>
              </div>
            )}
            {completion && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8B979C]">Completion</div>
                <div className="text-[13.5px] font-semibold text-[#1F3A47]">{completion}</div>
              </div>
            )}
          </div>

          <div className="mt-5 -mx-5 -mb-5 flex items-center justify-between gap-3 rounded-b-[18px] border-t border-[#BCCDD7] bg-[#D2DFE6] px-5 py-4">
            {pin.external ? (
              <button
                type="button"
                onClick={openDevelopment}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#28567A]"
              >
                Open development <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link href={pin.href} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#28567A]">
                Open development <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// A single branded card in the bottom "all developments" strip - logo on a
// dark tile (falling back to a styled name if the development has no logo
// asset yet), name and location below. Selecting a card does exactly what
// selecting its pin or list row does, via the same `select` handler.
function DevStripCard({
  pin,
  active,
  onSelect,
  onHover,
}: {
  pin: LocationPin;
  active: boolean;
  onSelect: () => void;
  onHover: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { t } = useLanguage();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [heroBroken, setHeroBroken] = useState(false);
  // The image tag is already in the static HTML, so the browser can start
  // (and fail) loading it before React hydrates and attaches `onError` -
  // catches that race on mount, same as a normal post-hydration failure.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth === 0) setHeroBroken(true);
  }, []);

  const d = devById(pin.id);
  if (!d) return null;
  const logo = resolveLogo(d.logo, d.name);
  const price = priceLabelFor(d, t);
  const hero = resolveImage(buildShots(d)[0], d.name);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      onMouseEnter={() => onHover(pin.id)}
      onMouseLeave={() => onHover((cur) => (cur === pin.id ? null : cur))}
      className="group relative h-[216px] w-[192px] flex-none snap-start overflow-hidden rounded-[16px] text-left transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-1.5 hover:scale-[1.015]"
      style={{
        boxShadow: active ? "0 10px 26px rgba(193,86,15,0.4)" : "0 6px 18px rgba(15,32,39,0.22)",
        outline: active ? "2.5px solid #C1560F" : "2.5px solid transparent",
        outlineOffset: "-2.5px",
      }}
    >
      {heroBroken ? (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(158deg,#27454F 0%,#162C35 62%,#101F26 100%)" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={hero}
          alt=""
          onError={() => setHeroBroken(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(15,32,39,0.05) 0%, rgba(15,32,39,0.2) 45%, rgba(15,32,39,0.92) 100%)",
        }}
      />
      {/* A diagonal scrim anchored top-left guarantees contrast for the logo
          against any photo (bright sky, pale render, whatever), rather than
          leaving it to sit directly on unpredictable image content - with a
          faint sheen along its edge for a touch of polish. */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(15,32,39,0.9) 0%, rgba(15,32,39,0.55) 28%, rgba(15,32,39,0.2) 42%, transparent 58%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(120deg, transparent 42%, rgba(255,255,255,0.16) 50%, transparent 60%)" }}
      />

      {logo && (
        // Canalside Quarter's wordmark (a wide ~4:1 logo) reads perfectly at
        // max-w-[130px] alone, since its own height naturally falls well
        // under any reasonable cap. Square/badge-shaped logos (Lampton
        // Parkside, Kew Bridge Rise, North Gate Park) need real height
        // headroom to reach that same ~130px footprint, or a shared
        // height-only cap leaves them tiny next to the wide ones - so this
        // caps width first (matching Canalside's size) and gives height
        // plenty of room to follow from that, up to the point it would
        // start crowding the card's bottom text block.
        <div className="absolute inset-x-3.5 top-3.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt=""
            className="max-h-[90px] max-w-[130px] object-contain object-left"
            style={PIN_LOGO_NEEDS_WHITE.has(pin.id) ? { filter: "brightness(0) invert(1)" } : undefined}
          />
        </div>
      )}

      <div className="absolute inset-x-3.5 bottom-3.5">
        <div className="truncate text-[14px] font-bold text-white">{d.name}</div>
        <div className="mb-1.5 truncate text-[11px] text-white/65">{d.locationLabel || d.region}</div>
        <div className="truncate text-[12.5px] font-bold text-[#C98A6B]">{price}</div>
      </div>
    </button>
  );
}

// Only live developments are shown on this page - computed once at module
// scope since it doesn't depend on component state.
const LIVE_LOCATIONS = LOCATIONS.filter((p) => devById(p.id)?.status === "live");

// These developments' logo files are dark navy wordmarks, unlike everyone
// else's (already white/light) - unreadable against this page's dark pin
// fill and strip-tile scrim without forcing them white.
const PIN_LOGO_NEEDS_WHITE = new Set(["fitzwilliam-gate", "city-reach", "little-chalfont-park", "barnet"]);

export default function LocationsMap() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openDev, setOpenDev] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const scrollStrip = (dir: 1 | -1) => stripRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<
    Record<
      string,
      {
        marker: mapboxgl.Marker;
        badgeEl: HTMLSpanElement;
        tailOuterEl: HTMLSpanElement;
        tailInnerEl: HTMLSpanElement;
        popupAnchorEl: HTMLDivElement;
      }
    >
  >({});
  // Flips true once markers exist, purely so the hover-preview portal below
  // (which reads markersRef, a ref - not itself a trigger for re-rendering)
  // has a reason to re-render and pick them up.
  const [markersReady, setMarkersReady] = useState(false);
  // React flags reading a ref's value during render as unsafe, so this
  // mirrors the hovered pin's own popup-anchor DOM node (read from
  // markersRef) into state from an effect instead of reading markersRef
  // directly in the JSX below.
  const [hoverAnchorEl, setHoverAnchorEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    setHoverAnchorEl(hovered ? (markersRef.current[hovered]?.popupAnchorEl ?? null) : null);
  }, [hovered, markersReady]);
  // Near a map edge, the hover PreviewCard's default position (centered
  // above the pin) can push it off-screen - clipped by the browser
  // viewport, not just the map. Rather than pan the map on every hover
  // (distracting, and the map's framing is otherwise deliberate), this
  // measures the card after it mounts and nudges it back into view:
  // flipping it below the pin when there's no room above, and shifting it
  // horizontally when it would overhang the left/right edge. Applied as
  // direct DOM mutations via refs (the same pattern the active-pin effect
  // below uses on badgeEl) rather than React state, since these are purely
  // cosmetic nudges to elements outside hovered/the ids this re-renders on.
  const previewCardRef = useRef<HTMLDivElement | null>(null);
  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hovered) return;
    let cancelled = false;
    let raf = 0;
    Object.entries(markersRef.current).forEach(([id, { popupAnchorEl }]) => {
      if (id !== hovered) return;
      const anchorEl = popupAnchorEl;
      const card = previewCardRef.current;
      const wrap = previewWrapRef.current;
      if (!card || !wrap) return;
      // Reset to the default "above, centered" position first so a
      // flipped/shifted previous card doesn't flash in the wrong spot for
      // a frame while this one is being measured.
      anchorEl.style.transform = "translate(-50%, -100%)";
      wrap.style.transform = "";
      card.classList.remove("origin-top");
      card.classList.add("origin-bottom");
      raf = requestAnimationFrame(() => {
        if (cancelled) return;
        const rect = card.getBoundingClientRect();
        const margin = 12;
        const flipBelow = rect.top < margin;
        let shiftX = 0;
        if (rect.right > window.innerWidth - margin) shiftX -= rect.right - (window.innerWidth - margin);
        if (rect.left + shiftX < margin) shiftX += margin - (rect.left + shiftX);
        anchorEl.style.transform = flipBelow ? "translate(-50%, 28px)" : "translate(-50%, -100%)";
        wrap.style.transform = shiftX ? `translateX(${shiftX}px)` : "";
        if (flipBelow) {
          card.classList.remove("origin-bottom");
          card.classList.add("origin-top");
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    // hoverAnchorEl (not just hovered) is a dependency because the portal
    // this measures only mounts once it's set - one render after hovered
    // changes - so previewCardRef/previewWrapRef aren't populated yet on
    // the render where hovered itself changes.
  }, [hovered, hoverAnchorEl]);
  // Surfaced directly on the page (not just the console) so a non-technical
  // visitor - or whoever is debugging a deploy - can see exactly why the
  // basemap didn't render without needing DevTools.
  const [mapError, setMapError] = useState<string | null>(null);

  // Hover gives mouse users an instant at-pin glance; a tap/click opens the
  // full centered popover (DevModal) independently of hover, so touch users
  // (who never fire hover) still get the same result from a tap.
  const active = hovered ?? selected;
  const openPin = LIVE_LOCATIONS.find((p) => p.id === openDev) || null;
  const openDevData = openPin ? devById(openPin.id) : null;
  const selectedPin = LIVE_LOCATIONS.find((p) => p.id === selected) || null;

  // Selecting a pin (from the map, the strip, or the modal) also dives the
  // camera toward it - the whole point of a real map over the old
  // illustrated one is that a dense cluster can be zoomed into instead of
  // just visually overlapping.
  const select = (id: string) => {
    setSelected((cur) => (cur === id ? cur : id));
    const pin = LIVE_LOCATIONS.find((p) => p.id === id);
    const map = mapRef.current;
    if (pin && map) map.flyTo({ center: [pin.lng, pin.lat], zoom: Math.max(map.getZoom(), 13), duration: 700 });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-0.9, 51.9],
      zoom: 6.2,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    // Once the map has rendered successfully at least once, a later error
    // (e.g. one stray tile request failing on a pan/zoom - normal, usually
    // transient, and non-fatal on a live map) shouldn't park a permanent red
    // banner over an otherwise-working map. Only surface it visibly before
    // that first successful render, when it likely means the map never came
    // up at all - always still logged to the console either way.
    let hasLoadedOnce = false;
    map.on("load", () => {
      hasLoadedOnce = true;
    });
    map.on("error", (e) => {
      const msg = e?.error?.message || String(e?.error || e);
      if (!hasLoadedOnce) setMapError(msg);
      console.error("[Mapbox error]", e?.error || e);
    });

    // Pins are Mapbox's own native markers (plain DOM elements it
    // repositions itself on every camera move/zoom, continuously and
    // directly) rather than React-rendered elements kept in sync by
    // recomputing map.project() on every "move" event through React state -
    // that approach has reportedly left pins visibly desynced from the map
    // on at least one browser, in ways this sandbox's Chromium couldn't
    // reproduce to debug further. Letting Mapbox own positioning entirely,
    // the same way it owns its own attribution/zoom controls, removes that
    // whole class of bug rather than patching another guessed-at symptom.
    LIVE_LOCATIONS.forEach((pin) => {
      const d = devById(pin.id);
      if (!d) return;
      const status = statusMetaFor(d, t);
      const { el, badgeEl, tailOuterEl, tailInnerEl, popupAnchorEl } = buildPinMarkerElement({
        ariaLabel: d.name,
        logo: resolveLogo(d.logo, d.name),
        initial: d.name.charAt(0),
        forceWhiteLogo: PIN_LOGO_NEEDS_WHITE.has(pin.id),
        onClick: () => select(pin.id),
        onMouseEnter: () => setHovered(pin.id),
        onMouseLeave: () => setHovered((cur) => (cur === pin.id ? null : cur)),
      });
      badgeEl.style.borderColor = status.dot;
      applyTailSize(tailOuterEl, tailInnerEl, 60, status.dot);
      const marker = new mapboxgl.Marker({ element: el, anchor: "center", offset: [0, -pinTipOffset(60)] })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
      markersRef.current[pin.id] = { marker, badgeEl, tailOuterEl, tailInnerEl, popupAnchorEl };
    });
    setMarkersReady(true);

    // fitBounds needs the container's real, laid-out size - calling it right
    // after construction can catch the container still at 0 height (CSS
    // aspect-ratio not yet resolved), where any padding is "impossible" and
    // Mapbox logs a warning and leaves its camera transform broken, which
    // silently blocks all further tile rendering. So this only runs once the
    // container reports a real size (checked eagerly, then retried from the
    // resize observer below if it wasn't ready yet), with padding capped to
    // what that size can actually fit.
    let didFitBounds = false;
    const fitInitialBounds = () => {
      if (didFitBounds || !LIVE_LOCATIONS.length || !mapContainerRef.current) return;
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      if (width < 40 || height < 40) return;
      didFitBounds = true;
      const bounds = new mapboxgl.LngLatBounds();
      LIVE_LOCATIONS.forEach((p) => bounds.extend([p.lng, p.lat]));
      const padding = Math.max(8, Math.min(64, width / 4, height / 4));
      map.fitBounds(bounds, { padding, maxZoom: 11, duration: 0 });
    };
    fitInitialBounds();

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
      fitInitialBounds();
    });
    resizeObserver.observe(mapContainerRef.current);

    mapRef.current = map;
    return () => {
      resizeObserver.disconnect();
      Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflects which pin is active (hovered/selected) on the marker badges
  // already built above - their own color/size/stacking, never the
  // Mapbox-owned outer marker element's position/transform.
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, { marker, badgeEl, tailOuterEl, tailInnerEl }]) => {
      const isActive = active === id;
      const size = isActive ? 80 : 60;
      badgeEl.className = `block rounded-2xl border-2 transition-all duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
        isActive
          ? "h-20 w-20 shadow-[0_6px_16px_rgba(193,86,15,0.45),0_0_0_10px_rgba(193,86,15,0.22)]"
          : "h-[60px] w-[60px] shadow-[0_2px_8px_rgba(15,32,39,0.3)]"
      }`;
      const d = devById(id);
      const color = isActive ? "#C1560F" : d ? statusMetaFor(d, t).dot : "#2E86D8";
      badgeEl.style.borderColor = color;
      applyTailSize(tailOuterEl, tailInnerEl, size, color);
      marker.setOffset([0, -pinTipOffset(size)]);
      marker.getElement().style.zIndex = isActive ? "50" : "0";
    });
  }, [active, t]);

  return (
    <div className="mx-auto w-full px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5" style={{ maxWidth: 1440 }}>
      {/* All-developments strip - doubles as the list of developments,
          since a sidebar list duplicating it added nothing the map doesn't
          already show. Kept visually unchanged (card size, logo fitting -
          both tuned carefully per logo) and only tightened the whitespace
          around it, so the strip and map fit together without scrolling on
          a typical viewport instead of needing the map scrolled into view
          separately. */}
      <div className="relative mb-5">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollStrip(-1)}
          className="absolute -left-5 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_8px_20px_rgba(15,32,39,0.4)] transition-transform hover:scale-110"
          style={{ top: 108, background: "#16313D" }}
        >
          <Icon name="chevronLeft" className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollStrip(1)}
          className="absolute -right-5 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_8px_20px_rgba(15,32,39,0.4)] transition-transform hover:scale-110"
          style={{ top: 108, background: "#16313D" }}
        >
          <Icon name="chevronRight" className="h-5 w-5" />
        </button>
        <div ref={stripRef} className="hi-scroller flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {LIVE_LOCATIONS.map((pin) => (
            <DevStripCard
              key={pin.id}
              pin={pin}
              active={active === pin.id}
              onSelect={() => select(pin.id)}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>

      {/* Classic padding-bottom-percentage aspect ratio (sized off this
          element's own width, not the newer `aspect-ratio` property -
          either works for this box itself). Shortened from 53.07% so the
          strip above and this map together fit inside a typical viewport
          without needing to scroll past the strip to see the whole map. */}
      <div className="relative w-full" style={{ paddingBottom: "38%", minHeight: 320 }}>
        <div
          ref={mapContainerRef}
          className="overflow-hidden rounded-[22px] border border-[#E3E9EC] bg-[#F0ECE6]"
          // Mapbox GL adds its own `mapboxgl-map` class to this exact element
          // once it mounts, and that class's own stylesheet sets
          // `position: relative` - overriding Tailwind's `absolute` utility
          // class (a plain CSS cascade/specificity fight, same-specificity
          // selectors, Mapbox's loads later) and silently making `inset-0`
          // inert, which collapsed this div to its 2px border-only height
          // with no visible background/border (confirmed live via measured
          // getBoundingClientRect: 1376x2). An inline style always wins
          // over any class, so set position/inset here instead.
          style={{ position: "absolute", inset: 0 }}
        />

        {!MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[22px] border border-[#E3E9EC] bg-[#F5F5F7] p-8 text-center">
            <div className="text-[14px] font-semibold text-[#1F3A47]">Map unavailable</div>
            <div className="max-w-[320px] text-[13px] text-[#6E7B80]">
              Set the NEXT_PUBLIC_MAPBOX_TOKEN build secret to enable the live map.
            </div>
          </div>
        )}

        {mapError && (
          <div className="pointer-events-none absolute inset-x-3 top-3 z-[60] rounded-[10px] border border-[#E8A0A0] bg-[#FDECEC] px-3.5 py-2.5 text-[12.5px] font-medium text-[#8A2E2E] shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
            Map error: {mapError}
          </div>
        )}

        {/* The hover PreviewCard portals into a DOM node that's a child of
            the hovered pin's own Mapbox marker element (built in the mount
            effect above), so it's carried along by Mapbox's own marker
            positioning automatically - no separate position syncing of our
            own needed, the same reasoning as the pins themselves. */}
        {hovered &&
          selected !== hovered &&
          hoverAnchorEl &&
          createPortal(
            <div ref={previewWrapRef} style={{ perspective: 800 }}>
              <PreviewCard
                pin={LIVE_LOCATIONS.find((p) => p.id === hovered)!}
                onOpen={setOpenDev}
                cardRef={previewCardRef}
              />
            </div>,
            hoverAnchorEl
          )}

        {selectedPin && <DevModal pin={selectedPin} onClose={() => setSelected(null)} onOpen={setOpenDev} />}
      </div>

      {/* Hill shell for external vendor experiences - keeps the buyer on
          hill-intl.com (persistent back bar) instead of handing the
          presentation over to another host's address bar/navigation. */}
      {openPin && openDevData && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white">
          <div
            className="flex flex-none items-center gap-4 px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            style={{ background: "rgba(18,34,45,0.96)", backdropFilter: "blur(14px)" }}
          >
            <button
              type="button"
              onClick={() => setOpenDev(null)}
              className="hi-pill inline-flex flex-none items-center gap-2 rounded-full border border-white/25 bg-white/8 px-4 py-2 text-[13.5px] font-semibold text-white"
            >
              <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" />
              Back to all locations
            </button>
            <span className="truncate text-[15px] font-bold text-white">{openDevData.name}</span>
          </div>
          <iframe src={openPin.href} title={openDevData.name} className="w-full flex-1 border-none" />
        </div>
      )}
    </div>
  );
}
