declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type EnquiryPayload = {
  type: "register" | "download_gate";
  name: string;
  email: string;
  phone?: string;
  regions?: string[];
  motivation?: string;
  budget?: string;
  preferredLanguage?: string;
  developmentId?: string;
  developmentName?: string;
  formPlacement?: "sticky" | "panel";
  consent: boolean;
  pageLang: string;
};

// Distinguishes conversion points for GTM: the homepage form has no
// developmentId; the two dev-page forms (sticky card + inline panel) are
// split via formPlacement since they're different UI entry points.
function formNameFor(payload: EnquiryPayload): string {
  if (payload.type === "download_gate") return "download_gate";
  if (!payload.developmentId) return "register_interest_general";
  if (payload.formPlacement === "sticky") return "register_development_sticky";
  if (payload.formPlacement === "panel") return "register_development_panel";
  return "register_development";
}

function pushConversionEvent(payload: EnquiryPayload): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "form_submit",
    form_name: formNameFor(payload),
    development_id: payload.developmentId,
    development_name: payload.developmentName,
    page_lang: payload.pageLang,
  });
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) pushConversionEvent(payload);
    return res.ok;
  } catch {
    return false;
  }
}
