---
id: task-012-lint-rules-over-the-whole-tree-spec-001-18-f3.5
type: task
title: "Lint rules over the whole tree (spec-001 §18, F3.5)"
status: in-progress
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
own documentation and `.wingfoil/` configuration, which are not pack content.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint` (ESLint) and `npm run check:pins` exit 0;
   no dependency is added. `npm test` needs no network.
2. **The command and the report.**
   - `npm run check:packs -- [--tree <dir>]` runs the lint alone: it runs the schema checks
     silently and lints only the files that passed them; a pack whose `pack.yaml` fails its schema
     is skipped as a whole.
   - `npm run validate` and `npm run validate:publication` run the lint as the step after the
     schema checks, in both modes alike. It takes over the `compat.yaml` report of task-011, so a
     problem appears once. Presets still compose after lint problems: each composition keeps its
     own refusal.
   - The report line is `lint: checked <n> files, <m> problems`, where `<n>` counts every regular
     file under `packs/`, `presets/` and `transitions/`, plus `catalog.yaml` and `compat.yaml`.
     One line per problem follows, `<file>[:<line>:<col>]: <rule>: <message>`, sorted; the
     `<rule>` ids are fixed in the Design, so tests match them.
   - Exit codes as `check:schemas`: 1 when a rule fails, 2 on an I/O error, 3 on bad usage.
   - The composer refuses what the lint rejects (§17, §18) through the same functions: the
     per-pack rules of acceptance 4, 9 and 11 apply to every pack it composes. The test helper
     `tests/support/pack-tree.ts` is updated to write conforming packs.
   - The new module and its tests are named `check-packs`; `tests/lint.test.ts` stays ESLint's.
3. **Every YAML file of the tree** (`catalog.yaml`, `compat.yaml`, `packs/**`, `presets/*.yaml`,
   `transitions/*.yaml`): `format` and every integer value (`formats.*`, `compat.yaml` `reads`,
   integer parameter defaults and preset values) are YAML integers, never fractional notation such
   as `1.0`; no YAML float `.nan` or `.inf`.
4. **Each pack under `packs/`,** in the working tree:
   - `version` is `1.0.0` or later (§4);
   - `id` equals the directory path under `packs/`, and `name` equals its last segment (§4, §6.2);
     a `pack.yaml` directly under `packs/` is a layout error, not a pack;
   - pack names are unique across the packs of the tree and across the catalog's `packs` (dl-004
     1(a));
   - `requires` has at most one entry per pack id, and no pack requires or conflicts with itself
     (§6.3), each with its own message;
   - `requires_capabilities` is sorted;
   - `contents.fragments` is in the order `dna`, `roles`, `memory`; `contents` matches the files
     present, both ways (§6.4);
   - `formats` lists exactly the kinds of the files shipped, an extra kind included, with the
     value each file declares (§5);
   - the layout and path segments of §6.1 (`packs/<axis>/[<slot>/]<name>/`, with `README.md` and
     `CHANGELOG.md`); every file under `packs/` belongs to a pack directory; no symbolic link
     anywhere in a pack; no submodule, detected as a `.git` entry inside a pack;
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
7. **Presets:** the file is named `<id>.yaml`; the packs satisfy the cardinalities of §3; every
   parameter value passes the type of the parameter it sets (§8.1), read from its YAML type, not
   from its text, and `validate` passes preset values to the composer with their YAML type; a
   directory named `presets/<x>.yaml` is reported, not skipped.
8. **Transitions:** the file is named `<id>.yaml` (§14); `id` is `<from name>-to-<to name>`; `from`
   differs from `to`, and both are stage packs of the catalog.
9. **F3.5, the workflows and fragments of every pack.** "Required" means a direct `requires` entry,
   as §6.3 states it for what a pack references:
   - **no empty phase:** a phase that declares none of `include`, `actions` and `produces` fails
     (`pack-authoring`, benchmark note N1);
   - **includes by name:** every `include` is a bare workflow name, never a path or a file name,
     and names a workflow shipped by the pack or by a pack it requires, or a slot of §9; `base`'s
     `sw-life-cycle` includes `inception`, `specification`, `delivery` and `end-of-life`, and a
     methodology's `delivery` includes `release` and `retrospective` (§9);
   - every phase `role` and every `approval.by_role` is declared in `team.roles` of a dna fragment
     of the pack or of a pack it requires;
   - every workflow `element` and `iterate_over` names a Memory type declared by a memory fragment
     of the pack or of a pack it requires;
   - every directive id in a roles fragment is shipped by the pack, by a pack it requires, or is a
     WingFoil built-in (`src/wingfoil-builtins.ts`).
10. **F3.5, no contradictions between overlays.** For every methodology M of the tree, every
    team-mode T or none, and every stage S or none, except none and none, `base` + M + T + S is
    composed with their `requires`:
    - no phase, blueprint or governance pack is added, so `base`'s slot defaults are used;
    - each required parameter without a default gets the placeholder `x` for `string`, `path` and
      `pattern`, `0` for `integer` and `false` for `boolean`;
    - the composition runs the merge (§7.2–§7.5) and the output plan (§7.6, §7.7), with no file
      written, no determinism check and no matrix; a refusal fails, naming the combination;
    - the combinations run whether or not presets exist; a methodology, team-mode or stage pack is
      one whose `pack.yaml` passed its schema; with no overlay pack in the tree, none runs.
    Every other pack that no combination reaches (phase, blueprint, governance) is composed once
    the same way, as `base` + the first methodology in id order + the pack, with their `requires`,
    so its fragments get the composer's checks too.
11. **F3.5, no secrets,** in every file under `packs/`, `presets/` and `transitions/`:
    - a PEM private key block (`-----BEGIN … PRIVATE KEY-----`);
    - a token with a known prefix, after a word boundary and with its full body:
      `gh[pousr]_[A-Za-z0-9]{36}`, `github_pat_[A-Za-z0-9_]{22,}`, `glpat-[A-Za-z0-9_-]{20,}`,
      `xox[abpr]-[A-Za-z0-9-]{10,}`, `npm_[A-Za-z0-9]{36}`, `AKIA[0-9A-Z]{16}`,
      `sk-[A-Za-z0-9]{20,}`;
    - a YAML scalar of 32 or more characters with no `/`, `.` or `-` that is base64 with a Shannon
      entropy of at least 4.5 bits per character and contains a digit and both cases, or that is
      hex with an entropy of at least 3.0, except a `sha256:` digest; in Markdown files the same
      test applies to each whitespace-separated token.

    Each finding names the file and line, never the value.
12. **Fixtures:** every rule has a passing and a failing test on a synthesized tree. The golden
    tree (`tests/fixtures/compose/tree`) passes the lint: every phase declares something, and its
    `sw-life-cycle` includes the four slots; its expected output
    (`tests/fixtures/compose/expected`) is regenerated, and the real run of task-011 acceptance 9
    still passes on `wingfoil@0.2.2`.
13. **On this repository,** `npm run check:packs` exits 0 and reports `lint: checked 2 files,
    0 problems` (`catalog.yaml`, `compat.yaml`); `npm run validate` reports the same line.
14. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-012-check-packs`, run through `tooling-delivery` as `developer`
(`code-quality`, `testing`, `determinism`), under `npm run lint`. Built in five commits, one per
group of rules, each green on its own.

- **`src/problems.ts`:** `Problem` (`file`, optional `line` and `column`, `rule`, `message`), the
  byte-order sort and the report line of acceptance 2. A check returns every problem it finds;
  only the composer turns the first into its error.
- **`src/pack-rules.ts`,** the per-pack rules, moved out of `resolve.ts` and `output.ts` and
  completed: manifest (`pack-version`, `pack-id`, `pack-name`, `requires-twice`, `requires-self`,
  `conflicts-self`, `capabilities-sorted`), inventory (`fragment-order`, `contents`), `formats`,
  layout (`layout`, `symlink`, `submodule`), `asset-id`, parameters (`parameter-scope`,
  `parameter-default`), slots (`slot`, `base-only`). `resolve` and `planOutput` call them on the
  packs they compose and throw the first problem as `ResolveError` or `OutputError`, with the
  messages they give today, so their tests keep passing. The layout walk uses `lstat`, never
  follows a link, and reports a `.git` entry as a submodule.
- **`src/yaml-rules.ts`:** `integer` and `nan`, over every scalar node of a loaded YAML file, read
  from its source range: a numeric value whose source is not a base-10 integer where an integer
  is expected, and any `.nan` or `.inf`.
- **`src/tree-rules.ts`:** `catalog.yaml` (`catalog-path`, `catalog-id`, `catalog-versions`,
  `catalog-transitions`, `catalog-index`), `compat` (the two checks of `src/compat.ts`, now
  returning problems), presets (`preset-name`, `preset-cardinality` through `resolve`'s axis
  check, `preset-value` with `checkValue` on the YAML value, `preset-directory`), transitions
  (`transition-name`, `transition-id`, `transition-stages`), and `pack-name-unique` across the
  tree and the catalog.
- **`src/workflow-rules.ts`,** F3.5 on each pack's workflows and fragments: `empty-phase`,
  `include` (bare name; shipped by the pack or a direct `requires`, or a §9 slot),
  `life-cycle-includes` (§9), `role` (phase `role`, `approval.by_role`, against dna `team.roles`),
  `memory-type` (`element`, `iterate_over`), `directive` (roles fragments, with
  `BUILTIN_DIRECTIVE_IDS`).
- **`src/overlay-rules.ts`:** `overlay`, the combinations of acceptance 10 through
  `composeDocuments` (typed placeholders) and `planOutput`, in memory; a refusal becomes one
  problem naming the combination, attached to the overlay packs' `pack.yaml`.
- **`src/secret-rules.ts`:** `secret`, the scan of acceptance 11; the entropy is computed over
  the characters of the scalar or token; the message gives the kind of finding, never the value.
- **`src/check-packs.ts`:** `runCheckPacks(tree)`: the schema check run silently, then every rule
  over the files that passed it; returns `{ code, checked, problems }`. `src/check-packs-cli.ts`
  is `npm run check:packs`.
- **`src/validate.ts`:** the lint replaces the `compat.yaml` step as the step after the schema
  checks, and keeps the loaded compat for the matrix. Preset values are checked on their YAML
  type (acceptance 7) before a preset is composed; the text then given to the compose command is
  that value's own text, so the type cannot change on the way.
- **Fixtures:** `tests/support/pack-tree.ts` writes `README.md`, `CHANGELOG.md` and workflows
  whose phases declare `actions` and `produces`. The golden tree's workflows gain `actions` and
  `produces`, its `sw-life-cycle` includes the four slots, and `tests/fixtures/compose/expected` is
  regenerated with `npm run compose`.
- **Tests,** red first: `tests/check-packs.test.ts` (the command, the report, exit codes, this
  repository), one test file per rule module with a passing and a failing case per rule id, and
  the existing resolve, output, compose and validate tests kept green.

Commits: (1) problems and pack rules, shared with the composer; (2) YAML and tree rules; (3)
workflow and overlay rules; (4) secret rules; (5) `check:packs`, the validate step, the fixtures.

## Execution Notes

- 2026-10-09: amended while `pending`, before the approver's review, after an independent review
  (a subagent with its own context): "no empty phase" reduced to what `pack-authoring` states (a
  phase that declares none of `include`, `actions`, `produces`), since the stricter reading failed
  34 of the 51 phases of this repository's own workflows; the secret scan's patterns and entropy
  thresholds made precise after measuring false positives on paths and identifiers; roles from
  dna `team.roles` and `approval.by_role`, Memory types from `element` and `iterate_over`, direct
  `requires` as §6.3 states; which rules the composer shares; the step order inside `validate`;
  preset values with their YAML type; the overlay compositions' packs, placeholders and output
  plan, and a composition for every pack no combination reaches; the counted files and fixed rule
  ids; names unique in the tree and the catalog; transitions named `<id>.yaml`; submodules and
  stray files; the module named `check-packs`.
