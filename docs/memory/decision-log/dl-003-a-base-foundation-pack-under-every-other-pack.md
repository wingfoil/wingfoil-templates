---
id: dl-003-a-base-foundation-pack-under-every-other-pack
type: decision-log
title: "A base foundation pack under every other pack"
status: pending
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
- **D4 — Slots.** `sw-life-cycle` includes `inception`, `specification`, `delivery` and `end-of-life`
  by name.
  - `base` ships defaults for `inception`, `specification` and `end-of-life`.
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

Configuration changes this decision implies. Each is applied after approval and bumps `version:`:
- `pack-authoring`:
  - the foundation rule (`requires: base@^<major>`, add or tighten);
  - the slot rule;
  - AGENTS.md R1;
  - the install folder, following WingFoil dl-138 Q3: `built-in/` today, `remote/` if ratified.

## Execution Notes

- spec-001 must define:
  - the merge of Memory state machines across fragments (the add-or-tighten rule);
  - `requires` with ranges;
  - the slot-replacement rule;
  - the `{{parameter}}` syntax;
  - the `agents_section` contribution.
