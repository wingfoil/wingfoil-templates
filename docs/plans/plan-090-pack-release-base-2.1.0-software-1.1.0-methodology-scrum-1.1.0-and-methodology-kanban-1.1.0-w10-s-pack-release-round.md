---
id: plan-090-pack-release-base-2.1.0-software-1.1.0-methodology-scrum-1.1.0-and-methodology-kanban-1.1.0-w10-s-pack-release-round
type: plan
title: "pack-release: base 2.1.0, software 1.1.0, methodology/scrum 1.1.0 and methodology/kanban 1.1.0, W10's pack release round"
status: draft
workflow: "pack-release"
phase: "release"
tags: ["packs","base","software","scrum","kanban","W10"]
---

## Context

The pack release round of W10 (the sequencer › W10's order: after the presets,
`governance/feedback` and `governance/wingfoil-dogfood`, before this repository's adoption): the
next version of each of the four packs whose fixes and additions the register holds, through
`pack-release` › `release`, which includes `pack-release-cycle` (`prepare → validate →
approve-publication → publish`). Named as the next plan by plan-089's close. `main` at `c33f6a22`
(plan-089's `active → done`), pushed by the approver; its CI read: CI 45888295271 and Pages
45888295309, both `success` (plan-089 point 7).

The first release under `pack-release-cycle` 10 (plan-089): `validate` runs `npm run
check:release` (dl-054 P1); at `approve-publication` the approver pushes the approval commit and the
agent reads `main`'s CI on it before handing over the publication's commands (dl-053 P1).

**Published today:** `base` 2.0.1, `software` 1.0.0 (`base@^2`), `methodology/scrum` 1.0.0 and
`methodology/kanban` 1.0.0 (each `base@^2`, `software@^1`); their charters `active`.

**The register's Open rows this round settles** (`docs/owed-items.md`), by pack:
- **`base`:** "bug-011's fix" (`security-secrets` names its exceptions: the emails of `dna.yaml` ›
  `team.members` and the git identity's email in a commit's author header); "bug-014's fix"
  (`governance-evolution` › `apply` asks for `AGENTS.md` updated outside the generated region);
  "`base`'s directives' `Precedence:` line and its AGENTS.md section stating spec-001 §10.1's
  table"; the Memory templates' optional fields (`decision-log`: `contributor`, `credit`,
  `reported_by`; `task`: `reported_by`, holding feedback ids as well as note paths); "`base`
  composed without `software`" (no directive for `product-owner`, the role of
  `decision-log-ingest` › `capture`: a directive for that role, or a reading that the advice
  stands; claude's row).
- **`software`:** "bug-012's fix" (its AGENTS.md section names the agent's roles and the `bug`
  gates by reference to `dna.yaml` and `memory.yaml`, with dl-041 G1's wording in the section and
  the README); its directives' `Precedence:` line; the Memory templates' optional fields (`adr`,
  `bug`, `tech-spec`: `contributor`, `credit`, `reported_by`; `release`: `backlog_committed`,
  `waves`, `## Scope changes`).
- **`methodology/scrum`:** "bug-013's fix" (its AGENTS.md section names the role mapping as its
  default, pointing to the workflows' roles and `dna.yaml`); "bug-015's fix" (`sprint-planning`,
  `plan-release` and the `scrum` directive name the risk of a `sprint` naming no Sprint; WingFoil's
  side is F-043); its directives' `Precedence:` line.
- **`methodology/kanban`:** its directives' `Precedence:` line.
- **The round:** "A check of the CHANGELOG's first line, which becomes the tag annotation" (where
  it goes ruled here, `check:packs` recommended); "`npm run check:release`'s report: the counts'
  lines" (`workflow list` ends with `}`, the dry run with "- Not pushed: …"); "The notice to
  WingFoil UI" (what of its adoption feedback was captured, bug-011 … bug-015, dl-041, F-043 …
  F-046, and the fix published; its text shown to the approver first); "`pack-semver` rule for
  fixes and changed defaults" (trigger: the next pack release that is a fix or changes a default).

bug-011 … bug-015 are `approved`, `minor` (plan-064 ruling 6). The packs' directives today carry no
`Precedence:` line: `pack-authoring` asks for it on the first line after the `# ` title (dl-025 D2,
spec-001 §10.1), and no lint checks it.

**Not in this round:** `governance/feedback` and `governance/wingfoil-dogfood` (no row names their
next release; their four directives carry no `Precedence:` line either, point 4); this repository's
adoption and its pin upgrade (next in W10); "The private projects' check scripted" (its trigger is a
release that needs a private check, and `pack-release-cycle` 10 asks for none, point 9).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One plan, four pack-releases.** Recommended: this plan carries the four, as plan-052 carried
   three: `prel-009` `base` 2.1.0, `prel-010` `software` 1.1.0, `prel-011` `methodology/scrum`
   1.1.0, `prel-012` `methodology/kanban` 1.1.0, numbered and prepared in that order (`requires`'
   order, `base` first). One outline, one close, one notice. *Alternative:* one `pack-release` plan
   per pack (four outlines and closes, the tooling task in the first).
2. **The classes: `minor` for all four.** Recommended: each release adds a line to every directive
   (`Precedence:`), which the register's rows call "the next minor release"; `base` and `software`
   also add optional template fields, an addition. The bug fixes ride in the minors: bug-011 relaxes
   a `security` rule (spec-001 §10.1) and bug-012 … bug-015 change a generated section or a phase's
   text, none a patch's wording-only change (`pack-semver`); `minor`, the higher class, settles
   them, as plan-049 ruling 2 settled its doubt, and no rule for fixes is needed to classify them.
   The row "`pack-semver` rule for fixes and changed defaults" stays Open, its trigger reworded "the
   next pack release that carries fixes only". No `requires` changes: a minor of `base` and
   `software` stays inside `base@^2` and `software@^1`. The WingFoil range is computed from
   `compat.yaml` at `prepare` (dl-002), expected `>=0.3.0 <=0.3.2` as today.
3. **Five tasks, split by kind and by pack** (plan-049 ruling 4's split), each added with `memory
   add` on `main`:
   - **task-107, tooling** (`tooling-delivery` v5, developer, `pack: ""`): the CHANGELOG check in
     `check:packs` (point 6) and `check:release`'s two counts' lines (point 7); red first (dl-018).
   - **task-108, `base`** (`kanban-delivery`, pack-author, `pack: pack-foundation-base`): bug-011,
     bug-014, the `Precedence:` lines and the AGENTS.md section's table (point 4), `decision-log`'s
     and `task`'s fields (point 5), and the row "`base` composed without `software`", settled in its
     Design with both options, the reading recommended there and ruled at its backlog gate.
   - **task-109, `software`** (`kanban-delivery`, `pack: pack-foundation-software`): bug-012, the
     `Precedence:` line, `adr`'s, `bug`'s, `tech-spec`'s and `release`'s fields.
   - **task-110, `methodology/scrum`** (`kanban-delivery`, `pack: pack-methodology-scrum`):
     bug-013, bug-015, the `Precedence:` lines.
   - **task-111, `methodology/kanban`** (`kanban-delivery`, `pack: pack-methodology-kanban`): the
     `Precedence:` lines.

   Each task on `task/task-<n>-<slug>` from `main`, merged into `main` with `--no-ff` at its
   `deliver` on the approver's OK (no plan branch: a pack-release's elements and approvals live on
   `main`, as plan-087's). Each pack task's Acceptance names its README's lines, its CHANGELOG left
   to `prepare`, and the lint, the compositions and the matrix on its branch. *Alternative:* one
   pack task for the four packs (`kanban-delivery`'s `pack` names one charter, so it departs from
   the workflow).
4. **The `Precedence:` classes** (spec-001 §10.1). Recommended: `base`'s `security-secrets`
   `security`, its `claim-sources`, `doc-versioning` and `traceability` `foundation`; `software`'s
   `determinism` `foundation`; `methodology/scrum`'s `definition-of-done` and `scrum` and
   `methodology/kanban`'s `definition-of-workflow` and `kanban` `method`. `base`'s AGENTS.md
   section states §10.1's table and its rules (the stricter rule wins; ties by class; a project's
   `custom/` directives declare their class; escalation by `decision-log-ingest`). No lint in this
   round. The governance packs' four directives without the line get a new Open row (owner
   approver, trigger each governance pack's next release). *Alternative:* their releases joined to
   this round (`governance/feedback` 1.1.0, `governance/wingfoil-dogfood` 1.1.0).
5. **The Memory templates' fields** (plan-074 point 6; the register's row). Recommended: copied
   from WingFoil 0.3.2's `init` templates, names, types and comments, each optional (not in
   `frontmatter.required`); `reported_by` an optional list whose values are feedback ids or feedback
   note paths, provenance only (plan-074 point 6); `release`'s `## Scope changes` section as 0.3.2
   writes it. Each task's Design lists the fields against 0.3.2's files, and a composition of each
   template is checked by `npm run lint` and the matrix (no `unknown field` warning on 0.3.0 …
   0.3.2).
6. **The CHANGELOG check** (task-107; dl-028 D1, dl-052 D2). Recommended: in `check:packs`, where
   `author` and `prepare` meet it: a pack's `CHANGELOG.md` has as its first entry `- <version>`,
   alone or followed by `:` or a space, equal to `pack.yaml`'s `version` (the line `publish:pack`
   reads into the tag annotation, `changelogEntry`). Red first on a fixture whose first entry names
   another version. It runs in CI with `check:packs`, so the first release it meets is this round's.
7. **`check:release`'s counts' lines** (task-107; plan-089's close). Recommended: an informative
   line for each: for `workflow list`, the number of workflows its JSON lists (`workflows: <n>`);
   for the dry run, the tag and the catalog commit it would make, read from its output; the rest of
   the report as task-106 wrote it, tests extended. *Alternative:* the rule kept as written, the row
   Closed by a note.
8. **The order.** Recommended: task-107 first, merged before any `prepare` (its check meets the
   CHANGELOG entries `prepare` writes, and its counts' lines the first report); the four pack tasks
   after it, one at a time in `prel`'s order (each body reviewed, accepted into the backlog by the
   approver, built, reviewed, `in-review` approved by the approver, merged on the approver's OK,
   `main` pushed by the approver and its CI read); then `prepare` of the four in order (version,
   `formats`, `requires_capabilities`, the computed range, the CHANGELOG entry, the README's
   "Install and update" against `compat.yaml`); then `validate` of each, its independent review
   and `submit` (`validating → releasing`); then `approve-publication` and `publish` of each.
   *Alternative:* the four pack tasks in parallel (separate files; four gates open at once).
9. **`validate`** (`pack-release-cycle` 10). Recommended, for each pack-release: the matrix (every
   preset and documented combination holding the pack, on 0.3.0 and 0.3.2), `check:runs` on both,
   the adoption run once per `init` template for a pack whose README carries install steps (dl-032
   E3), and `npm run check:release -- --pack <pack>` from the submitted head on Node.js 22.21.0 and
   22.12.0, its report written outside the repository and read into the Validation (a failed run's
   report beside the rerun's). No private projects' check: the row stays Open.
10. **`approve-publication` and `publish`** (dl-053 P1, dl-044 P1). Recommended: the approver
    approves the four (`releasing → released`) with the commands the agent hands over, then pushes
    `main` once; the agent reads `main`'s CI on the last approval commit and, after its `success`,
    hands over `publish:pack --report <path>` and the atomic push for each pack in `prel`'s order;
    the agent reads each report into the pack-release's Publication, checks its digest and range
    against the dry run the Validation recorded, checks the tag with `git ls-remote` (plan-087's
    silent push), and runs CB-6 live. *Alternative:* one push after each approval.
11. **The records after the tags.** Recommended: an Execution Note on each charter (the version, the
    tag, the catalog commit) and on bug-011 … bug-015 (fixed in, published at); the notice to
    WingFoil UI drafted, its text shown to the approver, sent only on the approver's OK, then its
    row Closed; the register's rows of this round to Closed in the close's commit.
12. **Checks** (dl-039 R1 … R3). Recommended: for each task, the build review and its amendments,
    then once on its frozen commit its branch CI and the local list on Node.js 22.21.0; for the
    pack-releases, `validate`'s list (point 9), whose `check:release` replaces the clean clones; a
    job over 25 minutes goes to the approver.
13. **The pushes** (rule 3). Recommended: every push of `main` the approver's; `main` pushed at this
    plan's `submit`, after each task's merge and close, after the approvals (point 10), and at the
    close, its run read by the next plan. The agent pushes the task branches.

## Steps

On `main`, except each task's build on its own branch (point 3). Before every commit, the privacy
check (`repository-practice` rule 2) and `npm run check:texts` on the staged diff (rule 5); after
every commit under `.wingfoil/`, `docs/memory/` or `docs/plans/`, `npm run -s wingfoil -- workflow
list` and `npm run lint` exit 0. Files staged by name.

1. **This plan:** an independent review by a subagent (dl-017), amended, the outline ruled by the
   approver, then submitted (`draft → active`), `main` pushed by the approver.
2. **task-107** (tooling, points 6, 7), through `tooling-delivery` v5 to `done`.
3. **task-108 … task-111** (`base`, `software`, `methodology/scrum`, `methodology/kanban`), each
   through `kanban-delivery` to `done`, in that order (point 8).
4. **`prepare`** (tech-lead): `prel-009` … `prel-012` added and filled in order, each submitted
   (`draft → validating`).
5. **`validate`** (reviewer): point 9 for each, its independent review recorded, then submitted
   (`validating → releasing`).
6. **`approve-publication`** (approver) and **`publish`** (tech-lead): point 10.
7. **Records:** point 11.
8. **Close:** the account per tech-spec (dl-020); the register's rows; `active → done`; the next
   plan named (this repository's adoption, its `wingfoil-release-intake` first).

## Handoff

- **claude (facilitator; developer of task-107; pack-author of task-108 … task-111; tech-lead of
  `prepare` and `publish`):** every step except the approvals, the pushes of `main`, the merge OKs,
  `publish:pack` and the notice's sending. It never runs `memory approve` or `memory reject`, nor
  `publish:pack`: it gives the approver the commands, with `cd`, `--reason` and the full id (the
  pinned 0.2.2 resolves no short reference). No pull request. Repository texts follow
  `repository-practice`.
- **Reviewers (subagents):** this plan; each task's body and build; each pack-release at
  `validate`; the close; each re-review a fix that changes a decision needs (dl-017), each record
  (dl-017 R3) the verdict, the count per severity, the fixing commit, what was applied, or not and
  why.
- **Approver:** the outline (before `submit`); each task's acceptance into the backlog and at
  `in-review`; each merge OK; every push of `main`; the four approvals; `publish:pack` and its
  push; the notice's text and its sending.
- Done when the four versions are tagged and in the catalog with CB-6 read, the five tasks `done`,
  the charters and bug-011 … bug-015 carry their notes, the notice is sent or ruled, and the round's
  rows are Closed or re-triggered as ruled. The plan then goes `active → done`.

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). At wave close: per tech-spec, the errata and
     rulings recorded in the wave, and the element the approver names to fold them back, or the
     ruling that none is needed (dl-020).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
