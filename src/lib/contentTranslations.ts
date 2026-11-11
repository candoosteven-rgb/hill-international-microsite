// Translation layer for raw CONTENT strings (USPs, spec bullets, amenity
// names, travel labels, taglines...) as opposed to `t()`/`dp()`'s UI-chrome
// dictionaries. The source-of-truth data files (DEV_DATA.json,
// PAGE_DATA_FULL.json) stay plain English, since they're hand-edited and
// also auto-synced from hill.co.uk (scripts/sync-availability.mjs) - adding
// per-language fields to every entry there would make every future edit or
// sync need all 5 languages at once. Instead this is a side dictionary keyed
// by the exact English string, with the same graceful "fall back to English
// if untranslated" behaviour as `t()`/`dp()`, so new content (e.g. a sync
// pulling in a never-seen plot name) never breaks - it just stays English
// until someone adds it here.
import CONTENT_T from "@/data/CONTENT_T.json";
import type { LangCode } from "@/lib/types";

const CONTENT_TRANSLATIONS = CONTENT_T as Partial<Record<LangCode, Record<string, string>>>;

export function tc(text: string | undefined | null, lang: LangCode): string {
  if (!text) return "";
  if (lang === "en") return text;
  return CONTENT_TRANSLATIONS[lang]?.[text] ?? text;
}

// Distance/time fragments (amenity "d" fields, travel array entries) are
// mostly "<number> <unit>" - translating the handful of unit words covers
// every value already on file AND any new one a future sync pulls in,
// without needing a dictionary entry per distance value.
const UNIT_WORDS: Record<Exclude<LangCode, "en">, Record<string, string>> = {
  tr: {
    mi: "mi",
    mile: "mil",
    miles: "mil",
    min: "dk",
    mins: "dk",
    minute: "dakika",
    minutes: "dakika",
    walk: "yürüyüş",
    drive: "araçla",
    hr: "sa",
    hrs: "sa",
  },
  zh: {
    mi: "英里",
    mile: "英里",
    miles: "英里",
    min: "分钟",
    mins: "分钟",
    minute: "分钟",
    minutes: "分钟",
    walk: "步行",
    drive: "车程",
    hr: "小时",
    hrs: "小时",
  },
  ar: {
    mi: "ميل",
    mile: "ميل",
    miles: "ميل",
    min: "دقيقة",
    mins: "دقيقة",
    minute: "دقيقة",
    minutes: "دقيقة",
    walk: "سيرًا على الأقدام",
    drive: "بالسيارة",
    hr: "ساعة",
    hrs: "ساعة",
  },
  yue: {
    mi: "英里",
    mile: "英里",
    miles: "英里",
    min: "分鐘",
    mins: "分鐘",
    minute: "分鐘",
    minutes: "分鐘",
    walk: "步行",
    drive: "車程",
    hr: "小時",
    hrs: "小時",
  },
};

const DISTANCE_PATTERNS: Array<{ re: RegExp; build: (m: RegExpMatchArray, u: Record<string, string>) => string }> = [
  // "0.4 mi" / "<1 mi" / "14 mi"
  {
    re: /^(<?\d+(?:\.\d+)?)\s*mi(les)?$/i,
    build: (m, u) => `${m[1]} ${u.mi}`,
  },
  // "1 mile"
  {
    re: /^(\d+(?:\.\d+)?)\s*mile$/i,
    build: (m, u) => `${m[1]} ${u.mile}`,
  },
  // "13 min walk" / "13-min walk" / "13 mins walk"
  {
    re: /^(\d+)[\s-]*mins?\s+walk$/i,
    build: (m, u) => `${m[1]} ${u.min} ${u.walk}`,
  },
  // bare "27 min" (travel list's own minutes suffix)
  {
    re: /^(\d+)\s*mins?$/i,
    build: (m, u) => `${m[1]} ${u.min}`,
  },
  // "1 hr drive" / "1 hr 30 min drive"
  {
    re: /^(\d+)\s*hrs?(?:\s+(\d+)\s*min)?\s+drive$/i,
    build: (m, u) => (m[2] ? `${m[1]} ${u.hr} ${m[2]} ${u.min} ${u.drive}` : `${m[1]} ${u.hr} ${u.drive}`),
  },
];

export function tcUnit(text: string | undefined | null, lang: LangCode): string {
  if (!text) return "";
  if (lang === "en") return text;
  const units = UNIT_WORDS[lang as Exclude<LangCode, "en">];
  if (!units) return text;
  const trimmed = text.trim();
  for (const { re, build } of DISTANCE_PATTERNS) {
    const m = trimmed.match(re);
    if (m) return build(m, units);
  }
  // Not a recognised distance/time fragment (e.g. a bare bus count like
  // "33", or already-prose text that went through the content dictionary
  // instead) - leave it untouched rather than guess.
  return text;
}
