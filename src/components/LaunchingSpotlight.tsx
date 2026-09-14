"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { devData, LAUNCHING_SOON } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { resolveImage } from "@/lib/image";
import Icon from "@/components/Icon";

const SLIDE_MS = 7000;

export default function LaunchingSpotlight() {
  const { t } = useLanguage();
  const router = useRouter();
  const { startPriority } = useAppState();
  const devs = devData.filter((d) => LAUNCHING_SOON.has(d.id));
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (devs.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % devs.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [devs.length]);

  if (!devs.length) return null;

  const active = devs[slide];
  const isCambium = active.id === "cambium-square";

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "min(600px,72vh)", minHeight: 440, background: "#0E2028" }}
    >
      {devs.map((dev, i) => (
        <div
          key={dev.id}
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${resolveImage(dev.image || dev.images?.[0], dev.name)}")`,
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
            "linear-gradient(0deg, rgba(9,19,25,0.94) 0%, rgba(9,19,25,0.55) 40%, rgba(9,19,25,0.12) 65%, rgba(9,19,25,0.4) 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-[3] px-5 pb-12 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <span className="hi-eyebrow mb-3 flex items-center gap-2 text-[#C98A6B]">
            <Icon name="rocket" className="h-3.5 w-3.5 flex-none" strokeWidth={1.8} />
            {t("launch_spotlight_eyebrow")}
          </span>
          <h2
            className="font-bold text-[#F9F5F3]"
            style={{ fontSize: "clamp(28px,4.4vw,58px)", lineHeight: 1.02, letterSpacing: "-0.035em" }}
          >
            {active.name}
          </h2>
          <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/78">
            {active.tagline}
            {active.locationLabel ? ` · ${active.locationLabel}` : ""}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`/developments/${active.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/developments/${active.id}`);
                }}
                className="hi-pill inline-flex items-center rounded-full bg-[#C1560F] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(193,86,15,0.36)]"
              >
                {t("dev_view")}
              </a>
              <button
                onClick={() => startPriority(active.region)}
                className="hi-pill inline-flex items-center rounded-full border border-white/40 bg-white/6 px-7 py-4 text-[15px] font-bold text-[#F9F5F3]"
              >
                {isCambium ? "Attend the launch" : t("cta_priority")}
              </button>
            </div>
            {devs.length > 1 && (
              <div className="flex items-center gap-2">
                {devs.map((dev, i) => (
                  <button
                    key={dev.id}
                    onClick={() => setSlide(i)}
                    aria-label={dev.name}
                    className="h-2 rounded-full transition-all"
                    style={{ width: i === slide ? 22 : 8, background: i === slide ? "#F9F5F3" : "rgba(249,245,243,0.4)" }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
