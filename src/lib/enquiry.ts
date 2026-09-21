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
  consent: boolean;
  pageLang: string;
};

// Distinguishes conversion points for GTM: the homepage form has no
// developmentId, the two dev-page forms (sticky card + inline panel) share
// one name since they're the same conversion action on the same URL.
function formNameFor(payload: EnquiryPayload): string {
  if (payload.type === "download_gate") return "download_gate";
  return payload.developmentId ? "register_development" : "register_interest_general";
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
