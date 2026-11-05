"use client";

import { useEffect, useRef, useState } from "react";
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

// A real, pannable/zoomable Mapbox GL map. Markers are plain DOM elements
// (Mapbox's own marker API, not React) since Mapbox owns their positioning
// as the map moves; clicking one drives the same `onSelect` state as a list
// row or strip card, and hovering shows a lightweight native Mapbox popup
// (so it repositions correctly on pan/zoom, which a React-positioned card
// anchored by CSS percentages could never do on a real map).
function MapboxMap({
  locations,
  activeId,
  hoveredId,
  selectedId,
  onSelect,
  onHover,
}: {
  locations: LocationPin[];
  activeId: string | null;
  hoveredId: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onHover: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Mount the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-0.9, 51.9],
      zoom: 6.2,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    if (locations.length) {
      const bounds = new mapboxgl.LngLatBounds();
      locations.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 56, maxZoom: 11, duration: 0 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Intentionally mount-only - `locations` only used for the initial fit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Re)build one marker per pin whenever the pin set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locations.forEach((pin, i) => {
      const d = devById(pin.id);
      if (!d) return;
      const status = statusMetaFor(d, t);

      // Mapbox sets its own positioning transform directly on the element
      // passed to Marker - this outer button must never have its own
      // transform touched, or it'll jump off its lng/lat. A 44px tap target
      // (WCAG minimum) around a visually smaller badge, same pattern as the
      // rest of the site's pins; the active-state scale/color lives on the
      // inner span instead.
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", d.name);
      el.className = "flex h-11 w-11 cursor-pointer items-center justify-center";

      const badge = document.createElement("span");
      badge.className =
        "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(15,32,39,0.25)] transition-transform duration-200";
      badge.style.background = status.dot;
      badge.textContent = String(i + 1);
      el.appendChild(badge);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelect(pin.id);
      });
      el.addEventListener("mouseenter", () => onHover(pin.id));
      el.addEventListener("mouseleave", () => onHover((cur) => (cur === pin.id ? null : cur)));

      markersRef.current[pin.id] = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // Reflect active (hovered ?? selected) styling on the marker badges - the
  // inner span only, never the outer element Mapbox positions (see above).
  useEffect(() => {
    locations.forEach((pin) => {
      const marker = markersRef.current[pin.id];
      if (!marker) return;
      const badge = marker.getElement().firstElementChild as HTMLElement | null;
      if (!badge) return;
      const d = devById(pin.id);
      const status = d ? statusMetaFor(d, t) : null;
      const isActive = activeId === pin.id;
      badge.style.background = isActive ? "#C1560F" : status?.dot || "#2E86D8";
      badge.style.transform = isActive ? "scale(1.3)" : "scale(1)";
    });
  }, [activeId, locations, t]);

  // A hover (from the marker itself, a list row or a strip card) shows a
  // lightweight popup pinned to that pin's real map coordinate - never when
  // it's the tap/click-selected pin, since that already opens the full
  // DevModal instead.
  useEffect(() => {
    const map = mapRef.current;
    popupRef.current?.remove();
    popupRef.current = null;
    if (!map || !hoveredId || hoveredId === selectedId) return;

    const pin = locations.find((p) => p.id === hoveredId);
    const d = pin ? devById(pin.id) : null;
    if (!pin || !d) return;
    const status = statusMetaFor(d, t);
    const price = priceLabelFor(d, t);

    const node = document.createElement("div");
    node.className = "hi-pop min-w-[190px] rounded-[14px] bg-white p-3.5 shadow-[0_12px_32px_rgba(15,32,39,0.28)]";
    node.innerHTML = `
      <div class="mb-1 flex flex-wrap items-center gap-2">
        <div class="text-[14px] font-bold tracking-tight text-[#1F3A47]">${d.name}</div>
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold" style="background:${status.bg};color:${status.color}">${status.label}</span>
      </div>
      <div class="text-[12px] text-[#8B979C]">${d.locationLabel || d.region}</div>
      <div class="mt-2 text-[13px] font-bold text-[#C1560F]">${price}</div>
    `;

    popupRef.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 16 })
      .setLngLat([pin.lng, pin.lat])
      .setDOMContent(node)
      .addTo(map);
  }, [hoveredId, selectedId, locations, t]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[22px] bg-[#F5F5F7] p-8 text-center">
        <div className="text-[14px] font-semibold text-[#1F3A47]">Map unavailable</div>
        <div className="max-w-[320px] text-[13px] text-[#6E7B80]">
          Set the NEXT_PUBLIC_MAPBOX_TOKEN build secret to enable the live map.
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
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
  const d = devById(pin.id);
  if (!d) return null;
  const logo = resolveLogo(d.logo, d.name);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      onMouseEnter={() => onHover(pin.id)}
      onMouseLeave={() => onHover((cur) => (cur === pin.id ? null : cur))}
      className="hi-pill flex w-[168px] flex-none snap-start flex-col overflow-hidden rounded-[14px] text-left transition-transform duration-200"
      style={{
        background: active ? "#C1560F" : "#16313D",
        boxShadow: active ? "0 8px 20px rgba(193,86,15,0.35)" : "0 4px 14px rgba(15,32,39,0.18)",
      }}
    >
      <div className="flex h-[76px] items-center justify-center px-4">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="max-h-11 max-w-[130px] object-contain" />
        ) : (
          <span className="text-center text-[15px] font-bold leading-tight text-white">{d.name}</span>
        )}
      </div>
      <div className="border-t border-white/12 px-3.5 py-3">
        <div className="truncate text-[12.5px] font-bold text-white">{d.name}</div>
        <div className="truncate text-[11px] text-white/60">{d.locationLabel || d.region}</div>
      </div>
    </button>
  );
}

// Only live developments are shown on this page - computed once at module
// scope since it doesn't depend on component state.
const LIVE_LOCATIONS = LOCATIONS.filter((p) => devById(p.id)?.status === "live");

export default function LocationsMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openDev, setOpenDev] = useState<string | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const scrollStrip = (dir: 1 | -1) => stripRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  // Hover gives mouse users an instant at-pin glance; a tap/click opens the
  // full centered popover (DevModal) independently of hover, so touch users
  // (who never fire hover) still get the same result from a tap.
  const active = hovered ?? selected;
  const openPin = LIVE_LOCATIONS.find((p) => p.id === openDev) || null;
  const openDevData = openPin ? devById(openPin.id) : null;
  const selectedPin = LIVE_LOCATIONS.find((p) => p.id === selected) || null;

  const select = (id: string) => setSelected((cur) => (cur === id ? cur : id));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-auto flex w-full min-h-0 flex-1 flex-col px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-5" style={{ maxWidth: 1440 }}>
        <div className="relative w-full min-h-0 flex-1 overflow-hidden rounded-[22px] border border-[#E3E9EC]">
          <MapboxMap
            locations={LIVE_LOCATIONS}
            activeId={active}
            hoveredId={hovered}
            selectedId={selected}
            onSelect={select}
            onHover={setHovered}
          />
          {selectedPin && <DevModal pin={selectedPin} onClose={() => setSelected(null)} onOpen={setOpenDev} />}
        </div>

        {/* All-developments strip - doubles as the list of developments,
            since a sidebar list duplicating it added nothing a real,
            pannable map doesn't already show. Fixed height, so it (and the
            map above it) always fit within the screen without scrolling. */}
        <div className="relative mt-5 flex-none">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[13px] font-bold uppercase tracking-wide text-[#8B979C]">All developments</div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => scrollStrip(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DEE2] text-[#28567A]"
              >
                <Icon name="chevronLeft" className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => scrollStrip(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DEE2] text-[#28567A]"
              >
                <Icon name="chevronRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            ref={stripRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
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
