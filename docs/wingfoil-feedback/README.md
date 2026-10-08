# WingFoil feedback inbox

Notes about WingFoil — defects, gaps and requests — found while working in this repository. WingFoil
reads this inbox at its retrospective and answers in its own repository (WingFoil dl-163); this
repository pulls the answer at its own sync.

## Rules

- One file per note, `F-<nnn>-<slug>.md`, never deleted and never renumbered; the format is WingFoil
  dl-163 R4: the frontmatter fields `id`, `title`, `kind` (`defect | gap | request`), `status`
  (`open | needs-info | captured | resolved | declined | duplicate`), `wingfoil_version` and
  `answered_by`, and a body stating what was observed and what was expected, reproducible with
  WingFoil alone (command, output, version).
- This repository writes `open`; `answered_by` and every other status are set only by the sync, from
  what WingFoil published.
- How notes are written, when the sync runs and what WingFoil cites are the rules of the
  `wingfoil-cli` directive (`.wingfoil/directives/custom/wingfoil-cli.md`).
- If WingFoil's `COLLABORATION.md` refines the format, the next sync follows it.

**Source key:** to be set — the `svc-NNN` id WingFoil assigns when it registers this repository as a
feedback source (WingFoil task-269). WingFoil cites a note as `<source key>/F-<nnn>@<sha>`.

**Last sync:** none.

## Ledger

| Note | Title | Kind | Status | Answered by |
|---|---|---|---|---|
| [F-001](F-001-templates-are-compiled-typescript.md) | Templates are compiled TypeScript; there is no external template source | gap | open | |
| [F-002](F-002-pack-model-orthogonal-axes.md) | Pack model: orthogonal axes instead of monolithic templates | request | open | |
| [F-003](F-003-pack-versioning-and-advance-bundled-packs.md) | Pack versioning and the "advance bundled packs" release step | request | open | |
| [F-004](F-004-remote-content-and-dl-031-integrity.md) | Remote content conflicts with dl-031 ("no digest, no manifest") | gap | open | |
| [F-005](F-005-projects-need-a-lock.md) | Projects need a lock to make init reproducible and upgrades possible | request | open | |
| [F-006](F-006-init-asks-one-question.md) | init asks one question; the vision asked for more | gap | open | |
| [F-007](F-007-no-command-updates-configuration-after-init.md) | No command updates the configuration after init | gap | open | |
| [F-008](F-008-no-lifecycle-stage.md) | No lifecycle stage: moving from demo to production is manual | request | open | |
| [F-009](F-009-agent-first-overlay-depends-on-agent-work.md) | The agent-first overlay depends on v0.3/v0.4 agent work | request | open | |
| [F-010](F-010-first-packs-fix-scaffold-gaps.md) | The first packs fix known scaffold gaps | request | open | |
| [F-011](F-011-memory-add-set-fills-only-id-tokens.md) | memory add --set fills only id tokens, so required fields cannot be set at creation | defect | open | |
| [F-012](F-012-format-key-distinct-from-version.md) | Format key distinct from version: | request | open | |
| [F-013](F-013-migrate-and-capabilities-commands.md) | wingfoil migrate and wingfoil capabilities | request | open | |
| [F-014](F-014-agents-md-marker-format.md) | The base pack depends on the AGENTS.md marker format of dl-137's tech-spec | request | open | |
| [F-015](F-015-one-composer-for-packs.md) | One composer for packs, written in WingFoil-Templates and proposed to WingFoil | request | open | |
| [F-016](F-016-phase-cannot-declare-its-method.md) | A workflow phase cannot declare the method it follows | gap | open | |
| [F-017](F-017-pack-format-and-schemas-format-1.md) | The pack format and its schemas, format 1 (WingFoil-Templates spec-001) | request | open | |
| [F-018](F-018-where-on-iterate-over-not-evaluated.md) | where: on iterate_over is declared but nothing evaluates it | gap | open | |
| [F-019](F-019-built-in-directive-ids-not-readable.md) | WingFoil's built-in directive ids cannot be read without a project | gap | open | |
| [F-020](F-020-composed-configuration-must-satisfy-unexposed-schemas.md) | A composed .wingfoil/ must satisfy WingFoil's own schemas, which nothing exposes | gap | open | |
| [F-021](F-021-runs-only-at-a-git-root.md) | WingFoil runs only at the root of a git repository | request | open | |

## Context

These notes were first kept in one file, `X_wingfoil-templates-notes.md` (versioned in task-009,
split in task-010); its notes T1–T18 are F-001–F-018, each saying so on its first line.

**Origin.** WingFoil-Templates was opened on 2026-10-01 to become the official, live source of
WingFoil templates. T1–T14 come from the design discussion held before any implementation, and from
an analysis of WingFoil at commit `30f06016` (`v0.2.2-1778-g30f06016`, v0.3 in development, wave 1);
their references point into the WingFoil repository at that commit. A first attempt at this
repository skipped phases of its own `sw-life-cycle`; it is kept on the branch
`archive/draft-2026-10-05`, and `main` restarted from the WingFoil configuration commit `539e943`.
The ids the old inbox cited from that attempt — `dl-001`, `dl-002`, `dl-003`, `spec-001`, `pack-*`,
`task-001`, `prel-001`, and the files `catalog.yaml`, `compat.yaml`, `schema/`, `packs/` — existed
then only on that branch, as unapproved drafts; most have since been recreated on `main` through the
workflows, with their own content.

The old inbox was meant to be read at WingFoil's next `retrospective` (`additional-points` phase)
and `release-planning` (v0.4, the release that already carries P4.18–P4.20 and the "methodology
packs" idea, `docs/04_memory/planning/rl-v1/minor-v0.4.md:45-50`).

**Decisions taken by the approver on 2026-10-05**, the inputs these notes assume:

| # | Decision |
|---|---|
| D1 | The AI-agent variants of the methodologies are an **overlay** (`team-mode`), applied on top of any methodology, not separate methodology packs. |
| D2 | The lifecycle **stage** axis uses the full scale: `prototype` → `mvp` → `production` → `maintenance` → `sunset`. |
| D3 | Every **pack has its own semver**. The base packs **stay bundled in the npm package** as offline fallback. **Before each WingFoil release, WingFoil advances its bundled packs to the newest version published on WingFoil-Templates** (F-003). |
| D4 | First scope of WingFoil-Templates: methodologies `scrum`, `kanban`; overlay `team-mode/agent-first`; phase methods `inception/lean-inception`, `specification/bdd-sbe`; blueprints `web-service`, `cli-library`; stages `prototype`, `production`, plus the transition between them. |
| D5 | The WingFoil-side changes go through WingFoil's own process (these notes → retrospective/planning), not as direct edits from this repository. |
| D6 | A pack's compatibility contract is the **file formats** its content is written in plus the WingFoil **capabilities** it needs, not a hand-written range of WingFoil versions; a `compat.yaml` maps each WingFoil release to the formats it reads and the capabilities it provides, and the range is computed from it. Before WingFoil 1.0, one living line per pack; from 1.0, lines N and N-1 for a declared window. Depends on F-012 and F-013. (Recorded on `main` as dl-002.) |

**WingFoil counterpart found on 2026-10-05:** dl-138 (WingFoil consumes templates from a remote,
versioned source; `ready`, release v0.4) decides the direction these notes assume. Its questions map
onto them: Q1 ↔ F-005, Q2 ↔ F-007, Q3 ↔ F-007 and this repository's `pack-authoring` directive, Q4 ↔
F-004, Q5 (release v0.4) ↔ the open question below. Beyond dl-138 the notes add the axes model
(F-002), versioning by format and capability (D6, F-012, F-013), stages and transitions (F-008), and
the bundled-pack release step (F-003).

**Open questions for WingFoil's planning** not tied to a single note (the others are in F-003,
F-004, F-005, F-007, F-008):
- Which packs are bundled as fallback: exactly the D4 set, or only `scrum` + `kanban` + the
  `prototype` stage?
- Which release: everything in v0.4 alongside P4.18–P4.20, or `stage` and `upgrade` in a later
  minor?
