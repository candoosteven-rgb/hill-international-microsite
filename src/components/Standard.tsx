"use client";

import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const FEATURES: { key: string; kind: "spec" | "glazing" | "heating" | "wardrobe" | "lock"; wide?: boolean }[] = [
  { key: "std_i1", kind: "spec", wide: true },
  { key: "std_i2", kind: "glazing" },
  { key: "std_i3", kind: "heating" },
  { key: "std_i4", kind: "wardrobe" },
  { key: "std_i6", kind: "lock" },
];

export default function Standard() {
  const { t } = useLanguage();

  return (
    <section
      id="hi-standard"
      className="hi-section relative"
      style={{
        backgroundColor: "#16313D",
        backgroundImage: `radial-gradient(1200px 640px at 8% -12%, rgba(201,138,107,0.22), transparent 62%), linear-gradient(180deg, rgba(21,47,60,0.90) 0%, rgba(14,33,42,0.93) 55%, rgba(18,40,51,0.91) 100%), url("${resolveImage("uploads/marble-texture-background_38679-1053.avif", "")}")`,
        backgroundSize: "auto, auto, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
        backgroundBlendMode: "screen, multiply, normal",
        boxShadow: "inset 0 1px 0 rgba(201,138,107,0.42), inset 0 -1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-10">
          <div className="max-w-[720px] flex-[1_1_620px]">
            <span className="hi-eyebrow mb-6 block text-[#C98A6B]">{t("std_eyebrow")}</span>
            <h2
              className="font-bold text-[#F9F5F3]"
              style={{ fontSize: "clamp(30px,3.6vw,46px)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
            >
              {t("std_title")}
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-white/72">{t("std_body")}</p>
          </div>
          <div className="flex flex-none items-center gap-2.5 rounded-full border border-white/22 px-5 py-3">
            <Icon name="check" className="h-4 w-4 text-[#C98A6B]" strokeWidth={2.4} />
            <span className="text-[13px] font-semibold text-[#F9F5F3]">{t("std_note")}</span>
          </div>
        </Reveal>

        <Reveal delay={1} className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.key}
              className={`hi-glass overflow-hidden ${i === 0 ? "sm:col-span-2 lg:col-span-4" : ""}`}
            >
              {i === 0 ? (
                <div className="grid items-stretch sm:grid-cols-2">
                  <div
                    className="min-h-[220px] bg-cover bg-center"
                    style={{ backgroundImage: `url("${resolveImage("uploads/SJH_0001.webp", "Kitchen")}")` }}
                  />
                  <div className="flex flex-col justify-center gap-3.5 p-9">
                    <FeatureIcon kind={f.kind} />
                    <h3 className="text-[24px] font-bold tracking-tight text-[#F9F5F3]">{t(`${f.key}_title`)}</h3>
                    <p className="max-w-[460px] text-[16px] leading-relaxed text-white/72">{t(`${f.key}_body`)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col gap-3.5 p-8">
                  <FeatureIcon kind={f.kind} />
                  <h3 className="text-[19.5px] font-bold tracking-tight text-[#F9F5F3]">{t(`${f.key}_title`)}</h3>
                  <p className="text-[15.5px] leading-relaxed text-white/68">{t(`${f.key}_body`)}</p>
                </div>
              )}
            </div>
          ))}
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-7 max-w-[820px] text-[13.5px] leading-relaxed text-white/62">{t("std_disclaimer")}</p>
        </Reveal>
      </div>
    </section>
  );
}

const svgProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#C98A6B",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function FeatureIcon({ kind }: { kind: "spec" | "glazing" | "heating" | "wardrobe" | "lock" }) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(201,138,107,0.16)] ${
        kind === "heating" ? "hi-heatpod" : kind === "lock" ? "hi-lockpod" : ""
      }`}
    >
      {kind === "spec" && (
        <svg {...svgProps}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M4 10h16" />
          <path d="M8 6.5h3" />
          <path d="M12 14v3" />
        </svg>
      )}
      {kind === "glazing" && (
        <svg {...svgProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 12h18" />
          <path d="M9 4v8" />
          <path d="M15 12v8" />
          <path className="hi-stitch" d="M3 12h18" stroke="#F2CDB9" strokeWidth={2.1} />
          <path className="hi-seam" d="M4 16.5h16" stroke="#F2CDB9" strokeWidth={1.4} opacity={0.85} />
        </svg>
      )}
      {kind === "heating" && (
        <svg {...svgProps}>
          <path className="hi-heat1" d="M8 4v6" stroke="#F0A86E" />
          <path className="hi-heat2" d="M12 4v6" stroke="#F0A86E" />
          <path className="hi-heat3" d="M16 4v6" stroke="#F0A86E" />
          <path d="M4 15h16" />
          <path d="M4 19h16" />
        </svg>
      )}
      {kind === "wardrobe" && (
        <svg {...svgProps}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <g className="hi-wardrobe-in" stroke="#F2CDB9">
            <path d="M7 7h10" />
            <path d="M9.5 7v3.4" />
            <path d="M12 7v4" />
            <path d="M14.5 7v3.4" />
          </g>
          <g className="hi-doorL">
            <path d="M4.6 3.6h7.4v16.8H4.6z" strokeWidth={1.5} />
            <path d="M10 11h.01" strokeWidth={2.2} />
          </g>
          <g className="hi-doorR">
            <path d="M12 3.6h7.4v16.8H12z" strokeWidth={1.5} />
            <path d="M14 11h.01" strokeWidth={2.2} />
          </g>
        </svg>
      )}
      {kind === "lock" && (
        <svg {...svgProps}>
          <path className="hi-shackle" d="M12 3a4 4 0 0 1 4 4v3H8V7a4 4 0 0 1 4-4Z" />
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path className="hi-keyhole" d="M12 14.4v2.6" stroke="#F2CDB9" strokeWidth={2.2} />
        </svg>
      )}
    </div>
  );
}
