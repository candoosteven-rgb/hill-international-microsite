"use client";

import { useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const DEVESH_VIDEO_SRC =
  "uploads/Step into life at Kew Bridge Rise.Devesh, a London music producer, chose a two bed apartment wit.mp4";

const QUOTES = [
  {
    q: "trust_q2",
    name: "trust_q2_name",
    place: "Lampton Parkside, Hounslow",
    img: "uploads/Daniele and Maira - Lampton Parkside 3.jpg.webp",
  },
  { q: "trust_q3", name: "trust_q3_name", place: "Knights Park, Eddington", img: "uploads/Screenshot 2026-09-04 131132.png" },
];

export default function Trust() {
  const { t } = useLanguage();
  const deveshVideoRef = useRef<HTMLVideoElement>(null);

  const toggleDeveshFilm = () => {
    const v = deveshVideoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  return (
    <section id="hi-trust" className="hi-section bg-[#EEF3F5]">
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="mb-12 max-w-[660px]">
          <span className="hi-eyebrow mb-6 block text-[#C98A6B]">{t("trust_eyebrow")}</span>
          <h2
            className="font-extrabold text-[#1F3A47]"
            style={{ fontSize: "clamp(30px,3.6vw,46px)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
          >
            {t("trust_title")}
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#5C6B71]">{t("trust_body")}</p>
        </Reveal>

        <Reveal delay={1} className="mb-14 grid grid-cols-1 gap-7 border-y border-[#E3E9EC] py-8 sm:grid-cols-3">
          {["trust_stat1", "trust_stat2", "trust_stat3"].map((k, i) => (
            <div key={k}>
              <div className="font-extrabold tracking-tight text-[#1F3A47]" style={{ fontSize: 44, fontVariantNumeric: "tabular-nums" }}>
                {["95%", "9", "4,000+"][i]}
              </div>
              <div className="mt-2.5 text-[14.5px] leading-snug text-[#6E7B80]">{t(k)}</div>
            </div>
          ))}
        </Reveal>

        <Reveal delay={1} className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DFE7EA] bg-white">
            <video
              ref={deveshVideoRef}
              src={resolveImage(DEVESH_VIDEO_SRC, "")}
              controls
              playsInline
              preload="metadata"
              className="block aspect-[9/16] max-h-[420px] w-full bg-[#1F3A47] object-cover"
            />
            <div className="flex flex-1 flex-col gap-4 p-7">
              <div className="flex items-center justify-between gap-4">
                <Icon name="quote" className="h-5 w-5 flex-none text-[#C98A6B]" />
                <button
                  onClick={toggleDeveshFilm}
                  className="hi-link inline-flex flex-none items-center gap-2 text-[14px] font-semibold text-[#28567A]"
                >
                  {t("trust_watch_film")}
                  <Icon name="play" className="h-4 w-4" />
                </button>
              </div>
              <p className="flex-1 text-[16.5px] leading-relaxed text-[#3E4E55]">{t("trust_q1")}</p>
              <div>
                <div className="text-[14.5px] font-bold text-[#1F3A47]">{t("trust_q1_name")}</div>
                <div className="mt-0.5 text-[13.5px] text-[#8A969B]">Kew Bridge Rise, Brentford</div>
              </div>
            </div>
          </div>

          {QUOTES.map((item, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-[#DFE7EA] bg-white">
              <div
                className="aspect-[9/16] max-h-[420px] w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${resolveImage(item.img, item.place)}")` }}
              />
              <div className="flex flex-1 flex-col gap-4 p-7">
                <div className="flex items-center justify-between gap-4">
                  <Icon name="quote" className="h-5 w-5 flex-none text-[#C98A6B]" />
                </div>
                <p className="flex-1 text-[16.5px] leading-relaxed text-[#3E4E55]">{t(item.q)}</p>
                <div>
                  <div className="text-[14.5px] font-bold text-[#1F3A47]">{t(item.name)}</div>
                  <div className="mt-0.5 text-[13.5px] text-[#8A969B]">{item.place}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
