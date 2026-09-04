"use client";

import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import Icon from "@/components/Icon";

export default function CompareBar() {
  const { t } = useLanguage();
  const { compareIds, compareOpen, setCompareOpen, clearCompare } = useAppState();

  if (!compareIds.length || compareOpen) return null;
  const canCompare = compareIds.length >= 2;

  return (
    <div className="hi-in fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4">
      <div className="flex items-center gap-4 rounded-full bg-[#16313D] py-3 pl-6 pr-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <span className="text-[13.5px] font-semibold text-[#F9F5F3]">
          {compareIds.length} / 4
        </span>
        <button onClick={clearCompare} className="hi-link text-[13px] font-semibold text-white/65">
          {t("compare_bar_clear")}
        </button>
        <button
          onClick={() => canCompare && setCompareOpen(true)}
          disabled={!canCompare}
          className="hi-pill inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold text-white"
          style={{ background: canCompare ? "#C1560F" : "rgba(255,255,255,0.15)", opacity: canCompare ? 1 : 0.55, cursor: canCompare ? "pointer" : "default" }}
        >
          <Icon name="compare" className="h-4 w-4" />
          {t("compare_bar_cta")} ({compareIds.length})
        </button>
      </div>
    </div>
  );
}
