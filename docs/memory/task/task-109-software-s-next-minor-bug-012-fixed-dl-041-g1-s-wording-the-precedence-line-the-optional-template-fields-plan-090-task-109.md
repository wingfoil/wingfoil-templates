---
id: task-109-software-s-next-minor-bug-012-fixed-dl-041-g1-s-wording-the-precedence-line-the-optional-template-fields-plan-090-task-109
type: task
title: "software's next minor: bug-012 fixed, dl-041 G1's wording, the Precedence line, the optional template fields (plan-090 task-109)"
status: draft
pack: "pack-foundation-software"
depends_on: []
tags: ["packs","software"]
---

## Context

plan-090 hosts this task (its Steps 3; points 3, 4 and 5 of its outline, ruled on 2026-11-27): the
content of `software`'s next minor, 1.1.0 (`prel-010`, prepared after this task, task-110 and
task-111). A pack task under `kanban-delivery` v7, pack-author, charter `pack-foundation-software`;
the CHANGELOG entry, the version and the range are `prepare`'s, not this task's. It follows
task-108 (`base`'s minor, merged at `0be6a781`), whose shapes it reuses where the two packs meet.

**What it fixes and adds**, the register's Open rows (`docs/owed-items.md`):
- **bug-012's fix** (`approved`, `minor`): `software`'s AGENTS.md section states by value
  "{{agent_name}} acts as developer, reviewer, qa and architect" (a copy of its `dna.yaml`
  fragment's `executes_as`) and names two of the `bug` type's five gates (`triaged`, `planned`).
  The default composition already disagrees: `team.agents` merges `executes_as` as a set (spec-001
  §7.3), so the composed agent holds six roles with `base`'s `facilitator` and `product-owner`; a
  project whose `dna.yaml` or `memory.yaml` changes them gets a region that contradicts its own
  configuration. Expected (bug-012): the section names where the facts live (the roles `dna.yaml`
  › `team.agents` gives the agent; the `bug` gates as `memory.yaml` declares them, moved only by
  the approver's `approve`), or a value kept comes from a parameter with a default (spec-001 §8).
- **dl-041 G1's wording** (`approved`, option (d); G4: "in its next release (with bug-012's
  change)", the same row): until a released WingFoil binds a gate's approval to the phase that owns
  it, `software` keeps the approvals in `release-submit` › `approve-release` and
  `release-publishing` › `publish`; its section and README state that a project not running the
  engine follows those steps by hand, the approver's OK recorded at `approve-release` (in
  `releasing`, before the release commit) and at `publish` (before the tag), never moving a release
  past `releasing` by `submit` alone. G1's later part (gates on `release`, `software` 2.0.0) keeps
  its own row and is not this task's.
- **The `Precedence:` line** (dl-025 D2, spec-001 §10.1, `pack-authoring`): `determinism`
  `Precedence: foundation`, the first line after its `# ` title (plan-090 point 4). `base`'s
  section, from 2.1.0, states §10.1's table; `software`'s section adds none.
- **The optional template fields** (plan-074 point 6, plan-090 point 5): `adr`, `bug` and
  `tech-spec` get `contributor`, `credit` and `reported_by`; `release` gets `backlog_committed`,
  `waves` and the `## Scope changes` section.
- **README step 3 "own entries"** (plan-052 › close, task-067; trigger the next README pass,
  plan-090 point 3): `software`'s step 3 re-adds "the project's own entries" to the four files
  without saying that `init`'s scaffolded Memory types, roles and workflows are not among them;
  `methodology/kanban`'s step 3 and, from 2.1.0, `base`'s answer it ("only what the project wrote
  itself, … never the Memory types, roles or workflows WingFoil's `init` scaffolded").

**What exists today** (`main` at `d724938d`, `software` 1.0.0 tagged): `packs/software/directives/`
(`determinism`, with no `Precedence:` line), `agents/section.md` (the text above),
`fragments/dna.yaml` (`executes_as: [developer, reviewer, qa, architect]`), `fragments/roles.yaml`
(`determinism` for `developer`, `reviewer`, `architect`), `fragments/memory.yaml` (the `release`
type requires `title`, `version` and `release-line`; its path and id carry `{release-line}` and
`{version}`), `memory-templates/` (`adr`, `bug`, `release`, `release-line`, `tech-spec`, none with
an optional field), and a `README.md` with no "Updating from" paragraph. WingFoil 0.3.2's `init`
writes, on its `adr`, `bug`, `decision-log` and `tech-spec` templates, `contributor: ""`, `credit:
""` and `reported_by: []`; on its `release` template, `backlog_committed:` (no value) and `waves:
[]`, each with an `# optional — …` comment, and a `## Scope changes` section (a comment and a
table header: Task, From, Admitted at, Count vs backlog_committed) after the body.
`tests/fixtures/runs/software.yaml` only starts `sw-life-cycle`: no run adds a `software` type
except `governance/feedback`'s `route-bug` (a `bug`, on `with-software`).

## Acceptance

1. **bug-012, by reference:** `agents/section.md` names the agent's roles as those `dna.yaml` ›
   `team.agents` gives `{{agent_name}}` (its `executes_as`), and says it never approves and hands
   the approver the exact command, as today; a `bug` moves through the gates `memory.yaml` declares
   for it, including one parked back by its `returns`, only by the approver's `approve`. The
   section names no role and no `bug` state by value. No parameter is added (bug-012's other
   option): a reference follows the project's own files with nothing for it to set. The README's
   "Who holds `tech-lead`" paragraph, which describes the composed DNA's defaults, stays.
2. **dl-041 G1's wording:** the section and the README state G1 as ruled: the approvals stay in
   `release-submit` › `approve-release` and `release-publishing` › `publish` until a WingFoil
   release that `compat.yaml` lists binds a gate's approval to the phase that owns it; a project
   not running the engine follows those steps by hand, the approver's OK recorded at
   `approve-release` (in `releasing`, before the release commit) and at `publish` (before the
   tag); a release never moves past `releasing` by `submit` alone.
3. **The `Precedence:` line:** `determinism` `Precedence: foundation`, the first line after the `#
   ` title, followed by a blank line; the rest of the directive unchanged. No lint checks it
   (plan-090 point 4): the Design lists its first line, and the build review reads it.
4. **The template fields:** `adr.md`, `bug.md` and `tech-spec.md` gain `contributor: ""`, `credit:
   ""` and `reported_by: []` with the comments `base`'s `decision-log.md` carries since task-108
   (`reported_by`'s: "list of the feedback ids or feedback note paths this element answers, as
   provenance only; restate each in this element, never copy it"); `release.md` gains
   `backlog_committed:` and `waves: []` with 0.3.2's comments, and the `## Scope changes` section
   as 0.3.2 writes it, after the template's own sections. No template gains `id` or `status`; no
   type's `frontmatter.required` changes; `release-line.md` unchanged. On 0.3.0 and 0.3.2, on the
   `defaults` example, the frontmatter of an `adr`, a `bug`, a `tech-spec` and a `release` added
   with `memory add` is read (and the `release`'s `## Scope changes`), and whether the fields,
   their comments and the section are kept is recorded in the Execution Notes, with the commands.
5. **The README:** step 3 re-adds only what the project wrote itself, never the Memory types,
   roles or workflows `init` scaffolded, as `methodology/kanban`'s and `base`'s; an **"Updating
   from 1.0.0."** paragraph: recompose and copy the `.wingfoil/` files as in steps 2 and 3,
   regenerate the AGENTS.md region and paste it again (bug-012 and G1 change it); the
   `determinism` directive's line reaches the project only by that copy; the optional fields reach
   it only through its copied templates (elements already written are not changed); with
   `governance/feedback`, a `bug` routed from then on cites the item in its `reported_by` field,
   as that pack's rule says for a template that has the field. The generated regions ("What it
   adds", the composition, the parameters) are not expected to change; `npm run index -- --check`
   says so.
6. **Not this task's:** the CHANGELOG entry, `pack.yaml`'s `version` and the range (`prepare`);
   the notes on the charter `pack-foundation-software`, on bug-012 and on dl-041, which are
   plan-090 point 11's, after the tag; G1's later part; no file under `src/`, `.wingfoil/`,
   `presets/` or another pack changes; a change found needed there stops the task and goes to the
   approver (dl-019).
7. **Validation:** `npm test`, `npm run lint`, `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` pass with no warning, `tolerance applied: none`; the overlays `software-exit`,
   `scrum-exit`, `kanban-exit` and `feedback-exit` and the golden tree pass; `npm run check:runs`
   passes, with a run of its own added to `tests/fixtures/runs/software.yaml` that adds an `adr`, a
   `bug` and a `tech-spec`, on 0.3.0 and 0.3.2. The runner's `add` sets no field, and a `release`
   needs `version` and `release-line` to have an id and a path, so no run adds one: criterion 4's
   reading covers it. `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged
   until `prepare`. Tests and fixtures that read `software`'s files, or whose elements meet a
   changed template (the `with-software` feedback fixture's `bug`), updated where their
   expectations change.
8. **The counts** the tooling tests take on this repository (the lint's files, the index's, the
   compositions and runs): each that moves stated in the Execution Notes with the test it changes,
   measured, not assumed.
9. **Checks** (`kanban-delivery` › `review`, dl-039): the build review and its amendments; then,
   once, on the frozen commit, the branch CI `success`, its run id and every job's duration (a job
   over 25 minutes goes to the approver); dl-039's local list on Node.js 22.21.0 from a clean tree
   after `npm ci` and `npm run build`, as task-108 ran it.
10. **Delivery:** the branch `task/task-109-…` from `main`, in a worktree; after `approve`, a
    `--no-ff` merge on the approver's OK, `main` pushed by the approver (plan-090 ruling 13), its CI
    read, and `approved → done`; the privacy check of the branch's diff recorded
    (`repository-practice` rule 2).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
