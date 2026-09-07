"use client";

import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const FEATURES: { key: string; icon: Parameters<typeof Icon>[0]["name"]; wide?: boolean }[] = [
  { key: "std_i1", icon: "building", wide: true },
  { key: "std_i2", icon: "compare" },
  { key: "std_i3", icon: "leaf" },
  { key: "std_i4", icon: "building" },
  { key: "std_i6", icon: "shield" },
];

export default function Standard() {
  const { t } = useLanguage();

  return (
    <section
      id="hi-standard"
      className="hi-section relative"
      style={{
        backgroundColor: "#16313D",
        backgroundImage:
          "radial-gradient(1200px 640px at 8% -12%, rgba(201,138,107,0.22), transparent 62%), linear-gradient(180deg, rgba(21,47,60,0.90) 0%, rgba(14,33,42,0.93) 55%, rgba(18,40,51,0.91) 100%)",
        boxShadow: "inset 0 1px 0 rgba(201,138,107,0.42), inset 0 -1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-10">
          <div className="max-w-[720px] flex-[1_1_620px]">
            <span className="hi-eyebrow mb-6 block text-[#C98A6B]">{t("std_eyebrow")}</span>
            <h2
              className="font-extrabold text-[#F9F5F3]"
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
                    style={{ backgroundImage: `url(${resolveImage("uploads/SJH_0001.webp", "Kitchen")})` }}
                  />
                  <div className="flex flex-col justify-center gap-3.5 p-9">
                    <FeatureIcon icon={f.icon} />
                    <h3 className="text-[24px] font-extrabold tracking-tight text-[#F9F5F3]">{t(`${f.key}_title`)}</h3>
                    <p className="max-w-[460px] text-[16px] leading-relaxed text-white/72">{t(`${f.key}_body`)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col gap-3.5 p-8">
                  <FeatureIcon icon={f.icon} />
                  <h3 className="text-[19.5px] font-extrabold tracking-tight text-[#F9F5F3]">{t(`${f.key}_title`)}</h3>
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

function FeatureIcon({ icon }: { icon: Parameters<typeof Icon>[0]["name"] }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(201,138,107,0.16)]">
      <Icon name={icon} className="h-5 w-5 text-[#C98A6B]" strokeWidth={1.7} />
    </div>
  );
}
