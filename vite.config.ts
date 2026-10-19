import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { privacyServices } from "./scripts/privacy-services";
import kitConfig from "./sveltekit.config.js";

export default defineConfig({
  // SvelteKit 3 takes its configuration here, not from svelte.config.js
  // (which it refuses to start beside).
  plugins: [sveltekit(kitConfig), tailwindcss(), privacyServices()],
});
