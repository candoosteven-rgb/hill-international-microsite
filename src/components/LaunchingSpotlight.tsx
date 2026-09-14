"use client";

import { useRouter } from "next/navigation";
import { devData, LAUNCHING_SOON } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { resolveImage } from "@/lib/image";
import Icon from "@/components/Icon";

export default function LaunchingSpotlight() {
  const { t } = useLanguage();
  const router = useRouter();
  const devs = devData.filter((d) => LAUNCHING_SOON.has(d.id));

  if (!devs.length) return null;

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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {devs.map((d) => (
            <a
              key={d.id}
              href={`/developments/${d.id}`}
              onClick={(e) => {
                e.preventDefault();
                router.push(`/developments/${d.id}`);
              }}
              className="hi-card group relative block aspect-[3/4] overflow-hidden rounded-[18px]"
            >
              <span
                aria-hidden
                className="hi-card-img absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${resolveImage(d.image || d.images?.[0], d.name)}")` }}
              />
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(9,19,25,0.86) 0%, rgba(9,19,25,0.15) 45%, transparent 65%)",
                }}
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-6">
                <span className="text-[21px] font-bold tracking-tight text-white">{d.name}</span>
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrowRight" className="h-4 w-4" strokeWidth={2.2} />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
