---
id: task-039-the-base-pack-s-exit-criterion-readme-examples-for-every-governed-project-s-parameters-and-the-private-projects-check-plan-043
type: task
title: "The base pack's exit criterion: README examples for every governed project's parameters, and the private projects' check (plan-043)"
status: draft
pack: "pack-foundation-base"
depends_on: ["task-038-the-base-pack-s-other-workflows-and-its-agents.md-section-decision-log-ingest-retrospective-retrospective-periodic-plan-043"]
tags: ["packs","base","W8"]
---

## Context

The last of plan-043's three tasks: `base`'s exit criterion (dl-022 S6, the charter's Acceptance),
through the README's examples (plan-043 ruling 3, P): every governed project's parameters compose
and validate on WingFoil 0.3.0 with no warning, by `npm run validate` and the CI on every push; the
three private, non-software projects are checked outside this repository, their outcome recorded
alone.

**The parameter sets**, read from the public repositories (`wingfoil/wingfoil@19a66000`,
`wingfoil/wingfoil-ui@6a5ad5c`, `wingfoil/wingfoil-benchmark@190847c`, this repository) for the
parameters `base` declares:
- **the defaults** (`docs/memory/decision-log/{id}.md`, `docs/memory/task/{id}.md`,
  `docs/plans/{id}.md`, `plan-{n}-{slug}`, `docs/retrospectives`): WingFoil-Benchmark and this
  repository use them, and so do the three private, non-software projects for these types;
- **release folders** (`docs/04_memory/design/dls/{id}.md`, `docs/04_memory/{release}/{id}.md`,
  `docs/05_plans/{scope}/{id}.md`, `{workflow}-{phase}-plan`, `docs/09_retrospectives`): WingFoil;
- **release folders without a retrospective folder**: WingFoil-UI, as WingFoil's with the default
  `retrospective_path`.

Three examples cover the five software and non-software repositories, one per distinct set; the
Execution Notes record which repository each matches. Every example names a fictional project
(spec-002 §2.4, `pack-authoring`) and fictional approver and agent identities (`*.example`
addresses, which WingFoil 0.3.0 accepts for a member, task-037).

Three examples change what `npm run validate` does on this repository: 3 compositions, 3 matrix
runs instead of 0, and 3 more files for the lint; the tests that assert this repository's counts
move under dl-018 R1–R3.

## Acceptance

1. **Three examples**, each `tests/fixtures/examples/base/<example>/example.yaml` in the preset
   format (spec-001 §15): `format: 1`, `id` equal to its directory, `title`, `description` naming
   a fictional project, `packs: [base@^1]`, `parameters` with `project_name`, `approver_name`,
   `approver_email` (`*.example`), `agent_name`, and the set's path and id values:
   - a fictional non-software project on the defaults (only the four identity parameters set);
   - a fictional software project keeping its records in release folders (WingFoil's set);
   - a fictional software project with release folders and no retrospective folder (UI's set).
2. **README section 7**: the exemption line replaced by one `### <example>` per fixture, each
   followed by `Fixture: tests/fixtures/examples/base/<example>/` and a paragraph: the fictional
   situation, the parameters it sets, what the project gets, how one phase runs (spec-002 §2.4).
   Each example and its README entry land in the same commit (CB-2).
3. **The tests** that assert this repository's validation counts follow, red first (dl-018 R1):
   `tests/validate.test.ts` (compositions 3, matrix `3 runs`, the lint count with the three
   `example.yaml` files) and `tests/check-packs.test.ts` (the lint count); their titles say what
   they count.
4. **`npm run validate`** on this repository, after `npm run build`, exits 0: the three examples
   composed twice byte-identical and run on WingFoil 0.3.0 alone, `matrix: self-test, 3 runs,
   0 failed, tolerance applied: none`; recorded in the Execution Notes. The CI's
   "Validate this repository" step runs the same on every push.
5. **The private projects' check**, run by claude outside this repository: for each of the three
   private, non-software projects, `base` composed with that project's current path and id values
   (read from its own configuration) and fictional identities, validated on WingFoil 0.3.0. The
   Execution Notes record only: the date, `base`'s commit, the WingFoil version, the number of
   projects (3), the command with its values redacted, each exit code and the warning count; no
   name, path or value. A failure goes to the approver (dl-019).
6. **The mapping**: the Execution Notes record which public repository each example's set matches
   (WingFoil, UI, Benchmark, this repository), and that the private projects match the defaults or
   not, without naming them.
7. **The charter** `pack-foundation-base`: an Execution Note recording the exit criterion met, with
   the commit and the CI run.
8. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
   `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
   `npm run index -- --check`, `npm run validate` exit 0; the CI run on the pushed branch concludes
   `success`. Privacy: no local path, no private project's name or value, no real name, no address
   but `*.example` in the diff.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
