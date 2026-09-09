"use client";

import { useMemo, useState } from "react";
import { devById, epcColorsOf, epcOf, gbp, pageDataFor, priceLabelFor, statusMetaFor } from "@/lib/data";
import { devBlurb, devBlurb2, devHeadline } from "@/lib/blurb";
import { resolveImage, placeholderFor } from "@/lib/image";
import { resolveLogo } from "@/lib/logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { submitEnquiry } from "@/lib/enquiry";
import Icon from "@/components/Icon";

const TABS = [
  { key: "overview", nav: "nav_overview" },
  { key: "gallery", nav: "nav_gallery" },
  { key: "avail", nav: "nav_avail" },
  { key: "spec", nav: "nav_spec" },
  { key: "location", nav: "nav_location" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface GateForm {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  submitted: boolean;
}

const EMPTY_GATE: GateForm = { name: "", email: "", phone: "", consent: false, submitted: false };

export default function DevelopmentPage() {
  const { t, dp, lang } = useLanguage();
  const { pageDevId, closeDevPage, liked, toggleLiked, startPriority } = useAppState();
  const [tab, setTab] = useState<TabKey>("overview");
  const [locCat, setLocCat] = useState("cat_transport");
  const [gate, setGate] = useState<GateForm>(EMPTY_GATE);
  const [avBuilding, setAvBuilding] = useState("all");
  const [avBeds, setAvBeds] = useState("all");

  const d = pageDevId ? devById(pageDevId) : null;
  const pd = pageDevId ? pageDataFor(pageDevId) : undefined;

  const buildings = useMemo(() => {
    if (!pd) return [];
    return Array.from(new Set(pd.plots.map((p) => p.building).filter(Boolean))) as string[];
  }, [pd]);

  const bedsOptions = useMemo(() => {
    if (!pd) return [];
    return Array.from(new Set(pd.plots.map((p) => p.beds))).sort((a, b) => a - b);
  }, [pd]);

  const filteredPlots = useMemo(() => {
    if (!pd) return [];
    return pd.plots.filter(
      (p) => (avBuilding === "all" || p.building === avBuilding) && (avBeds === "all" || p.beds === Number(avBeds))
    );
  }, [pd, avBuilding, avBeds]);

  if (!pageDevId || !d || !pd) return null;

  const status = statusMetaFor(d, t);
  const epc = epcOf(d);
  const epcColors = epcColorsOf(epc);
  const isLiked = liked.has(d.id);
  const priceLabel = priceLabelFor(d, t);
  const tagline = d.tagline || t("dev_tagline", { region: d.region });
  const logoSrc = resolveLogo(d.logo, d.name);
  const locCats = Object.keys(pd.amenities);

  const goRegister = () => {
    closeDevPage();
    setTimeout(() => document.getElementById("hi-register")?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <div dir="auto" className="hi-fade fixed inset-0 z-[400] overflow-y-auto overflow-x-hidden bg-white text-[#1F3A47]">
      <div
        className="sticky top-0 z-30 shadow-[0_10px_26px_-12px_rgba(0,0,0,0.5)]"
        style={{ background: "rgba(14,32,40,0.97)", backdropFilter: "blur(14px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              onClick={closeDevPage}
              className="hi-pill inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/8 px-4 py-2 text-[13px] font-semibold text-[#F9F5F3]"
            >
              <Icon name="chevronLeft" className="h-3.5 w-3.5" />
              {dp("back")}
            </button>
            <span className="whitespace-nowrap text-[17px] font-extrabold tracking-tight text-[#F9F5F3]">{d.name}</span>
            <span
              className="flex-none whitespace-nowrap rounded-full px-3 py-1 text-[10.5px] font-bold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <nav className="hi-scroller flex max-w-full items-center gap-5 overflow-x-auto">
            {TABS.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className="whitespace-nowrap text-[13.5px] font-semibold"
                style={{ color: tab === tb.key ? "#F9F5F3" : "rgba(249,245,243,0.6)" }}
              >
                {dp(tb.nav)}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleLiked(d.id)}
              aria-pressed={isLiked}
              className="hi-icon-3d flex h-10 w-10 flex-none items-center justify-center rounded-full border"
              style={{ borderColor: isLiked ? "#C1560F" : "rgba(255,255,255,0.24)", background: isLiked ? "rgba(193,86,15,0.15)" : "rgba(255,255,255,0.08)" }}
            >
              <Icon name={isLiked ? "heart-fill" : "heart"} className="h-4 w-4 text-[#C1560F]" />
            </button>
            <button
              onClick={goRegister}
              className="hi-pill rounded-full bg-[#C1560F] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(193,86,15,0.34)]"
            >
              {dp("cta_register")}
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
        {logoSrc && (
          <div className="hi-pop absolute left-5 top-24 md:left-8 md:top-28">
            <img src={logoSrc} alt={`${d.name} logo`} className="h-10 w-auto md:h-12" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-13 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="hi-eyebrow inline-flex items-center gap-1.5 text-white/82">
                <Icon name="pin" className="h-3.5 w-3.5 text-[#C98A6B]" />
                {d.locationLabel || d.region}
              </span>
              <span className="rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: status.bg, color: status.color }}>
                {status.label}
              </span>
            </div>
            <h1
              className="mb-4.5 font-extrabold text-[#F9F5F3]"
              style={{ fontSize: "clamp(42px,9vw,110px)", lineHeight: 0.92, letterSpacing: "-0.045em" }}
            >
              {d.name}
            </h1>
            <p className="mb-6.5 max-w-[640px] whitespace-pre-line text-[clamp(17px,2vw,21px)] leading-snug text-white/86">
              {tagline}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t("price_from")}</span>
                <bdi className="text-[26px] font-extrabold tracking-tight text-[#F9F5F3]">{priceLabel}</bdi>
              </div>
              {d.accessNote && (
                <>
                  <span className="h-6.5 w-px bg-white/20" />
                  <span className="text-[14.5px] font-bold text-[#C98A6B]">{d.accessNote}</span>
                </>
              )}
              {epc && (
                <span
                  className="inline-flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4"
                  style={{ background: epcColors.bg, border: `1px solid ${epcColors.border}` }}
                >
                  <span className="text-[13px] font-bold" style={{ color: epcColors.fg }}>
                    {t("epc_label")} {epc}
                  </span>
                  <span className="h-3.5 w-px" style={{ background: epcColors.border }} />
                  <span className="text-[13px] font-medium" style={{ color: epcColors.soft }}>
                    {epc === "A" ? t("epc_benefit_lowest") : t("epc_benefit")}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {tab === "overview" && (
        <section className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <span className="hi-eyebrow mb-5.5 block text-[#C1560F]">{dp("ov_eyebrow")}</span>
              <h2
                className="mb-6.5 font-extrabold text-[#1F3A47]"
                style={{ fontSize: "clamp(30px,3.6vw,46px)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
              >
                {devHeadline(d, dp)}
              </h2>
              <p className="mb-4.5 text-[16.5px] leading-relaxed text-[#5C6B71]">{devBlurb(d, dp)}</p>
              <p className="text-[16.5px] leading-relaxed text-[#5C6B71]">{devBlurb2(d, dp)}</p>
            </div>

            {!!pd.facts.length && (
              <div className="rounded-[22px] bg-[#F5F5F7] p-8 md:p-9">
                <div className="mb-6.5 text-[19px] font-extrabold tracking-tight text-[#1F3A47]">{dp("facts_title")}</div>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {pd.facts.map((f) => (
                    <div key={f.k}>
                      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(193,86,15,0.12)]">
                        <Icon name="check" className="h-4 w-4 text-[#C1560F]" />
                      </div>
                      <div className="mb-1.5 text-[24px] font-extrabold tracking-tight text-[#1F3A47]">{f.v || "—"}</div>
                      <div className="text-[13px] font-medium leading-snug text-[#6E7B80]">{dp(f.k)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!!pd.suite && (
            <div className="mx-auto mt-16 max-w-[1400px] rounded-[22px] bg-[#16313D] p-8 md:p-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <span className="hi-eyebrow mb-4 block text-[#C98A6B]">{dp("suite_title")}</span>
                  <div className="mb-1 text-[19px] font-bold text-[#F9F5F3]">{pd.suite.line1}</div>
                  <div className="text-[15px] text-white/70">{pd.suite.line2}</div>
                  <div className="mb-5 text-[15px] text-white/70">{pd.suite.line3}</div>
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${pd.suite.phone}`} className="hi-link inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#F9F5F3]">
                      <Icon name="phone" className="h-3.5 w-3.5" />
                      {pd.suite.phone}
                    </a>
                    <a href={`mailto:${pd.suite.email}`} className="hi-link inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#F9F5F3]">
                      <Icon name="mail" className="h-3.5 w-3.5" />
                      {pd.suite.email}
                    </a>
                    <a
                      href={pd.suite.maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hi-pill inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-[13px] font-semibold text-[#F9F5F3]"
                    >
                      <Icon name="external" className="h-3.5 w-3.5" />
                      {dp("suite_dir")}
                    </a>
                  </div>
                </div>
                {!!pd.hours.length && (
                  <div>
                    <div className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-white/60">{dp("suite_hours")}</div>
                    <div className="flex flex-col gap-2">
                      {pd.hours.map(([day, hrs]) => (
                        <div key={day} className="flex items-center justify-between border-b border-white/10 py-1.5 text-[14px]">
                          <span className="text-white/70">{dp(day)}</span>
                          <span className="font-semibold text-[#F9F5F3]">{hrs === "closed" ? dp("closed") : hrs}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {tab === "gallery" && (
        <section className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <span className="hi-eyebrow mb-3 block text-[#C1560F]">{dp("gal_eyebrow")}</span>
            <h2 className="mb-2.5 text-[32px] font-extrabold tracking-tight text-[#1F3A47]">{dp("gal_title")}</h2>
            <p className="mb-9 text-[14.5px] text-[#8B979C]">{dp("gal_note")}</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pd.gallery.map((g, i) => (
                <div key={i} className="overflow-hidden rounded-2xl">
                  <img
                    src={resolveImage(g.src, dp(g.cap))}
                    alt={dp(g.cap)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = placeholderFor(g.src, dp(g.cap));
                    }}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="bg-[#F5F5F7] px-4 py-2.5 text-[13px] font-medium text-[#5C6B71]">{dp(g.cap)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "avail" && (
        <section className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <span className="hi-eyebrow mb-3 block text-[#C1560F]">{dp("av_eyebrow")}</span>
            <h2 className="mb-2.5 text-[32px] font-extrabold tracking-tight text-[#1F3A47]">{dp("av_title")}</h2>
            <p className="mb-8 max-w-[560px] text-[15px] leading-relaxed text-[#8B979C]">{dp("av_sub")}</p>

            {!!buildings.length && (
              <div className="mb-8 flex flex-wrap gap-2">
                <FilterPill active={avBuilding === "all"} onClick={() => setAvBuilding("all")} label={dp("all_buildings")} />
                {buildings.map((b) => (
                  <FilterPill key={b} active={avBuilding === b} onClick={() => setAvBuilding(b)} label={b} />
                ))}
                <span className="mx-2 w-px bg-[#D7DEE2]" />
                <FilterPill active={avBeds === "all"} onClick={() => setAvBeds("all")} label={dp("all_beds")} />
                {bedsOptions.map((b) => (
                  <FilterPill key={b} active={avBeds === String(b)} onClick={() => setAvBeds(String(b))} label={dp("beds_n", { n: b })} />
                ))}
              </div>
            )}

            {!filteredPlots.length ? (
              <p className="rounded-2xl bg-[#F5F5F7] p-8 text-[15px] text-[#6E7B80]">{dp("av_demo") || dp("av_none")}</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#E3E9EC]">
                <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="bg-[#F5F5F7] text-[12px] font-semibold uppercase tracking-wide text-[#6E7B80]">
                      <Th>{dp("c_plot")}</Th>
                      <Th>{dp("c_building")}</Th>
                      <Th>{dp("c_beds")}</Th>
                      <Th>{dp("c_baths")}</Th>
                      <Th>{dp("c_size")}</Th>
                      <Th>{dp("c_price")}</Th>
                      <Th>{dp("c_status")}</Th>
                      <Th> </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlots.map((p) => (
                      <tr key={p.plot} className="border-t border-[#E3E9EC]">
                        <Td className="font-semibold text-[#1F3A47]">{p.plot}</Td>
                        <Td>{p.building || "—"}</Td>
                        <Td>{p.beds}</Td>
                        <Td>{p.baths ?? "—"}</Td>
                        <Td>{p.size ? `${p.size} sq ft` : "—"}</Td>
                        <Td className="font-semibold text-[#C1560F]">{p.price ? gbp(p.price) : "—"}</Td>
                        <Td>
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                            style={
                              p.avail
                                ? { background: "rgba(46,134,216,0.12)", color: "#1A5A96" }
                                : { background: "rgba(201,138,107,0.2)", color: "#8a5636" }
                            }
                          >
                            {p.avail ? dp("s_available") : dp("s_reserved")}
                          </span>
                        </Td>
                        <Td>
                          <button onClick={goRegister} className="hi-link text-[13px] font-semibold text-[#28567A]">
                            {dp("enquire")}
                          </button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "spec" && (
        <section className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <span className="hi-eyebrow mb-3 block text-[#C1560F]">{dp("spec_eyebrow")}</span>
            <h2 className="mb-10 max-w-[720px] text-[32px] font-extrabold tracking-tight text-[#1F3A47]">
              {dp("spec_title")}
            </h2>
            <div className="flex flex-col gap-14">
              {pd.spec.map((g) => (
                <div key={g.k} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
                  <img src={resolveImage(g.img, dp(g.k))} alt={dp(g.k)} className="h-[260px] w-full rounded-2xl object-cover" />
                  <div>
                    <h3 className="mb-4 text-[22px] font-extrabold tracking-tight text-[#1F3A47]">{dp(g.k)}</h3>
                    <ul className="flex flex-col gap-2.5">
                      {g.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#5C6B71]">
                          <Icon name="check" className="mt-1 h-3.5 w-3.5 flex-none text-[#C1560F]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    {g.note && <p className="mt-4 text-[13px] text-[#8B979C]">{g.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "location" && (
        <section className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <span className="hi-eyebrow mb-3 block text-[#C1560F]">{dp("loc_eyebrow")}</span>
            <h2 className="mb-8 max-w-[720px] text-[32px] font-extrabold tracking-tight text-[#1F3A47]">
              {dp("loc_title")}
            </h2>

            {!!locCats.length && (
              <>
                <div className="mb-7 flex flex-wrap gap-2">
                  {locCats.map((c) => (
                    <FilterPill key={c} active={locCat === c} onClick={() => setLocCat(c)} label={dp(c)} />
                  ))}
                </div>
                <div className="mb-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(pd.amenities[locCat] || []).map((a, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-[#E3E9EC] px-5 py-3.5">
                      <span className="text-[14.5px] font-medium text-[#1F3A47]">{a.name}</span>
                      <span className="text-[13px] font-semibold text-[#8B979C]">{a.d}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!!pd.travel.length && (
              <div>
                <h3 className="mb-1.5 text-[20px] font-extrabold tracking-tight text-[#1F3A47]">{dp("travel_title")}</h3>
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

      <DownloadsGate d={d} gate={gate} setGate={setGate} dp={dp} t={t} lang={lang} />

      {isComingWithNote(d.status) && (
        <div className="bg-[#F5F5F7] px-5 py-12 text-center md:px-8">
          <p className="mx-auto max-w-[560px] text-[14.5px] leading-relaxed text-[#6E7B80]">{dp("coming_soon_note")}</p>
          <button
            onClick={() => startPriority(d.region)}
            className="hi-pill mt-5 inline-flex items-center gap-2 rounded-full bg-[#1F3A47] px-6 py-3.5 text-[14px] font-bold text-white"
          >
            {t("cta_priority")}
          </button>
        </div>
      )}

      <NearbyDevs id={d.id} />
    </div>
  );
}

function isComingWithNote(status: string) {
  return status !== "live";
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="hi-pill rounded-full px-4 py-2 text-[13px] font-semibold"
      style={{
        border: `1px solid ${active ? "#16313D" : "#D7DEE2"}`,
        background: active ? "#16313D" : "#fff",
        color: active ? "#fff" : "#28567A",
      }}
    >
      {label}
    </button>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3.5 ${className}`}>{children}</td>;
}

function DownloadsGate({
  d,
  gate,
  setGate,
  dp,
  t,
  lang,
}: {
  d: ReturnType<typeof devById>;
  gate: GateForm;
  setGate: (fn: (g: GateForm) => GateForm) => void;
  dp: (key: string, vars?: Record<string, string | number>) => string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  lang: string;
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (!d) return null;
  const docs = [
    d.docs.brochure && { key: "doc_brochure" },
    d.docs.factsheet && { key: "doc_factsheet" },
    d.docs.investor && { key: "doc_investor" },
  ].filter(Boolean) as { key: string }[];
  if (!docs.length) return null;

  const submit = async () => {
    const emailOk = /\S+@\S+\.\S+/.test(gate.email);
    if (!gate.name.trim() || !emailOk || !gate.consent) {
      setError(t("modal_gate_error"));
      return;
    }
    setError("");
    setSubmitting(true);
    const ok = await submitEnquiry({
      type: "download_gate",
      name: gate.name.trim(),
      email: gate.email.trim(),
      phone: gate.phone.trim() || undefined,
      developmentId: d.id,
      developmentName: d.name,
      consent: gate.consent,
      pageLang: lang,
    });
    setSubmitting(false);
    if (!ok) {
      setError(t("form_submit_error"));
      return;
    }
    setGate((g) => ({ ...g, submitted: true }));
  };

  return (
    <section id="dp-downloads" className="bg-[#16313D] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[680px] text-center">
        <h2 className="mb-3 text-[30px] font-extrabold tracking-tight text-[#F9F5F3]">{dp("dl_title")}</h2>
        <p className="mb-9 text-[15px] leading-relaxed text-white/72">{dp("dl_sub")}</p>

        {gate.submitted ? (
          <div className="flex flex-wrap justify-center gap-3">
            {docs.map((doc) => (
              <span
                key={doc.key}
                className="hi-pill inline-flex items-center gap-2 rounded-full bg-[#C1560F] px-6 py-3.5 text-[14px] font-bold text-white"
              >
                <Icon name="download" className="h-4 w-4" />
                {dp(doc.key)}
              </span>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-[440px] text-left">
            <div className="mb-4 grid grid-cols-1 gap-3.5">
              <input
                value={gate.name}
                onChange={(e) => setGate((g) => ({ ...g, name: e.target.value }))}
                placeholder={t("modal_gate_name")}
                className="rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
              />
              <input
                value={gate.email}
                onChange={(e) => setGate((g) => ({ ...g, email: e.target.value }))}
                placeholder={t("modal_gate_email")}
                className="rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
              />
              <input
                value={gate.phone}
                onChange={(e) => setGate((g) => ({ ...g, phone: e.target.value }))}
                placeholder={t("modal_gate_phone")}
                className="rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
              />
            </div>
            <label className="mb-5 flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={gate.consent}
                onChange={(e) => setGate((g) => ({ ...g, consent: e.target.checked }))}
                className="mt-0.5"
              />
              <span className="text-[13px] leading-relaxed text-white/68">{t("modal_gate_consent")}</span>
            </label>
            {error && <div className="mb-4 text-[13px] text-[#E6A98C]">{error}</div>}
            <button
              onClick={submit}
              disabled={submitting}
              className="hi-pill w-full rounded-full bg-[#C1560F] py-3.5 text-[14.5px] font-bold text-white disabled:opacity-60"
            >
              {t("modal_gate_submit")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function NearbyDevs({ id }: { id: string }) {
  const { dp } = useLanguage();
  const { openDevPage: goPage } = useAppState();
  const pd = pageDataFor(id);
  if (!pd || !pd.nearby.length) return null;
  const devs = pd.nearby.map((nid) => devById(nid)).filter(Boolean) as NonNullable<ReturnType<typeof devById>>[];
  if (!devs.length) return null;

  return (
    <section className="bg-[#F5F5F7] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="mb-1.5 text-[26px] font-extrabold tracking-tight text-[#1F3A47]">{dp("nearby_title")}</h2>
        <p className="mb-8 text-[14.5px] text-[#8B979C]">{dp("nearby_sub")}</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {devs.map((nd) => (
            <div
              key={nd.id}
              onClick={() => goPage(nd.id)}
              className="hi-card cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_6px_18px_rgba(20,40,50,0.08)]"
            >
              <img
                src={resolveImage(nd.image, nd.name)}
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
