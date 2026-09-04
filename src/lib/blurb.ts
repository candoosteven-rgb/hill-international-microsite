import type { Development } from "@/lib/types";

function interpolate(str: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), str);
}

export function devHeadline(d: Development, dp: (key: string, vars?: Record<string, string | number>) => string): string {
  const key = `${d.id}_h`;
  const custom = dp(key);
  if (custom !== key) return custom;
  return dp("auto_h", { place: d.place || d.region });
}

export function devBlurb(d: Development, dp: (key: string, vars?: Record<string, string | number>) => string): string {
  const key = `${d.id}_p1`;
  const custom = dp(key);
  if (custom !== key) return custom;
  const template = dp("auto_p1");
  return interpolate(template, {
    name: d.name,
    tagline: (d.tagline || "new homes").toLowerCase(),
    place: d.place || d.region,
    access: d.accessNote || "Well connected to the surrounding area",
  });
}

export function devBlurb2(d: Development, dp: (key: string, vars?: Record<string, string | number>) => string): string {
  const key = `${d.id}_p2`;
  const custom = dp(key);
  if (custom !== key) return custom;
  return dp("auto_p2");
}
