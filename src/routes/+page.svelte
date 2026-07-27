<script lang="ts">
  import { enhance } from "$app/forms";
  import TurnstileWidget from "$lib/components/TurnstileWidget.svelte";
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let submitting = $state(false);
</script>

<svelte:head>
  <title>1836 Digital Investment Group</title>
  <meta name="description" content="1836 Digital Investment Group" />
</svelte:head>

<div class="bg-hero flex min-h-svh flex-col">
  <main
    class="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center"
  >
    <h1
      class="font-heading text-cream text-[30px] leading-[40px] tracking-[5px] md:text-[55px] md:leading-[85px] md:tracking-[10px]"
    >
      1836 DIGITAL INVESTMENT GROUP
    </h1>

    <img
      src="/images/star-1000.png"
      srcset="
        /images/star-500.png   500w,
        /images/star-800.png   800w,
        /images/star-1000.png 1000w
      "
      sizes="(max-width: 767px) 80vw, 440px"
      width="1000"
      height="1000"
      alt=""
      class="mt-4 w-[80vw] max-w-[440px]"
    />

    <div class="mt-8 w-full max-w-sm">
      {#if form?.success}
        <p role="status" class="font-body font-light text-white">
          Thank you! Your submission has been received!
        </p>
      {:else}
        <form
          method="POST"
          class="flex flex-col items-center"
          use:enhance={() => {
            submitting = true;
            return async ({ update }) => {
              await update();
              submitting = false;
            };
          }}
        >
          {#if form?.error}
            <p
              role="alert"
              class="font-body mb-4 bg-[#ffdede] px-4 py-2 font-light text-black"
            >
              {form.error}
            </p>
          {/if}

          <!-- Anti-bot: per-request timing token + a hidden honeypot. Naive bots
               fill the honeypot; a too-fast fill is caught by the timing screen. -->
          <input type="hidden" name="ts" value={data.formTs} />
          <input
            type="text"
            name="bot-field"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
            class="hidden"
          />

          <label for="email" class="font-body text-cream font-light">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            maxlength="256"
            autocomplete="email"
            class="font-body text-cream border-cream w-60 border-0 border-b-2 bg-transparent pb-1 text-center text-xl font-light focus:outline-none"
          />

          <!-- Optional Cloudflare Turnstile (dark until PUBLIC_TURNSTILE_SITE_KEY
               is set). Injects its hidden cf-turnstile-response input into this
               form; verification runs centrally in the dashboard. -->
          <TurnstileWidget />

          <button
            type="submit"
            disabled={submitting}
            class="font-body text-cream border-cream hover:bg-cream/10 mt-6 cursor-pointer border bg-transparent px-[15px] py-[10px] font-light tracking-wider disabled:opacity-60"
          >
            {submitting ? "PLEASE WAIT..." : "CONTACT US"}
          </button>
        </form>
      {/if}
    </div>
  </main>

  <footer class="font-body text-cream/70 pb-4 text-center text-sm font-light">
    © {new Date().getFullYear()} 1836 Digital Investment Group
  </footer>
</div>
