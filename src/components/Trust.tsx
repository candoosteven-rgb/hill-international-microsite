"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const DEVESH_VIDEO_SRC =
  "uploads/kew-bridge-rise-devesh-testimonial.mp4";
const DEVESH_VIDEO_POSTER = "uploads/devesh-video-poster.jpg.webp";

// Counts the stat row up from 0 once it scrolls into view, instead of just
// appearing - matches the design's own trustProg-driven animation (1.1s,
// cubic ease-out), and jumps straight to the final values for anyone who
// prefers reduced motion.
function useCountUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProg(1);
      return;
    }

    const start = () => {
      const t0 = performance.now();
      const dur = 1100;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        setProg(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            io.disconnect();
            start();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, prog };
}

const QUOTES = [
  {
    q: "trust_q2",
    name: "trust_q2_name",
    place: "Lampton Parkside, Hounslow",
    img: "uploads/trust-testimonial-lampton-parkside.jpg.webp",
  },
  { q: "trust_q3", name: "trust_q3_name", place: "Knights Park, Eddington", img: "uploads/trust-testimonial-knights-park.png.webp" },
];

export default function Trust() {
  const { t } = useLanguage();
  const deveshVideoRef = useRef<HTMLVideoElement>(null);
  const { ref: statsRef, prog: statsProg } = useCountUp();
  const statValues = [
    `${Math.round(95 * statsProg)}%`,
    String(Math.round(9 * statsProg)),
    `${(Math.round((4000 * statsProg) / 50) * 50).toLocaleString("en-GB")}+`,
  ];

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
            className="font-bold text-[#1F3A47]"
            style={{ fontSize: "clamp(30px,3.6vw,46px)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
          >
            {t("trust_title")}
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#5C6B71]">{t("trust_body")}</p>
        </Reveal>

        <Reveal delay={1} className="mb-14">
          <div ref={statsRef} className="grid grid-cols-1 gap-7 border-y border-[#E3E9EC] py-8 sm:grid-cols-3">
            {["trust_stat1", "trust_stat2", "trust_stat3"].map((k, i) => (
              <div key={k}>
                <div className="font-bold tracking-tight text-[#1F3A47]" style={{ fontSize: 44, fontVariantNumeric: "tabular-nums" }}>
                  {statValues[i]}
                </div>
                <div className="mt-2.5 text-[14.5px] leading-snug text-[#6E7B80]">{t(k)}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={1} className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-[#DFE7EA] bg-white">
            <video
              ref={deveshVideoRef}
              src={resolveImage(DEVESH_VIDEO_SRC, "")}
              poster={resolveImage(DEVESH_VIDEO_POSTER, "Devesh, Kew Bridge Rise resident")}
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
