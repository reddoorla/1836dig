import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { privacyServices } from "./scripts/privacy-services";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss(), privacyServices()],
});
