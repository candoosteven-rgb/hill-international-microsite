"use client";

import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Reveal from "@/components/Reveal";

const STATS = ["about_stat1", "about_stat2", "about_stat3", "about_stat4"];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="hi-about" className="hi-section bg-black" style={{ paddingTop: 130 }}>
      <div className="mx-auto max-w-[1040px] text-center">
        <Reveal>
          <div className="mb-3.5 text-[19px] font-semibold tracking-tight text-[#00ACE5]">
            Foundations you can lean on
          </div>
          <h2
            className="mx-auto font-bold text-[#F5F5F7]"
            style={{ fontSize: "clamp(40px,6.4vw,74px)", lineHeight: 1.05, letterSpacing: "-0.045em" }}
          >
            {t("about_title")}
          </h2>
          <p className="mx-auto mt-6 max-w-[660px] text-[21px] leading-snug tracking-tight text-[#A1A1A6]">
            {t("about_body")}
          </p>
        </Reveal>

        <Reveal delay={1} className="mx-auto mt-14 max-w-[620px]">
          <p className="text-[19px] font-semibold leading-snug tracking-tight text-[#F5F5F7]">
            &ldquo;{t("about_founder_quote")}&rdquo;
          </p>
          <p className="mt-3 text-[14px] text-[#C98A6B]">{t("about_founder_name")}</p>
        </Reveal>

        <Reveal delay={1} className="mx-auto mt-10">
          <div className="h-[340px] overflow-hidden rounded-[28px] md:h-[520px]">
            <img
              src={resolveImage("uploads/number-92-dining-kitchen.jpg.webp", "Hill International")}
              alt="Hill International development"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={1} className="mx-auto mt-16 flex max-w-[960px] flex-wrap justify-center gap-x-12 gap-y-10">
          {STATS.map((s) => (
            <div key={s} className="flex-[0_1_190px]">
              <div
                className="font-bold text-[#F5F5F7]"
                style={{ fontSize: "clamp(38px,4.4vw,54px)", lineHeight: 1, letterSpacing: "-0.045em" }}
              >
                {t(`${s}_num`)}
              </div>
              <div className="mx-auto mt-3 max-w-[210px] text-[15px] leading-snug text-[#A1A1A6]">
                {t(`${s}_label`)}
              </div>
            </div>
          ))}
        </Reveal>

        <div className="mx-auto mt-14 h-px w-full max-w-[640px] bg-white/15" />

        <Reveal delay={2} className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {[
            ["uploads/whathouse-award-white.png", "WhatHouse? Awards", "h-24 md:h-28"],
            ["uploads/hbf-award-white.png", "Home Builders Federation 5-star rating", "h-24 md:h-28"],
            ["uploads/trustpilot-white.png", "Trustpilot 4.9 rating", "h-16 md:h-20"],
          ].map(([src, alt, size]) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={resolveImage(src, alt)} alt={alt} loading="lazy" className={`${size} w-auto object-contain`} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
