---
id: task-038-the-base-pack-s-other-workflows-and-its-agents.md-section-decision-log-ingest-retrospective-retrospective-periodic-plan-043
type: task
title: "The base pack's other workflows and its AGENTS.md section: decision-log-ingest, retrospective, retrospective-periodic (plan-043)"
status: draft
pack: "pack-foundation-base"
depends_on: ["task-037-the-base-pack-its-smallest-valid-form-data-templates-roles-directives-and-governance-evolution-plan-043"]
tags: ["packs","base","W8"]
---

## Context

The second of plan-043's three tasks (ruling N, 2026-10-21): the rest of `base`'s workflows and its
AGENTS.md section, from the accepted charter `pack-foundation-base`, on top of task-037's smallest
valid `base` (merged `b6e9755`). It also settles the charter's open point 0.

**Open point 0, read at `wingfoil/wingfoil@v0.3.0`: positive, with a condition.** A phase's
`where` matches a list field by a shared element (`matches`, `src/workflow/deduce.ts`), so
`where: { type: decision-log, status: [in-discussion], tags: [retrospective] }` selects a
decision-log tagged `retrospective`. But the tag is not set by the action alone: a workflow's
actions are free-form strings, and the command WingFoil 0.3.0 offers for `memory.add` reads only
its `type` (`builtinBinding`, `src/workflow/bindings.ts`; `src/core/workflow-next.ts`), so the
facilitator passes `--tags retrospective` to `memory add` by hand; without it the selection matches
nothing and the step reads as complete. The selection is also repository-wide, so a previous
retrospective's decision-log still `in-discussion` would match too. The approver ruled (S,
2026-10-21) to keep the tag selection, with `capture` telling the facilitator to pass the tag, the
charter recording the limit, and a feedback note asking WingFoil to pass an action's arguments to
its command (F-032, owed under plan-043).

**A checkpoint phase and the lint.** The charter's `additional-points` is an approver's checkpoint:
a role and an `approval`, no action and no `produces`; WingFoil 0.3.0 records it as such. The lint
rule `empty-phase` (`src/workflow-rules.ts`) refuses a phase that declares none of `include`,
`actions` and `produces`. The approver ruled (R, 2026-10-21) that a phase with an `approval`
declares a gate, so the rule accepts it, and `pack-authoring`'s sentence says so; a tooling change
under dl-018 R1–R3 inside this pack task.

## Acceptance

1. **`workflows/decision-log-ingest.yaml`**: `name`, `kind: main`, `format: 1`, `version: 1`, a
   description saying it is for decisions that change no governance (dl-022 S4); `capture` (role
   `product-owner`: `memory.add(type: decision-log)`, `memory.submit`, `produces`
   `{ type: decision-log, path: "{{decision_log_path}}" }`) → `approve` (role `approver`:
   `memory.approve`, `approval: { by_role: approver }`, `fallback: { step: capture }`) (dl-015 C3).
2. **`workflows/retrospective.yaml`**: `name`, `kind: sub`, no `element`, `format: 1`,
   `version: 1`, a description; `explore` (role `facilitator`: `agent.execute`, the friction
   inventory, read-only, `produces` `"{{retrospective_path}}"`) → `additional-points` (role
   `approver`: a checkpoint, `approval: { by_role: approver }`, no action) → `capture` (role
   `facilitator`: `'memory.add(type: decision-log, tags: [retrospective])'` in single quotes,
   `memory.submit`, `produces` `{ type: decision-log, path: "{{decision_log_path}}" }`; its
   description tells the facilitator to pass `--tags retrospective`, lists a change of governance
   as a point ruled by `governance-evolution`, one plan per point, and a WingFoil defect as a
   feedback note) → `approve` (role `approver`: `memory.approve` on
   `where: { type: decision-log, status: [in-discussion], tags: [retrospective] }`,
   `approval: { by_role: approver }`, `fallback: { step: capture }`) (dl-015 C4, dl-006 R2 as
   dl-022 amends it).
3. **`workflows/retrospective-periodic.yaml`**: `name`, `kind: main`, `format: 1`, `version: 1`, a
   description; one phase `retrospective`, with a description, that includes `retrospective` by
   name (spec-001 §9: what runs it in a composition without `software`).
4. **`pack.yaml`**: the parameter `retrospective_path` (type `path`, default `docs/retrospectives`;
   its description: the inventory's directory, weak evidence, a project may set a fixed file, only
   `[A-Za-z0-9._/{}-]` and no `{…}` token, no element being in scope); `contents.workflows` in the
   order `decision-log-ingest`, `governance-evolution`, `retrospective`, `retrospective-periodic`;
   `agents_section: true`.
5. **`agents/section.md`**: Markdown, no frontmatter, no marker; opens with `# {{project_name}}`
   (spec-001 §10); says the approver approves and the agent never does and hands the approver the
   exact command; Memory changes only through the WingFoil CLI; which workflow to start for a
   decision (`decision-log-ingest`), a change of governance (`governance-evolution`) and a
   retrospective (`retrospective-periodic`; `retrospective` is a sub and is not started); nothing
   of `software`.
6. **README**: sections 4–6 regenerated by `npm run index`; section 2 names the decision-log and
   retrospective workflows too; section 8 adds that `retrospective` is taken from WingFoil's
   without `collect-feedback` and the `release` element, and `retrospective-periodic` from
   wingfoil-templates' own configuration; section 3 unchanged unless a step names a file this task
   adds; section 7 keeps the exemption line (task-039).
7. **The lint rule** (ruling R): `empty-phase` accepts a phase that declares `approval`; a red case
   in `tests/check-packs.test.ts` first (a phase with only `role` and `approval` passes), its red
   run recorded (dl-018 R1); a phase with none of `include`, `actions`, `produces` and `approval`
   still fails, and the refusal's message and `src/workflow-rules.ts`'s header name the four keys.
   `pack-authoring`'s sentence on phases that declare nothing names the approval checkpoint as
   declaring a gate.
8. **The charter** `pack-foundation-base`: an Execution Note recording ruling S and its date, which
   replaces open point 0's fallback, open point 0's outcome (above, with its condition and limit)
   and `retrospective_path`'s default.
9. **The commands**, after `npm run build`, recorded in the Execution Notes: `npm run lint`,
   `npm run check:packs`, `npm run check:schemas`, `npm run index -- --check` exit 0;
   `npm run validate -- base --param project_name=Sample --param "approver_name=Sample
   Approver" --param approver_email=approver@sample.example --param "agent_name=Sample Agent"`
   exits 0, composed twice byte-identical, the matrix on WingFoil 0.3.0 alone with no warning
   (`diagnostics` empty) and `matrix: self-test, 1 run, 0 failed, tolerance applied: none`; 0.3.0's
   `workflow list` lists `decision-log-ingest`, `governance-evolution` and
   `retrospective-periodic` (`retrospective`, a sub, is not listed without `--all`), recorded by
   hand from its JSON output. The lint count of this repository moves from 16 to 20 files:
   `tests/check-packs.test.ts` and `tests/validate.test.ts` (`lint: checked 16 files`) change
   under dl-018 R1–R3, their red runs recorded.
10. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
    `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
    `npm run index -- --check`, `npm run validate` exit 0; the CI run on the pushed branch
    concludes `success`. Privacy: no local path, no private project's name, no real name, no
    address but `*.example` in the diff.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
- 2026-10-21: independent review of the body: request changes (the checkpoint phase fails the
  lint's `empty-phase`; open point 0's tag is not set by the action alone and the selection is
  repository-wide). The approver ruled R (the lint accepts a phase with `approval`) and S (keep the
  tag selection, `capture` tells the facilitator to pass the tag, F-032). WingFoil's v0.3
  retrospective (`19a66000`) was read first: our notes F-001…F-031 are triaged, and none of F-032's
  topics is covered by an element. Amended, with the counts (16 → 20), "no warning", the path's
  description, README sections 2 and 8, the workflows' keys and the YAML quoting.
