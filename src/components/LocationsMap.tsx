"use client";

import { useState } from "react";
import Link from "next/link";
import { devById, pageDataFor, priceLabelFor, statusMetaFor } from "@/lib/data";
import { autoFacts } from "@/lib/facts";
import { resolveImage, buildShots } from "@/lib/image";
import { useLanguage } from "@/lib/i18n";
import Icon from "@/components/Icon";
import { LOCATIONS, type LocationPin } from "@/data/LOCATIONS_MAP";

function completionFor(devId: string): string | null {
  const pd = pageDataFor(devId);
  const d = devById(devId);
  const facts = pd?.facts?.length ? pd.facts : d ? autoFacts(d) : [];
  return facts.find((f) => f.k === "f_completion")?.v || null;
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
  // A 44px tap target (the WCAG-recommended touch-target minimum) around a
  // visually smaller badge, so the dense Cambridge/London clusters don't
  // have to grow into each other just to stay tappable. Hover-out is
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
      className="flex h-11 w-11 items-center justify-center"
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

// Order the region filter pills by first appearance in LOCATIONS, which is
// already grouped region-by-region - avoids depending on the sitewide
// `regions` list, which may include regions with no pins on this map.
const REGION_ORDER = Array.from(
  new Set(LOCATIONS.map((p) => devById(p.id)?.region).filter((r): r is string => !!r))
);

export default function LocationsMap() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openDev, setOpenDev] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>("all");

  // Hover takes momentary precedence (mouse users get instant feedback);
  // falls back to the tapped/clicked selection otherwise, so touch users
  // (who never fire hover) still see the card they tapped for.
  const active = hovered ?? selected;
  const openPin = LOCATIONS.find((p) => p.id === openDev) || null;
  const openDevData = openPin ? devById(openPin.id) : null;

  const select = (id: string) => setSelected((cur) => (cur === id ? cur : id));
  const changeRegion = (r: string) => {
    setRegionFilter(r);
    setSelected(null);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
      <div className="hi-eyebrow mb-6 flex items-center gap-3 text-[#C1560F]">
        <Icon name="pin" className="h-4 w-4" />
        OUR LOCATIONS
      </div>
      <h1
        className="mb-8 font-bold tracking-tight text-[#1F3A47]"
        style={{ fontSize: "clamp(30px,4.2vw,48px)", lineHeight: 1.03, letterSpacing: "-0.03em" }}
      >
        Discover where we are building
      </h1>

      <div className="mb-8 flex flex-wrap gap-2">
        {["all", ...REGION_ORDER].map((r) => {
          const isActive = regionFilter === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => changeRegion(r)}
              className="hi-pill rounded-full px-5 py-2.5 text-sm font-semibold"
              style={{
                border: `1px solid ${isActive ? "#16313D" : "#D7DEE2"}`,
                background: isActive ? "#16313D" : "#fff",
                color: isActive ? "#fff" : "#28567A",
              }}
            >
              {r === "all" ? "All regions" : r}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div
          className="relative w-full flex-none overflow-visible rounded-[22px] border border-[#E3E9EC] bg-[#F0ECE6] lg:w-[72%]"
          style={{ aspectRatio: "1824 / 968" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/uploads/locations-map-background.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full select-none rounded-[22px] object-cover"
          />

          {LOCATIONS.map((pin, i) => {
            const d = devById(pin.id);
            if (!d) return null;
            const isActive = active === pin.id;
            const matchesFilter = regionFilter === "all" || d.region === regionFilter;
            const status = statusMetaFor(d, t);
            return (
              <div
                key={pin.id}
                className={`absolute transition-opacity duration-200 ${isActive ? "z-50" : "z-0"}`}
                style={{
                  left: `${pin.x * 100}%`,
                  top: `${pin.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: matchesFilter ? 1 : 0.22,
                }}
                onMouseLeave={() => setHovered((cur) => (cur === pin.id ? null : cur))}
              >
                <PinButton
                  active={isActive}
                  aria-label={d.name}
                  onClick={() => select(pin.id)}
                  onMouseEnter={() => setHovered(pin.id)}
                  className={`flex items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(15,32,39,0.25)] transition-transform duration-200 ${
                    isActive ? "h-8 w-8 scale-110" : "h-6 w-6"
                  }`}
                  style={{ background: isActive ? "#C1560F" : status.dot }}
                >
                  {i + 1}
                </PinButton>

                {isActive && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                    <PreviewCard pin={pin} onOpen={setOpenDev} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* List */}
        <div className="flex w-full flex-1 flex-col lg:max-h-[640px]">
          <div className="mb-5 flex flex-none flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2 text-[13px] font-medium text-[#5C6B71]">
              <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: "#2E86D8" }} />
              Live
            </span>
            <span className="flex items-center gap-2 text-[13px] font-medium text-[#5C6B71]">
              <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: "#C98A6B" }} />
              Coming soon
            </span>
          </div>

          <div className="overflow-y-auto">
            {Object.entries(
              LOCATIONS.reduce<Record<string, { pin: LocationPin; name: string; num: number }[]>>((groups, pin, i) => {
                const d = devById(pin.id);
                if (!d) return groups;
                (groups[d.region] ||= []).push({ pin, name: d.name, num: i + 1 });
                return groups;
              }, {})
            )
              .filter(([region]) => regionFilter === "all" || region === regionFilter)
              .map(([region, items]) => (
                <div key={region} className="mb-6">
                  <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-[#8B979C]">{region}</div>
                  <ul className="flex flex-col gap-1.5">
                    {items.map(({ pin, name, num }) => {
                      const d = devById(pin.id)!;
                      const status = statusMetaFor(d, t);
                      const isActive = active === pin.id;
                      return (
                        <li key={pin.id}>
                          <button
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => select(pin.id)}
                            onMouseEnter={() => setHovered(pin.id)}
                            onMouseLeave={() => setHovered((cur) => (cur === pin.id ? null : cur))}
                            className={`flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left text-[14px] text-[#1F3A47] transition-colors duration-150 ${
                              isActive ? "bg-[#F5F5F7]" : "hover:bg-[#F5F5F7]"
                            }`}
                          >
                            <span
                              className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white"
                              style={{ background: isActive ? "#C1560F" : status.dot }}
                            >
                              {num}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium">{name}</span>
                              <span className="block text-[12px] text-[#8B979C]">{d.region}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
