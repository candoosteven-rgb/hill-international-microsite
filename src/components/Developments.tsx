"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { devData, regions } from "@/lib/data";
import { resolveImage, buildShots } from "@/lib/image";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import DevCard from "@/components/DevCard";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const REGION_BANNERS: Record<string, string> = {
  London: "uploads/opt/london-skyline.jpg",
  Cambridge: "uploads/1912220.jpg",
  Oxford: "uploads/opt/okford.jpg",
  Bristol: "uploads/Screenshot 2026-08-28 123313.png",
};

export default function Developments() {
  const { t } = useLanguage();
  const router = useRouter();
  const {
    liked,
    savedOnly,
    setSavedOnly,
    recentIds,
    clearRecent,
    regionFilter,
    setRegionFilter,
    zoneFilter,
    setZoneFilter,
  } = useAppState();

  const londonZones = useMemo(
    () =>
      Array.from(new Set(devData.filter((d) => d.region === "London" && d.zone).map((d) => d.zone!))).sort(
        (a, b) => a - b
      ),
    []
  );

  const showRecent = recentIds.length > 0;
  const recentDevs = recentIds.map((id) => devData.find((d) => d.id === id)).filter(Boolean) as typeof devData;

  const activeSaved = savedOnly && liked.size > 0;
  const regionsBase = regionFilter === "all" ? regions : [regionFilter];
  const visibleRegions = activeSaved
    ? regionsBase.filter((r) => devData.some((d) => d.region === r && liked.has(d.id)))
    : regionsBase;

  return (
    <section id="hi-developments" className="hi-section bg-white">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div className="min-w-0 flex-[1_1_620px]">
            <div className="hi-eyebrow mb-6 flex items-center gap-3 text-[#C1560F]">
              <Icon name="pin" className="h-4 w-4" />
              {t("regions_eyebrow")}
            </div>
            <h2
              className="mb-5 font-extrabold tracking-tight text-[#1F3A47]"
              style={{ fontSize: "clamp(34px,4.6vw,54px)", lineHeight: 1.01, letterSpacing: "-0.03em" }}
            >
              {t("regions_title")}
            </h2>
            <p className="max-w-[900px] text-[17px] leading-snug text-[#5C6B71]">{t("regions_body")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", ...regions].map((r) => {
              const active = regionFilter === r;
              return (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className="hi-pill rounded-full px-5 py-2.5 text-sm font-semibold"
                  style={{
                    border: `1px solid ${active ? "#16313D" : "#D7DEE2"}`,
                    background: active ? "#16313D" : "#fff",
                    color: active ? "#fff" : "#28567A",
                  }}
                >
                  {r === "all" ? t("filter_all") : r}
                </button>
              );
            })}
            {liked.size > 0 && (
              <button
                onClick={() => setSavedOnly(!savedOnly)}
                className="hi-pill inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold"
                style={{
                  border: `1px solid ${activeSaved ? "#16313D" : "#D7DEE2"}`,
                  background: activeSaved ? "#16313D" : "#fff",
                  color: activeSaved ? "#fff" : "#28567A",
                }}
              >
                <Icon name={activeSaved ? "heart-fill" : "heart"} className="h-3.5 w-3.5" />
                {t("filter_saved")}
              </button>
            )}
          </div>
        </div>

        {showRecent && (
          <div className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="hi-eyebrow text-[#C98A6B]">{t("recent_eyebrow")}</span>
              <button
                onClick={clearRecent}
                className="hi-pill flex-none rounded-full border border-[#D3DDE3] bg-white px-4 py-2 text-[13px] font-semibold text-[#28567A]"
              >
                {t("recent_clear")}
              </button>
            </div>
            <div className="hi-scroller flex gap-4 overflow-x-auto pb-1.5">
              {recentDevs.map((d) => (
                <div
                  key={d.id}
                  onClick={() => router.push(`/developments/${d.id}`)}
                  className="hi-card flex-none w-[220px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(20,40,50,0.08)]"
                >
                  <div className="relative h-[120px] overflow-hidden bg-[repeating-linear-gradient(45deg,#dfe3e2,#dfe3e2_10px,#eceeec_10px,#eceeec_20px)]">
                    <img src={resolveImage(buildShots(d)[0], d.name)} alt={d.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3.5">
                    <div className="mb-0.5 text-[15px] font-bold text-[#1F3A47]">{d.name}</div>
                    <div className="text-[12.5px] text-[#6E7B80]">{d.region}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visibleRegions.map((region) => {
          const isLondon = region === "London";
          const regionDevs = devData.filter(
            (d) =>
              d.region === region &&
              (!isLondon || zoneFilter === "all" || d.zone === zoneFilter) &&
              (!activeSaved || liked.has(d.id))
          );
          if (!regionDevs.length) return null;
          const hasBanner = region in REGION_BANNERS;

          return (
            <div key={region} className="mt-16 first:mt-0">
              {hasBanner ? (
                <div className="relative mb-12 h-[280px] overflow-hidden rounded-[22px] md:h-[320px]">
                  <img
                    src={resolveImage(REGION_BANNERS[region], region)}
                    alt={region}
                    className="hi-banner-drift absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(15,32,39,0.88) 0%, rgba(15,32,39,0.25) 55%, rgba(15,32,39,0.05) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-6 bottom-6 flex flex-wrap items-end justify-between gap-4">
                    <h3 className="text-[32px] font-extrabold tracking-tight text-[#F9F5F3] md:text-[38px]">
                      {region}
                    </h3>
                    <span className="rounded-full bg-black/28 px-4 py-2 text-[13px] font-semibold text-white/85">
                      {regionDevs.length} {regionDevs.length === 1 ? t("dev_count_one") : t("dev_count_many")}
                    </span>
                  </div>
                </div>
              ) : (
                <h3 className="mb-6 border-b border-[#D7DEE2] pb-3.5 text-[28px] font-extrabold tracking-tight text-[#1F3A47]">
                  {region}
                </h3>
              )}

              {isLondon && (
                <div className="mb-10 flex flex-wrap items-center gap-2.5">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8a9298]">
                    {t("zone_filter_prefix")}
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-label="London Underground" className="mr-0.5 flex-none">
                    <circle cx="12" cy="12" r="8.6" fill="none" stroke="#DC241F" strokeWidth="2.8" />
                    <rect x="1.6" y="10.35" width="20.8" height="3.3" fill="#1F3A47" />
                  </svg>
                  {(["all", ...londonZones] as (number | "all")[]).map((z) => {
                    const active = zoneFilter === z;
                    return (
                      <button
                        key={z}
                        onClick={() => setZoneFilter(z)}
                        className="hi-pill rounded-full px-4 py-1.5 text-[13px] font-semibold"
                        style={{
                          border: `1px solid ${active ? "#28567A" : "#D7DEE2"}`,
                          background: active ? "#28567A" : "#fff",
                          color: active ? "#fff" : "#28567A",
                        }}
                      >
                        {z === "all" ? t("zone_filter_all") : t("zone_filter_label", { n: z })}
                      </button>
                    );
                  })}
                </div>
              )}

              <Reveal className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                {regionDevs.map((d) => (
                  <DevCard key={d.id} d={d} />
                ))}
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
