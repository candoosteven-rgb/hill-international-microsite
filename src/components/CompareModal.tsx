"use client";

import { devById, epcOf, priceLabelFor, statusMetaFor } from "@/lib/data";
import { resolveImage } from "@/lib/image";
import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import Icon from "@/components/Icon";

export default function CompareModal() {
  const { t } = useLanguage();
  const { compareIds, compareOpen, setCompareOpen, removeCompare } = useAppState();

  if (!compareOpen) return null;
  const devs = compareIds.map((id) => devById(id)).filter(Boolean) as NonNullable<ReturnType<typeof devById>>[];

  const rows: { label: string; cells: React.ReactNode[] }[] = [
    { label: t("price_from"), cells: devs.map((d) => priceLabelFor(d, t)) },
    { label: t("compare_row_region"), cells: devs.map((d) => d.region) },
    { label: t("compare_row_zone"), cells: devs.map((d) => (d.zone ? `Zone ${d.zone}` : "—")) },
    { label: t("compare_row_status"), cells: devs.map((d) => statusMetaFor(d, t).label) },
    { label: t("compare_row_homes"), cells: devs.map((d) => d.tagline || t("dev_tagline", { region: d.region })) },
    { label: t("offers_label"), cells: devs.map((d) => (d.accessPoints || []).map((a) => a.label).join(" · ") || "—") },
    { label: t("compare_row_epc"), cells: devs.map((d) => (epcOf(d) ? `EPC ${epcOf(d)}` : "—")) },
  ];

  return (
    <div
      className="hi-fade fixed inset-0 z-[330] flex items-center justify-center p-4 md:p-6"
      style={{ background: "rgba(15,25,30,0.72)", backdropFilter: "blur(6px)" }}
      onClick={() => setCompareOpen(false)}
    >
      <div
        className="hi-pop relative max-h-[88vh] w-full max-w-[1080px] overflow-y-auto rounded-3xl bg-white p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setCompareOpen(false)}
          aria-label={t("modal_close")}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(31,58,71,0.1)] text-[#1F3A47]"
        >
          <Icon name="close" className="h-4.5 w-4.5" />
        </button>
        <h2 className="mb-2 text-[26px] font-extrabold tracking-tight text-[#1F3A47] md:text-[30px]">
          {t("compare_modal_title")}
        </h2>
        <p className="mb-8 text-[14.5px] text-[#6E7B80]">{t("compare_modal_sub")}</p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
            <thead>
              <tr>
                <th className="w-[160px]" />
                {devs.map((d) => (
                  <th key={d.id} className="px-3 pb-4">
                    <div className="relative h-[110px] w-[150px] overflow-hidden rounded-xl">
                      <img src={resolveImage(d.image, d.name)} alt={d.name} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeCompare(d.id)}
                        aria-label={t("compare_remove")}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90"
                      >
                        <Icon name="close" className="h-3 w-3 text-[#1F3A47]" />
                      </button>
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#1F3A47]">{d.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-[#E3E9EC]">
                  <td className="py-3.5 pr-4 text-[13px] font-semibold text-[#8B979C]">{row.label}</td>
                  {row.cells.map((c, i) => (
                    <td key={i} className="px-3 py-3.5 text-[14px] text-[#1F3A47]">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
