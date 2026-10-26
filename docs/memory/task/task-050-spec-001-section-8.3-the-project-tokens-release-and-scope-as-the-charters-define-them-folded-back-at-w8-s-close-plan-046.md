---
id: task-050-spec-001-section-8.3-the-project-tokens-release-and-scope-as-the-charters-define-them-folded-back-at-w8-s-close-plan-046
type: task
title: "spec-001 section 8.3: the project tokens release and scope as the charters define them, folded back at W8's close (plan-046)"
status: draft
pack: ""            # tooling task (pack-cycle › author, plan-046, ruling 4)
depends_on: []
tags: ["tooling","spec","W8"]
---

## Context

plan-046's ruling 4 (the approver, 2026-10-24): W8's close folds back spec-001 §8.3's `{release}`
note (dl-020). §8.3 ("WingFoil tokens pass through") names the project tokens `{release}` and
`{scope}` and cites, for them, `docs/notes/base-regeneration-inputs.md` §2, a working note that
plan-022 deleted (`1aa50c3`), as spec-001's Execution Note of 2026-10-10 records: a reader of the
specification finds it only in the history. The definitions now live in accepted elements:
- `{release}`: a task's `release` field, which a project may use in `base`'s `task_path` (for
  example `docs/04_memory/{release}/{id}.md`); `software`'s charter (Tokens and ids) and dl-015 C10;
- `{scope}`: a plan's field of that name, which a project may use in `base`'s `plan_path` (for
  example `docs/05_plans/{scope}/{id}.md`); `base`'s charter (Parameters) and dl-015 C10;
- `{release-line}` and `{version}`, `software`'s, which §8.3 does not name today: a release's field
  `release-line` and an element's `version`, used by `release_path`, `release_line_id` and
  `release_id`'s defaults (`software`'s charter).

The amendment is text only: the composer never reads a single-brace token (§8.3's first sentence),
so no code or test changes. It is approved by this task's merge OK, as task-044's was.

## Acceptance

1. **spec-001 §8.3, amended in place**: the citation of the local note is gone; the project tokens
   are named with their sources as above (`{release}`, `{scope}`, and `software`'s
   `{release-line}` and `{version}`), each with the parameter that may carry it and the accepted
   element that defines it; the section's rule is unchanged (the composer interprets no
   single-brace token; which tokens WingFoil fills, and from where, is WingFoil's).
2. **spec-001's Execution Notes**: an entry dated with the merge, saying what §8.3 now states and
   why (W8's fold-back, plan-046 ruling 4, dl-020), approved by the merge OK; the 2026-10-10 entry
   is left as it stands.
3. **No other change**: no file under `src/`, `tests/`, `packs/`, `schema/` or `.github/`; no
   other section of spec-001 or spec-002; `grep -n "docs/notes/" docs/memory/tech-spec/spec-001*`
   finds only the 2026-10-10 Execution Note.
4. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`,
   `validate -- --overlay tests/fixtures/software-exit`, the golden fixture's step and
   `workflow list` exit 0 with no warning; the CI run on the pushed branch concludes `success`.
   No test is written: the change is a specification's text, with no behaviour a test could hold
   (dl-018 covers code); the Execution Notes say so.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
