import { env } from "$env/dynamic/private";
import { createIngestAction } from "@reddoorla/maintenance/forms";
import type { Actions, PageServerLoad } from "./$types";

// The homepage hosts the form action, so it cannot be prerendered.
export const prerender = false;

// Per-request timestamp for the ingest bot fill-timing screen.
export const load: PageServerLoad = () => ({ formTs: Date.now() });

export const actions: Actions = {
  default: createIngestAction({
    formType: "contact",
    // Keep the original Webflow failure copy.
    errorMessage: "Oops! Something went wrong while submitting the form.",
    getConfig: () => ({
      url: env.FORMS_INGEST_URL,
      token: env.FORMS_INGEST_TOKEN,
    }),
    buildPayload: (form, event) => {
      const email = form.get("email")?.toString().trim();
      if (!email) throw new Error("missing email");
      return {
        email,
        // Full URL incl. query string so UTM/campaign params are captured.
        sourceUrl: event.url.href,
        // Fleet form-e2e probe marker — forwarded only when the submitted form
        // carries testMode=true; a real visitor never sets it.
        testMode: form.get("testMode")?.toString() === "true" || undefined,
      };
    },
  }),
};
