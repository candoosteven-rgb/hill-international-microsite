import { devPrices, epcOf, gbp } from "@/lib/data";
import type { Development } from "@/lib/types";

// Per-development extras that don't derive from core data (matches the design
// source's hand-curated AUTO_FACTS table).
const AUTO_FACTS: Record<string, { k: string; v: string }[]> = {
  "hollymead-square": [
    { k: "f_availability", v: "Over 60% sold" },
    { k: "f_warranty", v: "10 yr NHBC" },
  ],
  "kew-bridge-rise": [{ k: "f_warranty", v: "10 yr NHBC" }],
  "lampton-parkside": [
    { k: "f_tenure", v: "999" },
    { k: "f_warranty", v: "10 yr NHBC" },
    { k: "f_parking", v: "53 spaces" },
  ],
  "cambium-square": [
    { k: "f_launch", v: "20th Sept" },
    { k: "f_homes", v: "256 low-carbon homes" },
  ],
};

function bedsFromTagline(tagline?: string | null): number[] {
  const found = Array.from(new Set(((tagline || "").match(/\d+/g) || []).map(Number)))
    .filter((n) => n > 0 && n < 8)
    .sort((a, b) => a - b);
  return found.length ? found : [1, 2];
}

function joinList(arr: (string | number)[]): string {
  if (arr.length <= 1) return String(arr[0]);
  return arr.slice(0, -1).join(", ") + " & " + arr[arr.length - 1];
}

// Fallback "At a glance" facts for developments without hand-authored ones,
// derived from the same data already shown elsewhere (price, EPC, zone, beds).
export function autoFacts(d: Development): { k: string; v: string }[] {
  const facts: { k: string; v: string }[] = [];
  const beds = bedsFromTagline(d.tagline);
  facts.push({ k: "f_types", v: joinList(beds) });
  const price = devPrices[d.id];
  if (price) facts.push({ k: "f_price", v: gbp(price[0]) });
  const epc = epcOf(d);
  if (epc) facts.push({ k: "f_epc", v: epc });
  if (d.zone) facts.push({ k: "f_zone", v: `Zone ${d.zone}` });
  return facts.concat(AUTO_FACTS[d.id] || []);
}
