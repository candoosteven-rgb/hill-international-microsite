"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";

const SLIDES = [
  "uploads/opt/london-skyline.jpg",
  "uploads/canalside-quarter-dusk.png.webp",
  "uploads/opt/north-gate-park-211a2098.jpg",
  "https://www.hill.co.uk/sites/default/files/styles/media_gallery/public/images/2024-09/Plot%2093%20Living%2C%20Dining%2C%20Kitchen%20%283%29.jpg.webp?h=790be497&itok=5MTdgoKp",
];

const SLIDE_MS = 6500;

export default function Hero() {
  const { t } = useLanguage();
  const [slide, setSlide] = useState(0);

  // Break the second title line right after "&" where present (e.g. English
  // "Home Counties & South of England." -> "Home Counties &" / "South of
  // England.") so the hero reads as three short lines instead of one long
  // one; languages without an "&" in this string just keep two lines.
  const emText = t("hero_a_title_em");
  const ampIdx = emText.indexOf("&");
  const emLines =
    ampIdx === -1 ? [emText] : [emText.slice(0, ampIdx + 1), emText.slice(ampIdx + 1).trim()];

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "min(880px,92vh)", minHeight: 560, background: "#0E2028" }}
    >
      {SLIDES.map((src, i) => (
        <div
          key={src}
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${resolveImage(src, "Hill International")}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === slide ? 1 : 0,
            transition: "opacity 1.1s ease",
            zIndex: i === slide ? 1 : 0,
          }}
        />
      ))}
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
          <h1
            className="font-bold text-[#F9F5F3]"
            style={{ fontSize: "clamp(30px,5.1vw,74px)", lineHeight: 0.98, letterSpacing: "-0.035em" }}
          >
            <span className="block">{t("hero_a_title_pre")}</span>
            {emLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

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
            <div className="flex items-center gap-2">
              {SLIDES.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setSlide(i)}
                  aria-label={`Show slide ${i + 1}`}
                  className="h-2 rounded-full transition-all"
                  style={{ width: i === slide ? 22 : 8, background: i === slide ? "#F9F5F3" : "rgba(249,245,243,0.4)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
