---
id: pack-governance-wingfoil-dogfood
type: pack
title: "WingFoil dogfood"
status: proposed
axis: "governance"
name: "wingfoil-dogfood"
slot: ""
pack_path: "packs/governance/wingfoil-dogfood"
requires: ["base@^2", "governance/feedback@^1"]
conflicts: []
---

## Purpose

`governance/wingfoil-dogfood` gives a project that uses WingFoil the channel back to WingFoil and
the discipline of running its pinned CLI (F4.2; dl-003 D6, dl-012 D3, dl-051). It is an upstream
pack of `governance/feedback` (spec-003 §5): a feedback item routed to `upstream:wingfoil` becomes
a note in WingFoil's dl-163 format in the project's inbox, which WingFoil reads and answers. It
adds no workflow, no Memory type, no methodology and no stage. Its catalog pack id is
`governance/wingfoil-dogfood`, its directory `packs/governance/wingfoil-dogfood`. It requires
`base@^2` and `governance/feedback@^1`, not `software`: the channel and the CLI rules serve any
WingFoil project. The `governance` axis has cardinality "many": it composes beside any other
governance pack, with no `conflicts`. dl-051 holds the request and its scope, ruled through
`pack-ingest` (plan-082 … plan-084); plan-085 holds the approver's rulings this charter applies.
No run on the engine before acceptance (dl-032 E2): the pack ships no workflow and fills no slot
of a required pack's workflow, `governance/feedback` reading the channel by its tag (spec-003
§5.2).

## Ships

**Directives** (`directives/`), with their binding in `fragments/roles.yaml` (spec-001 §7.4):

| Directive | Binding | What it holds |
|---|---|---|
| `wingfoil-cli` | `global` | running the pinned CLI and keeping the inbox and the known behaviours |
| `wingfoil-channel` | `assignments.facilitator` | the channel serving `upstream:wingfoil` |

- **`wingfoil-cli`** carries rules 1 … 7 of this repository's custom directive (1.6), their
  content unchanged (dl-012 D3), their project-bound values as parameters: the CLI command
  (rule 1), the inbox path, the source key (rule 7). Rules 2 … 5 point at the project's entries
  file (below), not at "an entry below", "the entry" or "this directive's version"; the scope line
  and rule 7 read "the project" for "this repository"; inside the pack,
  rule 5's bump is the entries file's *Checked against*, the directive's version being the pack's
  (dl-051 Q2 (a), dl-012's note of 2026-11-24). Rule 7 applies when a source key is set. Rule 8
  (a `schema/` change produces a note) is this repository's and stays in its custom directive
  (dl-051 Q3 (a)).
- **The known behaviours.** The directive holds the table's form (`#`, Behaviour, How to work
  with it, Note, WingFoil element) and rule 5's re-check at every pin bump; the entries are the
  project's, for its own pin, in the file the parameter names, outside the inbox, which WingFoil
  reads as one file per note.
- **`wingfoil-channel`**, `tags: [feedback-channel]`, its text holding the line ``Serves the
  target `upstream:wingfoil`.`` (spec-003 §5.1, the form its lint reads): a routed item's kind
  mapped onto dl-163's (`defect`, `gap` and `request` one to one, `observation` to `request`,
  dl-012 D3); the note written as `F-<nnn>-<slug>.md` in the inbox with dl-163 R4's six fields,
  `## Observed` and `## Expected`; the feedback id cited in the note's body, the item's
  `resulting` naming the note's path; no `## Replies` section; the note's row added to the
  inbox's ledger.

**Names.** Checked by plan-085 step 1 against WingFoil 0.2.2 … 0.3.2, the catalog's packs and
the fixtures: no clash for `governance/wingfoil-dogfood` and `wingfoil-channel`; `wingfoil-cli` is
kept as an id (plan-085 point 2, dl-051 Q6), held today only by this repository's `custom/`, which
its adoption removes.

**No `agents/section.md`** (spec-001 §10): `wingfoil-cli` is global and the channel is bound to
`facilitator`, so the agents read both through their roles.

**Parameters** (spec-001 §8.1); each description, written by `author`, says what the value is (the
source key's: "empty: no source key"):

| Parameter | Type | Default | Used by |
|---|---|---|---|
| `wingfoil_command` | string | none (required) | `wingfoil-cli` rule 1 |
| `wingfoil_inbox_path` | path | `docs/wingfoil-feedback` | `wingfoil-cli`, `wingfoil-channel` |
| `wingfoil_known_behaviours_path` | path | `docs/wingfoil-known-behaviours.md` | `wingfoil-cli` |
| `wingfoil_source_key` | string | `""` | `wingfoil-cli` rule 7 |

The names are proposed for `author`'s first task. The CLI command has no default: spec-002 §2.3
refuses a code span holding a WingFoil command, and the README's generated Parameters table shows
a default as one; a default `wingfoil` would assume a global install, against rule 1 (plan-085
point 4). No default carries a project value (`svc-018`, this repository's command); a generic
path equal to this repository's is not one.

**README and CHANGELOG** (spec-002 §2). The README's install steps hold, as text and with no
command, the inbox skeleton (Rules, Ledger, Context, the **Source key** and **Last sync** lines,
written at the inbox path the project sets, its Rules naming the pack's `wingfoil-cli`), the empty
entries file, `upstream:wingfoil` added to `feedback_targets`, and the CLI command and, once
WingFoil registers the project, the source key to set: a
pack ships no file outside `.wingfoil/` (spec-001 §6.1, §7.6), so dl-012 D3's "the
`docs/wingfoil-feedback/` README skeleton" is read as this install text.

No workflow, no Memory type, no executable logic.

## Adaptations

Listed in the README's "Sources and adaptations" (spec-002 §2):
- the rules come from this repository's `wingfoil-cli` 1.6, generalised only by their parameters,
  by rules 2 … 5's reference to the entries file and by "the project" for "this repository";
- the known behaviours are the project's, not the pack's: each project pins its own WingFoil
  (dl-051 Q2 (a));
- the inbox skeleton is install text, since a pack ships no file outside `.wingfoil/`.

## Commitments to adopters

As `base`'s and the published packs' (plan-041, R1), binding on every version: the parameters'
defaults are the convention for new projects; existing adopters set their current values and move
no file; ids are immutable; the directive ids are fixed, and a version that renames one ships an
old → new key mapping (WingFoil dl-187) and is a major (`pack-semver`). The pack enters the
official catalog with a maintained line (dl-001 D7), confirmed by the approver at plan-085's
outline (ruling of 2026-11-24).

## Adoption

**Any project.** A project with `base` and `governance/feedback`, with or without `software` and
with any methodology, adds the pack; adds `upstream:wingfoil` to `feedback_targets`; sets the CLI
command and, once WingFoil registers it as a feedback source, the source key; creates the inbox
and the entries file as the README says. A project that keeps a `wingfoil-cli` directive of its
own removes it in the same change (one id per composition). The README gives the procedure (F6.1,
spec-002 §2.3).

**This repository** (W10, its adoption plan; not this charter's): it adopts the pack with `base`,
`software`, `methodology/kanban` and `governance/feedback`, with dl-012 D6's knock-ons, among
them: its custom `wingfoil-cli` removed, rule 8 kept in `custom/` as a directive of another id
(one id per composition, a custom file overriding the pack's), which the adoption plan names; the
lint's and
`tests/wingfoil-feedback.test.ts`'s directive paths; `docs/wingfoil-feedback/README.md`'s Rules
naming the pack's directive; its known behaviours moved to the entries file.

## Out of scope

- Everything of `base` and `governance/feedback`: the feedback element, its triage and its routes.
- Any other upstream's channel: its own pack.
- Executable logic: the pack ships no script; the inbox's sync is a rule, run by hand.
- Rule 8 and anything else that holds only for this repository, the catalog's.
- WingFoil's own side: its reading of the inbox and its answers (WingFoil dl-163).

## Compatibility

- `pack.yaml` format 2 (spec-001 §5, a new pack), no conditional entry, no `tensions`.
- `formats`: `roles: 1`, `directive: 1`. `requires: [base@^2, governance/feedback@^1]`,
  `conflicts: []`, `requires_capabilities: []` (spec-001 §6.2: the pack adds no workflow; the
  engine `governance/feedback` needs is its own requirement).
- The oldest release of its matrix is WingFoil 0.3.0; the range is computed from `compat.yaml`,
  never written here.
- Install mapping: as the catalog's other packs (spec-001 O12, provisional).
- No feedback note to WingFoil for the pack's publication (dl-021 R1).

## Acceptance

dl-051 Q5's evidence and plan-085 point 6, each criterion with its checker: **[V]** the validation
command, the lint or a test under `tests/`; **[A]** the approver. Fixtures under
`tests/fixtures/examples/wingfoil-dogfood/<example>/` (spec-002 §2.4), README examples of
fictional projects only, run in the compatibility matrix on the releases `compat.yaml` lists.
- **WD-1 Installable [V]:** composes with `base` and `governance/feedback` alone, and with
  `software` and a methodology; each composition validates with no warning on every compatible
  release and composes deterministically; `requires` names only `base@^2` and
  `governance/feedback@^1`, `conflicts` is empty.
- **WD-2 Reusable [V]:** no default carries a project value (`svc-018`, this repository's CLI
  command); two fixtures with different parameter sets compose and validate; the F3.5 lint passes.
- **WD-3 The channel [V]:** the lint of spec-003 §11 passes (the "Serves the target" line read,
  one channel per target, the channel from a pack that requires `governance/feedback`).
- **WD-4 The route [V]:** a `check:runs` scenario drives `feedback-ingest` → `feedback-review`
  through `wingfoil-channel` to `closed`, on the oldest and the newest selected release, as
  `tests/fixtures/runs/feedback-upstream.yaml` does with FA-8's fixture (dl-032 E3's `check:runs`
  evidence). The scenario writes the note itself: it shows that the route closes and the
  directives compose, not that an agent follows them.
- **WD-5 The note [V]:** the note's format checked by the dl-163 checks factored into
  `tests/support/inbox.ts` (`assertFields`, `assertSections`), run on the note as FA-8's are in
  `tests/runs.test.ts`.
- **WD-6 The rules [A]:** `wingfoil-cli`'s rules 1 … 7 are this repository's custom 1.6 but for
  their parameters, rules 2 … 5's reference to the entries file and "the project" for "this
  repository" (dl-012 D3), read at the review.
- **WD-7 Presets [V]:** `classic-scrum` and `classic-kanban` unchanged; the pack optional, as
  `governance/feedback` is.
- **Exit criterion** (`pack-cycle` › `author`): WD-1 … WD-7; the README's examples as fixtures,
  one without `software`, one with `software` and a methodology (spec-002 §2.4); CB-1 … CB-3 (the
  README standard, examples as fixtures, install truth) and CB-6 at the first tag, CB-4 and CB-5
  being the catalog index's (spec-002 §6). No run of dl-032 E4 (no `release`, no `delivery`). The
  adoption run of dl-032 E3, once per `init` template, is `first-release`'s; `author` prepares it.
- **Proposed tasks** (`author`, `pack: pack-governance-wingfoil-dogfood`, one `kanban-delivery`
  iteration each): (1) the `wingfoil-cli` directive, its parameters and the known-behaviours form
  (WD-2, WD-6); (2) `wingfoil-channel` and the `roles.yaml` fragment, with the §11 lint's fixtures
  (WD-3); (3) the `check:runs` scenario through the channel (WD-4, WD-5); (4) the README with the
  install steps, the inbox skeleton and the examples as fixtures (WD-1, WD-7). No `design` phase
  (plan-085 point 5).

## Open points

1. **The parameter names** above, proposed; `author`'s first task fixes them against the names in
   use.
2. **Rule 7's text with an empty source key**, which must read well when the value substitutes to
   nothing (plan-085 point 4); and how the generated Parameters table renders the empty default,
   which the README generator prints as a bare pair of backticks.
3. **The CLI command in the README**: the install step describes the value ("the command that runs
   the project's pinned WingFoil CLI") without spelling it out (spec-002 §2.3); every example and
   every `check:runs` composition sets it, and a preset holding the pack would need a stand-in
   (`src/preset-stand-ins.ts`); no preset holds it.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-24: written under plan-085 step 2 from its outline and the approver's rulings.
- 2026-11-24: independent review (dl-017): approve after amendments; no blocker, three should-fix
  (WD-5's citation: the checks live in `tests/support/inbox.ts`; rule 8 kept under another id,
  one id per composition; "this repository" read as "the project" in the scope line and rule 7,
  and rules 2 and 4's references to the entries) and six nits (no `## Replies`; the descriptions
  and the empty default's rendering; the parameters to set named; the names check and the id
  kept; dl-012 D6's knock-ons "among them"; O13 dropped), all applied in the commit that records
  this note. No re-review: the fixes state references and citations, no ruling changes.
