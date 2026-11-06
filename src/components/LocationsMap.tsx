"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { devById, pageDataFor, priceLabelFor, statusMetaFor } from "@/lib/data";
import { autoFacts } from "@/lib/facts";
import { resolveImage, buildShots } from "@/lib/image";
import { resolveLogo } from "@/lib/logo";
import { useLanguage } from "@/lib/i18n";
import Icon from "@/components/Icon";
import { LOCATIONS, type LocationPin } from "@/data/LOCATIONS_MAP";

// Temporarily back on the illustrated map (not Mapbox) until a working
// Mapbox token is in place - see git history (commits introducing
// MapboxMap) to restore it once that's sorted. LOCATIONS_MAP.ts still
// stores real lat/lng (needed for Mapbox and more precise anyway), so this
// reruns the same lat/lon -> pixel-fraction fit used to originally place
// these pins on /uploads/locations-map-background.png (1824x968), fit
// against Heathrow/Luton/Stansted/London City's known real coordinates.
function toMapFraction(lat: number, lng: number): { x: number; y: number } {
  const refLat = 51.47;
  const refLon = -0.4543;
  const refX = 1293;
  const refY = 783;
  const scaleX = 502.0;
  const scaleY = -728.4;
  const px = refX + (lng - refLon) * scaleX;
  const py = refY + (lat - refLat) * scaleY;
  return { x: px / 1824, y: py / 968 };
}

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

function PinButton({
  active,
  className,
  style,
  onClick,
  onMouseEnter,
  children,
  "aria-label": ariaLabel,
}: {
  active: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  onMouseEnter: () => void;
  children: React.ReactNode;
  "aria-label": string;
}) {
  // A tap target at least the WCAG-recommended 44px minimum, sized to the
  // active badge so it never clips. Hover-out is
  // handled by the wrapper that also contains the preview card (see
  // LocationsMap), since leaving the button for the card above it
  // shouldn't close it.
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="flex h-12 w-12 items-center justify-center"
    >
      <span className={className} style={style}>
        {children}
      </span>
    </button>
  );
}

// Hover (mouse) shows this instantly; a tap/click on touch shows it too and
// keeps it open regardless of subsequent pointer movement - neither input
// depends on the other.
function PreviewCard({ pin, onOpen }: { pin: LocationPin; onOpen: (id: string) => void }) {
  const { t } = useLanguage();
  const d = devById(pin.id);
  if (!d) return null;

  const status = statusMetaFor(d, t);
  const price = priceLabelFor(d, t);
  const completion = completionFor(d.id);
  const hero = resolveImage(buildShots(d)[0], d.name);

  return (
    <div
      className="hi-pop w-[280px] origin-bottom overflow-hidden rounded-[16px] bg-white shadow-[0_12px_32px_rgba(15,32,39,0.28)]"
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
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8B979C]">Price from</div>
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
      className="group relative h-[216px] w-[192px] flex-none snap-start overflow-hidden rounded-[16px] text-left transition-transform duration-200 hover:-translate-y-1"
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
            // Fitzwilliam Gate's source file is a dark navy wordmark (the
            // others are already white) - force it white to read against
            // the tile's dark scrim, same as every other logo here.
            style={pin.id === "fitzwilliam-gate" ? { filter: "brightness(0) invert(1)" } : undefined}
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

export default function LocationsMap() {
  const { t } = useLanguage();
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
    <div className="mx-auto w-full px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-5" style={{ maxWidth: 1440 }}>
      {/* All-developments strip - doubles as the list of developments,
          since a sidebar list duplicating it added nothing the map doesn't
          already show. */}
      <div className="relative mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[13px] font-bold uppercase tracking-wide text-[#8B979C]">Our developments</div>
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
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-10"
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

      <div
        className="relative w-full overflow-visible rounded-[22px] border border-[#E3E9EC] bg-[#F0ECE6]"
        style={{ aspectRatio: "1824 / 968" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/uploads/locations-map-background.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full select-none rounded-[22px] object-cover"
        />

        {LIVE_LOCATIONS.map((pin) => {
          const d = devById(pin.id);
          if (!d) return null;
          const isActive = active === pin.id;
          const status = statusMetaFor(d, t);
          const { x, y } = toMapFraction(pin.lat, pin.lng);
          const logo = resolveLogo(d.logo, d.name);
          return (
            <div
              key={pin.id}
              className={`absolute transition-opacity duration-200 ${isActive ? "z-50" : "z-0"}`}
              style={{ left: `${x * 100}%`, top: `${y * 100}%`, transform: "translate(-50%, -50%)" }}
              onMouseLeave={() => setHovered((cur) => (cur === pin.id ? null : cur))}
            >
              <PinButton
                active={isActive}
                aria-label={d.name}
                onClick={() => select(pin.id)}
                onMouseEnter={() => setHovered(pin.id)}
                className={`-rotate-45 overflow-hidden rounded-[50%_50%_50%_0] border-2 transition-all duration-200 ${
                  isActive
                    ? "h-12 w-12 shadow-[0_6px_16px_rgba(193,86,15,0.45)]"
                    : "h-9 w-9 shadow-[0_2px_8px_rgba(15,32,39,0.3)]"
                }`}
                style={{ borderColor: isActive ? "#C1560F" : status.dot, background: "#16313D" }}
              >
                <span className="flex h-full w-full rotate-45 items-center justify-center">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="" className="h-[70%] w-[70%] object-contain" />
                  ) : (
                    <span className="text-[16px] font-bold text-white/85">{d.name.charAt(0)}</span>
                  )}
                </span>
              </PinButton>

              {hovered === pin.id && selected !== pin.id && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <PreviewCard pin={pin} onOpen={setOpenDev} />
                </div>
              )}
            </div>
          );
        })}

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
