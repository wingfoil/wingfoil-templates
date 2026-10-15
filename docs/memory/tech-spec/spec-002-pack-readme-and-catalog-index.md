---
id: spec-002-pack-readme-and-catalog-index
type: tech-spec
title: "Pack README and catalog index"
status: approved
tags: ["packs","catalog","index"]
---

## 1. Purpose and scope

This specification makes the catalog **browsable**, by people and by AI agents, so that a project
can choose its packs (dl-014). It fixes:
- the **README standard** every pack follows (§2), which supersedes the README line of spec-001
  §6.1 ("purpose, parameters, adaptation notes");
- the **generated index**: `CATALOG.md`, `catalog-index.json`, `llms.txt` and the generated
  sections of each README (§3);
- the **agent path**: stable, anonymous URLs, with no server (§4);
- the **search page** on GitHub Pages (§5);
- the **lint rules and checks** that keep all of them true (§6).

It implements dl-014 D1–D4 and its acceptance criteria CB-1…CB-8, with the proposals the approver
did not restate at the ruling (2026-10-09): option (b), then (c); `npm run index`; the file names
above; `index/catalog-index.schema.json`. It serves `docs/01_vision/06_features.md` F2.8 and F2.9,
wave W14.

Unchanged: `catalog.yaml`, `compat.yaml`, every file under `schema/`, and the pack digest of
spec-001 §13. The README stays a file of the pack: it is hashed into the digest of every published
version, so the README of a published version is fixed by its tag (dl-004 4(a)). Nothing in this
specification is part of the contract with the WingFoil CLI (`wingfoil-cli` rule 8); §4 says when
the index would become one.

Out of scope: the content of any pack's README (its pack's tasks); how WingFoil installs packs
(capability `pack-install`, WingFoil's names, spec-001 O3); enabling GitHub Pages (the approver's
action).

The key words **must**, **must not**, **should** and **may** are normative.

## 2. The pack README

### 2.1 Sections

A pack's `README.md` **must** hold these sections, in this order and with these headings, and no
other level-1 or level-2 heading:

| # | Heading | Kind | Content |
|---|---|---|---|
| 1 | `# <title>` | generated | `pack.yaml` `title` as the heading; then `description`; then one line `Axis: <axis>` and, for a phase pack, ` · Slot: <slot>`; the foundation packs, `base` and `software`, write `Axis: foundation` |
| 2 | `## When to use it` | written | the problem it solves; the adoption profiles it serves (`docs/01_vision/04_personas.md` §2), as the presets that contain it name them; when **not** to use it |
| 3 | `## Install and update` | written | §2.3 |
| 4 | `## Composition` | generated | `requires`, `conflicts`, `formats`, `requires_capabilities`; for every pack but `base`, the Memory types, roles and workflows it adds or tightens over the foundation (`base`, and `software` for a pack that requires it); for `software`, over `base`; for a pack with a conditional part (spec-001 §6.5), that part's workflows and directives marked as present only with `software` |
| 5 | `## What it adds` | generated | workflows (name, kind, phases with their roles and gates), Memory types (states, gates), directives (id, the roles fragment entries that assign them), fragments (`dna`, `roles`), Memory templates |
| 6 | `## Parameters` | generated | one row per parameter: name, type, default (or "required"), description; "None." when there is none |
| 7 | `## Examples` | written | §2.4 |
| 8 | `## Sources and adaptations` | written | the sources of the method, with their edition, and what the pack adapts from them (dl-007 M3); "None: written for this catalog." when there is none |
| 9 | `## Versions` | written | a link to `CHANGELOG.md` and a link to the pack's entry in `CATALOG.md` (§3.2, §2.5) |

A written section may contain level-3 headings and below.

### 2.2 Generated sections

A generated section is delimited by two comment lines, the heading inside them:

```markdown
<!-- generated:begin composition -->
## Composition
…
<!-- generated:end composition -->
```

The names are `title`, `composition`, `what-it-adds` and `parameters`. `npm run index` (§3)
rewrites only what lies between a pair, and writes it **only from the pack's own files at the same
commit**: `pack.yaml`, its fragments, workflows, directives and Memory templates. Nothing from
`catalog.yaml`, `compat.yaml`, another pack or git enters a README, so a publication, a WingFoil
intake or a new version of another pack never changes a pack's directory.

For section 4, "what it adds or tightens over the foundation" is computed from the pack's own fragments
alone: the Memory types, roles and states it declares, and the workflows it ships; it is not a
composition with `base`, so it lists what the pack declares without telling an addition from a
tightening. Versions appear only in `CHANGELOG.md` and in the index (§3).

### 2.3 Install and update

While no release listed in `compat.yaml` provides the capability `pack-install`, section 3
**must** give the hand-adoption steps (F6.1), and its first line after the heading **must** be:

```markdown
> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.
```

(`03_is-isnot.md`: not a manual). Once such a release is listed, the section **should** shrink to a
link.

In every case section 3 links the "Install" block of `CATALOG.md` (§3.2, §2.5), which says what the
CLI supports. **No README contains a WingFoil CLI command**: no code-block line and no inline code
span whose text, after leading whitespace and an optional `$ `, starts with `wingfoil `,
`npx wingfoil`, `npm exec wingfoil`, `npm run wingfoil` or `npm run -s wingfoil`. The hand steps
name files and keys, not commands.

### 2.4 Examples

Section 7 holds one or more examples. Each is a level-3 heading `### <example>` (a name of
spec-001 §4's grammar) followed by:
- a line `Fixture: tests/fixtures/examples/<pack name>/<example>/`;
- the situation of a **clearly fictional** project, the composition and parameters it uses, what
  the project gets, and how one phase runs under it.

Every example **is a fixture**. Its directory holds `example.yaml`, written in the preset format
(spec-001 §15) with `id` equal to `<example>`, whose `packs` contain the pack and name only packs of
the tree. The validation command composes and validates every example as it does a preset
(determinism, matrix, lint), so an example cannot rot. An example fixture is not a preset: it is
not indexed (§3) and names no profile.

**Temporary exemption** (the approver's ruling, 2026-10-10): every composition needs a methodology
(spec-001 §3), and none exists before wave W10. A pack whose examples cannot compose yet, because
the tree holds no methodology, writes `None yet: no methodology pack is published.` as section 7;
CB-2 accepts it while the tree holds no methodology (`packs/methodology/` holds no pack), and the
pack adds its examples in a later version, once one exists.

Examples name no real project, person or adopter (`pack-authoring`, dl-003 D10). Their fictional
names are not project values: the "no project values" review rule of `pack-authoring` does not
apply to section 7 and to `tests/fixtures/examples/`.

### 2.5 Links to the index

A README links `CATALOG.md` absolutely, as
`https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#<anchor>`: a tagged README
predates its own version's catalog entry, so a relative link would open an outdated `CATALOG.md`.
Links inside the pack (`CHANGELOG.md`, its files) are relative.

## 3. The generated index

### 3.1 The command

`npm run index -- [--tree <dir>] [--check]` writes, from the tree and its git tags:
- `CATALOG.md` and `llms.txt` at the tree's root;
- `catalog-index.json` at the tree's root, valid against `index/catalog-index.schema.json`;
- the generated sections of every pack README under `packs/` (§2.2), in the working tree.

`--check` writes nothing and exits 1, naming each file, when a committed output differs from what
the command would write. The validation command (F3.1) runs `--check`; `validate` and
`validate:publication` alike.

Determinism (`determinism` directive): no clock, no randomness, no environment; packs, versions,
presets and transitions in ascending byte order of their ids, versions in semver order; LF line
endings and a final newline; JSON with two-space indentation and keys in the order §3.3 gives.

Reading published data: a published version is a `versions[]` entry of `catalog.yaml`. Its `version`
and `wingfoil` (the computed range) come from `catalog.yaml` at the working commit, because a tag
precedes its own catalog entry (spec-001 §11); its `tag` is derived as `<catalog pack id>@<version>`
(dl-004), since `catalog.yaml` has no such field; the fields taken from its `pack.yaml` and README
are read at that tag (`git show <tag>:…`), never from `main`. A derived tag missing from the
repository is an error (exit 2), so CI checks out with every tag (`fetch-depth: 0`). A pack with no
published version is not listed in `CATALOG.md` or `catalog-index.json`.

Exit codes as the other commands: 1 a check fails, 2 an I/O or git error, 3 bad usage.

### 3.2 `CATALOG.md`

The human index, in this order:
1. a title and one paragraph saying what the catalog is and that the file is generated;
2. **Install**, with the anchor `install`: the `compat.yaml` releases whose `capabilities` contain
   `pack-install`, or the sentence that no released WingFoil installs packs yet and that each
   README's section 3 gives the temporary hand steps;
3. one section for the foundation packs, `base` then `software`, then one section per axis, in
   `catalog.yaml` order: a table with
   the columns Pack, Summary, Slot (phase only), Status, Latest, WingFoil, README. Pack is the id,
   preceded by `<a id="pack-<id with / replaced by ->"></a>`, the anchor READMEs link (§2.5);
   Summary is `description`'s first sentence;
   Latest and WingFoil are the last published version and its computed range; README links the
   README rendered on github.com at the latest version's tag,
   `https://github.com/wingfoil/wingfoil-templates/blob/<tag>/packs/<catalog pack id>/README.md`;
4. **Presets**: id, title, profile, packs;
5. **Transitions**: id, from, to;
6. **Profiles**: each profile named by a preset, with the packs of the presets that name it;
7. **For agents**: the URL patterns of §4 and a link to `llms.txt`.

### 3.3 `catalog-index.json`

The machine index. Top-level keys, in order:
- `format`: `1`, the counter of this file's own format;
- `repository`: `"wingfoil/wingfoil-templates"`;
- `install`: the versions of the `compat.yaml` releases that provide `pack-install`, ascending;
- `packs`: one object per published pack;
- `presets`: one object per preset (`id`, `title`, `description`, `profile`, `packs`, `url`);
- `transitions`: one object per transition (`id`, `from`, `to`, `formats`,
  `requires_capabilities`, `url`).

A pack object holds, in order:
- `id`, `catalog` and `status` from `catalog.yaml`; `axis` and `slot` derived from the id
  (spec-001 §4), both `null` for the foundation packs, `base` and `software`, and `slot` `null` for
  every pack but a phase pack; `latest`,
  the highest published version in semver order;
- `versions`: one object per published version, ascending: `version` and `wingfoil` (the computed
  range) from `catalog.yaml`, `tag` derived as `<catalog pack id>@<version>` (§3.1), and from the
  tag's `pack.yaml`: `formats`,
  `requires_capabilities`, `requires`, `conflicts`; plus `readme_url` and `manifest_url` pinned to
  the tag (§4);
- from the latest version's tag: `title`, `description`, `workflows`, `memory_types` and
  `directives` (each a sorted list of names), `parameters` (name, type, default when there is one,
  description), and `excerpt`, the first paragraph of the README's section 2 only, with no
  adoption-profile text, at most 500 characters, cut at a word;
- `profiles`: the profiles of the presets whose `packs` name the pack.

No field holds a date or a commit of `main`. The file changes only at a publication, a WingFoil
release intake (the `wingfoil` ranges, `install`) or a change of a preset or a transition.

`index/catalog-index.schema.json` (JSON Schema 2020-12) describes this file. It lives outside
`schema/` and is not part of the contract with WingFoil (§4).

### 3.4 `llms.txt`

The entry point for agents, in the `llms.txt` convention: a level-1 title, a one-line summary as a
blockquote, then level-2 sections of links:
- **Index**: `catalog-index.json` and `CATALOG.md`, at `main` (§4);
- **Specifications**: spec-001 and this specification;
- **Reading a pack**: the URL patterns of §4, with `<catalog pack id>` and `<version>` as
  placeholders.

The convention places the file at a domain root, which a project site under `/wingfoil-templates/`
cannot offer; agents are pointed to it explicitly (from `CATALOG.md`, the root `README.md` and the
search page).

## 4. The agent path

No server. Agents read anonymous, CORS-enabled URLs, with
`<base> = https://raw.githubusercontent.com/wingfoil/wingfoil-templates` and
`<tag> = <catalog pack id>@<version>`:
- `<base>/main/catalog-index.json`: the index; search is a local filter over it (by axis, slot,
  profile, status, text);
- `<base>/refs/tags/<tag>/packs/<catalog pack id>/README.md` and `…/pack.yaml`: the description and
  composition of one published version, immutable because tags never move (dl-004, `pack-semver`);
- `<base>/main/catalog.yaml` and `<base>/main/compat.yaml`: resolution and compatibility;
- `<base>/main/presets/<id>.yaml` and `<base>/main/transitions/<id>.yaml`: a preset or a
  transition, which have no version of their own (spec-001 §14, §15); these are the `url` fields of
  §3.3;
- with the search page (§5), `https://wingfoil.github.io/wingfoil-templates/catalog-index.json` and
  `…/llms.txt`, which serve `main` only.

The tag is written as is in the path (`/` and `@` included). Raw files may be up to 5 minutes stale
and raw access has undocumented abuse limits; the REST API (60 requests per hour unauthenticated)
and code search (token required) are not part of the path.

If WingFoil reads the index (for example `template list` / `template show`, feedback note F-006),
`catalog-index.json` becomes part of the contract: its schema then moves under `schema/` and a
feedback note is written (`wingfoil-cli` rule 8).

## 5. The search page

A static site built from `catalog-index.json` and the README excerpts, by a command of the tooling,
`npm run site -- [--tree <dir>] --out <dir>`, which writes `index.html`, `site.css`, `search.js`,
`catalog-index.json` and `llms.txt` into `<dir>`; deployed to GitHub Pages by CI on every change of
`main`:
- a search field over title, description, excerpt and profile, and filters by axis, slot, profile
  and status; each result links the README rendered on github.com at the latest version's tag
  (§3.2);
- client-side only: no external service, no analytics, no external fonts, no third-party library;
  the page's script is written in this repository, `index/vendor/search.js`, its sha256 recorded in
  `index/vendor/search.js.sha256` and checked by the build;
- without JavaScript the page shows the full list, with the content of `CATALOG.md`'s tables;
- the page renders no README Markdown: the excerpt is shown as escaped text, and each result links
  the README rendered on github.com;
- the site also serves `catalog-index.json` and `llms.txt`;
- the deployment job pins every action to a commit SHA and holds only the permissions
  `pages: write` and `id-token: write`.

The build is deterministic like the index (§3.1). Enabling Pages and its environment protection is
the approver's action.

## 6. Checks

These extend the lint rules of spec-001 §18 (`npm run check:packs`, F3.5) and the validation
command (F3.1):
- **CB-1 README standard.** The lint fails on a pack whose README misses a section of §2.1, has
  them out of order, has another level-1 or level-2 heading, or has a generated section without its
  markers.
- **CB-2 Examples are fixtures.** Every example names its fixture; the fixture exists, its
  `example.yaml` passes the preset schema with `id` equal to the example's name, and its `packs`
  contain the pack; the validation command composes and validates each. An example without a
  fixture, or a fixture no README names, fails. A section 7 that reads `None yet: no methodology
  pack is published.` passes while the tree holds no methodology (§2.4).
- **CB-3 Install truth.** The lint fails on a README with a WingFoil CLI command (§2.3), and on a
  section 3 whose first line is not the temporary mark of §2.3 while no `compat.yaml` release
  provides `pack-install`. `CATALOG.md`'s Install block lists only those releases. At
  `pack-release-cycle` › `prepare` the hand steps are checked against the `compat.yaml` of that
  commit; tagged READMEs are never checked again.
- **CB-4 Index content.** For a fixture catalog with tagged versions, `catalog-index.json`
  validates against its schema, carries `format: 1`, lists every published pack, preset and
  transition with the fields of §3.3, takes per-version fields from the tags, and pins its README
  and `pack.yaml` URLs with `refs/tags/<tag>`.
- **CB-5 Freshness and determinism.** Changing a `pack.yaml`, a fragment, a workflow or
  `catalog.yaml` without running `npm run index` makes the validation fail; two runs of the command
  are byte-identical; publishing a version changes no file under `packs/`.
- **CB-6 Agent path.** Offline, the tests check the URL patterns that `catalog-index.json`,
  `CATALOG.md` and `llms.txt` emit. Live, an anonymous fetch from `llms.txt` to the index, a filter,
  and one pack's README and `pack.yaml` at its tag are recorded as evidence in `base`'s first
  `pack-release` (the first tag).
- **CB-7 Search page.** A site built from the fixture catalog returns the expected packs for a text
  query, an axis filter and a profile filter, and its no-JavaScript HTML lists all of them; the
  vendored script's checksum is verified. On the deployed site, the page loads, and
  `catalog-index.json` and `llms.txt` are served with CORS.
- **CB-8 No contract change.** `catalog.yaml`, `compat.yaml` and the files under `schema/` are
  unchanged by this specification and by the tasks that implement it.

## 7. Open points

All closed in wave W14 (plan-024):

| # | Point | Decision |
|---|---|---|
| P1 | The vendored search library, and whether the page needs any script beyond it. | No third-party library: the page's own script, vendored with its sha256 (§5); the approver, 2026-10-11 |
| P2 | Whether `excerpt` should also carry section 2's adoption profiles as text, for search. | No: the first paragraph only (§3.3); the approver, 2026-10-11 |
| P3 | The name of the site command (`npm run site` here) and its output layout. | `npm run site -- [--tree <dir>] --out <dir>` and its five files (§5); task-024 |

## Execution Notes

- 2026-10-10, under plan-021: written from dl-014 D1–D5, submitted `pending`.
- 2026-10-10: amended while `pending`, before the approver's ruling, after an independent review:
  the temporary exemption of §2.4 for packs that cannot compose an example before the first
  methodology (the approver's ruling); the sources of each index field (§3.1, §3.3), `axis`,
  `slot` and `latest` derived; preset and transition URLs (§4); absolute links to `CATALOG.md`
  (§2.5); the exact temporary mark and command rule (§2.3); anchors in table cells (§3.2); CI with
  every tag; example fixtures are not presets. Additions dl-014 does not state, for the ruling: the
  site command's name (P3), and section 4 listing what a pack declares without telling an addition
  from a tightening (§2.2).
- 2026-10-12, the open points and errata of wave W14 (plan-024), recorded for the next element
  that amends this specification:
  - **P1** (the approver, 2026-10-11): no third-party search library; the page's script is
    written in this repository, `index/vendor/search.js`, its sha256 in
    `index/vendor/search.js.sha256` and checked by the build (task-024);
  - **P2** (the approver, 2026-10-11): `excerpt` carries section 2's first paragraph only, no
    profile text (task-019);
  - **P3** (task-024): `npm run site -- [--tree <dir>] --out <dir>`, writing `index.html`,
    `site.css`, `search.js`, `catalog-index.json` and `llms.txt`;
  - **§3.1 erratum** (task-019): a version's `tag` is derived as `<catalog pack id>@<version>`;
    `catalog.yaml` has no such field;
  - **§2.4 erratum** (the approver, 2026-10-11, task-022): the exemption holds while the tree holds
    no methodology (§6 CB-2's reading), not "until the first methodology is published".
- 2026-10-13, **amended in place** (plan-031): the errata and rulings above, and those of task-019,
  task-024 and plan-024, are folded into the body, as dl-020 R2 asks before wave W8. The approver
  chose, on 2026-10-13, to edit this approved body in place under a plan (option (b) of plan-031)
  rather than to supersede it, and approved the content ("tabella ok"); the merge OK of plan-031 is
  the approval of the edited text. Changes: §2.4 (the exemption while the tree holds no
  methodology); §3.1 and §3.3 (`tag` derived; a derived tag missing is an error); §3.2 (the README
  column on github.com at the tag); §3.3 (`excerpt`, P2); §5 (results link the README on github.com;
  P1: the page's own script; no Markdown rendered; P3: the command and its files; the CI-pending
  sentence dropped); §6 CB-7 (the vendored script); §7 (P1–P3 closed). Nothing else changed; no
  code, test or generated file changes, since the tooling already implements this text.
- 2026-10-15, **amended in place** (plan-038, after dl-022; the merge OK of plan-038 is the approval
  of the edited text): §2.1 (the foundation packs `base` and `software` write `Axis: foundation`;
  section 4 is computed over the foundation a pack requires, and marks a conditional part's files
  as present only with `software`); §3.2 (the foundation section, `base` then `software`); §3.3
  (`axis` and `slot` `null` for both foundation packs). The index command follows in the tooling
  task that follows plan-038.
- 2026-10-15, **§2.4 kept by ruling** (the approver, plan-038): §2.4's premise, that every
  composition needs a methodology (spec-001 §3), no longer holds after dl-022: a composition without
  `software` needs none, so `base` could compose an example alone. The exemption is kept as written,
  holding while the tree holds no methodology, and `base`'s examples are due with wave W10.
