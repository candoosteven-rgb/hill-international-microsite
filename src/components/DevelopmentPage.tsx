"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { devById, gbp, pageDataFor, priceLabelFor, statusMetaFor } from "@/lib/data";
import { devBlurb, devBlurb2, devHeadline, devText } from "@/lib/blurb";
import { autoFacts } from "@/lib/facts";
import { resolveImage, placeholderFor, buildShots } from "@/lib/image";
import { VIDEO_EMBEDS, isYoutubeEmbed, youtubeWatchUrl } from "@/lib/video";
import { resolveLogo } from "@/lib/logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { submitEnquiry } from "@/lib/enquiry";
import Icon from "@/components/Icon";
import Footer from "@/components/Footer";

// Dev logos that are dark line-art marks (not pre-colored for a dark backdrop) —
// forced to white on the hero image, matching the design's per-id filter table.
const FORCE_WHITE_HERO_LOGO_IDS = new Set(["city-reach"]);

// Real branded local-area map images, where we actually have one - kept in
// preference to the generic embed below since they match the design exactly.
const MAP_SRC: Record<string, string> = {
  "baltic-wharf": "uploads/Screenshot 2026-09-04 094937.png",
  "southville-collection": "uploads/Screenshot 2026-09-04 095321.png",
};

// Every other development gets a real, live Google Maps embed instead of no
// map at all - built from the same address data already used for the "Get
// directions" link where we have one, or the development's own place/
// locationLabel/region otherwise. No API key needed for this embed form.
function mapEmbedSrc(d: NonNullable<ReturnType<typeof devById>>, pd: NonNullable<ReturnType<typeof pageDataFor>>): string {
  // Prefer the precise sales-suite address/coordinates already used for the
  // "Get directions" link, where we have one - that's an exact pin. Otherwise
  // search by the development's own name plus its area, since Hill's real
  // developments are generally listed on Google Maps under that name and
  // this resolves to the actual site far more often than an area name alone
  // (which only centers the map on the general city/neighbourhood).
  let query = `${d.name}, ${d.place || d.locationLabel || d.region}, UK`;
  const mapsUrl = pd.suite?.maps;
  if (mapsUrl) {
    try {
      const q = new URL(mapsUrl).searchParams.get("query");
      if (q) query = q;
    } catch {
      // malformed URL - fall back to the name+place query above
    }
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

// Real, room-appropriate photos to fall back to if a spec group's own image
// (often hotlinked from a development's marketing site) fails to load - a
// broken-photo placeholder should still look like the room it's describing,
// not an abstract colour gradient.
const SPEC_FALLBACK_PHOTO: Record<string, string> = {
  sg_kitchen: "uploads/SJH_0001.webp",
  sg_bathroom: "uploads/DSC_0447 - HR.jpg",
  sg_heating: "uploads/DSC_0447 - HR.jpg",
  sg_electrical: "uploads/NEXUS_BEDROOM 2_VIGNETTE_.jpg.webp",
  sg_communal: "uploads/0223_001_46_H2.jpg.webp",
  sg_finishes: "uploads/North Gate Park - Plot 2 The Ash -bifolding doors.jpg.webp",
  sg_additional: "uploads/DSC_0787 - HR.jpg",
};

const SPEC_ICON_NAMES = new Set([
  "sg_kitchen",
  "sg_bathroom",
  "sg_heating",
  "sg_electrical",
  "sg_communal",
  "sg_finishes",
  "sg_additional",
]);
const specIconName = (k: string) =>
  (SPEC_ICON_NAMES.has(k) ? k : "sg_additional") as Parameters<typeof Icon>[0]["name"];

const LOC_CAT_ICON_NAMES = new Set(["cat_transport", "cat_food", "cat_green", "cat_fitness", "cat_shops", "cat_schools"]);
const locCatIconName = (k: string) =>
  (LOC_CAT_ICON_NAMES.has(k) ? k : "cat_transport") as Parameters<typeof Icon>[0]["name"];

// A jump-menu, not a tab switcher - every section below is always rendered
// (when it has content) and stacked on the page; nav links just scroll to the
// matching section id. The nav's own order doesn't need to match the section
// order on the page (it doesn't, exactly, in the design either).
const NAV_LINKS = [
  { key: "overview", id: "dp-overview", nav: "nav_overview" },
  { key: "gallery", id: "dp-gallery", nav: "nav_gallery" },
  { key: "avail", id: "dp-availability", nav: "nav_avail" },
  { key: "spec", id: "dp-spec", nav: "nav_spec" },
  { key: "location", id: "dp-location", nav: "nav_location" },
] as const;

type SectionKey = (typeof NAV_LINKS)[number]["key"];

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

export default function DevelopmentPage({ id }: { id: string }) {
  const { t, dp, lang } = useLanguage();
  const router = useRouter();
  const { liked, toggleLiked, addRecent } = useAppState();
  const [locCat, setLocCat] = useState("cat_transport");
  const [avBuilding, setAvBuilding] = useState("all");
  const [avBeds, setAvBeds] = useState("all");
  const [avPrice, setAvPrice] = useState<"all" | "under" | "mid" | "over">("all");
  const [specCat, setSpecCat] = useState(0);
  const [galIdx, setGalIdx] = useState(0);

  const d = devById(id);
  const pd = pageDataFor(id);

  useEffect(() => {
    addRecent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const buildings = useMemo(() => {
    if (!pd) return [];
    return Array.from(new Set(pd.plots.map((p) => p.building).filter(Boolean))) as string[];
  }, [pd]);

  const bedsOptions = useMemo(() => {
    if (!pd) return [];
    return Array.from(new Set(pd.plots.map((p) => p.beds))).sort((a, b) => a - b);
  }, [pd]);

  const inPriceBand = (price?: number) => {
    if (avPrice === "all") return true;
    const p = price ?? 0;
    if (avPrice === "under") return p < 300000;
    if (avPrice === "mid") return p >= 300000 && p < 400000;
    return p >= 400000;
  };

  const filteredPlots = useMemo(() => {
    if (!pd) return [];
    return pd.plots.filter(
      (p) =>
        (avBuilding === "all" || p.building === avBuilding) &&
        (avBeds === "all" || p.beds === Number(avBeds)) &&
        inPriceBand(p.price)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pd, avBuilding, avBeds, avPrice]);

  if (!d || !pd) return null;

  const sectionOn: Record<SectionKey, boolean> = {
    overview: true,
    gallery: pd.gallery.length > 0,
    avail: pd.plots.length > 0,
    spec: pd.spec.length > 0,
    location: d.status !== "coming-soon" || !!d.hasMap,
  };
  const navLinks = NAV_LINKS.filter((n) => sectionOn[n.key]);

  const scrollToSection = (elId: string) => {
    const el = document.getElementById(elId);
    if (el) window.scrollTo({ top: el.offsetTop - 74, behavior: "smooth" });
  };

  const status = statusMetaFor(d, t);
  const isLiked = liked.has(d.id);
  const priceLabel = priceLabelFor(d, t);
  const tagline = d.tagline || t("dev_tagline", { region: d.region });
  const logoSrc = resolveLogo(d.logo, d.name);
  const locCats = Object.keys(pd.amenities);
  const facts = pd.facts.length ? pd.facts : autoFacts(d);

  const goRegister = () => router.push("/#hi-register");
  const goDevelopments = () => router.push("/#hi-developments");

  return (
    <div dir="auto" className="hi-fade overflow-x-hidden bg-white text-[#1F3A47]">
      <div
        className="sticky top-0 z-30 shadow-[0_10px_26px_-12px_rgba(0,0,0,0.5)]"
        style={{ background: "rgba(14,32,40,0.97)", backdropFilter: "blur(14px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-5 py-2.5 md:gap-4 md:py-3.5 md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="hi-pill inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/8 px-4 py-2 text-[13px] font-semibold text-[#F9F5F3]"
            >
              <Icon name="chevronLeft" className="h-3.5 w-3.5" />
              {dp("back")}
            </button>
            <span className="whitespace-nowrap text-[17px] font-bold tracking-tight text-[#F9F5F3]">{d.name}</span>
          </div>
          <nav className="hi-scroller flex max-w-full items-center gap-5 overflow-x-auto">
            {navLinks.map((n) => (
              <button
                key={n.key}
                onClick={() => scrollToSection(n.id)}
                className="whitespace-nowrap text-[13.5px] font-semibold text-[rgba(249,245,243,0.68)] hover:text-[#F9F5F3]"
              >
                {dp(n.nav)}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleLiked(d.id)}
              aria-pressed={isLiked}
              className="hi-icon-3d flex h-10 w-10 flex-none items-center justify-center rounded-full border"
              style={{ borderColor: isLiked ? "rgba(193,86,15,0.7)" : "rgba(255,255,255,0.24)", background: isLiked ? "rgba(193,86,15,0.18)" : "rgba(255,255,255,0.08)" }}
            >
              <Icon
                name={isLiked ? "heart-fill" : "heart"}
                className={`h-4 w-4 ${isLiked ? "text-[#C1560F]" : "text-[#F9F5F3]"}`}
              />
            </button>
            <button
              onClick={goRegister}
              className="hi-pill rounded-full bg-[#C1560F] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(193,86,15,0.34)]"
            >
              {d.id === "cambium-square" ? "Attend the launch" : dp("cta_register")}
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[clamp(430px,74vh,760px)] overflow-hidden bg-[#0E2028]">
        <img src={resolveImage(pd.hero, d.name)} alt={d.name} className="hi-ken absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(4deg, rgba(11,26,33,0.92) 0%, rgba(11,26,33,0.5) 46%, rgba(11,26,33,0.12) 100%)" }}
        />
        <div className="absolute right-4 top-4 z-[5] md:hidden">
          <span
            className="rounded-full px-3 py-1.5 text-[11px] font-bold"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
        </div>
        {logoSrc && (
          <div className="hi-pop absolute left-1/2 top-9 -translate-x-1/2">
            <img
              src={logoSrc}
              alt={`${d.name} logo`}
              className="h-[77px] max-w-[190px] object-contain md:h-24 md:max-w-[280px]"
              style={{
                filter: FORCE_WHITE_HERO_LOGO_IDS.has(d.id)
                  ? "brightness(0) invert(1) drop-shadow(0 6px 18px rgba(0,0,0,0.35))"
                  : "drop-shadow(0 6px 18px rgba(0,0,0,0.35))",
              }}
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-7 md:px-8 md:pb-13">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-2.5 flex flex-wrap items-center gap-2 md:mb-5 md:gap-3">
              <span className="hi-eyebrow inline-flex items-center gap-1.5 text-white/82">
                <Icon name="pin" className="h-3.5 w-3.5 text-[#C98A6B]" />
                {d.locationLabel || d.region}
              </span>
              <span
                className="hidden rounded-full px-3 py-1.5 text-[11px] font-bold md:inline-flex"
                style={{ background: status.bg, color: status.color }}
              >
                {status.label}
              </span>
            </div>
            <h1
              className="mb-2 font-bold text-[#F9F5F3] md:mb-4.5"
              style={{ fontSize: "clamp(21px,4.5vw,55px)", lineHeight: 0.92, letterSpacing: "-0.045em" }}
            >
              {d.name}
            </h1>
            <p className="mb-3.5 max-w-[640px] whitespace-pre-line text-[clamp(17px,2vw,21px)] leading-snug text-white/86 md:mb-6.5">
              {tagline}
            </p>
            <div className="flex flex-col items-start gap-1.5 md:flex-row md:items-center md:gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t("price_from")}</span>
                <bdi className="text-[26px] font-bold tracking-tight text-[#F9F5F3]">{priceLabel}</bdi>
              </div>
              {d.accessNote && (
                <>
                  <span className="hidden h-6.5 w-px bg-white/20 md:block" />
                  <span className="text-[14.5px] font-bold text-[#C98A6B]">{d.accessNote}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <section id="dp-overview" className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="hi-eyebrow mb-5.5 block text-[#C1560F]">{dp("ov_eyebrow")}</span>
              <h2
                className="mb-6.5 font-bold text-[#1F3A47]"
                style={{ fontSize: "clamp(30px,3.6vw,46px)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
              >
                {devHeadline(d, dp)}
              </h2>
              <p className="mb-4.5 text-[16.5px] leading-relaxed text-[#5C6B71]">{devBlurb(d, dp)}</p>
              <p className="text-[16.5px] leading-relaxed text-[#5C6B71]">{devBlurb2(d, dp)}</p>
            </div>

            {!!facts.length && (
              <div className="rounded-[22px] bg-[#F5F5F7] p-8 md:p-9">
                <div className="mb-6.5 text-[19px] font-bold tracking-tight text-[#1F3A47]">{dp("facts_title")}</div>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {facts.map((f) => {
                    const factIcon = FACT_ICON_NAMES.find((n) => n === f.k);
                    return (
                      <div key={f.k}>
                        <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(193,86,15,0.12)]">
                          {factIcon && <Icon name={factIcon} className="h-4 w-4 text-[#C1560F]" />}
                        </div>
                        <div className="mb-1.5 text-[24px] font-bold tracking-tight text-[#1F3A47]">{f.v || "—"}</div>
                        <div className="text-[13px] font-medium leading-snug text-[#6E7B80]">{dp(f.k)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

      </section>

      <FilmSection d={d} pd={pd} dp={dp} />

      {sectionOn.avail && (
        <section id="dp-availability" className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-7.5 flex flex-wrap items-end justify-between gap-7">
              <div>
                <span className="hi-eyebrow mb-3 block text-[#C1560F]">{dp("av_eyebrow")}</span>
                <h2 className="mb-2.5 text-[32px] font-bold tracking-tight text-[#1F3A47]">{dp("av_title")}</h2>
                <p className="max-w-[520px] text-[15px] leading-relaxed text-[#5C6B71]">{dp("av_sub")}</p>
              </div>
              <span className="text-[13px] font-bold tabular-nums text-[#28567A]">
                {dp("showing", { n: filteredPlots.length, m: pd.plots.length })}
              </span>
            </div>

            {!!buildings.length && (
              <div className="mb-6 flex flex-wrap gap-3">
                <select
                  value={avBuilding}
                  onChange={(e) => setAvBuilding(e.target.value)}
                  className="hi-input-light cursor-pointer rounded-full border border-[#D7DEE2] bg-white px-4 py-3 text-[14px] font-semibold text-[#1F3A47]"
                >
                  <option value="all">{dp("all_buildings")}</option>
                  {buildings.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <select
                  value={avBeds}
                  onChange={(e) => setAvBeds(e.target.value)}
                  className="hi-input-light cursor-pointer rounded-full border border-[#D7DEE2] bg-white px-4 py-3 text-[14px] font-semibold text-[#1F3A47]"
                >
                  <option value="all">{dp("all_beds")}</option>
                  {bedsOptions.map((b) => (
                    <option key={b} value={String(b)}>
                      {dp("beds_n", { n: b })}
                    </option>
                  ))}
                </select>
                <select
                  value={avPrice}
                  onChange={(e) => setAvPrice(e.target.value as typeof avPrice)}
                  className="hi-input-light cursor-pointer rounded-full border border-[#D7DEE2] bg-white px-4 py-3 text-[14px] font-semibold text-[#1F3A47]"
                >
                  <option value="all">{dp("all_prices")}</option>
                  <option value="under">{dp("under")}</option>
                  <option value="mid">{dp("mid")}</option>
                  <option value="over">{dp("over")}</option>
                </select>
              </div>
            )}

            {/* Desktop/tablet: full data-grid table */}
            <div className="hidden overflow-x-auto rounded-[18px] border border-[#E3E9EC] md:block">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[1.2fr_1.3fr_0.7fr_0.7fr_0.8fr_1fr_1.1fr_1.6fr] gap-3.5 bg-[#F5F5F7] px-6 py-4 text-[11.5px] font-bold uppercase tracking-wide text-[#6E7B80]">
                  <span>{dp("c_plot")}</span>
                  <span>{dp("c_building")}</span>
                  <span>{dp("c_floor")}</span>
                  <span>{dp("c_beds")}</span>
                  <span>{dp("c_baths")}</span>
                  <span>{dp("c_size")}</span>
                  <span>{dp("c_price")}</span>
                  <span>{dp("c_status")}</span>
                </div>
                {filteredPlots.map((p) => (
                  <div
                    key={p.plot}
                    className="grid grid-cols-[1.2fr_1.3fr_0.7fr_0.7fr_0.8fr_1fr_1.1fr_1.6fr] items-center gap-3.5 border-t border-[#EEF1F1] px-6 py-4.5 text-[14.5px] text-[#1F3A47]"
                    style={{ opacity: p.avail ? 1 : 0.55 }}
                  >
                    <span className="font-bold">{p.plot}</span>
                    <span className="text-[#5C6B71]">{p.building || "—"}</span>
                    <span className="text-[#5C6B71]">{p.floor || "—"}</span>
                    <span className="text-[#5C6B71]">{p.beds}</span>
                    <span className="text-[#5C6B71]">{p.baths ?? "—"}</span>
                    <span className="whitespace-nowrap text-[#5C6B71]">
                      {p.size ? `${p.size.toLocaleString("en-GB")} sq ft` : "—"}
                    </span>
                    <span className="whitespace-nowrap font-bold text-[#C1560F]">{p.price ? gbp(p.price) : "—"}</span>
                    <span className="flex flex-wrap items-center gap-2.5">
                      <span
                        className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
                        style={
                          p.avail
                            ? { background: "rgba(31,164,92,0.12)", color: "#137A42" }
                            : { background: "rgba(31,58,71,0.08)", color: "#6E7B80" }
                        }
                      >
                        {p.avail ? dp("s_available") : dp("s_reserved")}
                      </span>
                      {p.avail && (
                        <button
                          onClick={goRegister}
                          className="hi-pill inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#28567A] px-3.5 py-2 text-[12.5px] font-bold text-white"
                        >
                          {dp("enquire")}
                          <Icon name="chevronRight" className="h-3 w-3" strokeWidth={2.6} />
                        </button>
                      )}
                    </span>
                  </div>
                ))}
                {!filteredPlots.length && (
                  <div className="border-t border-[#EEF1F1] px-6 py-9 text-center text-[14.5px] text-[#6E7B80]">
                    {dp("av_none")}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: one card per plot instead of a table that needs a sideways scroll */}
            <div className="flex flex-col gap-3 md:hidden">
              {filteredPlots.map((p) => (
                <div
                  key={p.plot}
                  className="rounded-2xl border border-[#E3E9EC] p-4"
                  style={{ opacity: p.avail ? 1 : 0.55 }}
                >
                  <div className="mb-3.5 flex items-start justify-between gap-3">
                    <span className="text-[15.5px] font-bold text-[#1F3A47]">{p.plot}</span>
                    <span
                      className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
                      style={
                        p.avail
                          ? { background: "rgba(31,164,92,0.12)", color: "#137A42" }
                          : { background: "rgba(31,58,71,0.08)", color: "#6E7B80" }
                      }
                    >
                      {p.avail ? dp("s_available") : dp("s_reserved")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13.5px]">
                    {[
                      [dp("c_building"), p.building || "—", false],
                      [dp("c_floor"), p.floor || "—", false],
                      [dp("c_beds"), String(p.beds), false],
                      [dp("c_baths"), p.baths != null ? String(p.baths) : "—", false],
                      [dp("c_size"), p.size ? `${p.size.toLocaleString("en-GB")} sq ft` : "—", false],
                      [dp("c_price"), p.price ? gbp(p.price) : "—", true],
                    ].map(([label, value, isPrice], i) => (
                      <div key={i}>
                        <div className="text-[10.5px] font-bold uppercase tracking-wide text-[#8A969B]">{label}</div>
                        <div className={`mt-0.5 ${isPrice ? "font-bold text-[#C1560F]" : "text-[#1F3A47]"}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {p.avail && (
                    <button
                      onClick={goRegister}
                      className="hi-pill mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#28567A] px-3.5 py-3 text-[13px] font-bold text-white"
                    >
                      {dp("enquire")}
                      <Icon name="chevronRight" className="h-3 w-3" strokeWidth={2.6} />
                    </button>
                  )}
                </div>
              ))}
              {!filteredPlots.length && (
                <div className="rounded-2xl border border-[#EEF1F1] px-6 py-9 text-center text-[14.5px] text-[#6E7B80]">
                  {dp("av_none")}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {sectionOn.spec && (
        <section
          id="dp-spec"
          className="px-5 py-16 md:px-8 md:py-24"
          style={{
            backgroundColor: "#122530",
            backgroundImage: `radial-gradient(1200px 640px at 8% -12%, rgba(201,138,107,0.22), transparent 62%), linear-gradient(180deg, rgba(18,37,48,0.90) 0%, rgba(12,28,37,0.93) 55%, rgba(16,34,45,0.91) 100%), url("${resolveImage("uploads/marble-texture-background_38679-1053.avif", "")}")`,
            backgroundSize: "auto, auto, cover",
            backgroundPosition: "center, center, center",
            backgroundRepeat: "no-repeat, no-repeat, no-repeat",
            backgroundBlendMode: "screen, multiply, normal",
            boxShadow: "inset 0 1px 0 rgba(201,138,107,0.42), inset 0 -1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="mx-auto max-w-[1400px]">
            <span className="hi-eyebrow mb-3 block text-[#C98A6B]">{dp("spec_eyebrow")}</span>
            <h2 className="mb-11.5 max-w-[720px] text-[32px] font-bold tracking-tight text-[#F9F5F3]">
              {dp("spec_title")}
            </h2>
            {(() => {
              const specIdx = Math.min(specCat, pd.spec.length - 1);
              const active = pd.spec[specIdx];
              return (
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(220px,272px)_1fr]">
                  <div className="flex flex-col gap-2">
                    {pd.spec.map((g, i) => {
                      const isActive = i === specIdx;
                      return (
                        <button
                          key={g.k}
                          onClick={() => setSpecCat(i)}
                          className="hi-pill flex w-full items-center gap-3 rounded-2xl px-4.5 py-4 text-left text-[14.5px] font-bold tracking-tight"
                          style={{
                            background: isActive ? "#F9F5F3" : "rgba(255,255,255,0.05)",
                            color: isActive ? "#122530" : "rgba(249,245,243,0.78)",
                            border: `1px solid ${isActive ? "#F9F5F3" : "rgba(255,255,255,0.16)"}`,
                          }}
                        >
                          <Icon
                            name={specIconName(g.k)}
                            className="h-4.5 w-4.5 flex-none"
                            style={{ color: isActive ? "#C1560F" : "#C98A6B" }}
                          />
                          <span className="flex-1">{dp(g.k)}</span>
                          <span
                            className="text-[11.5px] font-semibold tabular-nums"
                            style={{ color: isActive ? "rgba(18,37,48,0.55)" : "rgba(249,245,243,0.45)" }}
                          >
                            {g.items.length}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-1 overflow-hidden rounded-[22px] border border-white/14 bg-white/[0.045] md:grid-cols-[1fr_34%]">
                    <div className="min-w-0 p-8">
                      <h3 className="mb-6 text-[clamp(21px,2.2vw,27px)] font-bold tracking-tight text-[#F9F5F3]">
                        {dp(active.k)}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {active.items.map((item, i) => (
                          <span
                            key={i}
                            className="flex items-start gap-3 border-b border-white/8 pb-3 text-[15.5px] leading-relaxed text-white/82"
                          >
                            <Icon name="check" className="mt-0.5 h-3.5 w-3.5 flex-none text-[#C98A6B]" strokeWidth={2.4} />
                            {item}
                          </span>
                        ))}
                      </div>
                      {active.note && <p className="mt-5 text-[13px] italic text-white/50">{active.note}</p>}
                    </div>
                    <div className="relative min-h-[320px] bg-[#16313D]">
                      <img
                        src={resolveImage(active.img, dp(active.k))}
                        alt={dp(active.k)}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = resolveImage(SPEC_FALLBACK_PHOTO[active.k] || active.img, dp(active.k));
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(90deg, rgba(18,37,48,0.55) 0%, rgba(18,37,48,0) 42%)" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
            <p className="mt-6.5 max-w-[760px] text-[12.5px] leading-relaxed text-white/45">{t("std_disclaimer")}</p>
          </div>
        </section>
      )}

      {sectionOn.gallery && (
        <section id="dp-gallery" style={{ background: "#0E2028" }} className="pb-19 pt-22">
          <div className="mx-auto max-w-[1400px] px-5 pb-8.5 md:px-8">
            <span className="hi-eyebrow mb-3 block text-[#C98A6B]">{dp("gal_eyebrow")}</span>
            <h2 className="text-[clamp(28px,3.2vw,40px)] font-bold tracking-tight text-[#F9F5F3]">{dp("gal_title")}</h2>
          </div>
          <div className="relative mx-auto flex max-w-[1400px] flex-col items-stretch gap-4 px-5 md:flex-row md:px-8">
            <div className="relative min-w-0 md:flex-1">
              <div className="relative overflow-hidden rounded-[20px] bg-[#16313D]" style={{ height: "clamp(300px,58vh,620px)" }}>
                <img
                  src={resolveImage(pd.gallery[galIdx].src, dp(pd.gallery[galIdx].cap))}
                  alt={dp(pd.gallery[galIdx].cap)}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = placeholderFor(pd.gallery[galIdx].src, dp(pd.gallery[galIdx].cap));
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute bottom-4.5 left-5 rounded-full bg-[rgba(11,26,33,0.72)] px-4 py-2 text-[12.5px] font-semibold text-[#F9F5F3] backdrop-blur-sm">
                  {dp(pd.gallery[galIdx].cap)}
                </span>
              </div>
              {pd.gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setGalIdx((i) => (i - 1 + pd.gallery.length) % pd.gallery.length)}
                    aria-label="Previous"
                    className="hi-icon-3d absolute left-11 top-1/2 z-[4] flex h-10.5 w-10.5 -translate-y-1/2 items-center justify-center rounded-full bg-white/82 text-[#1F3A47] shadow-[0_2px_8px_rgba(20,40,50,0.22)]"
                  >
                    <Icon name="chevronLeft" className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={() => setGalIdx((i) => (i + 1) % pd.gallery.length)}
                    aria-label="Next"
                    className="hi-icon-3d absolute right-11 top-1/2 z-[4] flex h-10.5 w-10.5 -translate-y-1/2 items-center justify-center rounded-full bg-white/82 text-[#1F3A47] shadow-[0_2px_8px_rgba(20,40,50,0.22)]"
                  >
                    <Icon name="chevronRight" className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <div className="absolute bottom-6 left-1/2 z-[4] flex -translate-x-1/2 items-center gap-1 rounded-full bg-[rgba(15,32,39,0.55)] px-2.5 py-1.5 backdrop-blur-sm">
                    {pd.gallery.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGalIdx(i)}
                        aria-label={`Photo ${i + 1}`}
                        className="flex h-4 w-4 items-center justify-center p-1"
                      >
                        <span
                          className="block h-1.5 w-1.5 rounded-full"
                          style={{ background: i === galIdx ? "#fff" : "rgba(255,255,255,0.5)" }}
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {pd.gallery.length > 1 && (
              <div
                className="hi-scroller flex flex-none flex-row gap-2.5 overflow-x-auto overflow-y-visible md:w-[90px] md:flex-col md:overflow-x-visible md:overflow-y-auto"
                style={{ maxHeight: "clamp(300px,58vh,620px)" }}
              >
                {pd.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setGalIdx(i)}
                    aria-label={dp(g.cap)}
                    className="flex-none overflow-hidden rounded-[10px]"
                    style={{
                      width: 90,
                      height: 64,
                      border: `2px solid ${i === galIdx ? "#C1560F" : "transparent"}`,
                      opacity: i === galIdx ? 1 : 0.62,
                    }}
                  >
                    <img
                      src={resolveImage(g.src, dp(g.cap))}
                      alt={dp(g.cap)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = placeholderFor(g.src, dp(g.cap));
                      }}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mx-auto max-w-[1400px] px-5 pt-5.5 md:px-8">
            <span className="text-[12.5px] text-white/50">{dp("gal_note")}</span>
          </div>
        </section>
      )}

      {sectionOn.location && (
        <section id="dp-location" className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <span className="hi-eyebrow mb-3 block text-[#C1560F]">{dp("loc_eyebrow")}</span>
            <h2 className="mb-10 max-w-[720px] text-[32px] font-bold tracking-tight text-[#1F3A47]">
              {d.id === "nexus" ? dp("loc_title") : d.place || d.locationLabel || d.region}
            </h2>

            <div className="mb-16 grid grid-cols-1 items-start gap-11 lg:grid-cols-[minmax(320px,1fr)_minmax(320px,1fr)]">
                <div>
                  {!!locCats.length && (
                    <>
                      <div className="mb-6.5 flex flex-wrap gap-2">
                        {locCats.map((c) => (
                          <FilterPill
                            key={c}
                            active={locCat === c}
                            onClick={() => setLocCat(c)}
                            label={dp(c)}
                            icon={locCatIconName(c)}
                            count={String((pd.amenities[c] || []).length)}
                          />
                        ))}
                      </div>
                      <div className="flex flex-col">
                        {(pd.amenities[locCat] || []).map((a, i) => (
                          <div key={i} className="flex items-center justify-between gap-5 border-b border-[#EEF1F1] py-4">
                            <span className="flex items-center gap-3 text-[15px] font-medium text-[#1F3A47]">
                              <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full bg-[#F2F6F8]">
                                <Icon name={locCatIconName(locCat)} className="h-4 w-4 text-[#28567A]" strokeWidth={1.7} />
                              </span>
                              {a.name}
                            </span>
                            <span className="whitespace-nowrap text-[13px] font-bold tabular-nums text-[#28567A]">{a.d}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {!locCats.length && !!d.accessPoints?.length && (
                    <div className="flex flex-col">
                      {d.accessPoints.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 border-b border-[#EEF1F1] py-4 text-[15px] font-medium text-[#1F3A47]">
                          <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full bg-[#F2F6F8]">
                            <Icon name={a.icon as Parameters<typeof Icon>[0]["name"]} className="h-4 w-4 text-[#28567A]" strokeWidth={1.7} />
                          </span>
                          {a.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden rounded-[20px]" style={{ height: "clamp(320px,46vh,460px)" }}>
                  {MAP_SRC[d.id] ? (
                    <img
                      src={resolveImage(MAP_SRC[d.id], `${d.name} local area map`)}
                      alt={`${d.name} local area map`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <iframe
                      src={mapEmbedSrc(d, pd)}
                      title={`${d.name} local area map`}
                      className="h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>
              </div>

            {!!pd.travel.length && (
              <div>
                <h3 className="mb-1.5 text-[20px] font-bold tracking-tight text-[#1F3A47]">{dp("travel_title")}</h3>
                <p className="mb-6 text-[13.5px] text-[#8B979C]">{dp("travel_note")}</p>
                <div className="flex flex-col gap-2.5">
                  {pd.travel.map((tr, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-[#F5F5F7] px-5 py-3.5">
                      <span className="text-[14.5px] font-medium text-[#1F3A47]">{tr.to}</span>
                      <span className="text-[13.5px] font-semibold text-[#28567A]">
                        {tr.n} min &middot; {dp(tr.mode)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <RegisterPanel d={d} pd={pd} dp={dp} t={t} lang={lang} />

      <NearbyDevs id={d.id} />

      <Footer onDevelopmentsClick={goDevelopments} />

      <DevStickyPanel d={d} dp={dp} t={t} lang={lang} />
    </div>
  );
}

function DevStickyPanel({
  d,
  dp,
  t,
  lang,
}: {
  d: NonNullable<ReturnType<typeof devById>>;
  dp: (key: string, vars?: Record<string, string | number>) => string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  lang: string;
}) {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", consent: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (sessionStorage.getItem("hi_pg_sticky_minimized") === "1") setMinimized(true);
    } catch {
      // sessionStorage unavailable (private mode, etc.) - default to expanded
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const avail = document.getElementById("dp-availability");
      const show = avail ? window.scrollY > avail.offsetTop : window.scrollY > 700;
      setVisible(show);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const minimize = () => {
    try {
      sessionStorage.setItem("hi_pg_sticky_minimized", "1");
    } catch {
      // ignore
    }
    setMinimized(true);
  };

  const expand = () => {
    try {
      sessionStorage.removeItem("hi_pg_sticky_minimized");
    } catch {
      // ignore
    }
    setMinimized(false);
  };

  const submit = async () => {
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    if (!form.name.trim() || !emailOk || !form.consent) {
      setError(t("modal_gate_error"));
      return;
    }
    setError("");
    setSubmitting(true);
    const ok = await submitEnquiry({
      type: "register",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      developmentId: d.id,
      developmentName: d.name,
      consent: form.consent,
      pageLang: lang,
    });
    setSubmitting(false);
    if (!ok) {
      setError(t("form_submit_error"));
      return;
    }
    setSubmitted(true);
  };

  if (minimized) {
    return (
      <button
        onClick={expand}
        aria-label={dp("cta_register")}
        title={dp("cta_register")}
        className="hi-pop fixed top-1/2 right-0 z-[150] hidden -translate-y-1/2 flex-col items-center gap-2 rounded-l-[14px] bg-[#C1560F] px-2.5 py-4 text-white shadow-[-8px_0_24px_rgba(10,20,25,0.3)] lg:flex"
      >
        <Icon name="message" className="h-4 w-4" strokeWidth={2} />
        <span className="text-[12px] font-bold" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          {dp("cta_register")}
        </span>
      </button>
    );
  }

  return (
    <div className="hi-in fixed top-1/2 right-[30px] z-[150] hidden max-h-[calc(100vh-130px)] w-[320px] -translate-y-1/2 overflow-auto lg:block">
      <div className="relative rounded-[20px] bg-[#122530] p-6.5 shadow-[0_24px_50px_rgba(10,20,25,0.4)]">
        <button
          onClick={minimize}
          aria-label="Minimise"
          title="Minimise"
          className="absolute right-3.5 top-3.5 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white/10 text-white/70"
        >
          <Icon name="minus" className="h-3 w-3" strokeWidth={2.4} />
        </button>
        <div className="mb-0.5 pr-5 text-[20px] font-bold tracking-tight text-[#F9F5F3]">{dp("sticky_title")}</div>
        <div className="mb-5 text-[12.5px] font-semibold text-white/55">{d.name}</div>
        {submitted ? (
          <div className="hi-in flex items-start gap-3">
            <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-full bg-[rgba(31,164,92,0.18)]">
              <Icon name="check" className="hi-check h-4 w-4 text-[#5FD39A]" strokeWidth={2.4} />
            </span>
            <p className="text-[13.5px] leading-relaxed text-white/82">{dp("reg_thanks")}</p>
          </div>
        ) : (
          <>
            <div className="mb-3.5 flex flex-col gap-2.5">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={t("modal_gate_name")}
                className="w-full rounded-[10px] border border-white/22 bg-white/6 px-3.5 py-3 text-[13.5px] text-[#F9F5F3] placeholder:text-white/45"
              />
              <input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder={t("modal_gate_email")}
                className="w-full rounded-[10px] border border-white/22 bg-white/6 px-3.5 py-3 text-[13.5px] text-[#F9F5F3] placeholder:text-white/45"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder={t("modal_gate_phone")}
                className="w-full rounded-[10px] border border-white/22 bg-white/6 px-3.5 py-3 text-[13.5px] text-[#F9F5F3] placeholder:text-white/45"
              />
            </div>
            <label className="mb-3.5 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                className="hi-checkbox mt-0.5"
              />
              <span className="text-[12px] leading-relaxed text-white/60">{t("modal_gate_consent")}</span>
            </label>
            {error && <div className="mb-3 text-[12.5px] text-[#E6A98C]">{error}</div>}
            <button
              onClick={submit}
              disabled={submitting}
              className="hi-pill flex w-full items-center justify-center rounded-full bg-[#C1560F] py-3.5 text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(193,86,15,0.34)] disabled:opacity-60"
            >
              {dp("cta_register")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  icon,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: Parameters<typeof Icon>[0]["name"];
  count?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="hi-pill inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-[13.5px] font-semibold"
      style={{
        border: `1px solid ${active ? "#1F3A47" : "#D7DEE2"}`,
        background: active ? "#1F3A47" : "#fff",
        color: active ? "#F9F5F3" : "#1F3A47",
      }}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5 flex-none" style={{ color: active ? "#F2CDB9" : "#C1560F" }} strokeWidth={1.8} />}
      {label}
      {count !== undefined && <span style={{ fontSize: 11, opacity: 0.6 }}>{count}</span>}
    </button>
  );
}

function RegisterPanel({
  d,
  pd,
  dp,
  t,
  lang,
}: {
  d: ReturnType<typeof devById>;
  pd: ReturnType<typeof pageDataFor>;
  dp: (key: string, vars?: Record<string, string | number>) => string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  lang: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", consent: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  if (!d || !pd) return null;

  const submit = async () => {
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    if (!form.name.trim() || !emailOk || !form.consent) {
      setError(t("modal_gate_error"));
      return;
    }
    setError("");
    setSubmitting(true);
    const ok = await submitEnquiry({
      type: "register",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      developmentId: d.id,
      developmentName: d.name,
      consent: form.consent,
      pageLang: lang,
    });
    setSubmitting(false);
    if (!ok) {
      setError(t("form_submit_error"));
      return;
    }
    setSubmitted(true);
  };

  return (
    <section className="bg-white px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-11 lg:grid-cols-2">
        <div>
          {pd.suite ? (
            <>
              <h3 className="mb-6.5 text-[clamp(26px,3vw,36px)] font-bold tracking-tight text-[#1F3A47]">
                {dp("suite_title")}
              </h3>
              <div className="mb-5.5 text-[16px] leading-relaxed text-[#5C6B71]">
                <div className="font-bold text-[#1F3A47]">{pd.suite.line1}</div>
                <div>{pd.suite.line2}</div>
                <div>{pd.suite.line3}</div>
              </div>
              <a
                href={pd.suite.maps}
                target="_blank"
                rel="noopener"
                className="hi-pill inline-flex items-center gap-2.5 rounded-full bg-[#1F3A47] px-6 py-3.5 text-[14px] font-bold text-white"
              >
                <Icon name="directions" className="h-4.5 w-4.5 flex-none" strokeWidth={2} />
                {dp("suite_dir")}
                <Icon name="arrowRight" className="h-4 w-4 flex-none" strokeWidth={2.2} />
              </a>
            </>
          ) : (
            <>
              <h3 className="mb-4 text-[clamp(26px,3vw,36px)] font-bold tracking-tight text-[#1F3A47]">{d.name}</h3>
              <p className="max-w-[400px] text-[16px] leading-relaxed text-[#5C6B71]">{dp("coming_soon_note")}</p>
            </>
          )}
        </div>

        <div className="rounded-[20px] bg-[#122530] p-8">
          <h3 className="mb-3 text-[clamp(19px,2vw,22px)] font-bold tracking-tight text-[#F9F5F3]">
            {devText(d, dp, "reg_title")}
          </h3>
          {submitted ? (
            <div className="hi-in mt-3.5 flex items-start gap-3.5">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[rgba(31,164,92,0.18)]">
                <Icon name="check" className="hi-check h-5 w-5 text-[#5FD39A]" strokeWidth={2.4} />
              </span>
              <p className="text-[15.5px] leading-relaxed text-white/82">{dp("reg_thanks")}</p>
            </div>
          ) : (
            <>
              <p className="mb-5 text-[14px] leading-relaxed text-white/70">{dp("reg_sub")}</p>
              <div className="mb-4 flex flex-col gap-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={t("modal_gate_name")}
                  className="rounded-[10px] border border-white/22 bg-white/6 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
                />
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder={t("modal_gate_email")}
                  className="rounded-[10px] border border-white/22 bg-white/6 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder={t("modal_gate_phone")}
                  className="rounded-[10px] border border-white/22 bg-white/6 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
                />
              </div>
              <label className="mb-4.5 flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  className="hi-checkbox mt-0.5"
                />
                <span className="text-[13px] leading-relaxed text-white/66">{t("modal_gate_consent")}</span>
              </label>
              {error && <div className="mb-3.5 text-[13px] text-[#E6A98C]">{error}</div>}
              <button
                onClick={submit}
                disabled={submitting}
                className="hi-pill inline-flex items-center rounded-full bg-[#C1560F] px-7 py-3.5 text-[14.5px] font-bold text-white shadow-[0_12px_26px_rgba(193,86,15,0.34)] disabled:opacity-60"
              >
                {dp("reg_submit")}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function NearbyDevs({ id }: { id: string }) {
  const { dp } = useLanguage();
  const router = useRouter();
  const d = devById(id);
  const pd = pageDataFor(id);
  if (!d || !pd || !pd.nearby.length) return null;
  const devs = pd.nearby.map((nid) => devById(nid)).filter(Boolean) as NonNullable<ReturnType<typeof devById>>[];
  if (!devs.length) return null;

  return (
    <section className="bg-[#F5F5F7] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-1.5 text-[26px] font-bold tracking-tight text-[#1F3A47]">{dp("nearby_title")}</h2>
        <p className="mb-8 text-[14.5px] text-[#8B979C]">{devText(d, dp, "nearby_sub")}</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {devs.map((nd) => (
            <div
              key={nd.id}
              onClick={() => router.push(`/developments/${nd.id}`)}
              className="hi-card cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(20,40,50,0.08)]"
            >
              <img
                src={resolveImage(buildShots(nd)[0], nd.name)}
                alt={nd.name}
                className="h-[160px] w-full object-cover"
              />
              <div className="p-5">
                <div className="mb-1 text-[16px] font-bold text-[#1F3A47]">{nd.name}</div>
                <div className="text-[13px] text-[#6E7B80]">{nd.region}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilmSection({
  d,
  pd,
  dp,
}: {
  d: ReturnType<typeof devById>;
  pd: ReturnType<typeof pageDataFor>;
  dp: (key: string, vars?: Record<string, string | number>) => string;
}) {
  const [open, setOpen] = useState(false);
  if (!d || !pd) return null;
  const embedUrl = VIDEO_EMBEDS[d.id];
  if (!embedUrl) return null;

  const isYoutube = isYoutubeEmbed(embedUrl);
  const watchUrl = isYoutube ? youtubeWatchUrl(embedUrl) : null;

  return (
    <section style={{ background: "#0E2028" }}>
      <div className="relative overflow-hidden" style={{ height: "clamp(340px,60vh,620px)" }}>
        <img
          src={resolveImage(pd.hero, d.name)}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(0.9) brightness(0.62)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/66">{dp("vid_eyebrow")}</div>
          <h2 className="text-[#F9F5F3]" style={{ fontFamily: "Inter,sans-serif", fontWeight: 800, fontSize: "clamp(28px,3.6vw,46px)", letterSpacing: "-0.03em" }}>
            {devText(d, dp, "vid_title")}
          </h2>
          <button
            onClick={() => setOpen(true)}
            aria-label={devText(d, dp, "vid_title")}
            className="hi-pulse mt-1.5 flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/40 bg-white/14 text-[#F9F5F3] backdrop-blur-sm"
          >
            <Icon name="play" className="h-6.5 w-6.5" style={{ marginInlineStart: 4 }} />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center p-6"
          style={{ background: "rgba(9,20,26,0.92)" }}
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full" style={{ maxWidth: 920, aspectRatio: "16/9" }} onClick={(e) => e.stopPropagation()}>
            <iframe
              src={embedUrl}
              title={d.name}
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full rounded-xl border-0"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
            />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute right-0 text-[14px] font-semibold text-white"
              style={{ top: -44 }}
            >
              {"Close ✕"}
            </button>
            {isYoutube && watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute left-0 text-[13px] text-white underline"
                style={{ bottom: -32, opacity: 0.75 }}
              >
                Trouble playing? Watch on YouTube ↗
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
