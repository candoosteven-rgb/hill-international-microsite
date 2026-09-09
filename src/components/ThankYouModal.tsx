"use client";

import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { emailTranslations, langs } from "@/lib/data";
import Icon from "@/components/Icon";

const SPARK_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
const CELEBRATION_SPARKS = SPARK_ANGLES.map((angle, i) => ({
  angle,
  size: i % 3 === 0 ? 7 : 5,
  offset: i % 3 === 0 ? -3.5 : -2.5,
  radius: i % 2 === 0 ? "100px" : "2px",
  color: i % 3 === 0 ? "#C1560F" : i % 3 === 1 ? "#C98A6B" : "#F9F5F3",
  delay: 0.16 + (i % 4) * 0.05,
}));

export default function ThankYouModal() {
  const { t, lang } = useLanguage();
  const { riSubmitted, setRiSubmitted } = useAppState();

  if (!riSubmitted) return null;

  const close = () => setRiSubmitted(false);
  const email = emailTranslations[lang] || emailTranslations.en;
  const languageName = langs.find((l) => l.code === lang)?.native || "English";
  const subject = email.subject;
  const body = email.body.replace("{name}", "there").replace("{language}", languageName);

  return (
    <div
      className="hi-fade fixed inset-0 z-[320] flex items-center justify-center p-6"
      style={{ background: "rgba(15,25,30,0.72)", backdropFilter: "blur(6px)" }}
      onClick={close}
    >
      <div
        className="hi-pop relative max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-3xl bg-[#16313D] px-7 pb-11 pt-13 text-center md:px-11"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label={t("modal_close")}
          className="absolute right-4 top-4 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-white/14 text-white"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>

        <div className="relative mx-auto mb-6 h-15 w-15">
          <span aria-hidden className="hi-ring absolute inset-0 rounded-full border-2 border-[#C1560F]" />
          <span aria-hidden className="hi-ring hi-ring-2 absolute inset-0 rounded-full border-2 border-[#C98A6B]" />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {CELEBRATION_SPARKS.map((sp, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${sp.angle}deg)` }}
              >
                <span
                  className="hi-spark block"
                  style={{
                    width: sp.size,
                    height: sp.size,
                    marginLeft: sp.offset,
                    borderRadius: sp.radius,
                    background: sp.color,
                    animationDelay: `${sp.delay}s`,
                  }}
                />
              </span>
            ))}
          </div>
          <span className="hi-badge-pop absolute inset-0 flex items-center justify-center rounded-full bg-[rgba(193,86,15,0.18)]">
            <Icon name="check" className="hi-check h-6.5 w-6.5 text-[#C1560F]" strokeWidth={2} />
          </span>
        </div>

        <h2 className="mb-3.5 text-[28px] font-extrabold tracking-tight text-[#F9F5F3]">{t("confirm_title")}</h2>
        <p className="mb-7 text-[16px] leading-relaxed text-white/78">{t("confirm_body")}</p>

        <div className="mb-7 rounded-2xl bg-[#F9F5F3] p-6 text-left">
          <div className="mb-3.5 text-[11.5px] font-bold uppercase tracking-wide text-[#8a9298]">
            {t("confirm_email_label")}
          </div>
          <div className="mb-2.5 text-[15px] font-bold text-[#1F3A47]">{subject}</div>
          <div className="whitespace-pre-line text-[14px] leading-relaxed text-[#5C6B71]">{body}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#hi-developments"
            onClick={close}
            className="hi-pill inline-flex items-center rounded-full bg-[#C1560F] px-6.5 py-3.5 text-[14.5px] font-bold text-white"
          >
            {t("nav_developments")}
          </a>
          <button
            onClick={close}
            className="hi-pill rounded-full border border-white/34 bg-white/10 px-6.5 py-3.5 text-[14.5px] font-semibold text-[#F9F5F3]"
          >
            {t("confirm_back")}
          </button>
        </div>
      </div>
    </div>
  );
}
