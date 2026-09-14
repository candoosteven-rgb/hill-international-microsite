"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { devData, LAUNCHING_SOON } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { resolveImage } from "@/lib/image";
import Icon from "@/components/Icon";

// Only Cambium Square has a confirmed launch date - the countdown is
// specific to it rather than every LAUNCHING_SOON entry.
const CAMBIUM_LAUNCH = new Date(2026, 8, 26).getTime();

function useCountdown(target: number) {
  const [msLeft, setMsLeft] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setMsLeft(Math.max(0, target - Date.now()));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [target]);
  return msLeft;
}

function formatCountdown(ms: number): string {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (days >= 1) return `${days}d ${hours}h`;
  if (hours >= 1) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function LaunchingSpotlight() {
  const { t } = useLanguage();
  const router = useRouter();
  const { startPriority } = useAppState();
  const msLeft = useCountdown(CAMBIUM_LAUNCH);
  const devs = devData
    .filter((d) => LAUNCHING_SOON.has(d.id))
    .sort((a, b) => (a.id === "cambium-square" ? -1 : b.id === "cambium-square" ? 1 : 0));

  if (!devs.length) return null;

  return (
    <section className="hi-section" style={{ background: "#F5F5F7" }}>
      <div className="mx-auto max-w-[1280px]">
        <h2
          className="mb-9 font-bold text-[#1F3A47]"
          style={{ fontSize: "clamp(26px,3vw,40px)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
        >
          {t("launch_spotlight_title")}
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {devs.map((d) => {
            const isCambium = d.id === "cambium-square";
            return (
              <div key={d.id} className="hi-card group relative aspect-[3/4] overflow-hidden rounded-[18px]">
                <a
                  href={`/developments/${d.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/developments/${d.id}`);
                  }}
                  aria-label={d.name}
                  className="absolute inset-0 block"
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
                </a>

                {isCambium && msLeft !== null && (
                  <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[rgba(15,32,39,0.55)] px-2.5 py-1.5 text-[12px] font-semibold tabular-nums text-white backdrop-blur-sm">
                    <Icon name="rocket" className="h-3.5 w-3.5 flex-none text-[#C98A6B]" strokeWidth={1.8} />
                    {formatCountdown(msLeft)}
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-6">
                  <span className="text-[21px] font-bold tracking-tight text-white">{d.name}</span>
                  <button
                    onClick={() => startPriority(d.region)}
                    className="hi-pill pointer-events-auto inline-flex flex-none items-center rounded-full bg-white/15 px-4 py-2.5 text-[13px] font-bold text-white backdrop-blur-sm"
                  >
                    {t("cta_preregister")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
