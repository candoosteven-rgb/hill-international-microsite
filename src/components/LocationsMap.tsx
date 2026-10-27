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
  selected,
  className,
  style,
  onClick,
  children,
  "aria-label": ariaLabel,
}: {
  selected: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
  "aria-label": string;
}) {
  // A 44px tap target (the WCAG-recommended touch-target minimum) around a
  // visually smaller badge, so the dense Cambridge/London clusters don't
  // have to grow into each other just to stay tappable.
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={selected}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center"
    >
      <span className={className} style={style}>
        {children}
      </span>
    </button>
  );
}

function SummaryPanel({ pin, onOpen }: { pin: LocationPin; onOpen: (id: string) => void }) {
  const { t } = useLanguage();
  const d = devById(pin.id);
  if (!d) return null;

  const status = statusMetaFor(d, t);
  const price = priceLabelFor(d, t);
  const completion = completionFor(d.id);
  const hero = resolveImage(buildShots(d)[0], d.name);

  return (
    <div className="hi-pop flex flex-col gap-5 rounded-[22px] border border-[#E3E9EC] bg-white p-5 sm:flex-row sm:p-6">
      <img src={hero} alt={d.name} className="h-[160px] w-full flex-none rounded-[14px] object-cover sm:w-[220px]" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2.5">
          <h2 className="text-[20px] font-bold tracking-tight text-[#1F3A47]">{d.name}</h2>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>
        <div className="mb-4 text-[13.5px] text-[#8B979C]">{d.locationLabel || d.region}</div>

        <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
          <div>
            <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B979C]">Price from</div>
            <div className="text-[15px] font-bold text-[#1F3A47]">{price}</div>
          </div>
          <div>
            <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B979C]">Homes</div>
            <div className="text-[15px] font-bold text-[#1F3A47]">{d.tagline || "—"}</div>
          </div>
          {completion && (
            <div>
              <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B979C]">Completion</div>
              <div className="text-[15px] font-bold text-[#1F3A47]">{completion}</div>
            </div>
          )}
        </div>

        {pin.external ? (
          <button
            type="button"
            onClick={() => onOpen(pin.id)}
            className="hi-pill inline-flex items-center gap-2 rounded-full bg-[#C1560F] px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            Open development
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Link
            href={pin.href}
            className="hi-pill inline-flex items-center gap-2 rounded-full bg-[#C1560F] px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            Open development
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
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
  const [openDev, setOpenDev] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const selectedPin = LOCATIONS.find((p) => p.id === selected) || null;
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
        <div className="flex w-full flex-none flex-col gap-6 lg:w-[72%]">
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

            {LOCATIONS.map((pin, i) => {
              const d = devById(pin.id);
              if (!d) return null;
              const isSelected = selected === pin.id;
              const matchesFilter = regionFilter === "all" || d.region === regionFilter;
              const status = statusMetaFor(d, t);
              return (
                <div
                  key={pin.id}
                  className={`absolute transition-opacity duration-200 ${isSelected ? "z-50" : "z-0"}`}
                  style={{
                    left: `${pin.x * 100}%`,
                    top: `${pin.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: matchesFilter ? 1 : 0.22,
                  }}
                >
                  <PinButton
                    selected={isSelected}
                    aria-label={d.name}
                    onClick={() => select(pin.id)}
                    className={`flex items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(15,32,39,0.25)] transition-transform duration-200 ${
                      isSelected ? "h-8 w-8 scale-110" : "h-6 w-6"
                    }`}
                    style={{ background: isSelected ? "#C1560F" : status.dot }}
                  >
                    {i + 1}
                  </PinButton>
                </div>
              );
            })}
          </div>

          {selectedPin && <SummaryPanel pin={selectedPin} onOpen={setOpenDev} />}
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
                    const isSelected = selected === pin.id;
                    return (
                      <li key={pin.id}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => select(pin.id)}
                          className={`flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left text-[14px] text-[#1F3A47] transition-colors duration-150 ${
                            isSelected ? "bg-[#F5F5F7]" : "hover:bg-[#F5F5F7]"
                          }`}
                        >
                          <span
                            className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: isSelected ? "#C1560F" : status.dot }}
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
