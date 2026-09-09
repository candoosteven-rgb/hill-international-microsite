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
          <div className="mb-3.5 text-[19px] font-semibold tracking-tight text-[#6FA8D6]">
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

        <Reveal delay={1} className="mx-auto mt-14">
          <div className="h-[340px] overflow-hidden rounded-[28px] md:h-[520px]">
            <img
              src={resolveImage("uploads/North Gate Park - Plot 2 The Ash -bifolding doors.jpg.webp", "Hill International")}
              alt="Hill International development"
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

        <Reveal delay={2} className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-4">
          {[
            ["uploads/whathouse-award.png", "WhatHouse? Awards"],
            ["uploads/hbf-award.png", "Home Builders Federation 5-star rating"],
            ["uploads/trustpilot-49.png", "Trustpilot 4.9 rating"],
          ].map(([src, alt]) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={resolveImage(src, alt)} alt={alt} className="h-16 rounded-xl bg-white/95 px-4 py-2.5" />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
