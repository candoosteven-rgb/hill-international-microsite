"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Development } from "@/lib/types";
import { epcColorsOf, epcOf, priceLabelFor, statusMetaFor } from "@/lib/data";
import { resolveImage, buildShots } from "@/lib/image";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import Icon from "@/components/Icon";

const ICON_MAP: Record<string, Parameters<typeof Icon>[0]["name"]> = {
  park: "park",
  concierge: "concierge",
  car: "car",
  terrace: "terrace",
  pin: "pin",
  school: "school",
  supermarket: "supermarket",
  gym: "gym",
  nursery: "nursery",
  landmark: "landmark",
  stadium: "stadium",
  towers: "towers",
  woodland: "woodland",
  yield: "yield",
};

export default function DevCard({ d }: { d: Development }) {
  const { t } = useLanguage();
  const router = useRouter();
  const { liked, toggleLiked, compareIds, toggleCompare, startPriority } = useAppState();
  const [shot, setShot] = useState(0);
  const [shots, setShots] = useState(() => buildShots(d).slice(0, 3));

  const dropBrokenShot = () => {
    setShots((list) => {
      const next = list.filter((_, i) => i !== shot);
      setShot((s) => Math.min(s, Math.max(0, next.length - 1)));
      return next;
    });
  };

  const epc = epcOf(d);
  const epcColors = epcColorsOf(epc);
  const status = statusMetaFor(d, t);
  const priceLabel = priceLabelFor(d, t);
  const priceIsGuide = false;
  const isComing = d.status !== "live";
  const isLiked = liked.has(d.id);
  const isComparing = compareIds.includes(d.id);
  const tagline = d.tagline || t("dev_tagline", { region: d.region });

  return (
    <div
      className="hi-card hi-in flex h-full flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_8px_26px_rgba(20,40,50,0.08)] cursor-pointer"
      onClick={() => router.push(`/developments/${d.id}`)}
    >
      <div className="relative h-[280px] md:h-[300px] overflow-hidden bg-[repeating-linear-gradient(45deg,#dfe3e2,#dfe3e2_10px,#eceeec_10px,#eceeec_20px)]">
        {shots.length ? (
          <>
            <img
              src={resolveImage(shots[shot], d.name)}
              alt={d.name}
              loading="lazy"
              onError={dropBrokenShot}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {shots.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 z-[4] flex -translate-x-1/2 items-center gap-1 rounded-full bg-[rgba(15,32,39,0.55)] px-2.5 py-1.5 backdrop-blur-sm">
                {shots.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShot(i);
                    }}
                    aria-label={`Photo ${i + 1}`}
                    className="flex h-4 w-4 items-center justify-center p-1"
                  >
                    <span
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{ background: i === shot ? "#fff" : "rgba(255,255,255,0.5)" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden bg-[linear-gradient(158deg,#27454F_0%,#162C35_62%,#101F26_100%)] p-8 text-center hi-hatch">
            <Icon name="building" className="relative h-8 w-8 text-[#C98A6B]" />
            <span className="relative text-[25px] font-extrabold leading-tight tracking-tight text-[#F9F5F3]">
              {d.name}
            </span>
            <span className="relative max-w-[250px] text-[13px] leading-snug text-white/72">
              We&rsquo;re working on it &mdash; the photographer beats us to the paint drying.
            </span>
          </div>
        )}

        {isComing && shots.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 z-[3] px-4 pb-3.5 pt-11 bg-[linear-gradient(to_top,rgba(15,32,39,0.88)_0%,rgba(15,32,39,0.45)_55%,transparent_100%)]">
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#F9F5F3]">
              {t("teaser_first_look")}
            </span>
          </div>
        )}

        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-[rgba(31,58,71,0.85)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          <Icon name="pin" className="h-2.5 w-2.5 flex-none" />
          {d.locationLabel || d.region}
        </span>

        <div className="absolute right-3.5 top-3.5 z-[5] flex items-center gap-2">
          {status.isLive && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{ background: status.bg, color: status.color }}
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#1FA45C] shadow-[0_0_0_3px_rgba(31,164,92,0.22)]" />
              {status.label}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLiked(d.id);
            }}
            aria-label="Save development"
            className="hi-pill flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/90"
          >
            <Icon
              name={isLiked ? "heart-fill" : "heart"}
              className="h-4 w-4 text-[#C1560F]"
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-7 md:px-7">
        <h4 className="mb-2 text-[21px] font-extrabold leading-tight tracking-tight text-[#1F3A47]">{d.name}</h4>
        <div className="mb-3.5 flex items-baseline gap-1.5">
          {priceIsGuide && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#8B979C]">
              {t("price_from")}
            </span>
          )}
          <bdi className="text-[16px] font-bold tracking-tight text-[#C1560F]">{priceLabel}</bdi>
        </div>
        {d.place && (
          <p className="mb-4.5 flex items-center gap-1.5 text-[13px] text-[#8B979C]">
            <Icon name="pin" className="h-3.5 w-3.5 flex-none text-[#1F3A47]" />
            {d.place}
          </p>
        )}
        <div className="mb-4 flex flex-col gap-1">
          {tagline.split("\n").map((line, i) => (
            <p
              key={i}
              className="flex items-start gap-2 text-[14px] leading-snug text-[#5C6B71]"
              style={{ unicodeBidi: "plaintext" }}
            >
              {d.showBedIcon && <Icon name="bed" className="mt-0.5 h-3.5 w-3.5 flex-none text-[#1F3A47]" />}
              {line}
            </p>
          ))}
        </div>

        {epc && (
          <div
            className="mb-4 inline-flex items-center gap-2.5 self-start rounded-full py-1.5 pl-2.5 pr-3.5"
            style={{ background: epcColors.bg, border: `1px solid ${epcColors.border}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/APD_Energy_Ratings.png" alt="EPC rating scale" className="h-5 w-4 flex-none object-contain" />
            <span className="text-[12px] font-bold tracking-wide" style={{ color: epcColors.fg }}>
              {t("epc_label")} {epc}
            </span>
            <span className="h-3 w-px" style={{ background: epcColors.border }} />
            <Icon name="f_epc" className="h-3.5 w-3.5 flex-none" style={{ color: epcColors.fg }} />
            <span className="text-[12px] font-medium" style={{ color: epcColors.soft }}>
              {epc === "A" ? t("epc_benefit_lowest") : t("epc_benefit")}
            </span>
          </div>
        )}

        {!!d.accessPoints?.length && (
          <>
            <div className="mt-3.5 border-t border-[#E3E9EC] pt-5 text-[16px] font-bold text-[#1F3A47]">
              {t("offers_label")}
            </div>
            <div className="my-3.5 grid grid-cols-2 gap-x-5 gap-y-3">
              {d.accessPoints.map((ap, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2.5 text-[13.5px] font-medium leading-snug text-[#1F3A47]"
                  style={{ unicodeBidi: "plaintext" }}
                >
                  <Icon name={ICON_MAP[ap.icon] || "pin"} className="h-4 w-4 flex-none" />
                  {ap.label}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="mt-auto -mx-6 -mb-6 mt-6 flex items-center justify-between gap-3 rounded-b-[18px] border-t border-[#BCCDD7] bg-[#D2DFE6] px-6 py-4.5 md:-mx-7 md:px-7">
          {status.isLive ? (
            d.siteUrl ? (
              <a
                href={d.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#28567A]"
              >
                {t("dev_view")} <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </a>
            ) : (
              <span className="text-[14px] font-semibold text-[#28567A]">{t("dev_view")}</span>
            )
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startPriority(d.region);
              }}
              className="hi-pill inline-flex items-center gap-2 rounded-full border border-[#1F3A47] px-4 py-2 text-[13px] font-bold text-[#1F3A47]"
            >
              <Icon name="clock" className="h-3.5 w-3.5" />
              {d.id === "cambium-square" ? "Attend the launch" : t("cta_priority")}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(d.id);
            }}
            className="hi-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={{
              border: `1px solid ${isComparing ? "#16313D" : "#B7C6CD"}`,
              background: isComparing ? "#16313D" : "transparent",
              color: isComparing ? "#fff" : "#28567A",
            }}
          >
            <Icon name={isComparing ? "check" : "compare"} className="h-3 w-3" />
            {t("compare_toggle_label")}
          </button>
        </div>
      </div>
    </div>
  );
}
