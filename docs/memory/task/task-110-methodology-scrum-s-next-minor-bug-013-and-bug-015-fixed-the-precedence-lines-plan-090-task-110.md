---
id: task-110-methodology-scrum-s-next-minor-bug-013-and-bug-015-fixed-the-precedence-lines-plan-090-task-110
type: task
title: "methodology/scrum's next minor: bug-013 and bug-015 fixed, the Precedence lines (plan-090 task-110)"
status: approved
pack: "pack-methodology-scrum"
depends_on: []
tags: ["packs","scrum"]
---

## Context

plan-090 hosts this task (its Steps 3; points 3 and 4 of its outline, ruled on 2026-11-27): the
content of `methodology/scrum`'s next minor, 1.1.0 (`prel-011`, prepared after this task and
task-111). A pack task under `kanban-delivery` v7, pack-author, charter `pack-methodology-scrum`;
the CHANGELOG entry, the version and the range are `prepare`'s, not this task's. It follows
task-108 (`base`) and task-109 (`software`, merged at `f5172ad0`), whose shapes it reuses.

**What it fixes**, the register's Open rows (`docs/owed-items.md`):
- **bug-013's fix** (`approved`, `minor`): `scrum`'s AGENTS.md section states by value
  "**Roles:** the Product Owner is `product-owner`, the Scrum Master `facilitator`, the Developers
  `developer` with `architect`, `reviewer`, `qa` and `tech-lead`." The mapping lives in the
  workflows' phase `role:` fields and in the roles `dna.yaml` declares (`roles.yaml` binds
  directives to roles and holds no mapping); a project that changes them gets a region that
  contradicts its configuration, as bug-012 for `software`. Expected (bug-013): the section names
  the mapping as `scrum`'s default and points to the workflows' roles and `dna.yaml` › `team` for
  the project's own, or takes it from parameters with defaults (spec-001 §8). **A departure from
  bug-013's Expected and the register's row,** for the approver to rule at the backlog gate
  (`pending → backlog`): the `scrum` directive's **Accountabilities** bullet states the same
  mapping by value; it is a rule, not the generated region, and bug-013 names only the section,
  but a project that changes its roles meets the same contradiction there. Recommended: the same
  reading (criterion 1); the alternative: the directive unchanged, with a new Open row. The
  README's "Sources and adaptations" ("the Scrum Master is `base`'s facilitator, and the
  Developers are `software`'s roles") describes the defaults and stays, as task-109 kept "Who holds
  `tech-lead`".
- **bug-015's fix** (`approved`, `minor`): a task's or a release's `sprint` naming a Sprint that
  does not exist is accepted at `memory submit` (reproduced for a task; for a release it follows
  from `release`'s `where`), and the element is never selected by `sprint` › `development` or
  `release` (their `where` match `sprint: "{sprint.id}"`), with no message. The field is written by
  editing (`sprint-planning` into the tasks, `plan-release` into the release's draft); WingFoil
  0.3.2 checks no reference and a pack cannot add a check (spec-001 O4). Expected (bug-015):
  `sprint-planning` and `plan-release` name the risk and ask that the field be checked against the
  Sprint's id when written, and the `scrum` directive (the register's row) or `backlog-item`'s
  description says that an element whose `sprint` names no Sprint is never selected. WingFoil's
  side is F-043, not this task's. "Names no Sprint" is read as: names a Sprint that does not
  exist; `n/a — <reason>` is the intended value of a task no Sprint
  selects (the `scrum` directive's Refinement), and has nothing to check against. `sprint-review`
  and `close` also rewrite `sprint`, to the next Sprint, which may not exist yet (it is added
  outside a step); bug-015's Expected names only `sprint-planning` and `plan-release`, so the
  directive's bullet covers those rewrites and their descriptions stay unchanged.
- **The `Precedence:` lines** (dl-025 D2, spec-001 §10.1, `pack-authoring`): `definition-of-done`
  and `scrum` `Precedence: method` (plan-090 point 4).
- **README step 3 "own entries"** (plan-052 › close, task-067; trigger the next README pass,
  plan-090 point 3): `scrum`'s step 3 re-adds "its own entries" without saying that `init`'s
  scaffolded Memory types, roles and workflows are not among them; `methodology/kanban`'s step 3,
  and from their next minors `base`'s and `software`'s, answer it.

**What exists today** (`main` at `f574a1d0`, `methodology/scrum` 1.0.0 tagged):
`packs/methodology/scrum/directives/` (`definition-of-done`, `scrum`, neither with a `Precedence:`
line), `agents/section.md` (the "Roles" bullet above), `workflows/sprint.yaml` (`version: 1`; its
`sprint-planning` and `plan-release` descriptions name no risk), `workflows/backlog-item.yaml`,
`workflows/delivery.yaml`, `fragments/roles.yaml`, `fragments/memory.yaml` (declaring `task.sprint`
and `release.sprint`, unchanged), `memory-templates/sprint.md`, and a `README.md`
with no "Updating from" paragraph. `scrum` has no Memory template that WingFoil 0.3.2's `init`
gives optional fields (plan-090 point 5 names none for it).

## Acceptance

1. **bug-013:** `agents/section.md`'s "Roles" bullet names the mapping as `scrum`'s default (the
   Product Owner `product-owner`, the Scrum Master `facilitator`, the Developers `developer` with
   `architect`, `reviewer`, `qa` and `tech-lead`) and says a project's own mapping is the roles
   its workflows' phases name and `dna.yaml` › `team` gives (its `roles`, and who holds them); no
   parameter is added (bug-013's other option: a reference follows the project's own files with
   nothing to set). If the approver rules the recommended reading (Context): the `scrum`
   directive's Accountabilities bullet names the mapping as `scrum`'s default and a project's own
   mapping as the roles its workflows' phases name and `dna.yaml` › `team` gives, the rest of that
   bullet unchanged; if the alternative: the directive unchanged, and this task adds an Open row to
   `docs/owed-items.md` (the directive's mapping by value; owner approver, trigger `scrum`'s next
   release).
2. **bug-015:** `sprint.yaml` › `sprint-planning`'s description asks that the id written in each
   selected task's `sprint` field be checked against this Sprint's `id` (its frontmatter) when
   written, and says that a task whose `sprint` names a Sprint that does not exist (misspelt, or
   never created) is never selected, and WingFoil gives no message; `plan-release`'s description
   says the same of the release's `sprint`; the `scrum` directive gains a bullet: an element whose
   `sprint` names a Sprint that does not exist is never selected by any Sprint and no command says
   so, so whoever writes or rewrites the field checks it against the Sprint's `id`; a rewrite to
   the next Sprint names it once that Sprint is added (`memory add`), and is checked then; `n/a —
   <reason>` is the way to leave a task unselected. `sprint-review`'s and `close`'s descriptions
   unchanged. The workflow's `version` moves by one (`2`), as `base`'s `governance-evolution` did
   in task-108; its phases, roles, actions and `where` unchanged.
3. **The `Precedence:` lines:** `definition-of-done` and `scrum` `Precedence: method`, each after
   the `# ` title and a blank line, followed by a blank line, as `base`'s `security-secrets.md`; no
   lint checks it (plan-090 point 4): the Design lists each, and the build review reads them.
4. **The README:** step 3 re-adds only what the project wrote itself (among them the `include`
   entries of the `custom/` workflows it wrote), never the Memory types, roles or workflows
   WingFoil's `init` scaffolded, as `methodology/kanban`'s; the rest of step 3 (the delivery
   workflow `init` scaffolded removed) unchanged; after step 7, in "Install and update", as
   `software`'s, an **"Updating from 1.0.0."** paragraph: recompose and copy the `.wingfoil/` files
   as in steps 2 and 3, regenerate the AGENTS.md region and paste it again (bug-013 changes it); the
   changed directives and `sprint` reach the project only by that copy; nothing in its elements
   changes, but a task or a release whose `sprint` names a Sprint that does not exist is worth
   checking once. What `sprint` at `version: 2` does to a Sprint already started is read on WingFoil
   0.3.0 and 0.3.2 (the procedure in the Design: a `sw-life-cycle` instance whose `delivery` ›
   `sprint` is in `development`, a task in `backlog-item`, on 1.0.0's files; then 1.1.0's copied;
   `workflow list --format json` and `workflow next` on it) and recorded in the Execution Notes; the
   paragraph states each release's outcome, and an outcome other than the instance going on goes to
   the approver (dl-019). The generated regions are not expected to change; `npm run index --
   --check` says so.
5. **Not this task's:** the CHANGELOG entry, `pack.yaml`'s `version` and the range (`prepare`);
   the notes on the charter `pack-methodology-scrum`, on bug-013 and on bug-015, which are plan-090
   point 11's, after the tag; F-043 (WingFoil's side); no file under `src/`, `.wingfoil/`,
   `presets/` or another pack changes; a change found needed there stops the task and goes to the
   approver (dl-019).
6. **Validation:** `npm test`, `npm run lint`, `npm run check:texts -- --base main`, `npm run
   check:packs`, `npm run index -- --check` and `npm run validate` pass with no warning,
   `tolerance applied: none`; the overlays `software-exit`, `scrum-exit`, `kanban-exit` and
   `feedback-exit` and the golden tree pass; `npm run check:runs` passes, its runs unchanged (no
   template changes, so no run is added). `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and
   `llms.txt` unchanged until `prepare`. Tests and fixtures that read `scrum`'s files updated where
   their expectations change (none is expected: no test asserts their text, and the `scrum-exit`
   overlay holds only compositions).
7. **The counts** the tooling tests take on this repository (the lint's files, the index's, the
   compositions and runs): each that moves stated in the Execution Notes with the test it changes,
   measured, not assumed.
8. **Checks** (`kanban-delivery` › `review`, dl-039): the build review and its amendments; then,
   once, on the frozen commit, the branch CI `success`, its run id and every job's duration (a job
   over 25 minutes goes to the approver); dl-039's local list on Node.js 22.21.0 from a clean tree
   after `npm ci` and `npm run build`, as task-109 ran it.
9. **Delivery:** the branch `task/task-110-…` from `main`, in a worktree; after `approve`, a
   `--no-ff` merge on the approver's OK, `main` pushed by the approver (plan-090 ruling 13), its CI
   read, and `approved → done`; the privacy check of the branch's diff recorded
   (`repository-practice` rule 2).

## Design

On `task/task-110-…`, from `main` at `17641bc1` (the backlog approval).

- **`agents/section.md`** (criterion 1): the "Roles" bullet becomes "**Roles:** by default the
  Product Owner is `product-owner`, the Scrum Master `facilitator`, the Developers `developer` with
  `architect`, `reviewer`, `qa` and `tech-lead`; the project's own mapping is the roles its
  workflows' phases name and `dna.yaml` › `team` gives (its `roles`, and who holds them)."
- **`directives/scrum.md`** (criteria 1, 2, 3): `Precedence: method` after the title; the
  Accountabilities bullet opens "By default the Product Owner is …" and gains the same reference,
  its agent sentence kept; a new bullet after "At the end of a Sprint", **A `sprint` naming no
  Sprint**, as criterion 2 words it (the rewrite to a next Sprint not yet added, and `n/a`).
- **`directives/definition-of-done.md`** (criterion 3): `Precedence: method` after the title.
- **`workflows/sprint.yaml`** (criterion 2): `version: 2`; `sprint-planning`'s description gains
  "Check each id written against this Sprint's id: a task whose sprint names a Sprint that does not
  exist (misspelt, or never created) is never selected, and WingFoil gives no message.";
  `plan-release`'s gains, after "its sprint by editing the draft", the same check for the release.
- **`README.md`** (criterion 4): step 3 as `methodology/kanban`'s first sentence; after step 7,
  **"Updating from 1.0.0."** with the outcome of the started-Sprint check.
- **The started-Sprint check** (criterion 4): a script composing `base`, `software` and
  `methodology/scrum` with the `defaults` example's parameters from `main`'s tree (1.0.0's files)
  and from the branch's, into a scratch repository per release (0.3.0, 0.3.2): `workflow start
  sw-life-cycle`; `docs/inception.md` committed and `inception.approve` finalized by the approver;
  a `tech-spec` added, submitted and approved; `sprint-001` added at `delivery.plan-sprint`, its
  `goal` written, submitted (`planned`); a task with `sprint: sprint-001` submitted and approved
  (`backlog`); the Sprint submitted (`active`) and the task (`in-progress`): `workflow next` gives
  `backlog-item.build@task:…`. Then the branch's `.wingfoil/` copied over and committed: `workflow
  list --format json` and `workflow next` read. A trial with only `version: 2` changed, before the
  build, gave no diagnostic and the same next step on both releases.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-28: independent review of the body: approve after amendments, nothing blocking (2 major,
  5 minor, 3 nits); applied: the Accountabilities reading stated as a departure for the backlog
  gate, with its alternative, and the README's "Sources and adaptations" kept; criterion 2's check
  against this Sprint's `id`, "a Sprint that does not exist", `n/a` the intended value; the
  rewrites at `sprint-review` and `close` left to the directive; the paragraph's position; the
  version bump's effect on a started Sprint read on WingFoil; the `scrum-exit` overlay; the release
  case as bug-015 reproduced it; `fragments/memory.yaml`; `dna.yaml` › `team` (its `roles`, and who
  holds them) in place of `team.roles`, since the mapping is also who holds a role.
- 2026-11-28: re-review of the amendments: approve after amendments (3 minor, 2 nits), all
  applied: a rewrite to a next Sprint not yet added; criterion 1 under either ruling, the
  alternative's Open row written by this task; the started-Sprint check's procedure (the main
  started, `development` mid-`backlog-item`, each release's outcome, another outcome to the
  approver); "the procedure in the Design"; "names no Sprint" read explicitly.
- 2026-11-28: built (`298805c0`) as the Design says, with the approver's ruling at the backlog gate
  (`17641bc1`: the `scrum` directive's Accountabilities given bug-013's reading). `npm test` 1537
  pass, 0 fail (the count unchanged: no test reads the changed texts); `npm run check:runs` 98
  runs, 0 failed (unchanged); `check:packs` 101 files, 0 problems; `index -- --check` 9 files up to
  date (no generated region moved); `check:texts -- --base main`, `lint` and `check:schemas` exit
  0.
- 2026-11-28: criterion 4's started-Sprint check (the Design's procedure, `defaults`' parameters),
  on 0.3.0 and 0.3.2: on 1.0.0's files (`main`'s tree) the `sw-life-cycle` instance reaches
  `backlog-item.build@task:task-001-buy-a-ticket` (`sprint-001` `active`, the task `in-progress`);
  after the branch's `.wingfoil/` copied and committed, `sprint.yaml` at `version: 2`, `workflow
  list --format json` exits 0 with no diagnostic and `workflow next` gives the same step on both
  releases. The README's paragraph states it.
- 2026-11-28: build review: approve (0 major, 1 minor, 2 nits). Applied: the README's
  started-Sprint sentence limited to the case read; `plan-release`'s description refilled (its
  text unchanged). Not applied: the directive's "a rewrite to the next Sprint names it once that
  Sprint is added", criterion 2's own words. Its note on the evidence, applied here: the check
  reads `workflow list`'s JSON (no diagnostic) and does not test its exit status.
- 2026-11-28: dl-039's checks on the frozen commit `015b6e96`. The branch CI run 46129403471
  `success`, its jobs: `validate (22.12.0, 1)` 11m22s, `validate (22.21.0, 1)` 11m12s, `validate
  (22.21.0, 2)` 7m55s, `validate (22.12.0, 2)` 7m19s (none over 25 minutes). The local list on
  Node.js 22.21.0, from a clean clone after `npm ci` and `npm run build`: all 18 commands exit 0;
  `npm test` 1537 pass, 0 fail; `lint`, `check:texts -- --base origin/main`, `check:pins`;
  `check:schemas` 10 files; `check:packs` 101 files, 0 problems; `index -- --check` 9 files up to
  date; `validate` 32 runs, the golden tree 26 (tolerance 0.2.2, as on `main`), the overlays
  `software-exit`, `scrum-exit`, `kanban-exit` 40 each and `feedback-exit` 48, each 0 failed and
  `tolerance applied: none`; `workflow list` exit 0; `check:runs` 98 runs, 0 failed; `npm audit
  --omit=dev` 0 vulnerabilities; the tree clean after. Privacy check of the branch's diff and its
  commit messages (`repository-practice` rule 2): no local path, no session or transcript of this
  work, no project outside this repository's named.
- 2026-11-28: `in-review → approved` by the approver (`9cf5ab2a`); on the approver's OK, merged
  `--no-ff` into `main` (`765f408e`); on `main` after the merge, the build, `workflow list`,
  `lint`, `check:packs` (101 files, 0 problems) and `index -- --check` pass. The task stays
  `approved` until `main`'s CI on the merge.
- 2026-11-28: `main` pushed by the approver; its CI on `addd7995` (the merge `765f408e` and its
  note) `success` (CI run 46136218930, Pages 46136218904); `approved → done`.
