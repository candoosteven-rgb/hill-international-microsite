/// <reference path="./worker-configuration.d.ts" />

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

function badRequest(message: string): Response {
  return Response.json({ ok: false, error: message }, { status: 400 });
}

async function handleEnquiry(request: Request, env: Env): Promise<Response> {
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

  return Response.json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/enquiry") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
      }
      try {
        return await handleEnquiry(request, env);
      } catch (err) {
        console.error("enquiry insert failed", err);
        return Response.json({ ok: false, error: "Server error" }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
