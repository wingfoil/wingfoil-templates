---
id: task-055-the-methodology-scrum-pack-and-the-readme-examples-now-due-for-software-and-scrum-plan-050
type: task
title: "The methodology/scrum pack and the README examples now due for software and scrum (plan-050)"
status: in-progress
pack: "pack-methodology-scrum"
depends_on: []
tags: ["packs","scrum"]
---

## Context

plan-050 (`pack-cycle › author` of `pack-methodology-scrum`, accepted under plan-047). This task
writes `packs/methodology/scrum` as the charter fixes it (Ships, Adaptations, the AGENTS.md
section) on the shape plan-047's runs proved on WingFoil 0.3.0 and dl-026 and dl-027 allow, and
which the lint and the composer accept since task-051. Once `packs/` holds a methodology, CB-2's
exemption line is refused (`src/example-rules.ts`), so the README examples of `software` and of
`scrum` come in the same change (plan-050's task-055 paragraph). `base` stays on `base@^1` unless
plan-049's `prepare` reaches `main` first (plan-050 ruling 1).

## Acceptance

1. **`packs/methodology/scrum/pack.yaml`**: `format: 1`, `id: methodology/scrum`,
   `axis: methodology`, `name: scrum`, `title: "Scrum"`, a `description` of what the pack holds,
   `version: 1.0.0`, `formats` exactly for the kinds shipped (`roles`, `memory`, `workflow`,
   `directive`, `memory-template`, all 1), `requires: [base@^1, software@^1]` (or `base@^2`,
   plan-050 ruling 1), `requires_capabilities: [workflow-engine]`, no `conflicts`, no
   `conditional`; the parameters `sprint_length` (string, default `"2 weeks"`), `sprint_path`
   (path, `docs/memory/sprint/{id}.md`), `sprint_id` (pattern, `sprint-{n}`), each with a
   description (a path parameter's says it takes only `[A-Za-z0-9._/{}-]`); `contents` lists every
   file below and nothing else.
2. **`fragments/memory.yaml`** (`format: 1`):
   - `sprint` defined: `path: "{{sprint_path}}"`, `id_pattern: "{{sprint_id}}"`,
     `amendable: true`, `template.file: memory/templates/built-in/sprint.md`,
     `template.frontmatter.required: [title, goal]`, `states: { sequence: [draft, planned, active,
     done], limits: { active: 1 } }`, no gate, no `waiting`;
   - `task` tightened: `template.frontmatter.required: [sprint]`,
     `template.frontmatter.not_applicable_allowed: [sprint]`;
   - `release` tightened: `template.frontmatter.required: [sprint]` (the path task-051's rule
     reads for the `where` key `sprint`);
   - nothing else (spec-001 §7.5).
3. **`memory-templates/sprint.md`**: `type: sprint`, `format: 1`, and the fields `id`, `title`,
   `goal` (WingFoil 0.3.0 warns on a `{sprint.id}` token unless the template declares `id`); body
   sections for the Sprint Goal and the Sprint Review.
4. **`fragments/roles.yaml`** (`format: 1`): `assignments`: `product-owner: [scrum]`,
   `facilitator: [scrum]`, `developer: [scrum, definition-of-done]`,
   `reviewer: [definition-of-done]`, `qa: [definition-of-done]`. No `dna.yaml` fragment.
5. **The directives** `directives/scrum.md` and `directives/definition-of-done.md`, with WingFoil
   0.3.0's directive frontmatter (`id`, `name`, `type: directive`, `kind: built-in`, `title`,
   `format: 1`), written as real rules from the charter: `scrum` (empiricism and values; the three
   accountabilities as `base`'s and `software`'s roles; the events and timeboxes, the Sprint lasting
   `{{sprint_length}}` and at most one month; the artefacts and their commitments; the Daily Scrum;
   refinement; one Sprint at a time; releases decided by the Product Owner, never gated by the
   review, none approved or published before the Sprint Backlog is done or moved, plan-047 ruling
   16; unfinished items at `close`); `definition-of-done` (generic, overridden by a project in
   `custom/`). No story points, user stories or burn-downs. Neither id equals a WingFoil 0.3.0
   built-in directive id, checked by `directives list` with no warning (`pack-compatibility`).
6. **The workflows**, as the charter's table states them, each `format: 1`, no key newer than
   WingFoil 0.3.0, every phase with its role or an include:
   - `delivery` (`kind: sub`, no `element`): `plan-sprint` (product-owner;
     `memory.add(type: sprint)`, `memory.submit`; produces
     `{ type: sprint, path: "{{sprint_path}}" }`) → `sprints` (`iterate_over: sprint`,
     `where: { status: [planned, active, done] }`, `include: sprint`);
   - `sprint` (`kind: sub`, `element: sprint`): `sprint-planning` (product-owner; `memory.submit`)
     → `development` (`iterate_over: task`, `where: { status: [backlog, in-progress, in-review,
     approved], sprint: "{sprint.id}" }`, `include: backlog-item`; not optional) → `plan-release`
     (product-owner, `optional: true`; `memory.add(type: release)`, `memory.submit`,
     `memory.submit`; produces `{ type: release, path: "{{release_path}}" }`) → `release`
     (`optional: true`, `iterate_over: release`, `where: { status: [in-development, releasing],
     sprint: "{sprint.id}" }`, `include: release`) → `sprint-review` (product-owner;
     `agent.execute`) → `retrospective` (`include: retrospective`) → `close` (facilitator;
     `memory.submit`);
   - `backlog-item` (`kind: sub`, `element: task`): `start` (developer;
     `element.set_state(in-progress)`) → `build` (developer; `agent.execute`) → `review`
     (reviewer; `memory.submit`) → `approve` (approver; `memory.approve`, approval by the approver,
     `fallback: { step: build }`) → `done` (developer; `memory.submit`).

   Each phase's `description` says what the role does (the charter's wording), including what a
   step cannot bind (`goal`, a task's or a release's `sprint`, a release's `version` and
   `release-line` are written by editing the draft or with `--set`, F-034); `close`'s says that an
   unfinished item has its `sprint` rewritten (to the next Sprint, or `n/a — <reason>` back to the
   Product Backlog) with `memory park` where it was started, and an open release its `sprint` to
   the next Sprint.
7. **`agents/section.md`**: a level-2 section `## Scrum`, no level-1 heading, no markers, as the
   charter's paragraph states it; it names `delivery`.
8. **`CHANGELOG.md`** with `- 1.0.0: …`, and **`README.md`** per spec-002 §2: generated sections
   by `npm run index`; section 3 opening with §2.3's temporary mark, linking
   `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`, with the
   charter's Adoption ("Any project"; existing tasks and releases) and no WingFoil CLI command in
   code (CB-3); "Sources and adaptations" citing the Scrum Guide, November 2020 edition, and the
   charter's five adaptations; section 7 linking its examples.
9. **The examples** (spec-002 §2.4, fictional projects only, `.example` addresses):
   `tests/fixtures/examples/scrum/<example>/example.yaml` and
   `tests/fixtures/examples/software/<example>/example.yaml`, each pack with one example on its
   parameters' defaults and one carrying values like UI's (task-049's UI set, its names
   fictional); `packs/software/README.md`'s section 7 rewritten from the exemption line to its
   examples; `base`'s README and examples unchanged. Each README example gives its `Fixture:` line,
   a fictional situation, its packs and parameters, what the project gets, and how one phase runs
   (spec-002 §2.4); no README or `example.yaml` names a real adopter ("like UI's" is this task's
   wording only). Each example composes and validates.
10. **Validation**, in a clean clone (the untracked draft of plan-047 removed from the worktree
    before the checks): `npm run check:packs`, `npm run index -- --check` and `npm run validate`
    pass; every new composition passes WingFoil 0.3.0's matrix with no warning (`tolerance
    applied: none`); `npm run validate -- --overlay tests/fixtures/software-exit` passes with 0
    failed, its count moving from 7 to 11 runs (the four new tree examples are composed by every
    run); the golden tree's `validate` passes. `catalog.yaml`, `CATALOG.md`, `catalog-index.json`
    and `llms.txt` are unchanged (an unpublished pack, spec-002 §3.1); `index --check` covers the
    READMEs' generated sections.
11. **Tests:** the counts the tooling tests take on this repository move, each stated in the
    Execution Notes with the test it changes: `tests/validate.test.ts` (plain `validate` from 3 to 7
    runs, the overlay's from 7 to 11, the publication run, `lint: checked 45 files`),
    `tests/check-packs.test.ts` (this repository's file count) and the index tests; `npm test`
    passes on Node.js 22.21 and on the floor 22.12.0 in clean clones; the CI run on the branch is
    `success` and recorded. No file under `src/` or `.wingfoil/` changes.

## Design

**The pack** (`packs/methodology/scrum/`), from the charter and plan-047's runs (the draft, kept
out of the repository, is only a reference): `pack.yaml`, `fragments/roles.yaml`,
`fragments/memory.yaml`, `memory-templates/sprint.md`,
`workflows/{delivery,sprint,backlog-item}.yaml`,
`directives/{scrum,definition-of-done}.md`, `agents/section.md`, `CHANGELOG.md`, `README.md`
(hand-written sections; the generated ones by `npm run index`).

**The examples**, fictional, `.example` addresses, `packs` naming `software@^1` and
`methodology/scrum@^1`:
- `tests/fixtures/examples/software/defaults/` (every parameter on its default) and
  `tests/fixtures/examples/software/release-folders-lean/` (task-049's UI-like values, renamed);
- `tests/fixtures/examples/scrum/defaults/` (`sprint_length` and the rest on their defaults) and
  `tests/fixtures/examples/scrum/release-folders-lean/` (the same UI-like values, with
  `sprint_length: "1 week"` and `sprint_path` under `docs/04_memory/sprints/`);
- `packs/software/README.md` section 7 and `packs/methodology/scrum/README.md` section 7 describing
  them as spec-002 §2.4 asks.

**Checks**, in order: `npm run index` then `npm run index -- --check`; `npm run check:packs`;
`npm run validate`; the overlay `software-exit` and the golden tree's `validate`; then the tests
that take the counts, run first to see which move (`node --test` on `validate`, `check-packs`,
`index`, `example-rules`), each moved count stated; the full `npm test` in clean clones on both
Node.js versions.

**Commits** on `task/task-055-scrum-pack`: the pack; the examples and `software`'s section 7; the
generated sections; the moved counts; the notes. The untracked draft of plan-047 was moved out of
the worktree before the branch (`tests/fixtures/scrum-draft/`), so no check sees it.

## Execution Notes

- 2026-10-27: written under plan-050 (step 4).
- 2026-10-27: independent review (approve after amendments), amended, re-reviewed (approve);
  submitted.
- 2026-10-27: accepted into the backlog; Design written; `backlog → in-progress`.
- 2026-10-27: the pack (`dee5b02`) and the examples with `software`'s section 7 (`bcd6c09`); the
  README's generated sections written by `npm run index` within those commits, not apart as the
  Design listed. Checks: `npm run index -- --check` (6 files), `npm run check:packs` (61 files,
  0 problems), `npm run validate` (7 runs, 0 failed, tolerance none), the overlay `software-exit`
  (11 runs, 0 failed, tolerance none), the golden tree (26 runs, 0 failed);
  `node dist/src/validate-publication-cli.js --tree .` (7 runs, 0 failed). `CATALOG.md`,
  `catalog-index.json`, `llms.txt` and `catalog.yaml` unchanged.
- 2026-10-27, the counts moved (one commit): `tests/check-packs.test.ts` this repository's lint
  45 → 61 files; `tests/index.test.ts` 5 → 6 files; `tests/validate.test.ts` schemas 4 → 5, lint
  45 → 61, compositions and runs 3 → 7, the `software-exit` overlay 7 → 11, the publication run
  3 → 7; the three titles say so.
- 2026-10-27: independent review: approve after amendments, nothing blocking. Applied: the events'
  timeboxes and the Retrospective's purpose in `scrum`; the two examples naming their composition
  and parameters; Marten Boards' description; the agent "works for the Developers, as their tool";
  the defaults example's roles; a test title.
- 2026-10-27: the full suite in clean clones at `9847e02`: 977 of 977 on Node.js 22.21.0 and on
  the floor 22.12.0; branch CI run 40486043059 on `9847e02`, conclusion `success`. Waiting for
  plan-049's `prepare` (`base` 2.0.0) on `main`: then `main` merged into the branch and `scrum`
  moved to `base@^2` (plan-050 ruling 1), the suite and the CI rerun, before `in-review`.
