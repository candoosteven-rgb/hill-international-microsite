/// <reference path="./worker-configuration.d.ts" />

declare global {
  interface Env {
    // Secret - set via `wrangler secret put BREVO_API_KEY`, never committed.
    BREVO_API_KEY?: string;
  }
}

type EnquiryBody = {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  regions?: string[];
  motivation?: string;
  budget?: string;
  preferredLanguage?: string;
  developmentId?: string;
  developmentName?: string;
  consent?: boolean;
  pageLang?: string;
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const ALLOWED_TYPES = new Set(["register", "download_gate"]);

const NOTIFY_TO = "InternationalEnquiries@hill.co.uk";
const NOTIFY_FROM = { email: "sales@email.hill.co.uk", name: "Hill International Microsite" };

function badRequest(message: string): Response {
  return Response.json({ ok: false, error: message }, { status: 400 });
}

function escapeHtml(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] as string);
}

function buildEmail(body: EnquiryBody): { subject: string; text: string; html: string } {
  const rows: [string, string][] = [
    ["Name", body.name || ""],
    ["Email", body.email || ""],
    ["Phone", body.phone || "-"],
  ];

  if (body.type === "download_gate") {
    rows.push(["Development", body.developmentName || body.developmentId || "-"]);
  } else {
    rows.push(["Regions", (body.regions || []).join(", ") || "-"]);
    rows.push(["Looking to", body.motivation || "-"]);
    rows.push(["Budget", body.budget || "-"]);
    rows.push(["Preferred language", body.preferredLanguage || "-"]);
  }
  rows.push(["Site language", body.pageLang || "-"]);

  const subject =
    body.type === "download_gate"
      ? `New downloads enquiry: ${body.name} - ${body.developmentName || body.developmentId || ""}`
      : `New register-interest enquiry: ${body.name}`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<table cellpadding="6" cellspacing="0">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;

  return { subject, text, html };
}

async function sendNotificationEmail(body: EnquiryBody, env: Env): Promise<void> {
  if (!env.BREVO_API_KEY) return;
  const { subject, text, html } = buildEmail(body);
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: NOTIFY_FROM,
        to: [{ email: NOTIFY_TO }],
        replyTo: body.email ? { email: body.email, name: body.name } : undefined,
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      console.error("Brevo send failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("Brevo send threw", err);
  }
}

async function handleEnquiry(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let body: EnquiryBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const type = body.type && ALLOWED_TYPES.has(body.type) ? body.type : null;
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();

  if (!type) return badRequest("Missing or invalid 'type'");
  if (!name) return badRequest("Missing 'name'");
  if (!EMAIL_RE.test(email)) return badRequest("Missing or invalid 'email'");
  if (!body.consent) return badRequest("Consent is required");

  await env.DB.prepare(
    `INSERT INTO enquiries
      (type, name, email, phone, regions, motivation, budget, preferred_language, development_id, development_name, consent, page_lang, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      type,
      name,
      email,
      body.phone || null,
      body.regions && body.regions.length ? body.regions.join(",") : null,
      body.motivation || null,
      body.budget || null,
      body.preferredLanguage || null,
      body.developmentId || null,
      body.developmentName || null,
      body.consent ? 1 : 0,
      body.pageLang || null,
      request.headers.get("user-agent") || null
    )
    .run();

  // Don't make the visitor wait on (or fail because of) the notification email -
  // the submission is already safely stored in D1 either way.
  ctx.waitUntil(sendNotificationEmail({ ...body, name, email }, env));

  return Response.json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/enquiry") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
      }
      try {
        return await handleEnquiry(request, env, ctx);
      } catch (err) {
        console.error("enquiry insert failed", err);
        return Response.json({ ok: false, error: "Server error" }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
