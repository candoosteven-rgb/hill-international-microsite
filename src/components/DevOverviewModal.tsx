"use client";

import { useEffect } from "react";
import { devById, statusMetaFor } from "@/lib/data";
import { devBlurb } from "@/lib/blurb";
import { resolveImage } from "@/lib/image";
import { resolveLogo } from "@/lib/logo";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import Icon from "@/components/Icon";

export default function DevOverviewModal() {
  const { t, dp } = useLanguage();
  const { devModalId, closeDevModal, openDevPage, addRecent } = useAppState();

  useEffect(() => {
    if (devModalId) addRecent(devModalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devModalId]);

  if (!devModalId) return null;
  const d = devById(devModalId);
  if (!d) return null;

  const status = statusMetaFor(d, t);
  const shots = d.images && d.images.length ? d.images : d.image ? [d.image] : [];
  const blurb = devBlurb(d, dp);
  const logoSrc = resolveLogo(d.logo, d.name);

  return (
    <div
      className="hi-fade fixed inset-0 z-[310] flex items-center justify-center p-4 md:p-6"
      style={{ background: "rgba(15,25,30,0.72)", backdropFilter: "blur(6px)" }}
      onClick={closeDevModal}
    >
      <div
        className="hi-pop relative max-h-[88vh] w-full max-w-[860px] overflow-y-auto rounded-[22px] bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeDevModal}
          aria-label={t("modal_close")}
          className="absolute right-4.5 top-4.5 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(31,58,71,0.85)] text-white"
        >
          <Icon name="close" className="h-4.5 w-4.5" />
        </button>

        <div className="relative h-[220px] overflow-hidden rounded-t-[22px] bg-[repeating-linear-gradient(45deg,#dfe3e2,#dfe3e2_10px,#eceeec_10px,#eceeec_20px)] md:h-[280px]">
          {shots.length ? (
            <img src={resolveImage(shots[0], d.name)} alt={d.name} className="h-full w-full object-cover" />
          ) : (
            <div className="hi-hatch absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(158deg,#27454F_0%,#162C35_62%,#101F26_100%)] p-10 text-center">
              <Icon name="building" className="h-10 w-10 text-[#C98A6B]" />
              <span className="text-[30px] font-extrabold leading-tight tracking-tight text-[#F9F5F3] md:text-[36px]">
                {d.name}
              </span>
              <span className="max-w-[400px] text-[15px] leading-relaxed text-white/72">
                We&rsquo;re working on it &mdash; the photographer beats us to the paint drying. New imagery lands here soon.
              </span>
            </div>
          )}
          {logoSrc && (
            <div className="hi-pop absolute bottom-4 left-4 rounded-lg bg-black/30 px-3 py-2 backdrop-blur-sm">
              <img src={logoSrc} alt={`${d.name} logo`} className="h-6 w-auto" />
            </div>
          )}
        </div>

        <div className="px-6 py-9 md:px-11 md:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#28567A]">
              {d.region} &middot; {t("modal_overview")}
            </span>
            <span
              className="rounded-full px-3 py-1.5 text-[11px] font-bold"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <h2 className="my-3.5 text-[30px] font-extrabold tracking-tight text-[#1F3A47] md:text-[36px]">{d.name}</h2>
          <p className="mb-8 text-[15.5px] leading-relaxed text-[#5C6B71]">{blurb}</p>

          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-[#D7DEE2] pt-7">
            <p className="max-w-[440px] text-[14.5px] leading-relaxed text-[#6E7B80]">{t("modal_contact_note")}</p>
            <button
              onClick={() => openDevPage(d.id)}
              className="hi-pill flex-none rounded-full bg-[#C1560F] px-6.5 py-3.5 text-[14.5px] font-bold text-white shadow-[0_10px_22px_rgba(193,86,15,0.3)]"
            >
              {t("dev_view")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
