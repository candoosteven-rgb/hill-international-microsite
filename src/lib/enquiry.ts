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

export async function submitEnquiry(payload: EnquiryPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
