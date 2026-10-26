"use client";

import { useState } from "react";
import Link from "next/link";
import { devById, pageDataFor } from "@/lib/data";
import { autoFacts } from "@/lib/facts";
import { resolveImage, buildShots } from "@/lib/image";
import Icon from "@/components/Icon";
import { LOCATIONS, REGION_LABELS, REGION_BLOBS, type LocationPin } from "@/data/LOCATIONS_MAP";

const FACT_ICON_NAMES: Parameters<typeof Icon>[0]["name"][] = [
  "f_homes",
  "f_types",
  "f_tenure",
  "f_completion",
  "f_price",
  "f_travel",
  "f_epc",
  "f_parking",
  "f_zone",
  "f_warranty",
];

function factIconFor(key: string) {
  if (key === "f_launch") return "rocket" as const;
  if (key === "f_ev") return "ev" as const;
  return FACT_ICON_NAMES.find((n) => n === key);
}

function PinLink({
  pin,
  children,
  className,
  onClick,
}: {
  pin: LocationPin;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (pin.external) {
    return (
      <a href={pin.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={pin.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function DevCardPreview({ pin }: { pin: LocationPin }) {
  const d = devById(pin.id);
  if (!d) return null;
  const pd = pageDataFor(d.id);
  const facts = (pd?.facts?.length ? pd.facts : autoFacts(d)).slice(0, 4);
  const hero = resolveImage(buildShots(d)[0], d.name);

  return (
    <div
      className="w-[260px] overflow-hidden rounded-[16px] bg-white shadow-[0_12px_32px_rgba(15,32,39,0.28)]"
      onClick={(e) => e.stopPropagation()}
    >
      <img src={hero} alt={d.name} className="h-[120px] w-full object-cover" />
      <div className="p-4">
        <div className="mb-1 text-[15px] font-bold tracking-tight text-[#1F3A47]">{d.name}</div>
        <div className="mb-3 text-[12px] text-[#8B979C]">{d.locationLabel || d.region}</div>
        {!!facts.length && (
          <div className="mb-3.5 grid grid-cols-2 gap-x-3 gap-y-2.5">
            {facts.map((f) => {
              const icon = factIconFor(f.k);
              return (
                <div key={f.k} className="flex items-start gap-1.5">
                  {icon && <Icon name={icon} className="mt-0.5 h-3 w-3 flex-none text-[#C1560F]" />}
                  <span className="text-[11.5px] leading-snug text-[#5C6B71]">{f.v || "—"}</span>
                </div>
              );
            })}
          </div>
        )}
        <PinLink
          pin={pin}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C1560F]"
        >
          {pin.external ? "View interactive experience" : "View development"}
          <Icon name="arrowRight" className="h-3 w-3" />
        </PinLink>
      </div>
    </div>
  );
}

export default function LocationsMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8 md:px-8 md:py-10">
      <p className="mb-6 max-w-[640px] text-[14.5px] leading-relaxed text-[#5C6B71]">
        Hover over a development to explore further. Click on a number or development name to visit its dedicated
        page or interactive experience.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Map */}
        <div
          className="relative w-full flex-none overflow-visible rounded-[22px] border border-[#E3E9EC] bg-[#F0ECE6] lg:w-[68%]"
          style={{ aspectRatio: "1.65" }}
        >
          {/* Soft region blobs give the pins visual landmass context without
              claiming cartographic accuracy (no GIS data source available). */}
          {REGION_BLOBS.map((b) => (
            <div
              key={b.label}
              className="pointer-events-none absolute rounded-full bg-[rgba(31,58,71,0.07)]"
              style={{
                left: `${b.x * 100}%`,
                top: `${b.y * 100}%`,
                width: `${b.w * 100}%`,
                height: `${b.h * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {REGION_LABELS.map((r) => (
            <span
              key={r.label}
              className="pointer-events-none absolute select-none whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wide text-[#8B979C]"
              style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%`, transform: "translate(-50%, -50%)" }}
            >
              {r.label}
            </span>
          ))}

          {LOCATIONS.map((pin, i) => {
            const d = devById(pin.id);
            if (!d) return null;
            const isActive = active === pin.id;
            return (
              <div
                key={pin.id}
                className="absolute"
                style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%`, transform: "translate(-50%, -50%)" }}
                onMouseEnter={() => setActive(pin.id)}
                onMouseLeave={() => setActive((cur) => (cur === pin.id ? null : cur))}
              >
                <PinLink
                  pin={pin}
                  className={`flex items-center justify-center rounded-full border-2 text-[11px] font-bold shadow-[0_2px_8px_rgba(15,32,39,0.25)] transition-transform duration-200 ${
                    isActive ? "z-20 h-8 w-8 scale-110 border-white bg-[#C1560F] text-white" : "z-10 h-6 w-6 border-white bg-[#28567A] text-white"
                  }`}
                  onClick={() => setActive((cur) => (cur === pin.id ? null : pin.id))}
                >
                  {i + 1}
                </PinLink>

                {isActive && (
                  <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-full">
                    <DevCardPreview pin={pin} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* List */}
        <div className="w-full flex-1 overflow-y-auto lg:max-h-[640px]">
          {Object.entries(
            LOCATIONS.reduce<Record<string, { pin: LocationPin; name: string; num: number }[]>>((groups, pin, i) => {
              const d = devById(pin.id);
              if (!d) return groups;
              (groups[d.region] ||= []).push({ pin, name: d.name, num: i + 1 });
              return groups;
            }, {})
          ).map(([region, items]) => (
            <div key={region} className="mb-6">
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-[#8B979C]">{region}</div>
              <ul className="flex flex-col gap-1.5">
                {items.map(({ pin, name, num }) => (
                  <li key={pin.id}>
                    <PinLink
                      pin={pin}
                      className="flex items-center gap-3 rounded-[10px] px-2 py-2 text-[14px] text-[#1F3A47] transition-colors duration-150 hover:bg-[#F5F5F7]"
                    >
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#28567A] text-[11px] font-bold text-white">
                        {num}
                      </span>
                      <span className="font-medium">{name}</span>
                    </PinLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
