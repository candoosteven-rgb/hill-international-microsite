"use client";

import { team } from "@/lib/data";
import { resolveImage } from "@/lib/image";
import { useLanguage } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

const WHY_ITEMS: Record<string, { num: string; title: string; body: string }[]> = {
  en: [
    { num: "01", title: "One team, several languages", body: "Speak to us in English, Turkish or Mandarin, with translation support available for other languages." },
    { num: "02", title: "Every development, one place", body: "Overview, images, brochures, fact sheets and investor guides for each development, all in one place." },
    { num: "03", title: "Clear next steps", body: "Register your interest once and a member of our team will follow up in your preferred language." },
  ],
  tr: [
    { num: "01", title: "Tek ekip, birden fazla dil", body: "Bizimle İngilizce, Türkçe veya Mandarin dilinde görüşebilirsiniz; diğer diller için çeviri desteği mevcuttur." },
    { num: "02", title: "Tüm projeler, bir arada", body: "Her proje için genel bakış, görseller, broşür, bilgi föyü ve yatırımcı rehberi tek bir yerde." },
    { num: "03", title: "Açık bir sonraki adım", body: "İlginizi bir kez kaydedin, ekibimizden biri tercih ettiğiniz dilde size geri dönsün." },
  ],
  zh: [
    { num: "01", title: "一支团队，多种语言", body: "您可以用英语、土耳其语或中文与我们沟通，其他语言也可提供翻译支持。" },
    { num: "02", title: "所有项目，一站浏览", body: "每个项目的概览、图片、楼书、资料表和投资指南，一站呈现。" },
    { num: "03", title: "清晰的下一步", body: "登记一次意向，我们的团队成员将以您偏好的语言跟进。" },
  ],
  ar: [
    { num: "01", title: "فريق واحد، عدة لغات", body: "يمكنكم التحدث معنا بالإنجليزية أو التركية أو الماندرين، مع توفر دعم ترجمة للغات الأخرى." },
    { num: "02", title: "كل المشاريع في مكان واحد", body: "نظرة عامة وصور وكتيبات وأوراق بيانات ودليل المستثمر لكل مشروع، في مكان واحد." },
    { num: "03", title: "خطوات تالية واضحة", body: "سجّل اهتمامك مرة واحدة، وسيتواصل معك أحد أعضاء فريقنا باللغة التي تفضلها." },
  ],
};

export default function Team() {
  const { t, lang } = useLanguage();
  const items = WHY_ITEMS[lang] || WHY_ITEMS.en;

  return (
    <section id="hi-team" className="hi-section bg-[#0D1214]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <span className="hi-eyebrow mb-6 block text-[#C98A6B]">{t("why_eyebrow")}</span>
          <h2
            className="font-bold text-[#F5F7F8]"
            style={{ fontSize: "clamp(26px,3.4vw,40px)", lineHeight: 1.02, letterSpacing: "-0.035em" }}
          >
            {t("why_title")}
          </h2>
          <p className="my-6 max-w-[571px] text-[17px] leading-[1.7] text-white/62">{t("why_body")}</p>
          <div>
            {items.map((w) => (
              <div key={w.num} className="border-t border-white/14 py-6">
                <h3 className="mb-2 text-[24px] font-bold tracking-tight text-[#F5F7F8]">{w.title}</h3>
                <p className="text-[15.5px] leading-relaxed text-white/58">{w.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <div>
          <span className="hi-eyebrow mb-5 block text-[#C98A6B]">Got any questions?</span>
          <h2
            className="mb-3 font-bold text-[#F5F7F8]"
            style={{ fontSize: "clamp(24px,3.1vw,37px)", lineHeight: 1.02, letterSpacing: "-0.035em" }}
          >
            {t("team_title")}
          </h2>
          <p className="mb-8 text-[16px] leading-relaxed text-white/62">{t("team_body")}</p>
          <div className="flex flex-col">
            {team.map((m) => (
              <div key={m.id} className="flex items-center gap-4 border-t border-white/14 py-4">
                <img
                  src={resolveImage(m.photo, m.name)}
                  alt={m.name}
                  loading="lazy"
                  className="h-14 w-14 flex-none rounded-full object-cover"
                />
                <div>
                  <div className="text-[17px] font-bold tracking-tight text-[#F5F7F8]">{m.name}</div>
                  <div className="text-[13px] text-white/55">{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
