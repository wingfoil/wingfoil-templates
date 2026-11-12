---
id: task-090-the-first-presets-classic-scrum-and-classic-kanban-and-the-validation-s-stand-in-values-for-a-preset-s-required-parameters-plan-070-task-a
type: task
title: "The first presets, Classic Scrum and Classic Kanban, and the validation's stand-in values for a preset's required parameters (plan-070 task A)"
status: draft
pack: ""            # tooling task (tooling-delivery v4), plan-070 task (A)
depends_on: []
tags: ["tooling","presets"]
---

## Context

plan-070's only task (points 1 … 6, the approver's OK of 2026-11-12): W10's first presets (F2.6),
Classic Scrum and Classic Kanban, and the stand-in values that let the validation compose a
preset with no project value (the approver's option (A)).

What exists (`main` at plan-070's `submit`):
- **Presets:** spec-001 §15 and §18, `schema/preset.schema.json`, the lint's `preset-name`,
  `preset-cardinality` and `preset-value` rules and the index check of `catalog.yaml`'s
  `presets[]` (`src/tree-rules.ts`); no `presets/` folder; `catalog.yaml` has `presets: []`.
- **The gap:** `base` declares `project_name`, `approver_name`, `approver_email` and
  `agent_name` with no default (`packs/base/pack.yaml`); a composition fails without a value
  (spec-001 §8.1), and a preset may not set a project value (§15). `presetComposition`
  (`src/validate.ts`) reads only the preset's own `parameters`, so a preset of `software` and a
  methodology fails with `parameter project_name of base is required and has no value`.
- **One code path:** `npm run validate`, `validate:publication` (`src/validate-publication-cli.ts`)
  and `publish:pack` (`src/publish.ts`) all compose through `runValidate`.
- **`--param`:** refused when it names a value the preset sets (`--param <name> overrides the value
  the preset sets`); CI's golden run passes `--param project_name=Golden` to a fixture preset
  that leaves it unset.
- **Legs:** a `[-pack]` or `[+pack]` leg derived from a composition takes the preset's values
  filtered by what the leg declares (plan-039 R5); plan-066 ruling 4 skips a leg when a pack it
  adds has a required parameter with no value.
- **Index:** `npm run index` writes `CATALOG.md`, `catalog-index.json`, `llms.txt` and the
  generated sections of the packs' READMEs; a pack's `profiles` come from the presets that name
  it; `npm run validate` runs `index --check`.
- **Tests pinned to the repository:** `tests/validate-2-run.test.ts` (the schemas', the lint's and
  the compositions' counts, the overlays' and the publication's runs) and `tests/catalog.test.ts`
  (the fixture catalog equal to `catalog.yaml`, `presets[]` kept).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018 R1): the tests of Acceptance 2 … 4 committed before the code and the
   content, so that the build passes and they fail by assertion; the failing run recorded with its
   command and count.
2. **Stand-ins** (plan-070 point 2), in one module of `src/` that `runValidate` uses:
   - a fixed stand-in value for each required parameter with no default that the composition of a
     preset (`presets/*.yaml`) declares, the preset does not set and no `--param` gives;
     fictional, generic, valid for the parameter's type (§8.1), modelled on the examples' values
     (an email on the `.example` domain), the same for every preset; the design lists them;
   - ranked last: a preset's own value and a `--param` each win over a stand-in; a stand-in is
     never counted as a value the preset sets, so the `--param` refusal and CI's golden run behave
     as today;
   - a leg derived from a preset inherits its stand-ins for the parameters of the packs it holds;
     a leg whose added pack has a required parameter with no value is still skipped (plan-066
     ruling 4);
   - an example, an overlay composition and `entries` get none; `npm run compose` with no value
     still fails;
   - tests: a fixture preset with no values composes through `runValidate` in both modes and
     through one `publish:pack` case; the stand-ins appear in the composed `dna.yaml`; a preset's
     value and a `--param` each win; an example and an overlay composition get none; on a fixture
     preset holding a pack with a conditional part, a `[-pack]` leg composes with the stand-ins
     and a `[+pack]` leg whose added pack has an unset parameter is skipped; `compose` alone
     fails.
3. **The presets** (points 1, 3): `presets/classic-scrum.yaml` (`format: 1`, `id: classic-scrum`,
   `title: "Classic Scrum"`, `packs: [software@^1, methodology/scrum@^1]`, `parameters: {}`,
   `profile: "Team developer"`) and `presets/classic-kanban.yaml` (`id: classic-kanban`, `title:
   "Classic Kanban"`, `packs: [software@^1, methodology/kanban@^1]`, `parameters: {}`, `profile:
   "Solo developer"`), each `description` one sentence naming its packs; `catalog.yaml`'s
   `presets[]` with both, `{ id, path }`, sorted by id, no pack's entry edited.
4. **The pinned tests** (point 5): `tests/validate-2-run.test.ts`'s counts and runs raised by the
   two presets' compositions; `tests/catalog.test.ts`'s fixture catalog with the same
   `presets[]`; each new number explained in the notes by the compositions it counts.
5. **The generated files** (point 4): regenerated by `npm run index` in the content's commit;
   `software` lists both profiles, `methodology/scrum` Team developer, `methodology/kanban` Solo
   developer, `base` none; `npm run index -- --check` exit 0.
6. **spec-001 amended in place** (point 2): §15 gains the rule (a preset needs no value for a
   required parameter; the validation supplies a stand-in, the adopter gives the real value at
   `init`) and §18 names the validation that supplies it; an Execution Note lists the change. No
   schema changes, so no feedback note (`wingfoil-cli` rule 8).
7. **Checks on the frozen commit** (dl-039): the branch CI green, every job's duration in the
   notes (dl-039 R3, G12); dl-039's local list on Node 22.21.0 from a clean worktree; `npm run
   validate` composing both presets on 0.3.0 and 0.3.2, exit 0 and no warning, their lines in
   the notes.

## Design

<!-- Filled at the design phase. -->

## Execution Notes

