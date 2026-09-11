"use client";

import { useState } from "react";
import { devData, disclaimer, regions } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import LangPills from "@/components/LangPills";
import Icon from "@/components/Icon";

export default function Footer({ onDevelopmentsClick }: { onDevelopmentsClick?: () => void }) {
  const { t, dp } = useLanguage();
  const [discOpen, setDiscOpen] = useState(false);

  return (
    <footer className="hi-section bg-[#1F3A47]" style={{ paddingTop: 70, paddingBottom: 56 }}>
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-1 gap-10 border-b border-white/12 pb-11 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/hill-logo-transparent.png" alt="Hill International" loading="lazy" className="h-7 w-auto" />
          </div>
          <div>
            <div className="mb-4 text-[13px] font-semibold text-[#F9F5F3]">{t("footer_regions")}</div>
            {regions.map((r) => (
              <div key={r} className="mb-2.5 text-[14px] text-white/68">
                {r}
              </div>
            ))}
          </div>
          <div>
            <div className="mb-4 text-[13px] font-semibold text-[#F9F5F3]">{t("footer_developments")}</div>
            {onDevelopmentsClick ? (
              <button
                onClick={onDevelopmentsClick}
                className="hi-link mb-2.5 block text-start text-[14px] text-white/68"
              >
                {t("nav_developments")} ({devData.length})
              </button>
            ) : (
              <a href="#hi-developments" className="hi-link mb-2.5 block text-[14px] text-white/68">
                {t("nav_developments")} ({devData.length})
              </a>
            )}
          </div>
          <div>
            <div className="mb-4 text-[13px] font-semibold text-[#F9F5F3]">{t("footer_contact")}</div>
            <a
              href="mailto:InternationalEnquiries@hill.co.uk"
              className="hi-link mb-2.5 flex items-center gap-1.5 text-[14px] text-white/68"
            >
              <span className="flex h-5 w-5 flex-none items-center justify-center">
                <Icon name="mail" className="h-4 w-4" />
              </span>
              InternationalEnquiries@hill.co.uk
            </a>
            <a
              href="https://www.linkedin.com/company/hill-group-international"
              target="_blank"
              rel="noopener"
              className="hi-link flex items-center gap-1.5 text-[14px] text-white/68"
            >
              <span className="flex h-5 w-5 flex-none items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/uploads/linkedin-logo-cropped.webp"
                  alt=""
                  loading="lazy"
                  className="h-5 w-5 object-contain"
                />
              </span>
              LinkedIn
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8 sm:col-span-2 lg:col-span-4">
            <div className="flex flex-wrap items-center gap-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/hbf-award-white.png"
                alt="HBF 5-star Customer Satisfaction 2026"
                loading="lazy"
                className="h-[58px] w-auto flex-none"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/whathouse-award-white.png"
                alt="What House? Awards - Three Times Housebuilder of the Year"
                loading="lazy"
                className="h-[62px] w-auto flex-none"
              />
              <div className="hidden self-stretch bg-white/12 sm:block" style={{ width: 1 }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/uploads/trustpilot-white.png"
                alt="Trustpilot 4.9 rating"
                loading="lazy"
                className="h-11 w-auto flex-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <LangPills variant="dark" size="sm" />
            </div>
          </div>
        </div>

        <div className="pt-6">
          {discOpen && (
            <div className="hi-in mb-5.5 border-b border-white/12 pb-6.5">
              <div className="mb-5.5 text-[12px] font-bold uppercase tracking-wide text-white/80">
                {dp("disc_title")}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {disclaimer.map((d) => (
                  <div key={d.h}>
                    <div className="mb-1.5 text-[12.5px] font-bold text-[#F9F5F3]">{dp(d.h)}</div>
                    <p className="text-[12px] leading-relaxed text-white/52">{d.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[11.5px] text-white/38">{dp("disc_lang_note")}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <span className="text-[12.5px] text-white/45">&copy; 2026 Hill International</span>
          <a
            href="https://www.hill.co.uk/privacy-and-cookies-0"
            target="_blank"
            rel="noopener"
            className="hi-link inline-flex items-center gap-1.5 text-[12.5px] text-white/68"
          >
            <Icon name="lock" className="h-3.5 w-3.5 flex-none" />
            {dp("privacy")}
          </a>
          <button onClick={() => setDiscOpen((v) => !v)} className="hi-link text-[12.5px] font-medium text-white/68">
            {dp("disc_title")}
          </button>
        </div>
      </div>
    </footer>
  );
}
