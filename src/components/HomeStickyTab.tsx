"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";

export default function HomeStickyTab() {
  const { t, dir } = useLanguage();
  const { pageDevId, devModalId, compareOpen, riSubmitted } = useAppState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pageDevId || devModalId || compareOpen || riSubmitted || !visible) return null;

  return (
    <a
      href="#hi-register"
      className="hi-pill fixed top-1/2 z-[150] hidden -translate-y-1/2 items-center gap-2.5 rounded-l-2xl bg-[#16313D] py-4 pl-3 pr-4 text-[13px] font-bold text-[#F9F5F3] shadow-[0_10px_24px_rgba(0,0,0,0.25)] lg:flex"
      style={{
        [dir === "rtl" ? "left" : "right"]: 0,
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        borderRadius: dir === "rtl" ? "0 16px 16px 0" : "16px 0 0 16px",
      }}
      title={t("home_sticky_sub")}
    >
      {t("nav_register")}
    </a>
  );
}
