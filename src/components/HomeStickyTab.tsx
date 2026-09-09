"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import Icon from "@/components/Icon";

export default function HomeStickyTab() {
  const { t, dir } = useLanguage();
  const { pageDevId, compareOpen, riSubmitted } = useAppState();
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (sessionStorage.getItem("hi_sticky_minimized") === "1") setMinimized(true);
    } catch {
      // sessionStorage unavailable (private mode, etc.) - default to expanded
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const reg = document.getElementById("hi-register");
      let show = window.scrollY > 640;
      if (reg && window.scrollY > reg.offsetTop - 260) show = false;
      setVisible(show);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pageDevId || compareOpen || riSubmitted || !visible) return null;

  const minimize = () => {
    try {
      sessionStorage.setItem("hi_sticky_minimized", "1");
    } catch {
      // ignore
    }
    setMinimized(true);
  };

  const expand = () => {
    try {
      sessionStorage.removeItem("hi_sticky_minimized");
    } catch {
      // ignore
    }
    setMinimized(false);
  };

  const goRegister = () => {
    const el = document.getElementById("hi-register");
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const side = dir === "rtl" ? "left" : "right";

  if (minimized) {
    return (
      <button
        onClick={expand}
        aria-label={t("register_submit")}
        title={t("register_submit")}
        className="hi-pop fixed top-1/2 z-[150] hidden -translate-y-1/2 flex-col items-center gap-2 bg-[#C1560F] px-2.5 py-4 text-white shadow-[-8px_0_24px_rgba(10,20,25,0.3)] lg:flex"
        style={{ [side]: 0, borderRadius: dir === "rtl" ? "0 14px 14px 0" : "14px 0 0 14px" }}
      >
        <Icon name="message" className="h-4 w-4" strokeWidth={2} />
        <span className="text-[12px] font-bold" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          {t("register_submit")}
        </span>
      </button>
    );
  }

  return (
    <div className="hi-in fixed top-1/2 z-[150] hidden w-[300px] -translate-y-1/2 lg:block" style={{ [side]: 30 }}>
      <div className="relative rounded-[20px] bg-[#122530] p-6.5 shadow-[0_24px_50px_rgba(10,20,25,0.4)]">
        <button
          onClick={minimize}
          aria-label="Minimise"
          title="Minimise"
          className="absolute right-3 top-3 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-white/10 text-white/70"
        >
          <Icon name="minus" className="h-3 w-3" strokeWidth={2.4} />
        </button>
        <div className="mb-1.5 pr-5 text-[19px] font-extrabold tracking-tight text-[#F9F5F3]">{t("register_eyebrow")}</div>
        <div className="mb-5 text-[13px] leading-relaxed text-white/60">{t("home_sticky_sub")}</div>
        <button
          onClick={goRegister}
          className="hi-pill flex w-full items-center justify-center rounded-full bg-[#C1560F] py-3.5 text-[14px] font-bold text-white shadow-[0_12px_26px_rgba(193,86,15,0.34)]"
        >
          {t("register_submit")}
        </button>
      </div>
    </div>
  );
}
