---
id: task-024-the-search-page-the-site-command-its-tests-on-the-fixture-catalog-and-its-pages-deployment-spec-002-5-cb-7
type: task
title: "The search page: the site command, its tests on the fixture catalog, and its Pages deployment (spec-002 §5, CB-7)"
status: in-progress
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
`<dir>`, served at `https://wingfoil.github.io/wingfoil-templates/`; recorded in spec-002's
Execution Notes with the P1 ruling, as task-019 and task-022 recorded their errata. A static site
with relative links needs no `actions/configure-pages`.

**The approver's action**, asked during the build and done before `in-review`:
**Settings › Pages › Build and deployment › Source: GitHub Actions** (with *Enforce HTTPS*, on by
default for github.io); then **Settings › Environments › `github-pages` › Deployment branches and
tags: Selected branches and tags**, with exactly one rule, branch `main`, and no tag rule. GitHub
creates the `github-pages` environment when Pages is enabled; the approver checks its rule. If the
organisation restricts Pages, it must allow public Pages sites. The Pages URLs land with the merge
that first deploys them.

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
3. **The command (P3).** `npm run site -- [--tree <dir>] --out <dir>` reads the tree's
   `catalog-index.json` and `llms.txt` as they are (it does not rebuild the index): it validates
   `catalog-index.json` against `index/catalog-index.schema.json` (exit 1 when it does not
   validate) and requires `llms.txt` (exit 2 when missing). It writes the five files of the Context
   into `<dir>`, which must not exist or be empty (exit 2 otherwise), with LF endings, no timestamp
   and nothing that depends on the tree's absolute path. It checks the sha256 of
   `index/vendor/search.js` against `index/vendor/search.js.sha256` before copying it (exit 1 when
   they differ). Two builds are byte-identical (the `determinism` directive). Exit codes as the
   other commands: 1 a check fails, 2 an I/O error, 3 bad usage.
4. **The page (§5).**
   - **Without JavaScript,** `index.html` lists every pack of the index by axis, as `CATALOG.md`
     does (id, summary, slot for a phase pack, status, latest, WingFoil range, a link to the README
     at the latest tag on github.com), then the Presets and Transitions tables and the Profiles
     section; and it links `llms.txt` and `catalog-index.json`, relatively.
   - **With JavaScript,** `search.js` adds a search field over title, description, excerpt and
     profiles and filters by axis, slot, profile and status. The query is split on whitespace;
     every word must occur, case-insensitively; an empty query matches every pack; a pack with no
     profile fails any profile filter; only pack rows are filtered, not presets or transitions. A
     row is shown when it matches the query and every filter, and hidden with the `hidden`
     property. The data searched is in each pack row's `data-` attributes (`data-profiles` as
     HTML-escaped JSON, since profiles contain spaces), so the page sends no request.
   - **Safety:** every text from the index is HTML-escaped, in text nodes and in attribute values;
     no Markdown is rendered; the excerpt is text. The page loads nothing from another origin: no
     font, no script, no style, no analytics, no protocol-relative URL, no `url(` with a scheme in
     `site.css`. `<head>` starts with `<meta charset="utf-8">`, then, before any `<link>` or
     `<script>`,
     `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'">`;
     there is no inline script, no `<style>` and no `style=` attribute. A meta CSP ignores
     `frame-ancestors` and Pages sets no response header, so the page has no clickjacking
     protection: accepted, since it has no form and no state.
5. **The vendored script (P1).** `index/vendor/search.js` is plain JavaScript written in this
   repository, with no dependency, linted by `npm run lint` with browser globals. Its pure function
   `matches(pack, query, filters)` is exposed as `globalThis.wingfoilSearch = { matches }` when
   there is no `document`, and its DOM wiring runs only in a browser.
   `index/vendor/search.js.sha256` holds its sha256 in the `sha256sum` format; `.gitattributes`
   gains `index/vendor/** -text`, so the sum holds on any checkout; a test fails when they differ.
   `_site/` is in `.gitignore` and ESLint's ignores.
6. **Tests on the fixture catalog (CB-7).** A site is built from the fixture catalog with tags
   (task-019). The tests load the built `search.js` (the deployed bytes) with `node:vm` in a
   context without `document`, parse each pack row's `data-` attributes from the built
   `index.html`, and run `matches` over those rows:
   - a word only kanban's excerpt holds gives `[methodology/kanban]`, and the same word in capitals
     too; a query that matches nothing gives `[]`;
   - axis `phase` gives `[phase/inception/lean]`; slot `inception` gives `[phase/inception/lean]`;
     profile `small teams` gives `[methodology/kanban, phase/inception/lean]`;
   - the status filter, on a synthetic `deprecated` pack, in the unit tests of `matches`.

   They also check: the no-JavaScript HTML lists all five published packs and no unpublished one,
   and the fixture's unreleased working-tree title appears nowhere; `"`, `'`, `<script>` and `&`
   injected into a description and an excerpt appear escaped in text and attributes; the CSP
   string, whole; the checksum is verified and a changed script fails the build; two builds are
   byte-identical; nothing in `index.html` or `site.css` names another origin except the README
   links built by `readmeOnGithub`.
7. **The agent path (§4).** The Pages URLs `https://wingfoil.github.io/wingfoil-templates/`,
   `…/catalog-index.json` and `…/llms.txt` join the URL patterns of task-021 (a `pages` form of
   `parseUrl`, resolved offline to the built site's files) and are listed in `CATALOG.md` › "For
   agents" and in `llms.txt`, with the note that they serve `main` only; the committed outputs are
   regenerated. The root `README.md` gains a Markdown link to the search page and `npm run site` in
   its command list; its test (task-023) allows exactly that one absolute link target, and its
   no-bare-URL rule stays.
8. **The deployment (D4, §5).** `.github/workflows/pages.yml`:
   - runs on every push to `main` and by `workflow_dispatch`; no `pull_request` or
     `pull_request_target` trigger; workflow-level `permissions: {}`; concurrency
     `{ group: pages, cancel-in-progress: false }`; no secret read;
   - a `build` job (`runs-on: ubuntu-24.04`, a `timeout-minutes`, `permissions: { contents: read }`):
     checkout with `fetch-depth: 0`, `fetch-tags: true` and `persist-credentials: false`; setup-node
     `22.21.0` with `check-latest: false`; `npm ci`; `npm run build`; `npm run index -- --check`;
     `npm run site -- --out _site`; `actions/upload-pages-artifact` with `path: _site`;
   - a `deploy` job that `needs: build`, runs only `if: github.ref == 'refs/heads/main'`, holds
     exactly `pages: write` and `id-token: write`, in the environment
     `{ name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }`, with
     `actions/deploy-pages` (`id: deployment`);
   - every action pinned to a full commit SHA of a release tag, the tag named in a comment.

   `tests/pages-workflow.test.ts` checks it as `tests/ci-workflow.test.ts` checks `ci.yml`.
   `ci.yml` gains a step `npm run site -- --out "$RUNNER_TEMP/site"` on every run, and its test
   lists it, so the site builds on the task branch before the approver's gate.
9. **The deployed site (CB-7), checked in `deliver`.** Before `in-review`, the approver has enabled
   Pages, and `gh api repos/wingfoil/wingfoil-templates/pages --jq .build_type` printing `workflow`
   is recorded. After the `--no-ff` merge and the push of `main`, and before `approved → done`,
   the Execution Notes record:
   - the `pages.yml` run of the merge commit
     (`gh run list --workflow pages.yml --branch main --limit 1 --json conclusion,headSha`) with
     conclusion `success`;
   - `curl -sI https://wingfoil.github.io/wingfoil-templates/` returning 200;
   - `curl -sI -H 'Origin: https://example.org'` on `…/catalog-index.json` and `…/llms.txt`
     returning 200 with `access-control-allow-origin: *`; and `curl -s <url> | cmp - <file>`
     against `main`'s `catalog-index.json` and `llms.txt` exiting 0.

   If one fails, the task stays `approved`, the failure is recorded and a bug element is opened;
   its fix is a tooling task of its own, and this task goes `done` after it.
10. **Tests,** red first: acceptance 3–8.
11. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

Branch `task/task-024-site`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`, `security`), under `npm run lint`. Tests first.

- **`index/vendor/search.js`:** an IIFE: `matches(pack, query, filters)` (pack: `{ text, axis,
  slot, status, profiles }`), then, when `document` exists, the wiring that reads the rows'
  `data-` attributes, builds nothing but the controls already in the HTML (a search input and four
  `<select>`s), and sets `hidden`; otherwise `globalThis.wingfoilSearch = { matches }`.
  `index/vendor/search.js.sha256` in `sha256sum` format.
- **`src/site.ts`, `src/site-cli.ts`:** `runSite(argv)` (acceptance 3); `renderSite(index)`
  writes `index.html` from the index (escaping with one `html()` helper; the tables of
  `CATALOG.md`; each pack row a `<tr>` with `data-text`, `data-axis`, `data-slot`, `data-status`,
  `data-profiles`; the filter options from the index's own values) and `site.css` (a constant).
  `package.json` gains `"site": "node dist/src/site-cli.js"`.
- **`src/index-urls.ts`:** `pagesUrl(path)` and a `pages` form in `parseUrl`/`buildUrl`;
  `src/index-render.ts` lists the three Pages URLs in "For agents" and `llms.txt`, noted as `main`
  only.
- **`.github/workflows/pages.yml`:** as acceptance 8, with `actions/checkout` and
  `actions/setup-node` at `ci.yml`'s SHAs, `actions/upload-pages-artifact` at v5.0.0
  (`fc324d3547104276b827a68afc52ff2a11cc49c9`) and `actions/deploy-pages` at v5.0.1
  (`368f82528645a54fb793d4d04e342629a3f51346`). `ci.yml` gains the site step.
- **Repository files:** `.gitattributes` `index/vendor/** -text`; `.gitignore` and ESLint ignore
  `_site/`; ESLint declares browser globals for `index/vendor/*.js`; the root README links the
  site and names `npm run site`; spec-002's Execution Notes record P1 and P3.
- **Tests:** `tests/site.test.ts` (acceptance 3–6, the fixture catalog), `tests/pages-workflow.test.ts`
  (acceptance 8), and the agent-path, index-urls, root-readme and ci-workflow tests extended
  (acceptance 7, 8).

## Execution Notes

- 2026-10-12: independent review of the body (a subagent with its own context, with read-only
  checks of the Pages actions and of github.io's CORS): approve after amendments; two blocking
  points (the deployed check had no path through the loop; the approver's settings were not
  exact), eleven should-fix (dispatch on other branches, stale or malformed input, the exact CSP,
  testing `matches` on the built site, slot and status coverage, the escaping test, other
  origins, line endings of the checksummed file, lint and the output folder, the documentation
  directive, the scope of the Pages URLs) and nits, all applied while `pending`. Re-review:
  approve; its should-fix (served bytes compared with `cmp`, not with a HEAD request) and nits
  (the charset meta first; "before `in-review`") applied.
- 2026-10-12, build on `task/task-024-site` (`73f2dff`): the tests of acceptance 3–8 were written
  first and failed to compile, then ran red against the missing modules; the review fixes were
  written test first (three failing site tests before them). Deviation from the Design: the site
  takes its axis order from the index schema's `axis` enum and reads no `catalog.yaml`, so it
  lists every pack of the index whatever the tree holds (review); it also refuses a pack whose
  `latest` is none of its versions, or whose axis it has no section for. spec-002's Execution
  Notes record P1, P3 and the W14 errata (`b000e9d`).
- 2026-10-12: independent review of the build (a subagent with its own context, the pinned SHAs
  checked against their release tags): approve after fixes; two should-fix (packs dropped by a
  partial `catalog.yaml`; the Pages root resolved to the wrong file in the tests), two surviving
  mutations and nits, applied in `24f31b5`. Re-review: approve; its three nits (a title-only
  search word, the Pages bodies compared, an axis guard) applied in `eea09d0`.
- 2026-10-12, the approver's action (acceptance 9, before `in-review`): GitHub Pages enabled on
  the repository. `gh api repos/wingfoil/wingfoil-templates/pages` prints `build_type: workflow`,
  `html_url: https://wingfoil.github.io/wingfoil-templates/`, `https_enforced: true`,
  `public: true`; the `github-pages` environment has `custom_branch_policies: true` and one branch
  policy, `main`.
- 2026-10-12: Acceptance 1–2 on Node.js 22.21.0 and 22.12.0: 803 tests pass; `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `validate`, the golden `validate`,
  `npm run index -- --check` and `npm run site -- --out _site` exit 0; CB-8 holds; no dependency
  added.
- 2026-10-12, CI (acceptance 11): run 38217775205 on `eea09d0`, conclusion `success` for
  `validate (22.12.0)` and `validate (22.21.0)`, each building the site.
