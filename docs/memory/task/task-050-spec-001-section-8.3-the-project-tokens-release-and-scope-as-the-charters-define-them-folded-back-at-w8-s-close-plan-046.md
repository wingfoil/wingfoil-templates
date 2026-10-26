---
id: task-050-spec-001-section-8.3-the-project-tokens-release-and-scope-as-the-charters-define-them-folded-back-at-w8-s-close-plan-046
type: task
title: "spec-001 section 8.3: the project tokens release and scope as the charters define them, folded back at W8's close (plan-046)"
status: in-progress
pack: ""            # tooling task (pack-cycle › author, plan-046, ruling 4)
depends_on: []
tags: ["tooling","spec","W8"]
---

## Context

plan-046's ruling 4 (the approver, 2026-10-24): W8's close folds back spec-001 §8.3's `{release}`
note (dl-020). §8.3 ("WingFoil tokens pass through") names the project tokens `{release}` and
`{scope}` and cites, for them, `docs/notes/base-regeneration-inputs.md` §2, a working note that
plan-022 deleted (`1aa50c3`), as spec-001's Execution Note of 2026-10-10 records: a reader of the
specification finds it only in the history. The meanings are now stated by accepted elements and
by WingFoil:
- `{release}`: a task's `release` field, which a project may use in `base`'s `task_path` (for
  example `docs/04_memory/{release}/{id}.md`); `software`'s charter (Tokens and ids) and dl-015 C10;
- `{scope}`: not a field but, with `{workflow}` and `{phase}`, which §8.3 already lists, a token of
  the workflow's execution context that WingFoil's engine fills, and that is given by hand from the
  CLI (WingFoil's `spec-001-memory-yaml-schema` at `wingfoil/wingfoil@cc31d7a8`, its v0.3.0);
  WingFoil's own `plan` path `docs/05_plans/{scope}/{id}.md` uses it for the release-line and
  release nesting, for example `rl-v1/rel-v0.1` (its `.wingfoil/memory.yaml` and
  `spec-017-workflow-commands-and-state-deduction` §1 at the same commit); a project may use it in
  `base`'s `plan_path` (`base`'s charter, Parameters; dl-015 C10);
- `{release-line}`, `{version}` and `{kind}`, WingFoil's tokens that `software`'s parameter
  defaults and the governed repositories' values use (a release's field `release-line`, an
  element's `version`, WingFoil's release `kind`; `software`'s charter, Tokens and ids). §8.3 does
  not name them today; the task-050 entry of plan-046 names only `{release}` and `{scope}`, so
  naming them rests on this task's merge OK. §8.3's list stays a list of examples.

The amendment is text only: the composer never interprets a single-brace token (§8.3's first
sentence), so no code or test changes. It is approved by this task's merge OK, as task-044's was.

## Acceptance

1. **spec-001 §8.3, amended in place**: the citation of the deleted note is gone; `{release}` is
   named as a project token with its source (`software`'s charter, dl-015 C10); `{scope}` is placed
   with `{workflow}` and `{phase}` as WingFoil's workflow-context tokens, its meaning cited from
   WingFoil's `spec-001-memory-yaml-schema` and its nesting use from WingFoil's own `plan` path
   (`.wingfoil/memory.yaml`, `spec-017-workflow-commands-and-state-deduction` §1), both at
   `wingfoil/wingfoil@cc31d7a8`; `{release-line}`, `{version}` and `{kind}` are
   added to the examples with `software`'s charter as the source of their use; each names the
   parameter that may carry it; the section's rule is unchanged (the composer interprets no
   single-brace token; which tokens WingFoil fills, and from where, is WingFoil's); the section is
   rewrapped to at most 100 columns.
2. **spec-001's Execution Notes**: an entry dated with the merge, saying what §8.3 now states and
   why (W8's fold-back, plan-046 ruling 4, dl-020), approved by the merge OK, naming the deleted
   note as "the working note plan-022 removed" without its path; the 2026-10-10 entry is left as it
   stands.
3. **No other change**: no file under `src/`, `tests/`, `packs/`, `schema/` or `.github/`; no
   other section of spec-001 or spec-002; `grep -n "docs/notes/" docs/memory/tech-spec/spec-001*`
   finds only the 2026-10-10 Execution Note.
4. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`,
   `validate -- --overlay tests/fixtures/software-exit`, the golden fixture's step and
   `workflow list` exit 0 with no warning; the CI run on the pushed branch concludes `success`.
   dl-018 R1 applies to code; no test is written, so R2's after-the-fact tests and their mutation
   check do not arise; the Execution Notes say so. Privacy (plan-041's rule): `git diff main` holds
   no local path (`/home/`), no name of a private project, no real person's name or address, and
   no address but `*.example`.

## Design

Written 2026-10-26, before the change. Branch `task/task-050-spec-section-8-3` from `main`.

- **§8.3, the new text** (its heading and first sentence unchanged):

  > Single-brace tokens belong to WingFoil and to the project, and the composer never interprets
  > any of them. Examples:
  > - WingFoil's element tokens: `{id}`, `{n}`, `{slug}`, `{axis}`, `{name}`, and the element
  >   fields `software`'s parameters use: `{version}` (an element's version), `{release-line}`
  >   (a release's field of that name) and `{kind}` (a release's kind, a field a project adds to
  >   `release`), as `software`'s charter states (Tokens and ids);
  > - WingFoil's workflow-context tokens `{workflow}`, `{phase}` and `{scope}`, which its engine
  >   fills and which are given by hand from the CLI (WingFoil's `spec-001-memory-yaml-schema` at
  >   `wingfoil/wingfoil@cc31d7a8`, its v0.3.0); WingFoil's own `plan` path uses `{scope}` for the
  >   release-line and release nesting, for example `rl-v1/rel-v0.1` (its `.wingfoil/memory.yaml`
  >   and `spec-017-workflow-commands-and-state-deduction` §1, same commit);
  > - the project token `{release}`, a task's `release` field (`software`'s charter, dl-015 C10).
  >
  > A `path` or `pattern` value may contain them, so a project can set, for example,
  > `task_path: "docs/04_memory/{release}/{id}.md"` or `plan_path:
  > "docs/05_plans/{scope}/{id}.md"` (`base`'s parameters). Which tokens WingFoil fills, and from
  > where, is WingFoil's.

- **The Execution Note**, appended to spec-001's: "2026-10-26, **amended in place** (plan-046
  ruling 4, task-050; its merge OK approves the text, as for task-044): W8's fold-back (dl-020):
  §8.3 no longer cites the working note plan-022 removed; it names `{release}` as a task's field,
  `{scope}` with `{workflow}` and `{phase}` as WingFoil's workflow-context tokens, and adds
  `{version}`, `{release-line}` and `{kind}`, each with its source. Nothing else changes."
- **The checks** of criterion 4 from clean clones; `git diff main` touches spec-001 and this task
  only; criterion 3's grep run and recorded.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-26: independent review: request changes, one blocking finding: `{scope}` is not a plan's
  field but WingFoil's workflow-context token (its memory.yaml specification at v0.3.0; WingFoil's
  `plan` has no `scope` field). Applied, with the non-blocking ones: `{scope}` grouped with
  `{workflow}` and `{phase}`; `{release-line}`, `{version}` and `{kind}` as WingFoil's tokens, and
  their naming beyond plan-046's entry stated; "interprets"; dl-018's reason; the Execution Note
  without the deleted path; the privacy rule; the rewrap. Re-review requested.
- 2026-10-26: re-review: approve after amendments, nothing blocking. Applied: `{scope}`'s meaning
  from WingFoil's `spec-001-memory-yaml-schema`, its nesting example from WingFoil's own `plan`
  path and its spec-017 §1, WingFoil's specifications named by their ids. The title, fixed at
  `memory add`, still says "project tokens"; the body states the reading. Submitted for the
  approver's acceptance into the backlog.
