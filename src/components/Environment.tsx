"use client";

import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const CARDS: { key: string; icon: Parameters<typeof Icon>[0]["name"]; img: string }[] = [
  { key: "env_c1", icon: "bolt", img: "uploads/opt/istock-1427519129.jpg" },
  { key: "env_c2", icon: "sprout", img: "uploads/epd.webp" },
  { key: "env_c3", icon: "crane", img: "uploads/opt/screenshot-2026-08-13-114054.jpg" },
];

export default function Environment() {
  const { t } = useLanguage();

  return (
    <section id="hi-environment" className="hi-section relative overflow-hidden bg-[#EDF2EC]" style={{ paddingBottom: 130 }}>
      <img
        src={resolveImage("uploads/opt/sky-zero-forest-aerial.jpg", "Forest")}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.5]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(237,242,236,0.96) 0%, rgba(237,242,236,0.93) 42%, rgba(237,242,236,0.55) 68%, rgba(237,242,236,0.18) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px]">
        <Reveal className="mb-14 max-w-[620px]">
          <div className="hi-eyebrow mb-6 flex items-center gap-3 text-[#2E5A42]">
            <Icon name="leaf" className="h-4 w-4" />
            {t("env_eyebrow")}
          </div>
          <h2
            className="font-bold text-[#1F3A47]"
            style={{ fontSize: "clamp(30px,3.6vw,46px)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
          >
            {t("env_title")}
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-[#5C6B71]">{t("env_body")}</p>
        </Reveal>

        <Reveal delay={1} className="grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <div key={c.key} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E3E9EC] bg-white">
              <div
                className="h-[190px] bg-cover bg-center"
                style={{ backgroundImage: `url("${resolveImage(c.img, t(`${c.key}_title`))}")` }}
              />
              <div className="p-7">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EDF2EC]">
                  <Icon name={c.icon} className="h-5 w-5 text-[#1F3A47]" />
                </div>
                <h3 className="mb-2.5 text-[20px] font-bold tracking-tight text-[#1F3A47]">
                  {t(`${c.key}_title`)}
                </h3>
                <p className="text-[15.5px] leading-relaxed text-[#6E7B80]">{t(`${c.key}_body`)}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
