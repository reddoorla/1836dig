import { json } from "@sveltejs/kit";
import { env as privateEnv } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import type { RequestHandler } from "./$types";

// Deploys as a Netlify function under adapter-netlify — a live probe, so it
// must never be prerendered.
export const prerender = false;

export const GET: RequestHandler = async () => {
  const forms = {
    ingestUrl: !!privateEnv.FORMS_INGEST_URL,
    ingestToken: !!privateEnv.FORMS_INGEST_TOKEN,
    turnstile: !!publicEnv.PUBLIC_TURNSTILE_SITE_KEY?.trim(),
    // Declares that this deploy's form forwards the `testMode` marker to
    // central ingest (see +page.server.ts buildPayload) — required before the
    // fleet form-e2e probe will submit here.
    testMode: true,
  };
  return json({ ok: true, forms });
};
