---
id: dl-014-a-browsable-catalog-pack-readmes-a-generated-index-for-people-and-agents-and-a-search-page
type: decision-log
title: "A browsable catalog: pack READMEs, a generated index for people and agents, and a search page"
status: approved
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
- spec-001 §6.1 requires a `README.md` in every pack ("purpose, parameters, adaptation notes"), and
  the README is part of the pack's digest (§13; dl-004 4(a)): the README of a published version is
  fixed by its tag, and any change to it on `main` is a change of the pack. `pack.yaml` has a
  non-empty `title` and `description` (§6.2), and every parameter a description "so that the README
  and the CLI can show it" (§8). The tag of a version is committed before the catalog entry that
  names it (§11), so a README can never list its own version's catalog data;
- `catalog.yaml` (spec-001 §11) is the index **WingFoil** reads to resolve packs; it lists a pack
  only once its first version is published, with ids, paths, status, versions, formats,
  capabilities, requires, conflicts and the computed WingFoil range, which `wingfoil-release-intake`
  recomputes (§12). It has no title, description or contents per pack. Its schema, like every file
  under `schema/`, is the contract with the CLI: a change produces a feedback note (`wingfoil-cli`
  rule 8);
- presets carry a `profile` (spec-001 §15); `pack.yaml` has no profile or tag field
  (`additionalProperties: false`);
- installing and updating packs are **WingFoil's commands**, not yet released; the capability
  `pack-install` names them in this repository's vocabulary (spec-001 §12; WingFoil owns the names,
  O3). Until then adoption is by hand (F6.1), and hand steps are temporary (`03_is-isnot.md`: not a
  manual);
- a pack carries no project's names, paths, people or versions (`pack-authoring`), and this
  repository keeps no list of adopters (dl-003 D10);
- the repository is public at `github.com/wingfoil/wingfoil-templates`; it has no root `README.md`
  yet, no tags yet (the first is `base`'s, W9), no CI yet (plan-015 task 10) and GitHub Pages is not
  enabled.

**Checked on 2026-10-09**, anonymously:

| Access | Result |
|---|---|
| `raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` | 200, `access-control-allow-origin: *`, `cache-control: max-age=300` (up to 5 minutes stale). This repository has no tag yet; on another public repository a tag containing `/` and `@` worked as `<ref>`, plain, %-encoded and as `refs/tags/<tag>` |
| REST `GET /repos/<owner>/<repo>/contents/<path>` and `git/trees/<ref>?recursive=1` | 200, CORS `*`, **60 requests per hour per IP** unauthenticated |
| REST `GET /search/code?q=…+repo:<owner>/<repo>` | **401 "Requires authentication"** |
| `https://wingfoil.github.io/wingfoil-templates/` | 404: Pages not enabled (`has_pages: false`). A Pages site serves one deployed build (no ref in its URL), with CORS `*` |

So an agent can **read** any file anonymously, pinned to a tag, but cannot **search** the
repository through GitHub without a token. People signed in to github.com can use its web code
search, an interim search; github.com renders Markdown and relative links but runs no script, so a
Markdown page cannot have a search field.

## Options

- **(a) Markdown only, in the repository.** Per-pack READMEs and a generated `CATALOG.md`, read on
  github.com.
  - For: no infrastructure; versioned with the packs; rendered by github.com; readable by agents
    through raw URLs.
  - Against: no search field (browser find, or github.com search when signed in); agents must fetch
    and parse Markdown.
- **(b) Markdown plus a generated machine-readable index** (`catalog-index.json` and an `llms.txt`
  entry point), no Pages.
  - For: agents get a stable "API" with no server: one anonymous raw fetch of the index, filtering
    locally, then raw fetches of READMEs and `pack.yaml` at the version's tag; no REST rate limit on
    the main path.
  - Against: still no search field for people.
- **(c) (b) plus a GitHub Pages site** built from the same index by CI, with client-side search.
  - For: a search field and filters for people; a stable URL that serves the same JSON with CORS;
    generated, so nothing to maintain by hand.
  - Against: needs CI (plan-015 task 10) and a Pages deployment; enabling Pages is a repository
    setting, an outward-facing change for the approver; the build must stay deterministic and safe.
- **(d) Extend `catalog.yaml` with descriptions and contents.**
  - Against: it changes the contract with WingFoil (schema change, rule 8 note) for a need that is
    not WingFoil's; the resolver's file grows with prose.

## Decision

**Proposed: (b) first, then (c)**, captured as proposed with plan-020 on 2026-10-09. The approver
rules at `memory approve`. In short: **Markdown in the repository is enough for reading, by people
and agents; GitHub Pages is needed only for the search field.** `catalog.yaml` stays the contract
with WingFoil and is not extended (option d rejected).

### D1 — The pack README standard

Every pack's `README.md` has these sections, in this order (it replaces spec-001 §6.1's one-line
requirement through the tech-spec of D6, and is enforced by the F3.5 lint rules):
1. **Title and summary** — `pack.yaml` `title` and `description`, axis, slot.
2. **When to use it** — the problem it solves, the adoption profiles it serves (personas §2, as the
   presets that contain it name them), when *not* to use it.
3. **Install and update** — the hand-adoption steps, marked as temporary, while no released
   WingFoil provides `pack-install`; and a link to the "Install" block of `CATALOG.md` (D2), which
   says what the CLI supports. No CLI command is written in a README.
4. **Composition** — `requires`, `conflicts`, `formats`, `requires_capabilities`, and what it adds
   or tightens over `base`.
5. **What it adds** — workflows (name, kind, phases, roles, gates), Memory types and fields (states,
   gates), directives (id, roles), fragments (`dna`, `roles`), Memory templates.
6. **Parameters** — name, type, default, description.
7. **Examples** — complete scenarios on concrete, clearly fictional projects: the situation, the
   composition and parameters used, what the project gets, and how a phase runs under it. Each
   example **is a fixture**, at `tests/fixtures/examples/<pack name>/<example>/`, that the
   validation command composes and validates, so an example cannot rot. Examples name no real
   project, person or adopter (`pack-authoring`, dl-003 D10); their fictional names are not project
   values (the F3.5 rule exempts the README's examples section).
8. **Sources and adaptations** — the sources of the method with their edition, and what the pack
   adapts (spec-001 §6.1 "adaptation notes"; dl-007 M3).
9. **Versions** — a static link to `CHANGELOG.md` and to the pack's entry in `CATALOG.md`.

Generated sections (1, 4, 5, 6) take their data **only from the pack's own files at the same
commit**: `pack.yaml`, fragments, workflows, directives. Nothing from `catalog.yaml` or
`compat.yaml` enters a README, so a publication or a WingFoil intake never changes a pack's
directory.

### D2 — The generated index

One command (proposed `npm run index`, part of the tooling) writes, deterministically
(`determinism`):
- **`CATALOG.md`** at the repository root, the human index: one table per axis (pack, summary,
  slot, status, latest version, WingFoil range, link to the README at the latest tag), presets and
  transitions, adoption profiles → packs (from the presets), an **"Install" block** generated from
  the `compat.yaml` releases that list `pack-install`, and a "For agents" section with the URLs of
  D3;
- **`catalog-index.json`**, the machine index, with a `format:` counter: per published pack — id,
  axis, slot, title, description, status, catalog, versions (version, tag, WingFoil range),
  requires, conflicts, formats, capabilities, workflows, Memory types, directives, parameters,
  profiles (from presets), a README excerpt, and the README and `pack.yaml` URLs **pinned to each
  version's tag**; presets and transitions likewise. Per-version fields are read from the tag
  (`git show <tag>:…`), never from `main`. A pack with no published version is not listed. Its
  schema lives outside `schema/` (proposed `index/catalog-index.schema.json`) and is **not** part of
  the contract with WingFoil;
- **`llms.txt`** at the repository root: the entry point for agents, pointing to
  `catalog-index.json`, `CATALOG.md`, spec-001 and the URL patterns of D3. (The `llms.txt`
  convention puts it at a domain root, which a project Pages site under `/wingfoil-templates/`
  cannot offer; agents are pointed to it explicitly.)
- the generated sections of each pack README (D1).

The validation command (F3.1) regenerates them in memory and **fails if a committed file differs**.
`pack-release-cycle` › `publish` and `wingfoil-release-intake` regenerate `CATALOG.md` and
`catalog-index.json` (D6).

### D3 — The agent "API"

No server. Stable, anonymous, CORS-enabled URLs, with `<catalog pack id>` and
`<tag> = <catalog pack id>@<version>`:
- `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/catalog-index.json` — the
  index; search is a local filter over it (by axis, slot, profile, text);
- `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/tags/<tag>/packs/<catalog pack id>/README.md`
  and `…/pack.yaml` — description and composition of one published version, immutable because tags
  are never moved (dl-004, `pack-semver`);
- `catalog.yaml` and `compat.yaml` at the `main` base, for resolution and compatibility;
- with option (c), the same index files under `https://wingfoil.github.io/wingfoil-templates/`,
  which serves `main` only (no tag-pinned files).

Raw files are cached up to 5 minutes, and raw access has undocumented abuse limits; the REST API
(60 requests per hour) and code search (token required) are not needed. If WingFoil's
`template list` / `template show` (F-006) wants to read the index, it becomes a contract: its schema
then moves under `schema/`, with a feedback note (rule 8).

### D4 — The search page (option c)

A static page built by CI from `catalog-index.json` and the README excerpts, deployed to GitHub
Pages on every change of `main`:
- search field over title, description, README excerpt and profile; filters by axis, slot, profile,
  status; each result links the README of the latest version;
- client-side, with no external service, no external fonts, no analytics; the search library is
  vendored in the repository with its checksum; any remaining external script carries SRI;
- without JavaScript it shows the full list (the same content as `CATALOG.md`);
- README Markdown is sanitized when rendered to HTML (community packs arrive with M4);
- the CI job pins every action to a commit SHA and has only `pages: write` and `id-token: write`;
- it serves `catalog-index.json` and `llms.txt` too.

Enabling Pages and its environment protection is the approver's action; the deployment runs only
after CI exists (plan-015 task 10).

### D5 — Acceptance criteria

- **CB-1 README standard.** The F3.5 lint rules fail on a fixture pack whose README misses a
  section of D1 or has them out of order.
- **CB-2 Examples are fixtures.** Every example of a README names its fixture under
  `tests/fixtures/examples/`; the validation command composes and validates each; an example
  without a fixture fails.
- **CB-3 Install truth.** No README contains a CLI command (lint); `CATALOG.md`'s "Install" block
  lists only the `compat.yaml` releases that provide `pack-install`; at `pack-release-cycle` ›
  `prepare` the README's hand steps are checked against the `compat.yaml` of that commit (they are
  required while no listed release provides `pack-install`). Tagged READMEs are never re-checked.
- **CB-4 Index content.** For the fixture catalog, `catalog-index.json` validates against its
  schema, carries `format: 1`, and lists every published pack, preset and transition with the fields
  of D2; README and `pack.yaml` URLs use `refs/tags/<tag>`; per-version fields come from the tag.
- **CB-5 Freshness and determinism.** Changing a `pack.yaml` or `catalog.yaml` without regenerating
  makes the validation fail; two runs of the index command are byte-identical; publishing a version
  changes no file under `packs/`.
- **CB-6 Agent path.** Offline, the tests check the URL patterns the index and `llms.txt` emit. Live,
  an anonymous fetch from `llms.txt` to the index, a filter, and one pack's README and `pack.yaml`
  at its tag are recorded as evidence in `base`'s first `pack-release` (the first tag).
- **CB-7 Search page.** In the test suite, a site built from the fixture catalog returns the
  expected fixture packs for a text query, an axis filter and a profile filter, and its no-JS HTML
  lists all of them. On the deployed site: the page loads, and `catalog-index.json` and `llms.txt`
  are served with CORS.
- **CB-8 No contract change.** `catalog.yaml`, `schema/` and their schemas are unchanged.

### D6 — Amendments this decision implies

Applied after approval, under the follow-up plan of plan-020 (run by the session that drives
`main`), each document bumped per `doc-versioning`:
- **a new tech-spec**, "Pack README and catalog index", that supersedes spec-001 §6.1's README line
  and specifies D1–D4. spec-001 is `approved` and its state machine has no way back, so it is not
  edited; spec-001's Execution Notes cite the new spec. dl-013's design phase follows the same path;
- **`pack-authoring` directive:** the README rule and the examples-are-fixtures rule;
- **`06_features.md`:** **F2.8** "Browsable catalog: README standard, generated `CATALOG.md`,
  `catalog-index.json`, `llms.txt`" (J1.1, J6.1, J7.1; Value H, Effort M, Uncertainty L) and
  **F2.9** "Catalog search page on GitHub Pages" (J6.1; Value M, Effort M, Uncertainty L); F6.1
  points to README section 3;
- **`07_sequencer.md`:** a new wave in M1 after W7, so that `base`'s README is the first written to
  the standard: F2.8, F2.9 (two features, no high uncertainty). Proposed id **W14**, so that the
  approved ids are not renumbered; it gets an "Ends with" ("a fixture catalog is browsable in
  `CATALOG.md`, `catalog-index.json` and a search page built in the tests"); the M1 row's goal and
  feature count (9 → 11) follow;
- **`08_mvp-canvas.md`:** the feature count of "waves W1–W12" and the tooling bullet;
- **`03_is-isnot.md`:** IS gains "a browsable index for people and agents (`CATALOG.md`,
  `catalog-index.json`), generated from the catalog"; "not a manual" stays, and README section 3
  respects it;
- **workflows:** `pack-release-cycle` › `publish` and `wingfoil-release-intake` regenerate and
  `produce` `CATALOG.md` and `catalog-index.json` (a workflow change with a `version:` bump);
- **`dna.yaml`:** `paths.docs` gains `CATALOG.md` and `llms.txt`; `paths.sources` gains
  `catalog-index.json` and `index/`; a module `catalog-index`.

### D7 — Elements opened later

**Tooling tasks** (no pack), opened by a follow-up plan through `tooling-change` once plan-015 is
`done` (it is owned by another session, and CB-1/CB-3 build on its lint task 9, D4 on its CI task
10):
1. the tech-spec of D6, the `pack-authoring` rule, and the README lint rules (CB-1, CB-3);
2. the index command: `CATALOG.md`, `catalog-index.json` and its schema, `llms.txt`, the README
   generated sections (CB-4, CB-5);
3. examples as fixtures: the fixture layout, the lint rule and the validation step (CB-2);
4. the agent path, documented in `CATALOG.md` and `llms.txt` and tested offline (CB-6);
5. the Pages site, its tests on the fixture catalog, and its CI deployment (CB-7, D4);
6. a root `README.md` that links `CATALOG.md` (`dna.yaml` `paths.docs` already names it);
7. the workflow changes of D6.

Every pack charter opened after this decision is approved cites D1, and its acceptance includes
CB-1 and CB-2: the charters of dl-011, dl-012 and dl-013 among them.

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step. The GitHub access table was checked with anonymous requests on that day, by the capture and
  again by the independent review.
- Open for the approver at the ruling: (b) only, or (b) then (c); the wave id; the command and file
  names.
- 2026-10-09: amended while `pending` after an independent review, as the approver asked: README
  generated sections only from the pack's own files, versions and install data only in the index
  (review N1, N2); index schema outside `schema/`, `format:` counter (N3); field sources, per-version
  reads from tags, unpublished packs excluded (N4); CB-7 on a fixture-built site (N5); CB-6 split,
  live part at `base`'s first release (N6); a new tech-spec instead of editing spec-001, "Sources and
  adaptations" section (N7); missing amendments (N8); wave id W14 and its "Ends with" (N9); tasks
  after plan-015, "F3.5 lint rules" (N10); Pages security (N11); URL patterns, caching, Pages and
  `llms.txt` caveats, signed-in search (N12); fictional examples, fixture layout, README excerpt
  (N13); charters cite D1, journey steps (N14); §6.1, wording, the tag claim (N15).
- 2026-10-09: unlike dl-011…dl-013, which the approver deferred until WingFoil has stable
  configuration contracts, this decision-log may be ruled before then.
- 2026-10-10: D6 applied under plan-021, merged `86d2124`: spec-002 ("Pack README and catalog
  index", `approved`), the `pack-authoring` rules, F2.8 and F2.9 with wave W14, the workflow and
  `dna.yaml` changes. The approver ruled the scheduling: D7's tooling tasks (W14) open through
  `tooling-change` once plan-015 is `done`, as written; and a temporary exemption from CB-2 for
  packs that cannot compose an example before the first methodology (spec-002 §2.4).
- 2026-10-10: until the index command exists (D7 T2, wave W14), `pack-release-cycle` › `publish`
  (v4) leaves `CATALOG.md` and `catalog-index.json` unchanged and records the skipped regeneration
  in the `pack-release` element's Execution Notes, as the approver ruled (option "skip and record");
  applied under plan-023 (`600ba9f`). The W7 dry-run publication is not blocked by W14.
