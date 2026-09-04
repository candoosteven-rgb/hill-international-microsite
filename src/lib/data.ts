import REGIONS from "@/data/REGIONS.json";
import DEV_PRICES from "@/data/DEV_PRICES.json";
import EPC_COLORS from "@/data/EPC_COLORS.json";
import DEV_DATA_RAW from "@/data/DEV_DATA.json";
import TEAM from "@/data/TEAM.json";
import LANGS from "@/data/LANGS.json";
import T from "@/data/T.json";
import DP from "@/data/DP.json";
import EMAIL_T from "@/data/EMAIL_T.json";
import BUDGETS from "@/data/BUDGETS.json";
import BUDGET_LABELS from "@/data/BUDGET_LABELS.json";
import DISCLAIMER from "@/data/DISCLAIMER.json";
import PAGE_DATA_FULL from "@/data/PAGE_DATA_FULL.json";
import type { Development, Lang, LangCode, PageData, TeamMember } from "@/lib/types";

export const regions: string[] = REGIONS;
export const devPrices: Record<string, number[]> = DEV_PRICES;
export const epcColors: Record<string, { bg: string; border: string; fg: string; soft: string }> = EPC_COLORS;
export const devData: Development[] = DEV_DATA_RAW as Development[];
export const team: TeamMember[] = TEAM;
export const langs: Lang[] = LANGS as Lang[];
export const translations = T as Record<LangCode, Record<string, string>>;
export const devPageCopy = DP as Record<LangCode, Record<string, string>>;
export const emailTranslations = EMAIL_T as Record<LangCode, Record<string, string>>;
export const budgets: string[] = BUDGETS;
export const budgetLabels: Record<string, string> = BUDGET_LABELS;
export const disclaimer: { h: string; body: string }[] = DISCLAIMER;
export const pageData = PAGE_DATA_FULL as unknown as Record<string, PageData>;

export const EPC_A = new Set([
  "city-reach",
  "marleigh-park",
  "cambium-square",
  "hartmere",
  "knights-park",
  "north-gate-park",
  "dagenham-green",
  "little-chalfont-park",
  "canalside-quarter",
  "hollymead-square",
]);

export function epcOf(d: Development): string | null {
  return d.epc || (EPC_A.has(d.id) ? "A" : null);
}

export function epcColorsOf(letter: string | null) {
  return epcColors[(letter || "").toUpperCase()] || epcColors.A;
}

export function gbp(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

export function devById(id: string): Development | undefined {
  return devData.find((d) => d.id === id);
}

type Translate = (key: string, vars?: Record<string, string | number>) => string;

export function priceLabelFor(d: Development, t: Translate): string {
  const p = devPrices[d.id];
  if (!p) {
    return d.id === "cambium-square" ? "About to launch" : d.status === "live" ? t("price_on_request") : t("status_coming");
  }
  return p.length > 1 ? `${gbp(p[0])} – ${gbp(p[1])}` : `${t("price_from")} ${gbp(p[0])}`;
}

export function statusMetaFor(d: Development, t: Translate) {
  const base =
    d.status === "live"
      ? { label: t("status_live"), dot: "#2E86D8", bg: "rgba(46,134,216,0.12)", color: "#1A5A96", isComing: false, isLive: true }
      : { label: t("status_coming"), dot: "#C98A6B", bg: "rgba(201,138,107,0.2)", color: "#8a5636", isComing: true, isLive: false };
  if (d.id === "cambium-square") {
    return { ...base, label: "About to launch", bg: "#C1560F", color: "#fff" };
  }
  return base;
}

export function pageDataFor(id: string): PageData | undefined {
  return pageData[id];
}
