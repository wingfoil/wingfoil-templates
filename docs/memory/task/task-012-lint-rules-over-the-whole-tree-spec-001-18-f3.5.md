---
id: task-012-lint-rules-over-the-whole-tree-spec-001-18-f3.5
type: task
title: "Lint rules over the whole tree (spec-001 §18, F3.5)"
status: draft
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-011-compatibility-matrix-and-the-real-compat.yaml"]
tags: ["tooling","W6","F3.5"]
---

## Context

Task 9 of plan-015 (`sw-life-cycle` › `tooling`, wave W6, F3.5). Tooling task, no pack. Below,
"plan-015 task N" names a step of that plan, not a Memory element.

It comes from:
- **spec-001 §18** ("Checks beyond the schemas"): the lint rules of the validation command check
  what the schemas cannot, and the composer refuses what they reject;
- **F3.5:** no empty phases (actions and produces declared), includes by name, no contradictions
  between overlays, no project values, no secrets. Their definitions are in the `pack-authoring`
  directive (empty phases, WingFoil benchmark note N1; includes by name, WingFoil bug-144;
  overlays only add or tighten), in spec-001 §7.2–§7.5 and §9, and in `security-secrets`;
- **F3.1:** the lint is a step of `npm run validate`, the one validation command;
- **checks deferred to this task:** task-002 (a directory named `presets/<x>.yaml` is skipped, a
  top-level `packs/pack.yaml` is read as a pack), task-004 (symbolic links and the rest of the §6.1
  layout; reuse of the resolver's checks), task-006 and task-007 (reuse of the fragment and asset
  `formats` checks and of identifier equals file stem; a `NaN` in a set), task-008 (a preset's `id`
  equals its file name), task-011 (reuse of the two `compat.yaml` checks of `src/compat.ts`).

Today almost every §18 rule that has code runs only inside a composition (`resolve`,
`composeDocuments`, `planOutput`), so it reaches only the packs a preset or the given entries pull
in. This task runs them over every file of the tree, reusing that code, and adds the rules that
have none.

Scope, as the approver ruled on 2026-10-09:
- **in:** the §18 rules that need no git tag, over the whole tree; the F3.5 rules below;
- **moved to plan-015 task 11** (release evidence, W7): the `catalog.yaml` rules that need a tag
  (a version entry matches the tagged `pack.yaml` and its digest recomputes, §13; transition
  digests recompute at the tag, §14; every `wingfoil` range recomputes from `compat.yaml`, §12).
  They have nothing to check until a first release, which that task's dry run produces;
- **overlays:** checked by composing every combination of overlays with every methodology;
- **no secrets:** a mechanical scan defined below; **no project values** stays a review rule of
  `pack-authoring`: no mechanical rule tells a project value from a pack's own text.

Not in scope: CI (plan-015 task 10); ESLint, which keeps the name `npm run lint`; the repository's
own documentation, which is not pack content.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no dependency is added. `npm test` needs no network.
2. **`npm run check:packs -- [--tree <dir>]`** runs the lint alone, and `npm run validate` and
   `npm run validate:publication` run it as a step after the schema checks, in both modes alike.
   The report line is `lint: checked <n> files, <m> problems`, followed by one line per problem,
   `<file>[:<line>:<col>]: <rule>: <message>`, sorted. Exit codes as `check:schemas`: 1 when a rule
   fails, 2 on an I/O error, 3 on bad usage. A file that failed its schema is not linted again.
   The composer still refuses what the lint rejects (§17, §18): the checks are shared, not copied.
3. **Every file of the tree** (`catalog.yaml`, `compat.yaml`, `packs/**`, `presets/*.yaml`,
   `transitions/*.yaml`): `format` and every integer value (`formats.*`, `compat.yaml` `reads`,
   integer parameter defaults and preset values) are YAML integers, never fractional notation such
   as `1.0`; no `NaN` or infinity anywhere.
4. **Each pack under `packs/`,** in the working tree:
   - `version` is `1.0.0` or later (§4);
   - `id` equals the directory path under `packs/`, and `name` equals its last segment (§4, §6.2);
     a `pack.yaml` directly under `packs/` is a layout error, not a pack;
   - pack names are unique across the tree (dl-004 1(a));
   - `requires` has at most one entry per pack id, and no pack requires or conflicts with itself
     (§6.3), each with its own message;
   - `requires_capabilities` is sorted;
   - `contents.fragments` is in the order `dna`, `roles`, `memory`; `contents` matches the files
     present, both ways (§6.4);
   - `formats` lists exactly the kinds of the files shipped, an extra kind included, with the
     value each file declares (§5);
   - the layout and path segments of §6.1 (`packs/<axis>/[<slot>/]<name>/`, `README.md` and
     `CHANGELOG.md` present), no symbolic link anywhere in the pack, no submodule;
   - asset identifiers equal their file stems (§6.1);
   - every `{{name}}` is in the pack's parameter scope, its own and its transitive `requires`'
     (§8.1), and every default passes its type (§8);
   - a phase pack ships its slot workflow (`name: <slot>`, `kind: sub`), a methodology ships
     `delivery`, no other pack ships a slot name, and no pack other than `base` ships
     `sw-life-cycle` or `retrospective` (§9).
5. **`catalog.yaml`,** the rules that need no tag: `path` equals `packs/<id>` and pack ids are
   unique; `versions` are in ascending semver order with unique versions; `transitions` appears
   only on versions of `stage` packs; every `transitions[]` and `presets[]` index entry matches its
   file (id and path; for transitions also `from`, `to`, `formats`, `requires_capabilities`).
6. **`compat.yaml`:** the two rules of `src/compat.ts` (task-011), reported as lint problems.
7. **Presets:** `id` equals the file name; the packs satisfy the cardinalities of §3; every
   parameter value passes the type of the parameter it sets (§8.1), read from its YAML type, not
   from its text; a directory named `presets/<x>.yaml` is reported, not skipped.
8. **Transitions:** `id` is `<from name>-to-<to name>`; `from` differs from `to`, and both are
   stage packs of the catalog.
9. **F3.5, workflows of every pack:**
   - **no empty phase:** every phase declares `include`, or `actions` and `produces`; a phase that
     declares none of them fails (`pack-authoring`, benchmark note N1);
   - **includes by name:** every `include` is a bare workflow name, never a path or a file name,
     and names a workflow shipped by the pack or by a pack it requires transitively, or a slot of
     §9; `base`'s `sw-life-cycle` includes `inception`, `specification`, `delivery` and
     `end-of-life`, and a methodology's `delivery` includes `release` and `retrospective` (§9);
   - every phase `role` is declared by a roles fragment of the pack or of a pack it requires,
     every workflow `element` is a Memory type declared by a memory fragment of the pack or of a
     pack it requires, and every directive id in a roles fragment is shipped by the pack, by a pack
     it requires, or is a WingFoil built-in (`src/wingfoil-builtins.ts`).
10. **F3.5, no contradictions between overlays:** for every methodology M of the tree, every
    team-mode T or none, and every stage S or none, except none and none, `base` + M + T + S (with
    their `requires`) is merged as the composer merges it (§7.2–§7.5); a refusal fails, naming the
    combination. Required parameters without a default get a placeholder, since only the merge is
    judged. With no overlay pack in the tree, nothing is composed.
11. **F3.5, no secrets,** in every file under `packs/`, `presets/` and `transitions/`: a PEM private
    key block (`-----BEGIN … PRIVATE KEY-----`); a token with a known prefix (`ghp_`, `gho_`,
    `ghs_`, `ghu_`, `github_pat_`, `glpat-`, `xox[abpr]-`, `npm_`, `AKIA` followed by 16 upper-case
    letters or digits, `sk-` followed by 20 or more letters or digits); a YAML scalar of 32 or more
    characters from the base64 or hex alphabet with a Shannon entropy of at least 4 bits per
    character, except a `sha256:` digest. Each finding names the file and line, never the value.
12. **Fixtures:** every rule has a passing and a failing test on a synthesized tree. The golden
    tree (`tests/fixtures/compose/tree`) passes the lint: its workflows gain `actions` and
    `produces`, and its `sw-life-cycle` includes the four slots; its expected output
    (`tests/fixtures/compose/expected`) is regenerated, and the real run of task-011 acceptance 9
    still passes on `wingfoil@0.2.2`.
13. **On this repository,** `npm run check:packs` exits 0 and reports two files checked
    (`catalog.yaml`, `compat.yaml`), 0 problems; `npm run validate` reports the same lint line.
14. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
