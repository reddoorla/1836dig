# 1836dig — Work Journal

Running log of build work: what was done, why, and where it landed.
Chronological — newest entry at the bottom.

The convention is in [CLAUDE.md](../CLAUDE.md) under "The work journal". In
short: every working session appends a dated entry, prose over bullets, why
over what, and history is never edited to be right — a later entry corrects an
earlier one and says so.

---

## 2026-09-05 — Journal opened, 11 commits of history summarised rather than reconstructed (`chore/work-journal`)

The journal starts today, so this first entry is a **backfill**: a coarse
summary written from the commit log, not from memory. Detail below this line is
trustworthy; detail above it is not, and nothing here should be cited as though
someone wrote it down at the time. For anything before 2026-09-05 the commit
log is the record.

**What this repo is.** The one-page site for
[1836dig.com](https://www.1836dig.com/) — 1836 Digital Investment Group —
converted off Webflow onto the Reddoor stack: SvelteKit 2 / Svelte 5 /
Tailwind 4 on adapter-netlify, **no CMS**. There is one page and its content is
hardcoded in `src/routes/+page.svelte`. The point of the conversion was to stop
paying Webflow: every asset (background photo, star logo, favicon, the Proxima
Nova webfont) is self-hosted under `static/`, and nothing references the Webflow
CDN, so the plan can be cancelled once DNS moves.

**The eras, such as they are.** Eleven commits, all inside eight days —
2026-07-27 to 2026-08-03, five in July and six in August. Three of them are the
site: the conversion itself (29 files, 3,359 insertions, in one commit on
07-27), the fleet bootstrap the same day (CI caller workflow, eslint, the
`/dev/a11y-fixtures` and `/dev/animate-in` audit routes), and the fleet smoke
suite on 07-31 (#1). Every commit after that is automation — the org Renovate
preset (#2), Renovate re-authenticating as the `reddoor-renovate` GitHub App
instead of an operator PAT (#4), and five dependency bumps on 08-03. So: built
in a sitting, then left alone while Renovate keeps it current. That is the
honest shape of it, and it is what a finished one-pager should look like.

**State as of this entry.** Branch `chore/work-journal`, cut from local `main`
at `d783be8`, tree clean, nothing of anyone's in flight. Local `main` is two
Renovate merges behind `origin/main` (#12, #13, 2026-08-10 and 08-12) and a
fetch shows the remote has moved further still, plus a `ci/run-on-staging`
branch nobody here has looked at — this checkout is stale, not divergent. The
README's launch checklist is still entirely unticked, and the log records no
DNS cutover, so whether the domain actually moved and the Webflow plan was
cancelled cannot be answered from inside this repo.

**What changed today.** `CLAUDE.md` now exists and carries "The work journal";
this file is the other half.
