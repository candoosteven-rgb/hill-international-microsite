"use client";

import { useLanguage } from "@/lib/i18n";
import { useAppState } from "@/lib/app-state";
import Icon from "@/components/Icon";
import LangPills from "@/components/LangPills";

const links: { href: string; key: string }[] = [
  { href: "#hi-developments", key: "nav_developments" },
  { href: "#hi-about", key: "nav_about" },
  { href: "#hi-team", key: "nav_team" },
];

export default function Nav() {
  const { t } = useLanguage();
  const { menuOpen, setMenuOpen, liked, setSavedOnly } = useAppState();

  const goToSaved = () => {
    setSavedOnly(true);
    setMenuOpen(false);
    document.getElementById("hi-developments")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="sticky top-0 z-[90] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.06)]"
      style={{ background: "rgba(18,34,45,0.96)", backdropFilter: "blur(14px)" }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-5 py-6 md:px-10">
        <a href="#" className="flex-none leading-none" aria-label="Hill International">
          <span className="text-[22px] font-extrabold tracking-tight text-[#F9F5F3]">Hill</span>
          <span className="ml-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#C1560F]">
            International
          </span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-2xl border border-white/25 bg-white/8 md:hidden"
        >
          <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5 text-white" />
        </button>

        <nav className="hidden flex-wrap items-center gap-6 text-[14.5px] font-medium text-white/90 md:flex">
          {links.map((l) => (
            <a key={l.key} href={l.href} className="hi-link">
              {t(l.key)}
            </a>
          ))}
          <div className="flex items-center gap-1.5 border-l border-white/15 pl-3">
            {liked.size > 0 && (
              <button
                onClick={goToSaved}
                className="hi-pill mr-1 inline-flex items-center gap-1.5 rounded-full border border-white/28 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#F9F5F3]"
              >
                <Icon name="heart-fill" className="h-3.5 w-3.5 flex-none text-[#C1560F]" />
                {liked.size}
              </button>
            )}
            <LangPills variant="dark" size="sm" />
          </div>
          <a
            href="#hi-register"
            className="hi-pill inline-flex items-center rounded-full bg-[#C1560F] px-5.5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(46,125,100,0.4)]"
          >
            {t("nav_register")}
          </a>
        </nav>
      </div>

      {menuOpen && (
        <div className="hi-in flex flex-col gap-0.5 border-t border-white/12 px-5 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/8 py-4 text-[17px] font-semibold text-[#F9F5F3]"
            >
              {t(l.key)}
            </a>
          ))}
          {liked.size > 0 && (
            <button
              onClick={goToSaved}
              className="flex items-center gap-2 border-b border-white/8 py-4 text-left text-[17px] font-semibold text-[#F9F5F3]"
            >
              <Icon name="heart-fill" className="h-4 w-4 flex-none text-[#C1560F]" />
              {t("filter_saved")} ({liked.size})
            </button>
          )}
          <div className="flex flex-wrap gap-2 py-4">
            <LangPills variant="dark" />
          </div>
          <a
            href="#hi-register"
            onClick={() => setMenuOpen(false)}
            className="mt-2 flex items-center justify-center rounded-full bg-[#C1560F] px-5 py-4 text-base font-semibold text-white"
          >
            {t("nav_register")}
          </a>
        </div>
      )}
    </div>
  );
}
