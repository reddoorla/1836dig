<!-- The shared playwright-a11y config axe-scans /dev/animate-in on every fleet
     site (it demos the starter's animateIn action). This site has no scroll
     animations, so a titled semantic stub stands in — without it the route
     404s and axe fails on the untitled error page (the recurring onboard
     gotcha). -->
<svelte:head>
  <title>animate-in demo — Reddoor</title>
  <meta
    name="description"
    content="Fleet a11y audit target. This site has no scroll animations; the route exists so the shared audit's route list resolves."
  />
</svelte:head>

<main>
  <h1>Animate-in demo</h1>
  <p>
    This one-page site ships no scroll animations, so there is nothing to demo
    here. The route exists because the fleet a11y audit scans it on every site.
  </p>
  <p><a href="/">Back to home</a></p>
</main>
