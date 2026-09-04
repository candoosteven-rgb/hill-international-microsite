"use client";

import { useLanguage } from "@/lib/i18n";
import { regions } from "@/lib/data";
import { useAppState } from "@/lib/app-state";

export default function Hero() {
  const { t } = useLanguage();
  const { setRegionFilter } = useAppState();

  const goRegion = (region: string) => {
    setRegionFilter(region);
    document.getElementById("hi-developments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "min(880px,92vh)", minHeight: 560, background: "#0E2028" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(1100px 620px at 82% 8%, rgba(111,168,214,0.22), transparent 60%), radial-gradient(900px 700px at 8% 92%, rgba(193,86,15,0.22), transparent 60%), linear-gradient(160deg,#12262F 0%,#0E2028 55%,#0D1214 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(0deg, rgba(9,19,25,0.96) 0%, rgba(9,19,25,0.5) 34%, rgba(9,19,25,0.14) 60%, rgba(9,19,25,0.42) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-[3] px-5 pb-14 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <span className="hi-eyebrow mb-4 block text-[#C98A6B]">{t("hero_a_eyebrow")}</span>
          <h1
            className="max-w-[1180px] font-extrabold text-[#F9F5F3]"
            style={{ fontSize: "clamp(38px,6.4vw,92px)", lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            {t("hero_a_title_pre")} <em className="not-italic text-[#C1560F]">{t("hero_a_title_em")}</em>
          </h1>
          <p className="mt-6 max-w-[640px] text-[17px] leading-relaxed text-white/75">{t("hero_a_sub")}</p>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#hi-developments"
                className="hi-pill inline-flex items-center rounded-full bg-[#C1560F] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(193,86,15,0.36)]"
              >
                {t("hero_cta1")}
              </a>
              <a
                href="#hi-register"
                className="hi-pill inline-flex items-center rounded-full border border-white/40 bg-white/6 px-7 py-4 text-[15px] font-bold text-[#F9F5F3]"
              >
                {t("hero_cta2")}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => goRegion(r)}
                  className="hi-pill rounded-full border border-white/25 bg-white/8 px-4 py-2 text-[13px] font-semibold text-white/85"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
