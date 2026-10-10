---
id: dl-003-a-base-foundation-pack-under-every-other-pack
type: decision-log
title: "A base foundation pack under every other pack"
status: approved
tags: ["packs","base"]
---

## Context

On 2026-10-05 the session "Stato progetti wingfoil" compared the `.wingfoil/` configurations of the
four repositories governed by WingFoil: WingFoil2, WingFoil2-Benchmark, WingFoil-UI and
WingFoil-Templates. They come from two families:
- WingFoil2's own configuration, which UI copied;
- the `wingfoil init` 0.2.x Kanban scaffold, from which Benchmark and Templates started.

Many of their differences have nothing to do with what the projects are:
- the same states under different names;
- capture workflows with different phases;
- several feedback channels to WingFoil;
- directives still at the init stub.

The approver wants the same steps in every project without distorting any of them. That session
proposed a common "base" pack. dl-001's model has axes but no common core.

The first attempt drafted this as dl-003 on `archive/draft-2026-10-05`. It also wrote `base` 0.1.0
before any format was specified. Neither was approved, and `base` 0.1.0 is not published
(`docs/notes/base-regeneration-inputs.md`).

## Options

1. **A new axis.** Rejected: an axis is a choice between alternatives, and the base has none.
2. **Spread over the existing packs.** Life cycles and ingest workflows would live inside each
   methodology. Rejected: the content would be duplicated in scrum and kanban, and blueprint and
   stage packs need the same types.
3. **A foundation pack under every other pack**, versioned like the others and required by all.

## Decision

Ruled by the approver, Roberto Pompermaier: **option 3**. Each point carries its source. A point
marked *relayed* reached this repository through another session, and becomes a ruling when this
element is approved.

- **D1 — The foundation** (approver, 2026-10-05: "ok, apri dl-003 e scrivi packs/base"). `base` is
  composed first, outside the axes.
  - Every other pack requires it, with a semver range: `requires: [base@^<major>]`.
  - Every other pack only adds to it or tightens it. In a Memory state machine, adding a state or a
    gate is allowed; removing either is not.
- **D2 — What `base` holds** (approver, 2026-10-05, same reply):
  - the common Memory types, with WingFoil2's state names where they exist;
  - the capture workflows, with the same phase names everywhere;
  - the `sw-life-cycle` skeleton with its slots, and `retrospective`;
  - the global directives, written as real rules, not init stubs;
  - the DNA and roles fragments: the approver as a member, the agent without approval authority;
  - path and id conventions as parameters with defaults.

  The exact types, states and parameters are fixed by spec-001 and by the `base` charter. Their
  inputs are in `docs/notes/base-regeneration-inputs.md`: per-type paths, the `{release}` and
  `{scope}` tokens, the bug state `fixed`, the agent name, the `service` name clash.
- **D3 — No `waiting` states in 0.x.** On WingFoil 0.2.2 no verb leaves a `waiting` state. A later
  major of `base` may add them. It then requires the `workflow-engine` capability (dl-002).
- **D4 — Slots** (amended 2026-10-06, see D11). `sw-life-cycle` includes `inception`,
  `specification`, `delivery` and `end-of-life` by name; the methodology's `delivery` includes
  `release` by name, at its own release cadence, as it includes `retrospective`.
  - `base` ships defaults for `inception`, `specification`, `release` and `end-of-life`.
  - A phase pack fills a slot by shipping a workflow of the same name. This is the one sanctioned
    replacement of one pack's file by another's.
  - `delivery` has no default: the methodology fills it.
- **D5 — Not in `base`:**
  - domain types and workflows;
  - the methodology;
  - domain roles and directives;
  - branch-per-task and CI, which belong to `stage/production`;
  - CI specifics, which belong to the blueprint.
- **D6 — The `governance` axis and `governance/wingfoil-dogfood`.** The feedback channel to WingFoil
  serves only the repositories that dogfood WingFoil, so it is not in `base`. It is the pack
  `governance/wingfoil-dogfood`: the `wingfoil-feedback` directive, the `docs/wingfoil-feedback/`
  inbox, and the known behaviours of the pinned CLI. The axis has cardinality "many".

  *Relayed*: the proposal was in the summary the approver answered on 2026-10-05, so the placement
  and the axis have an implicit ok.
- **D7 — Amendment of dl-001 D5.** The first scope gains `base` and `governance/wingfoil-dogfood`.
  `base` is bundled in WingFoil's npm package (dl-001 D4).

  *Relayed* by the session "Stato progetti wingfoil", 2026-10-05.
- **D8 — Agent files at the repository root.** WingFoil **dl-137** is `ready`. It adopted R1–R4 as
  constraints on its part-(b) tech-spec (amend `eac64831`, approve `9b915e4f`).

  *Relayed*. The ratification was checked in the WingFoil2 repository.
  - **R1.** `AGENTS.md`, and every other agent file at the root, is never a pack file. `CLAUDE.md`
    stays only as a pointer. Packs write only under `.wingfoil/`.
  - **R2.** Packs contribute to the content of `AGENTS.md`, not to the file. They contribute the
    composed configuration and at most one declared section (`agents_section`). WingFoil generates
    the file (dl-137 Q2 iii).
  - **R3.** The file has two owners. A region between markers belongs to WingFoil and is
    regenerated. The rest belongs to the project and is never touched. The drift check reads only
    the generated region.
  - **R4.** Until WingFoil exports `AGENTS.md` (v0.4), projects write it by hand, with `base`'s
    section and markers.

  The marker syntax is provisional. It is realigned to dl-137's part-(b) tech-spec, or earlier to
  WingFoil2's own `AGENTS.md` if that lands first (feedback notes T14).
- **D9 — Publication** (approver, 2026-10-06: session brief and sequencer review).
  - `base` is written against the **final** WingFoil v0.3 formats, expected at the end of WingFoil's
    wave 3: the dl-149 `format:` key, task-180, `bindings.yaml`, dev-loop 1.5/1.6, the Memory
    templates.
  - It is **published only after WingFoil v0.3 is released** (dl-002).
- **D10 — Adoption** (approver, 2026-10-06: session brief and journeys review).
  - Adoption is by hand until the CLI installs packs, in this order: WingFoil-Templates,
    WingFoil2-Benchmark, WingFoil-UI. WingFoil2 adopts `base` through its own process (dl-001 D6).
  - Benchmark and UI adopt only between two of their own releases.
  - Each repository records the adopted version in its own Memory, and this repository keeps no
    list of adopters.
- **D11 — Amendment of dl-001 D1: the phase slots** (approver, 2026-10-06: "ok, procedi con
  emendamento dl-003", on the reconciliation proposed in the session on phase methodologies).
  dl-001 D1 names the slots `inception`, `specification`, `release`, `operations`; D4 named
  `inception`, `specification`, `delivery`, `end-of-life`. The slots are those of D4 plus `release`:
  - `release` is the planning and publication of one release: scope, backlog, submission, tag and
    publication. It sits above the methodology's cadence (a Scrum sprint, a Kanban replenishment),
    so the methodology's `delivery` includes it at its own release cadence rather than replacing it.
    This gives release planning a slot that a phase pack can fill with a named method, as
    `lean-inception` fills `inception`.
  - `base`'s default `release` is minimal: scope recorded and approved, then tag and publication.
    It names no methodology, and says so.
  - The axis `phase/<slot>` of dl-001 D1 therefore takes the slots `inception`, `specification`,
    `release`, `end-of-life`. `delivery` is not a `phase/` slot: the `methodology` axis fills it.
  - `operations` is not a slot in 0.x; see Execution Notes.

Configuration changes this decision implies. Each is applied after approval and bumps `version:`:
- `pack-authoring`:
  - the foundation rule (`requires: base@^<major>`, add or tighten);
  - the slot rule, with the slot list of D11;
  - AGENTS.md R1;
  - the install folder, following WingFoil dl-138 Q3: `built-in/` today, `remote/` if ratified.

## Execution Notes

- spec-001 must define:
  - the merge of Memory state machines across fragments (the add-or-tighten rule);
  - `requires` with ranges;
  - the slot-replacement rule;
  - the `{{parameter}}` syntax;
  - the `agents_section` contribution;
  - the slot list of D11, and how a methodology's `delivery` includes `release` and
    `retrospective`.
- D11, open: dl-001's `operations` slot (running the product after release: incidents, support,
  maintenance) has no default, no pack in the first scope and no counterpart in any governed
  repository. It is either a later slot or part of `stage/production` and `stage/maintenance`. To be
  ruled before spec-001 fixes the slot list.
- D11, related: declaring which method a phase follows is a WingFoil format question, recorded in
  the feedback notes (T16), not here.
- Amended on 2026-10-06 while `pending` (D4, D11), under plan-009, before the approver's ruling.
- 2026-10-10: `docs/notes/base-regeneration-inputs.md`, cited in Context and D2, was removed
  (plan-022). Its inputs for `base`'s charter are in dl-015-conventions-the-base-pack-fixes-across-the-governed-repositories-names-states-ids-paths-and-the-agent (per-type paths,
  `paths.governance`, the bug state `fixed`, the agent name, and the naming points of the governed
  repositories); the `{release}`/`{scope}` tokens are in spec-001 §8.3, the `service` clash in
  `06_features.md` F4.6, and the `format:` key in spec-001 §5.
