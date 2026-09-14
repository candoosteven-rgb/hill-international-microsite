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
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (devs.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((s) => (s + 1) % devs.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [devs.length]);

  if (!devs.length) return null;

  const d = devs[active];
  const isCambium = d.id === "cambium-square";

  return (
    <section className="hi-section" style={{ background: "#F5F5F7" }}>
      <div className="mx-auto max-w-[1280px]">
        <span className="hi-eyebrow mb-3 block text-[#C1560F]">{t("launch_spotlight_eyebrow")}</span>
        <h2
          className="mb-9 max-w-[640px] font-bold text-[#1F3A47]"
          style={{ fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
        >
          {t("launch_spotlight_title")}
        </h2>

        <div className="overflow-hidden rounded-[28px] bg-[#16313D] shadow-[0_20px_50px_rgba(15,32,39,0.18)]">
          <div className="grid items-stretch lg:grid-cols-2">
            <div
              className="min-h-[240px] bg-cover bg-center lg:min-h-[420px]"
              style={{ backgroundImage: `url("${resolveImage(d.image || d.images?.[0], d.name)}")` }}
            />
            <div className="flex flex-col justify-center gap-4 p-8 md:p-11">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(201,138,107,0.16)] px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wide text-[#C98A6B]">
                <Icon name="rocket" className="h-3.5 w-3.5 flex-none" strokeWidth={1.8} />
                {t("teaser_launching_soon")}
              </span>
              <h3
                className="font-bold text-[#F9F5F3]"
                style={{ fontSize: "clamp(24px,2.6vw,34px)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
              >
                {d.name}
              </h3>
              <p className="max-w-[420px] text-[15px] leading-relaxed text-white/72">
                {d.tagline}
                {d.locationLabel ? ` · ${d.locationLabel}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3.5">
                <a
                  href={`/developments/${d.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/developments/${d.id}`);
                  }}
                  className="hi-pill inline-flex items-center rounded-full bg-[#C1560F] px-6 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(193,86,15,0.36)]"
                >
                  {t("dev_view")}
                </a>
                <button
                  onClick={() => startPriority(d.region)}
                  className="hi-pill inline-flex items-center rounded-full border border-white/25 px-6 py-3.5 text-[14px] font-bold text-[#F9F5F3]"
                >
                  {isCambium ? "Attend the launch" : t("cta_priority")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {devs.length > 1 && (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {devs.map((dev, i) => (
              <button
                key={dev.id}
                onClick={() => setActive(i)}
                className="hi-pill relative flex h-20 items-end overflow-hidden rounded-[16px] p-3.5 text-left"
                style={{
                  boxShadow: i === active ? "inset 0 0 0 2px #C1560F" : "inset 0 0 0 1px rgba(31,58,71,0.12)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("${resolveImage(dev.image || dev.images?.[0], dev.name)}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: i === active ? 1 : 0.55,
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(0deg, rgba(9,19,25,0.82) 0%, rgba(9,19,25,0.05) 75%)" }}
                />
                <span className="relative truncate text-[13px] font-bold text-white">{dev.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
