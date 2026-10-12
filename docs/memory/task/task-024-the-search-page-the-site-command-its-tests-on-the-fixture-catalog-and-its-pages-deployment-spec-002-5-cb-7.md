---
id: task-024-the-search-page-the-site-command-its-tests-on-the-fixture-catalog-and-its-pages-deployment-spec-002-5-cb-7
type: task
title: "The search page: the site command, its tests on the fixture catalog, and its Pages deployment (spec-002 §5, CB-7)"
status: pending
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-023-a-root-readme.md-that-links-the-catalog-dl-014-d7-t6"]
tags: ["tooling","W14","F2.9"]
---

## Context

Task 6 of plan-024 (`tooling-change` › `deliver`, wave W14, F2.9), the last of the wave. Tooling
task, no pack. Below, "plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **dl-014 D4 and D7 T5:** a static search page built by CI from `catalog-index.json`, deployed to
  GitHub Pages on every change of `main`, with its security rules;
- **spec-002 §5** (search field and filters, client-side only, the vendored script with its
  sha256, a full list without JavaScript, no Markdown rendered unsanitized, the site also serving
  `catalog-index.json` and `llms.txt`, the deployment job's pinned actions and permissions), **§4**
  (the Pages URLs of the agent path), **§3.4** (agents pointed to `llms.txt` from the search page),
  **§6 CB-7** and **§7 P1, P3**;
- **the approver's rulings of 2026-10-11** (plan-024): no third-party search library, the page's
  script written here and kept under `index/vendor/` with its sha256 checked by the build (P1); the
  excerpt shown as escaped text, no README Markdown rendered;
- **task-019, task-021:** the index and its URL helpers, which left the Pages URLs of §4 to this
  task; **task-023:** the root `README.md`, which links only relative targets, and which gains the
  search page's link here;
- **task-013:** CI, its pinned actions and the test of `ci.yml`.

Decided here, spec-002 P3: the command is `npm run site -- [--tree <dir>] --out <dir>`, and the
site is `index.html`, `site.css`, `search.js`, `catalog-index.json` and `llms.txt` at the root of
`<dir>`, served at `https://wingfoil.github.io/wingfoil-templates/`.

The approver's action, asked during the build, before the first deployment: enable GitHub Pages
on the repository with the source "GitHub Actions", and protect its `github-pages` environment so
that only `main` deploys.

Not in scope: a domain of its own; analytics; any external service; the README content of packs;
CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change; the format of
`catalog-index.json` does not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **The command (P3).** `npm run site -- [--tree <dir>] --out <dir>` reads the tree's committed
   `catalog-index.json` and `llms.txt` (it does not rebuild the index) and writes the five files of
   the Context into `<dir>`, which must not exist or be empty (exit 2 otherwise). It checks the
   sha256 of `index/vendor/search.js` against `index/vendor/search.js.sha256` before copying it,
   and exits 1 when they differ. Two builds are byte-identical (`determinism`). Exit codes as the
   other commands: 1 a check fails, 2 an I/O error, 3 bad usage.
4. **The page (§5).**
   - **Without JavaScript,** `index.html` lists every pack of the index, by axis as `CATALOG.md`
     does (id, summary, slot for a phase pack, status, latest, WingFoil range, a link to the README
     at the latest tag on github.com), then the presets, the transitions and the profiles; and it
     links `llms.txt` and `catalog-index.json`, relatively.
   - **With JavaScript,** `search.js` adds a search field over title, description, excerpt and
     profiles (a case-insensitive substring match on every word of the query) and filters by axis,
     slot, profile and status; a pack row is shown when it matches the query and every filter.
     The data it searches is in the rows' `data-` attributes, so the page needs no request.
   - **Safety:** every text from the index is HTML-escaped; no Markdown is rendered; the excerpt is
     shown as text. The page loads nothing from another origin: no font, no script, no style, no
     analytics. A `<meta http-equiv="Content-Security-Policy">` allows `'self'` only, and the page
     has no inline script or style.
5. **The vendored script (P1).** `index/vendor/search.js` is plain JavaScript written in this
   repository, with no dependency; its pure function `matches(pack, query, filters)` is exported to
   the tests (attached to `globalThis` when there is no `document`) and its DOM wiring runs only in a
   browser. `index/vendor/search.js.sha256` holds its sha256 in the `sha256sum` format, and a test
   fails when they differ.
6. **Tests on the fixture catalog (CB-7).** A site built from the fixture catalog with tags
   (task-019) is read back: a text query (a word only kanban's excerpt holds) gives
   `[methodology/kanban]`; the axis filter `phase` gives `[phase/inception/lean]`; the profile
   filter `small teams` gives `[methodology/kanban, phase/inception/lean]`; the no-JavaScript HTML
   lists all five published packs and no unpublished one; every text of the index appears escaped
   (a test injects `<script>` and `&` into a description); the checksum is verified; the build is
   deterministic; and nothing in `index.html` or `site.css` names another origin except the
   github.com links to READMEs.
7. **The agent path (§4).** The Pages URLs `https://wingfoil.github.io/wingfoil-templates/`,
   `…/catalog-index.json` and `…/llms.txt` join the URL patterns of task-021 (a `pages` form of
   `parseUrl`, resolved offline to the built site's files) and are listed in `CATALOG.md` › "For
   agents" and in `llms.txt`, with the note that they serve `main` only; the committed outputs are
   regenerated. The root `README.md` links the search page, and its test (task-023) allows exactly
   that one absolute link.
8. **The deployment (D4, §5).** `.github/workflows/pages.yml` runs on every push to `main` (and
   by `workflow_dispatch`): a `build` job with `contents: read` (checkout, setup-node, `npm ci`,
   `npm run build`, `npm run site -- --out _site`, `actions/upload-pages-artifact`) and a `deploy`
   job with exactly `pages: write` and `id-token: write`, in the `github-pages` environment, with
   `actions/deploy-pages`; every action pinned to a full commit SHA of a release tag, the tag
   named in a comment; concurrency `pages` without cancelling a running deployment; no secret
   read. `tests/pages-workflow.test.ts` checks it as `tests/ci-workflow.test.ts` checks `ci.yml`.
9. **The deployed site (CB-7).** After the approver enables Pages and the branch is merged, the
   first deployment's run conclusion is `success`; an anonymous request shows the page loading
   (HTTP 200), and `catalog-index.json` and `llms.txt` served with
   `access-control-allow-origin: *`. The commands and their output are recorded in the Execution
   Notes; this item is checked after the merge, before the task goes `done`.
10. **Tests,** red first: acceptance 3–8.
11. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
