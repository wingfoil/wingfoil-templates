---
id: dl-005-repository-governance-configuration-restart-notes-contributions-and-the-tooling-loop
type: decision-log
title: "Repository governance: configuration, restart, notes, contributions and the tooling loop"
status: pending
tags: ["governance","process"]
---

## Context

Several rulings about how this repository is run were given in chat on 2026-10-05 and 2026-10-06,
and are in no element yet. Some of them change the WingFoil configuration, and a configuration change
must come from an element (an approved decision-log, a task or a bug).

## Options

Each point below had its alternatives discussed in chat, or in the vision, journeys and sequencer
reviews (`docs/01_vision/`). Only the ruling is recorded here.

## Decision

Ruled by the approver, Roberto Pompermaier.

- **G1 — The `.wingfoil/` configuration fits the project** (2026-10-05, confirmed in the session
  brief of 2026-10-06). It covers:
  - Kanban as this repository's methodology, in continuous flow;
  - the Memory types `pack`, `pack-release` and `plan`, with `release` and `release-line` removed;
  - the workflows `pack-cycle`, `pack-release-cycle`, `pack-release`, `pack-deprecation`,
    `kanban-delivery` and the three ingest mains;
  - the directives `pack-authoring`, `pack-semver`, `pack-compatibility`, `wingfoil-feedback`.
- **G2 — Restart** (2026-10-05: "sei partito troppo veloce").
  - The first attempt skipped `sw-life-cycle` phases. It is archived on `archive/draft-2026-10-05`,
    as source material only, never cherry-picked.
  - `main` restarts from the configuration commit.
  - On 2026-10-06 the approver had that commit amended (`ff5d49f` → `539e943`) rather than fixed by
    bugs or a decision-log. The amend added:
    - `templates-inception`, a compact Lean Inception without GQM;
    - the pack id pattern `pack-{axis}-{name}`;
    - the padded ids `dl-001`/`spec-001`;
    - the removal of the feedback notes from the phase outputs.
- **G3 — Notes stay out of git** (2026-10-05: "non committare le note"). They are
  `docs/wingfoil-feedback/X_wingfoil-templates-notes.md` and `docs/notes/base-regeneration-inputs.md`.
  They are no phase's output. Files are staged by name, never with `git add -A`.
- **G4 — Public repository** (brief review, 2026-10-06):
  - `https://github.com/wingfoil/wingfoil-templates`;
  - MIT licence;
  - the approver's contact stays in `dna.yaml`.

  The visibility had first been relayed by "Stato progetti wingfoil"; the approver confirmed it
  directly here.
- **G5 — Contributions** (brief review, 2026-10-06).
  - Now only the approver and AI agents write the repository.
  - Later the repository opens on WingFoil's contribution model (`COLLABORATION.md`, WingFoil
    dl-020): Memory elements through the ingest workflows, implemented after acceptance, with
    `contributor:` and `credit:`.
- **G6 — Roles in the life cycle** (2026-10-05).
  - The agent `claude` executes as facilitator, architect, pack-author, developer and reviewer, and
    never approves.
  - The approver keeps the product-owner phases. The agent drafts them.
- **G7 — The tooling loop** (sequencer review, 2026-10-06).
  - Tooling tasks are tasks with no pack. They run in a `tooling` phase of `sw-life-cycle`, between
    specification and pack-delivery, one `kanban-delivery` iteration each.
  - Later tooling changes run through a startable main workflow, `tooling-change`, that includes the
    same loop.

  Both declarations were checked to parse with WingFoil 0.2.2 in a scratch clone.
- **G8 — Release intake** (journeys review, 2026-10-06). The `wingfoil-release-intake` workflow
  returns to the configuration (J4; its rules are dl-002).

Configuration changes this decision implies. Each is applied after approval and bumps `version:`:
- G7:
  - a `tooling` phase in `sw-life-cycle.yaml`;
  - a new main workflow, `tooling-change.yaml`;
  - both included in `workflows.yaml`.
- G8: `wingfoil-release-intake.yaml`, together with the dl-002 changes.

## Execution Notes

- The architecture choices of the features review are recorded in an ADR in the specification phase
  (`adr-ingest`), not here:
  - a reference composer in this repository, proposed to WingFoil as its implementation (feedback
    note T15);
  - tooling in TypeScript on Node.js.
