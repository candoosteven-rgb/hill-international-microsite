"use client";

import { useEffect, useState } from "react";
import { budgetLabels, budgets, langs, regions } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import { submitEnquiry } from "@/lib/enquiry";

interface RiForm {
  name: string;
  email: string;
  phone: string;
  regions: string[];
  motivation: string;
  budget: string;
  language: string;
  consent: boolean;
}

const EMPTY_FORM: RiForm = {
  name: "",
  email: "",
  phone: "",
  regions: [],
  motivation: "",
  budget: "",
  language: "",
  consent: false,
};

function pillStyle(active: boolean) {
  return {
    border: `1px solid ${active ? "#F9F5F3" : "rgba(255,255,255,0.28)"}`,
    background: active ? "#F9F5F3" : "rgba(255,255,255,0.06)",
    color: active ? "#16313D" : "#F9F5F3",
  };
}

export default function Register() {
  const { t, lang } = useLanguage();
  const { riSubmitted, setRiSubmitted, riDefaultRegion } = useAppState();
  const [form, setForm] = useState<RiForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!riDefaultRegion) return;
    // Pre-fill the region chip when arriving via a "coming soon" card's priority-list CTA.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => (f.regions.includes(riDefaultRegion) ? f : { ...f, regions: [...f.regions.filter((r) => r !== "all"), riDefaultRegion] }));
  }, [riDefaultRegion]);

  const toggleRegion = (key: string) => {
    setForm((f) => {
      let next = f.regions;
      if (key === "all") next = next.includes("all") ? [] : ["all"];
      else {
        next = next.filter((r) => r !== "all");
        next = next.includes(key) ? next.filter((r) => r !== key) : [...next, key];
      }
      return { ...f, regions: next };
    });
  };

  const submit = async () => {
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    const valid = form.name.trim() && emailOk && form.regions.length && form.motivation && form.budget && form.language && form.consent;
    if (!valid) {
      setError(t("register_error"));
      return;
    }
    setError("");
    setSubmitting(true);
    const ok = await submitEnquiry({
      type: "register",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      regions: form.regions,
      motivation: form.motivation,
      budget: form.budget,
      preferredLanguage: form.language,
      consent: form.consent,
      pageLang: lang,
    });
    setSubmitting(false);
    if (!ok) {
      setError(t("form_submit_error"));
      return;
    }
    setRiSubmitted(true);
  };

  if (riSubmitted) return null;

  return (
    <section id="hi-register" className="hi-section bg-[#f5f5f7]" style={{ paddingBottom: 48 }}>
      <div className="hi-reveal hi-in mx-auto max-w-[1180px] rounded-[32px] bg-[#16313D] px-6 py-14 md:px-16 md:py-20">
        <span className="hi-eyebrow mb-6 block text-[#C98A6B]">{t("register_eyebrow")}</span>
        <h2
          className="max-w-[600px] font-bold text-[#F9F5F3]"
          style={{ fontSize: "clamp(32px,4.2vw,50px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
        >
          {t("register_title")}
        </h2>
        <p className="my-5 max-w-[560px] text-[16.5px] leading-relaxed text-white/75">{t("register_body")}</p>

        <Field label={t("register_where")} required>
          <div className="flex flex-wrap gap-2">
            {["all", ...regions].map((r) => (
              <button
                key={r}
                onClick={() => toggleRegion(r)}
                className="hi-pill rounded-full px-4.5 py-2.5 text-[13.5px] font-semibold"
                style={pillStyle(form.regions.includes(r))}
              >
                {r === "all" ? t("filter_all") : r}
              </button>
            ))}
          </div>
        </Field>

        <div className="mb-8 grid grid-cols-1 gap-7 sm:grid-cols-2">
          <Field label={t("register_what")} required>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "selfuse", label: t("opt_selfuse") },
                { key: "investment", label: t("opt_investment") },
              ].map((o) => (
                <button
                  key={o.key}
                  onClick={() => setForm((f) => ({ ...f, motivation: o.key }))}
                  className="hi-pill rounded-full px-4.5 py-2.5 text-[13.5px] font-semibold"
                  style={pillStyle(form.motivation === o.key)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label={t("register_howmuch")} required>
            <select
              value={form.budget}
              onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
              className="w-full rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3]"
            >
              <option value="" className="text-[#1F3A47]">
                -
              </option>
              {budgets.map((b) => (
                <option key={b} value={b} className="text-[#1F3A47]">
                  {budgetLabels[b]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={t("register_language")} required>
          <div className="flex flex-wrap items-center gap-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setForm((f) => ({ ...f, language: l.code }))}
                className="hi-pill rounded-full px-4.5 py-2.5 text-[13.5px] font-semibold"
                style={pillStyle(form.language === l.code)}
              >
                {l.native}
              </button>
            ))}
            {form.language === "ar" && <span className="text-xs text-[#E6C3AE]">{t("ar_note")}</span>}
          </div>
        </Field>

        <p className="mb-2.5 text-[12px] text-white/50">{t("required_note")}</p>
        <div className="mb-5.5 grid grid-cols-1 gap-4.5 sm:grid-cols-3">
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={`${t("register_name")} *`}
            className="rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
          />
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder={`${t("register_email")} *`}
            className="rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder={t("register_phone")}
            className="rounded-xl border border-white/25 bg-white/8 px-4 py-3.5 text-[14.5px] text-[#F9F5F3] placeholder:text-white/45"
          />
        </div>

        <label className="mb-6.5 flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
            className="mt-0.5 h-[18px] w-[18px] flex-none cursor-pointer accent-[#C1560F]"
          />
          <span className="text-[13.5px] leading-relaxed text-white/72">
            <span className="text-[#E6A98C]">* </span>
            {t("register_consent")}{" "}
            <a
              href="https://www.hill.co.uk/privacy-and-cookies-0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8B79C] underline underline-offset-2"
            >
              {t("register_privacy_link")}
            </a>
            .
          </span>
        </label>

        {error && <div className="mb-4.5 text-[13.5px] text-[#E6A98C]">{error}</div>}

        <button
          onClick={submit}
          disabled={submitting}
          className="hi-pill hi-waggle inline-flex items-center gap-2.5 rounded-full bg-[#C1560F] px-8 py-4 text-[15.5px] font-bold text-white shadow-[0_14px_30px_rgba(46,125,100,0.4)] disabled:opacity-60"
        >
          {t("register_submit")}
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <div className="mb-3 text-[13.5px] font-semibold text-[#F9F5F3]">
        {label}
        {required && <span className="text-[#E6A98C]"> *</span>}
      </div>
      {children}
    </div>
  );
}
