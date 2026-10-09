---
id: dl-014-a-browsable-catalog-pack-readmes-a-generated-index-for-people-and-agents-and-a-search-page
type: decision-log
title: "A browsable catalog: pack READMEs, a generated index for people and agents, and a search page"
status: pending
tags: ["catalog","tooling","adoption","agents"]
---

## Context

On 2026-10-09 the approver asked, in chat, that the catalog this repository exposes be
**browsable**, by people and by AI agents, so that a project can choose which packs to use:
- to start, a **README per pack** describing it: installation and update commands, workflows,
  Memory elements, versions, and a complete description of examples on concrete projects;
- the READMEs (or plain Markdown files) **indexed** by an index page, with a **search field** if
  possible;
- agents must have an **API** (possibly github.com itself) to read the descriptions and the
  compositions of the packs and to search the index;
- an analysis of whether **Markdown files in the repository** are enough or **GitHub Pages** is
  needed.

What already exists:
- spec-001 §5 requires a `README.md` in every pack ("purpose, parameters, adaptation notes"), and
  the README is part of the pack's digest (§13): the README of a published version is fixed by its
  tag. `pack.yaml` has a non-empty `title` and `description` (§6.2), and every parameter a
  description "so that the README and the CLI can show it" (§8);
- `catalog.yaml` (spec-001 §11) is the index **WingFoil** reads to resolve packs: ids, paths,
  status, versions, formats, capabilities, requires, conflicts, the computed WingFoil range. It has
  no title, description or contents per pack, and it is the contract with the CLI: a change to its
  schema produces a feedback note (`wingfoil-cli` rule 8);
- installing and updating packs are **WingFoil's commands**, not yet released (F-006, F-007,
  WingFoil v0.4); until then adoption is by hand (F6.1). Journeys name commands only as WingFoil's
  to design (`05_journeys.md`);
- a pack carries no project's names, paths, people or versions (`pack-authoring`), and this
  repository keeps no list of adopters (dl-003 D10);
- the repository is public at `github.com/wingfoil/wingfoil-templates`; it has no root `README.md`
  yet, no CI yet (plan-015 task 10) and GitHub Pages is not enabled.

**Checked on 2026-10-09** against the public repository, without authentication:

| Access | Result |
|---|---|
| `raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` | 200, `access-control-allow-origin: *`; any branch or **tag** as `<ref>`, so a version-pinned read |
| REST `GET /repos/<owner>/<repo>/contents/<path>` and `git/trees/<ref>?recursive=1` | 200, CORS `*`, **60 requests per hour per IP** unauthenticated |
| REST `GET /search/code?q=…+repo:<owner>/<repo>` | **401 "Requires authentication"** |
| `https://wingfoil.github.io/wingfoil-templates/` | 404: Pages not enabled (`has_pages: false`) |

So an agent can **read** any file anonymously, pinned to a tag, but cannot **search** the
repository through GitHub without a token; github.com renders Markdown and relative links, but runs
no script, so a Markdown page cannot have a search field.

## Options

- **(a) Markdown only, in the repository.** Per-pack READMEs, a generated `CATALOG.md` (a table per
  axis, linking each README), read on github.com.
  - For: no infrastructure; versioned with the packs; rendered by github.com; readable by agents
    through raw URLs.
  - Against: no search field (browser find only); agents must fetch and parse Markdown, and cannot
    use GitHub search without a token.
- **(b) Markdown plus a generated machine-readable index in the repository** (`catalog-index.json`
  and an `llms.txt` entry point), no Pages.
  - For: agents get a stable "API" with no server: one anonymous raw fetch of the index, filtering
    locally, then raw fetches of READMEs and `pack.yaml` at the version's tag; no rate limit of the
    REST API on the main path.
  - Against: still no search field for people.
- **(c) (b) plus a GitHub Pages site** built from the same index by CI, with client-side search.
  - For: a search field and filters (axis, slot, adoption profile, status) for people; a stable
    URL that serves the same JSON with CORS; nothing new to maintain by hand, since it is generated.
  - Against: needs CI (plan-015 task 10) and a Pages deployment; enabling Pages is a repository
    setting, an outward-facing change for the approver; the site build must stay deterministic.
- **(d) Extend `catalog.yaml` with descriptions and contents.**
  - Against: it changes the contract with WingFoil (schema change, rule 8 note) for a need that is
    not WingFoil's; the resolver's file grows with prose.

## Decision

**Proposed: (b) first, then (c)**, captured as proposed with plan-020 on 2026-10-09. The approver
rules at `memory approve`. In short: **Markdown in the repository is enough for reading, by people
and agents; GitHub Pages is needed only for the search field.** `catalog.yaml` stays the contract
with WingFoil and is not extended (option d rejected).

### D1 — The pack README standard

Every pack's `README.md` has these sections, in this order (amends spec-001 §5's one-line
requirement; enforced by the lint, F3.5):
1. **Title and summary** — `pack.yaml` `title` and `description`, axis, slot, catalog
   (`official` / `community`).
2. **When to use it** — the problem it solves, the adoption profiles it serves (personas §2), when
   *not* to use it.
3. **Install and update** — what a released WingFoil supports for this pack, and only that: the CLI
   commands once a released WingFoil provides them (F-006, F-007), otherwise the hand-adoption
   steps (F6.1). No command is written before WingFoil ships it.
4. **Composition** — `requires`, `conflicts`, `formats`, `requires_capabilities`, and what it adds
   or tightens over `base`.
5. **What it adds** — workflows (name, kind, phases, roles, gates), Memory types and fields
   (states, gates), directives (id, roles), fragments (`dna`, `roles`), Memory templates.
6. **Parameters** — name, type, default, description (from `pack.yaml`).
7. **Examples** — complete scenarios on concrete (illustrative) projects: the situation, the
   composition and parameters used, what the project gets, and how a phase runs under it. Each
   example **is a fixture** under `tests/fixtures/` that the validation command composes and
   validates, so an example cannot rot. Examples name no real project, person or adopter
   (`pack-authoring`, dl-003 D10).
8. **Versions** — the versions published and their WingFoil range, generated from `catalog.yaml`
   between markers (D2), with a link to `CHANGELOG.md`.

Generated parts are delimited by markers and rewritten by the index command; the rest is written by
the pack author. The README of a published version is the one at its tag.

### D2 — The generated index

One command (proposed `npm run index`, part of the tooling) reads `catalog.yaml`, every
`pack.yaml`, the presets and the transitions, and writes, deterministically (`determinism`):
- **`CATALOG.md`** at the repository root: the human index — one table per axis (pack, summary,
  slot, status, latest version, WingFoil range, link to the README), presets and transitions,
  adoption profiles → packs, and an "For agents" section with the URLs of D3;
- **`catalog-index.json`**: the machine index — per pack: id, axis, slot, title, description,
  status, catalog, versions (version, tag, WingFoil range), requires, conflicts, formats,
  capabilities, workflows, Memory types, directives, parameters, profiles, tags, and the README and
  `pack.yaml` URLs **pinned to each version's tag** (to `main` for a `planned` pack); presets and
  transitions likewise. Its schema is `schema/catalog-index.schema.json`;
- **`llms.txt`** at the root: the entry point for agents, pointing to `catalog-index.json`,
  `CATALOG.md`, spec-001 and the URL patterns of D3;
- the generated sections of each pack README (D1, sections 1, 4–6, 8).

The validation command (F3.1) regenerates them in memory and **fails if a committed file differs**,
so the index is never stale.

### D3 — The agent "API"

No server. Stable, anonymous, CORS-enabled URLs:
- `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/catalog-index.json` — the
  index; search is a local filter over it (by axis, slot, profile, tag, text);
- `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/<pack>@<version>/<path>/README.md`
  and `…/pack.yaml` — description and composition of one published version, immutable because tags
  are never moved (dl-004, `pack-semver`);
- `catalog.yaml` and `compat.yaml` at the same base, for resolution and compatibility;
- with option (c), the same files under `https://wingfoil.github.io/wingfoil-templates/`.

The REST API (60 requests per hour unauthenticated) and GitHub code search (token required) are
not needed. If WingFoil's `template list` / `template show` (F-006) wants to read the index, that
makes it a contract: a feedback note then (rule 8).

### D4 — The search page (option c)

A static page built by CI from `catalog-index.json` and the READMEs, deployed to GitHub Pages on
every change of `main`:
- search field over title, description, README text and tags; filters by axis, slot, profile,
  status; each result links the README of the latest version;
- client-side, with no external service and no tracking; its script is in the repository or pinned;
- without JavaScript it shows the full list (the same content as `CATALOG.md`);
- it serves `catalog-index.json` and `llms.txt` too.

Enabling Pages in the repository settings is the approver's action; the deployment runs only after
CI exists (plan-015 task 10).

### D5 — Acceptance criteria

- **CB-1 README standard.** The lint fails on a fixture pack whose README misses a section of D1 or
  has them out of order.
- **CB-2 Examples are fixtures.** Every example of a README names its fixture; the validation
  command composes and validates each; a README example without a fixture fails.
- **CB-3 Install truth.** A README's install section names a CLI command only if the `compat.yaml`
  entry of a released WingFoil provides the capability; otherwise the lint requires the hand steps.
- **CB-4 Index content.** For the fixture catalog, `catalog-index.json` validates against its schema
  and lists every pack, preset and transition with the fields of D2; README and `pack.yaml` URLs of
  published versions use the version's tag.
- **CB-5 Freshness and determinism.** Changing a `pack.yaml` without regenerating makes the
  validation fail; two runs of the index command are byte-identical.
- **CB-6 Agent path.** From `llms.txt` an agent reaches the index, filters it, and fetches one pack's
  README and `pack.yaml` at a tag, with anonymous HTTP GETs only; checked once by hand against the
  public repository and recorded in the task, and offline in the tests by the URL patterns.
- **CB-7 Search page.** On the deployed site a text query, an axis filter and a profile filter each
  return the expected fixture packs; with JavaScript disabled the full list is shown.
- **CB-8 No contract change.** `catalog.yaml` and its schema are unchanged.

### D6 — Amendments this decision implies

Applied after approval, under the same follow-up plan as dl-011…dl-013:
- **spec-001 §5:** the README requirement points to D1 (a tech-spec amendment through the
  specification process; no schema of the WingFoil contract changes);
- **`pack-authoring` directive:** the README rule and the examples-are-fixtures rule;
- **`06_features.md`:** **F2.8** "Browsable catalog: README standard, generated `CATALOG.md`,
  `catalog-index.json`, `llms.txt`" (J1, J6, J5; Value H, Effort M, Uncertainty L) and **F2.9**
  "Catalog search page on GitHub Pages" (J6; Value M, Effort M, Uncertainty L); F6.1 points to the
  README section 3;
- **`07_sequencer.md`:** a wave **W7b — Catalog browsing** in M1, after W6 (CI) and before W8, so
  that `base`'s README is the first written to the standard: F2.8, F2.9;
- **`dna.yaml`:** `paths.docs` gains `CATALOG.md` and `llms.txt`; a module `catalog-index`
  (configuration change, `version:` bump, applied by the session that drives `main`).

### D7 — Elements opened later

**Tooling tasks** (no pack), through `tooling-change`, or added to plan-015's backlog if the
approver prefers:
1. the README standard: spec-001 amendment, `pack-authoring` rule, lint rule (CB-1, CB-3);
2. the index command: `CATALOG.md`, `catalog-index.json` and its schema, `llms.txt`, README
   generated sections (CB-4, CB-5);
3. examples as fixtures: the lint rule and the validation step (CB-2);
4. the agent path, documented in `CATALOG.md` and `llms.txt` and checked (CB-6);
5. the Pages site and its CI deployment, after plan-015 task 10 (CB-7);
6. a root `README.md` that links `CATALOG.md` (`dna.yaml` `paths.docs` already names it).

Every pack task from then on writes its README to the standard: the charters of dl-011, dl-012 and
dl-013 inherit it. A feedback note goes to WingFoil only if its CLI reads `catalog-index.json` (D3).

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step. The GitHub access table was checked with anonymous `curl` requests on that day.
- Open for the approver at the ruling: (b) only, or (b) then (c); the wave; the command and file
  names.
