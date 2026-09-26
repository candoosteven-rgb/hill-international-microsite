#!/usr/bin/env node
// Pulls current plot availability/pricing from each development's live
// hill.co.uk page (mapped in src/data/HILL_SOURCE_URLS.json) and merges it
// into that development's `plots` array in src/data/PAGE_DATA_FULL.json.
//
// This has never been run against the real hill.co.uk markup - the
// sandbox this was written in has hill.co.uk blocked at the network
// level, so the parsing strategies below are a best-effort guess at how a
// Drupal property-listing page is likely to be structured, not something
// verified against the real page. Run without --write first and read the
// report before trusting a --write run.
//
// Usage:
//   node scripts/sync-availability.mjs            # dry run, prints a report
//   node scripts/sync-availability.mjs --write     # applies changes to disk

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCES_PATH = path.join(ROOT, "src/data/HILL_SOURCE_URLS.json");
const PAGE_DATA_PATH = path.join(ROOT, "src/data/PAGE_DATA_FULL.json");

// PAGE_DATA_FULL.json uses a mix of formatting conventions (some tuple
// arrays like "hours" are kept on one line by whatever originally
// generated the file, which plain JSON.stringify(data, null, 2) does not
// reproduce). Rewriting the whole file would therefore turn every commit
// from this script into a huge, unrelated-looking diff. Instead, only the
// exact "plots": [...] slice for each changed development is located in
// the raw text and replaced in place, byte-for-byte identical everywhere
// else.
function findMatchingBracket(text, openIndex) {
  const open = text[openIndex];
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error(`no matching "${close}" found`);
}

function replacePlotsInRawJson(rawText, devId, newPlots) {
  const devKeyMatch = new RegExp(`"${devId}"\\s*:\\s*\\{`).exec(rawText);
  if (!devKeyMatch) throw new Error(`devId "${devId}" not found in raw JSON text`);
  const devObjStart = devKeyMatch.index + devKeyMatch[0].length - 1;
  const devObjEnd = findMatchingBracket(rawText, devObjStart);

  const plotsKeyRelative = /"plots"\s*:\s*\[/.exec(rawText.slice(devObjStart, devObjEnd + 1));
  if (!plotsKeyRelative) throw new Error(`"plots" key not found for devId "${devId}"`);
  const plotsArrayStart = devObjStart + plotsKeyRelative.index + plotsKeyRelative[0].length - 1;
  const plotsArrayEnd = findMatchingBracket(rawText, plotsArrayStart);

  const lineStart = rawText.lastIndexOf("\n", plotsArrayStart) + 1;
  const lineIndent = rawText.slice(lineStart, plotsArrayStart).match(/^\s*/)[0];

  const rendered = JSON.stringify(newPlots, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : lineIndent + line))
    .join("\n");

  return rawText.slice(0, plotsArrayStart) + rendered + rawText.slice(plotsArrayEnd + 1);
}

const WRITE = process.argv.includes("--write");

// Refuse to apply a scrape that lost more than half the plots we already
// know about for a development - almost always means the parser missed
// the real markup, not that half the plots sold at once.
const MIN_KEEP_RATIO = 0.5;

function parseMoney(text) {
  const m = text.replace(/,/g, "").match(/£\s*(\d+(?:\.\d+)?)/);
  return m ? Math.round(parseFloat(m[1])) : null;
}

function parseBeds(text) {
  const m = text.match(/(\d+)\s*bed/i);
  if (m) return parseInt(m[1], 10);
  if (/studio/i.test(text)) return 0;
  return null;
}

function parseSize(text) {
  const m = text.match(/([\d,]+)\s*sq\s*\.?\s*ft/i);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
}

function guessAvailability(text) {
  if (/\bsold\b/i.test(text)) return false;
  if (/\breserved\b/i.test(text)) return false;
  if (/\bavailable\b/i.test(text)) return true;
  return null; // unknown - caller decides the default
}

// Tries a couple of common listing-page shapes, in order, and returns as
// soon as one yields results:
//
//   1. A table where each row is one plot.
//   2. Repeated "card" elements (list items / divs whose class name hints
//      at plots/units/cards) that each contain a price.
//
// If a development's plot data is actually rendered client-side by a
// third-party widget (common in housebuilder sites - e.g. an embedded
// iframe from a plot-search vendor), NEITHER strategy will see it, because
// this script only reads the raw HTML response, not JS-rendered output.
// If every development reports strategy "none", that's the most likely
// explanation - the fix is switching the fetch below for a headless
// browser (Playwright is a natural fit) that waits for the widget to
// render before reading the DOM.
function extractPlotsFromHtml(html) {
  const $ = cheerio.load(html);
  const plots = [];

  $("table").each((_, table) => {
    $(table)
      .find("tr")
      .each((_, tr) => {
        const cells = $(tr)
          .find("td")
          .toArray()
          .map((td) => $(td).text().trim());
        if (!cells.length) return;
        const rowText = cells.join(" ");
        const price = parseMoney(rowText);
        if (price === null) return; // not a plot row
        plots.push({
          plot: cells[0] || "",
          beds: parseBeds(rowText),
          size: parseSize(rowText),
          price,
          avail: guessAvailability(rowText) ?? true,
        });
      });
  });
  if (plots.length) return { plots, strategy: "table" };

  for (const sel of [
    "article",
    "[class*='plot']",
    "[class*='unit']",
    "[class*='card']",
    "[class*='property']",
    "[class*='listing']",
    "[class*='home-item']",
    "[class*='house-type']",
  ]) {
    $(sel).each((_, el) => {
      const text = $(el).text().trim();
      const price = parseMoney(text);
      if (price === null) return;
      const heading = $(el).find("h1,h2,h3,h4,h5,strong").first().text().trim();
      plots.push({
        plot: heading || text.slice(0, 40),
        beds: parseBeds(text),
        size: parseSize(text),
        price,
        avail: guessAvailability(text) ?? true,
      });
    });
    if (plots.length) return { plots, strategy: `cards:${sel}` };
  }

  return { plots: [], strategy: "none" };
}

// When neither parsing strategy finds anything, guessing a third strategy
// blind (again) isn't useful - this instead reports concrete signals from
// the actual response so the real fix (different URL, headless-browser
// render, a third-party widget's own API) can be picked with evidence
// instead of another guess.
function diagnosePage(html) {
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const iframeSrcs = $("iframe")
    .map((_, el) => $(el).attr("src"))
    .get()
    .filter(Boolean);
  const scriptSrcs = $("script[src]")
    .map((_, el) => $(el).attr("src"))
    .get()
    .filter((src) => /widget|plot|embed|search|rightmove|onthemarket|nplan|vendor/i.test(src));
  const frameworkMarkers = ["__NEXT_DATA__", "data-reactroot", "ng-version", "__NUXT__", "window.__INITIAL_STATE__"].filter(
    (marker) => html.includes(marker)
  );

  return {
    title: $("title").text().trim(),
    bodyTextLength: bodyText.length,
    bodyTextSample: bodyText.slice(0, 200),
    iframeSrcs,
    thirdPartyScriptSrcs: scriptSrcs,
    frameworkMarkers,
  };
}

// Merges scraped plots onto the existing array, keyed by plot name, so a
// field this script can't reliably read (building/floor/baths) keeps its
// last known value instead of being blanked out.
function mergePlots(existingPlots, scraped) {
  if (!scraped.length) {
    return { plots: existingPlots, changed: false, note: "no plots found by any strategy - skipped" };
  }
  if (existingPlots.length && scraped.length < existingPlots.length * MIN_KEEP_RATIO) {
    return {
      plots: existingPlots,
      changed: false,
      note: `scrape returned ${scraped.length} plots vs ${existingPlots.length} on file (below ${
        MIN_KEEP_RATIO * 100
      }% sanity threshold) - skipped to avoid overwriting good data`,
    };
  }

  const byName = new Map(existingPlots.map((p) => [p.plot, p]));
  const merged = scraped.map((p) => {
    const prior = byName.get(p.plot);
    return {
      plot: p.plot,
      building: prior?.building ?? "-",
      floor: prior?.floor ?? "-",
      beds: p.beds ?? prior?.beds ?? 0,
      baths: prior?.baths ?? 1,
      size: p.size ?? prior?.size ?? 0,
      price: p.price,
      avail: p.avail,
    };
  });

  const changed = JSON.stringify(merged) !== JSON.stringify(existingPlots);
  return { plots: merged, changed, note: changed ? `updated (${merged.length} plots)` : "no change" };
}

async function main() {
  const { developments: sources } = JSON.parse(await readFile(SOURCES_PATH, "utf8"));
  const rawText = await readFile(PAGE_DATA_PATH, "utf8");
  const pageData = JSON.parse(rawText);

  const report = [];
  const pendingWrites = []; // [{ devId, plots }] - applied to rawText after the loop

  for (const [devId, { name, url }] of Object.entries(sources)) {
    if (!url) {
      report.push({ devId, name, status: "skipped", note: "no url configured in HILL_SOURCE_URLS.json" });
      continue;
    }
    if (!pageData[devId]) {
      report.push({ devId, name, status: "error", note: "devId not found in PAGE_DATA_FULL.json" });
      continue;
    }

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; HillAvailabilitySync/1.0)" },
      });
      if (!res.ok) {
        report.push({ devId, name, status: "error", note: `HTTP ${res.status}` });
        continue;
      }
      const html = await res.text();
      const { plots: scraped, strategy } = extractPlotsFromHtml(html);
      const existing = pageData[devId].plots || [];
      const { plots, changed, note } = mergePlots(existing, scraped);

      report.push({
        devId,
        name,
        status: changed ? "updated" : "unchanged",
        note: `${note} (strategy: ${strategy})`,
        diagnostics: strategy === "none" ? diagnosePage(html) : null,
      });

      if (changed) pendingWrites.push({ devId, plots });
    } catch (err) {
      report.push({ devId, name, status: "error", note: String(err?.message || err) });
    }
  }

  console.log("\nAvailability sync report:");
  for (const r of report) {
    console.log(`  [${r.status}] ${r.name} (${r.devId}) - ${r.note}`);
    if (r.diagnostics) {
      console.log(`    title: ${JSON.stringify(r.diagnostics.title)}`);
      console.log(`    body text length: ${r.diagnostics.bodyTextLength}`);
      console.log(`    body text sample: ${JSON.stringify(r.diagnostics.bodyTextSample)}`);
      console.log(`    iframe srcs: ${JSON.stringify(r.diagnostics.iframeSrcs)}`);
      console.log(`    third-party widget script srcs: ${JSON.stringify(r.diagnostics.thirdPartyScriptSrcs)}`);
      console.log(`    JS framework markers found: ${JSON.stringify(r.diagnostics.frameworkMarkers)}`);
    }
  }

  if (pendingWrites.length && WRITE) {
    let nextText = rawText;
    for (const { devId, plots } of pendingWrites) {
      nextText = replacePlotsInRawJson(nextText, devId, plots);
    }
    // Round-trip through JSON.parse as a sanity check before touching disk -
    // a malformed splice should fail loudly here, not produce a broken file.
    JSON.parse(nextText);
    await writeFile(PAGE_DATA_PATH, nextText, "utf8");
    console.log("\nWrote changes to src/data/PAGE_DATA_FULL.json");
  } else if (pendingWrites.length) {
    console.log("\nChanges found but --write not passed - dry run only, nothing written.");
  } else {
    console.log("\nNo changes.");
  }

  if (report.some((r) => r.status === "error")) process.exitCode = 1;
}

main();
