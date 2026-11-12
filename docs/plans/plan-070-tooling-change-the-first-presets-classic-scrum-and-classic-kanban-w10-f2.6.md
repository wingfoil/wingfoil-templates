---
id: plan-070-tooling-change-the-first-presets-classic-scrum-and-classic-kanban-w10-f2.6
type: plan
title: "tooling-change: the first presets, Classic Scrum and Classic Kanban (W10, F2.6)"
status: active
workflow: "tooling-change"
phase: "deliver"
tags: ["presets","W10"]
---

## Context

W10's presets (F2.6), the first of W10's remaining features in the order the approver set on
2026-11-12 (option (a): the presets and `governance/wingfoil-dogfood` first, then the pack release
round, then this repository's adoption last). The sequencer's W10 "Ends with" asks for "a first
preset for each methodology". The approver named them on 2026-11-12: Classic Scrum and Classic
Kanban.

**What exists** (`main`): spec-001 §15 (a preset in `presets/<id>.yaml`, format 1, no version,
`packs` in §6.3's entry syntax, `base` omissible, `parameters` generic only, `profile` naming an
adoption profile of `docs/01_vision/04_personas.md` §2); `schema/preset.schema.json`; the lint's
`preset-name`, `preset-cardinality` and `preset-value` rules and the index check of `catalog.yaml`'s
`presets[]` (spec-001 §18); `npm run validate` composing every preset twice (F3.4) and running
`npm run index -- --check`; `publish:pack` counting a preset among a pack's compositions; the
index's `profiles` per pack from the presets that hold it (spec-002). No preset exists:
`presets/` is absent and `catalog.yaml` has `presets: []`. How `init` selects a preset is
WingFoil's (F-030); no `init --preset` exists, so a preset is read by hand or by an agent.

**The gap the review found:** `base` declares four required parameters with no default
(`project_name`, `approver_name`, `approver_email`, `agent_name`, `packs/base/pack.yaml`), a
composition fails without a value (spec-001 §8.1), and a preset may not hold a project value
(§15). So a preset of `software` and a methodology, with `parameters: {}`, fails `npm run
validate`, `validate:publication` and `publish:pack` (`parameter project_name of base is required
and has no value`, exit 1). The approver ruled on 2026-11-12 option (A): stand-in values in the
validation only (point 2), not in the preset.

Hosted by `tooling-change` › `deliver`: no workflow names presets, and a preset is a repository
file the tooling checks, as `catalog.yaml` and `compat.yaml` are; one task, no pack.

**`main`'s CI before this plan** (dl-038 C3): plan-069's close (`4337af3c`, `6d53241f`), pushed
with this plan's body, its run read in the Execution Notes before `submit`.

## Proposed outline (ruled by the approver before `submit`)

1. **Two presets** (no format or schema change):
   - `presets/classic-scrum.yaml`: `format: 1`, `id: classic-scrum`, `title: "Classic Scrum"`,
     `packs: [software@^1, methodology/scrum@^1]` (`base` through their
     `requires`), `parameters: {}`, `profile: "Team developer"`;
   - `presets/classic-kanban.yaml`: `format: 1`, `id: classic-kanban`, `title: "Classic Kanban"`,
     `packs: [software@^1, methodology/kanban@^1]`, `parameters: {}`, `profile: "Solo developer"`;
   - each `description` one sentence naming its packs; the profiles from personas §2, whose table
     gives `methodology` (Kanban) to the solo developer and `methodology` to the team developer.
2. **Stand-in values for a preset's required parameters, in the validation only** (the approver's
   option (A), 2026-11-12). `validate:publication` and `publish:pack` run `runValidate`, so one
   change there covers the three commands. When it composes a preset (`presets/*.yaml` only, not
   an example, an overlay composition or `entries`), each required parameter of the composition
   that has no default, that the preset does not set and that no `--param` gives, gets a fixed
   stand-in value, the same for every preset, never written to the preset or to a pack:
   - **ranked last:** below the preset's values and below `--param`, and never counted as a value
     the preset sets, so `--param` keeps its rule (it may not override a value the preset sets)
     and CI's golden run (`--param project_name=Golden`) still composes;
   - **scope:** a leg derived from a preset inherits the preset's stand-ins for the parameters of
     the packs it holds; plan-066 ruling 4 unchanged, a leg whose added pack has a required
     parameter with no value still skipped; the examples, which set all four values, unaffected;
   - **values:** fictional and generic, valid for the parameter's type (§8.1), modelled on the
     examples' values (an email on the `.example` domain); the matrix's WingFoil releases check
     no member's email format, only an agent's email (none in `base`) and an agent's name (no
     `<`, `>` or line break);
   - **the composer unchanged:** `npm run compose` with no value still fails (§8.1, §17).

   The task's design fixes the values and where they live (one module of `src/`), red tests
   first: a preset with no values composes through `runValidate` in both modes and through one
   `publish:pack` case; the stand-ins appear in the composed `dna.yaml`; a preset's own value
   and a `--param` each win over a stand-in; an example and an overlay composition get none; on a
   fixture preset holding a pack with a conditional part, a `[-pack]` leg composes with the
   stand-ins and a `[+pack]` leg whose added pack has an unset parameter is still skipped;
   `compose` alone still fails.
   - spec-001 amended in place in the task (as task-036, task-059 and task-079 did, the merge OK
     approving the text): §15 gains the rule (a preset needs no value for a required parameter;
     the validation supplies a stand-in, the adopter gives the real value at `init`), §18 names
     the validation that supplies it; its Execution Notes list the change, and W10's close lists
     it per tech-spec (dl-020). No schema changes, so no feedback note (`wingfoil-cli` rule 8).
3. **`catalog.yaml`'s `presets[]`** gains both, `{ id, path }`, sorted by id; no pack's entry
   edited.
4. **The generated files** regenerated by `npm run index` in the same commit (`CATALOG.md`,
   `catalog-index.json`, `llms.txt` and the generated sections of the packs' READMEs): the presets
   listed; `profiles` come from the packs a preset names, so `software` gains both profiles,
   `methodology/scrum` Team developer and `methodology/kanban` Solo developer, `base` none. The
   site (`npm run site`) is built by CI from them.
5. **Checks of the task** (`tooling-delivery` v4), red first (dl-018 R1): the tests pinned to the
   repository's counts updated first and seen failing (`tests/validate-2-run.test.ts`: the
   schemas', the lint's and the compositions' counts, the runs of the overlays and of the
   publication; `tests/catalog.test.ts`'s fixture catalog, equal to `catalog.yaml` with its
   `presets[]`), then the stand-ins' tests of point 2; `npm run validate` composing both presets
   on the oldest and newest compatible release the matrix selects (0.3.0, 0.3.2), exit 0 and no
   warning; the branch CI's job durations recorded (dl-039 R3).
6. **No published pack changes,** so no `pack-release`: a preset has no version (§15) and joins
   the compatibility matrix of the packs it holds from their next release (`pack-compatibility`);
   the next `publish:pack` of each counts it.

Not in this plan: a preset for `team-mode`, `stage`, `phase` or `blueprint` packs (none exists);
`init --preset` (F-030, WingFoil's); `governance/wingfoil-dogfood` and the adoption (later W10
plans); the vision documents (W10's state is updated at W10's close).

## Steps

1. **This plan:** an independent review and a re-review if a fix changes a point (dl-017); the
   outline shown to the approver; the approver's OK; `submit` (`draft → active`).
2. **task-090** (`tooling-delivery` v4, `pack: ""`): its body reviewed, `pending → backlog` by the
   approver, on its branch `task/task-090-presets`; design, build, build review, checks on the
   frozen commit (the branch CI and dl-039's local list on Node 22.21.0), `in-review`, the
   approver's approval and merge OK; merged `--no-ff`, `main`'s CI read.
3. **Close:** `active → done`, the CI of the close's push left to the next plan.

## Handoff

- **The approver:** the OK on the outline (step 1), including the two profiles and point 2's
  stand-ins; task-090's `backlog`, approval and merge OK.
- **Alone:** the task's body, design, build, checks and notes; the reviews by an independent
  reviewer (a subagent with no part in the text). No pull request; files staged by name.
- **Done when:** both presets and their index entries on `main`, the stand-ins in the three
  commands with spec-001 §15 amended, the generated files current, `main`'s CI green.

## Execution Notes

- 2026-11-12: review: approve after amendments, three blocking: `parameters: {}` fails the
  composition (base's four required parameters, §8.1, §15), ruled by the approver as option (A),
  point 2; the tests pinned to the repository's counts as the red step (point 5); the matrix's
  oldest and newest release, not every one. With the nits: `format: 1`, the generated files and
  the profiles per named pack (point 4). Point 2 changes a rule: re-review.
- 2026-11-12: re-review: approve after amendments, one blocking, applied: the stand-ins ranked
  below the preset's values and `--param`, for `presets/*.yaml` only, plan-066 ruling 4's leg
  skip unchanged, each with a red test; with the nits: one code path (`runValidate`), the
  WingFoil releases' real limits on the values, the examples unaffected, the precedent task-036,
  task-059 and task-079, §18 rather than §17, a line rewrapped.
- 2026-11-12: second re-review: approve after amendments, one blocking, applied: a leg of a preset
  inherits its stand-ins for the packs it holds, ruling 4's skip kept for a pack the leg adds,
  with a test each; a clause, no other rule changed.
- 2026-11-12: final check of the leg clause: approve, no finding.
- 2026-11-12: the approver's OK on points 1 … 6 as written.
- 2026-11-12: `main`'s CI before this plan (dl-038 C3), on `0dc03bc2` (plan-069's close and this
  plan's body), run 43245689502, `success`: `validate (22.12.0, 1)` 7 min 56 s, `(22.12.0, 2)` 5 min
  28 s, `(22.21.0, 1)` 9 min 49 s, `(22.21.0, 2)` 8 min 12 s.
- 2026-11-12: task-090's body review found point 5 misreading `tests/catalog.test.ts`: it empties
  `presets` before comparing the fixture catalog with `catalog.yaml`, so it stays unchanged; the
  task records the departure, for the approver at task-090's `backlog`.
- 2026-11-12, close: task-090 approved, merged `--no-ff` at `d9946a9d` on the approver's OK,
  pushed, the branch removed, `approved → done`. `main`'s CI on the merge, run 43311916342,
  `success`: `validate (22.12.0, 1)` 11 min 35 s, `(22.12.0, 2)` 8 min 30 s, `(22.21.0, 1)` 9 min
  3 s, `(22.21.0, 2)` 5 min 47 s, every job under 20 minutes (G12). On `main`: the presets
  `classic-scrum` and `classic-kanban`, `catalog.yaml`'s `presets[]`, the index with the
  profiles, the validation's stand-ins and spec-001 §15 and §18. Departures recorded in task-090's
  notes (the catalog test unchanged, the `publish:pack` case on a `base`-only preset, the
  `check-packs` count found late). For W10's close (dl-020), per tech-spec: spec-001 §15 and §18
  amended in place by task-090. `active → done`; the run of this close's push is left to the next
  plan (dl-038 C3).
