"use client";

import { langs } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";

export default function LangPills({
  variant = "dark",
  size = "md",
}: {
  variant?: "dark" | "light" | "footer";
  size?: "sm" | "md";
}) {
  const { lang, setLang, t } = useLanguage();

  const padding = size === "sm" ? "5px 12px" : "6px 12px";
  const fontSize = size === "sm" ? "11.5px" : "12px";

  return (
    <>
      {langs.map((l) => {
        const active = l.code === lang;
        const bg =
          variant === "light"
            ? active
              ? "#16313D"
              : "#fff"
            : active
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0.08)";
        const color =
          variant === "light" ? (active ? "#fff" : "#28567A") : active ? "#16313D" : "#F9F5F3";
        const border =
          variant === "light" ? (active ? "#16313D" : "#D7DEE2") : active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)";

        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code as LangCode)}
            title={t("select_language")}
            className="hi-pill inline-flex items-center gap-1.5 rounded-full font-semibold"
            style={{ border: `1px solid ${border}`, background: bg, color, padding, fontSize }}
          >
            <img src={l.flag} alt="" width={14} height={14} className="rounded-full flex-none" />
            {l.native}
          </button>
        );
      })}
    </>
  );
}
