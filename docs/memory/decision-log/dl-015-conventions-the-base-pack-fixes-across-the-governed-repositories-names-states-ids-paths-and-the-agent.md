---
id: dl-015-conventions-the-base-pack-fixes-across-the-governed-repositories-names-states-ids-paths-and-the-agent
type: decision-log
title: "Conventions the base pack fixes across the governed repositories: names, states, ids, paths and the agent"
status: pending
tags: ["packs","base","conventions"]
---

## Context

`base` exists so that every governed repository runs the same steps under the same names (dl-003).
dl-003 D2 lists what it holds and says that "the exact types, states and parameters are fixed by
spec-001 and by the `base` charter". The charter is written in M2 (W8), after the WingFoil v0.3
formats are final. Until then the inputs for those choices have no Memory element:

- **The review of the first attempt's `base` 0.1.0** (2026-10-05). It was kept in the working note
  `docs/notes/base-regeneration-inputs.md` §2, which dl-003 D2 cites and which is removed with this
  capture (plan-022). Part of it is already recorded elsewhere: the `{release}` and `{scope}` tokens
  (spec-001 §8.3), the `service` name clash (`06_features.md` F4.6), no `waiting` states in 0.x
  (dl-003 D3), the AGENTS.md markers (dl-003 D8, F-014), and the `format:` key of the note's §1
  (spec-001 §5, O4, O11). The rest is below.
- **Eight naming points relayed on 2026-10-09** by the session bootstrapping a new consumer project
  on WingFoil 0.2.2 (Kanban). That project aligns with `base` before `base` exists, so that adopting
  it later is a replacement of files; where the governed repositories diverge it had to choose. Its
  choices are **provisional** until this decision-log is ruled.

The governed repositories meant below are WingFoil2, WingFoil-UI, WingFoil2-Benchmark and this
repository (dl-003). Every value of a governed repository is to be re-read from its own
configuration at the charter; the values here are those observed when the inputs were recorded.

## Options

- **(a) Rule the conventions now.** For: consumers that align early get final names. Against: the
  v0.3 formats may still change states and phases; the charter is the element that fixes them
  (dl-003 D2).
- **(b) Capture them now as proposals, rule them with `base`'s charter.** For: every input is in one
  tracked element, visible to every session and consumer; the ruling happens with the final
  formats. Against: early adopters keep provisional choices for a while.
- **(c) No element: the charter collects the inputs when it is written.** Against: the inputs live
  in an untracked note and in another repository, which this repository's texts cannot cite.

## Decision

**Proposed: option (b)**, captured on 2026-10-10 with plan-022. The ruling is expected with `base`'s
charter (W8); each point below becomes an input of that charter, and the charter may refine it.

| # | Convention | Governed repositories | This repository today | Consumer's provisional choice | Proposal |
|---|---|---|---|---|---|
| C1 | States of `decision-log`, `adr`, `tech-spec` | WingFoil2: decision-log `draft → in-discussion → ready`; adr `draft → pending → accepted → superseded`; tech-spec `draft → pending → approved → superseded` | the default machine `draft → pending → approved` | WingFoil2's | WingFoil2's names, as dl-003 D2 already asks ("WingFoil2's state names where they exist") |
| C2 | States of `bug` | WingFoil2: `draft → open → triaged → planned → in-progress → in-review → resolved → closed`; Benchmark adds `fixed` | the default machine | WingFoil2's | WingFoil2's chain; Benchmark's `fixed` maps onto `resolved` unless the charter finds a distinct meaning |
| C3 | Second phase of `decision-log-ingest` | `approve` (WingFoil2) | `rule` | `approve` | `approve`: the phase name matches its action (`memory.approve`) |
| C4 | Approval phase of `retrospective` | role `approver` (WingFoil2, UI) | role `product-owner` with the approver's gate | role `approver` | role `approver`: the phase is the approval itself |
| C5 | Phases of `base`'s default `release` slot (dl-003 D11: minimal, names no methodology) | not named | none (no `release` slot yet) | `pre-release-checks`, `approve-release`, `tag`, `publish`, `mark-released` | these five; `approve-release` is the approver's gate on the recorded scope |
| C6 | `release` and `release-line` types, and their ids | ids diverge: `{kind}-{version}`, `rel-{slug}`, `rl-{n}`, `rl-{version}` | none: removed, every pack is released on its own (`memory.yaml`) | `rl-{line}`, `{line}-v{version}` (two lines) | `base` ships both, since its `release` slot records a release; id patterns are parameters with defaults `rl-{line}` and `{line}-v{version}`, which cover several lines |
| C7 | `plan` id | `plan-{n}-{slug}` (Benchmark, this repository); `{workflow}-{phase}-plan` (WingFoil2, UI) | `plan-{n}-{slug}` | `plan-{n}-{slug}` | a parameter, default `plan-{n}-{slug}`; WingFoil2 and UI set their own |
| C8 | Directives of the `facilitator` role (`roles.yaml`) | none (WingFoil2, UI); `traceability` (Benchmark, this repository) | `traceability` | `traceability` | `traceability`, which `base` ships as a generic directive |
| C9 | The agent in `dna.yaml` `team.agents` | "AI agent (Claude/Cursor/etc.)" (WingFoil2, UI); "Claude Code" (Benchmark); `claude` (this repository) | `claude` | `claude-code` | a parameter `agent_name` with a generic default, never an agent product in pack content (`pack-authoring`); the four governed repositories agree one value at adoption, and align `executes_as` |
| C10 | Memory paths | one path per type: WingFoil2 and UI use `docs/04_memory/design/adrs`, `…/design/dls`, `…/design/specs`, `…/bugs`, tasks under `{release}`, plans under `docs/05_plans/{scope}/` | `docs/memory/<type>/{id}.md`, `docs/plans/{id}.md` | — | one `path` parameter per type, each with a default like this repository's; the `{release}` and `{scope}` tokens pass through (spec-001 §8.3). A single `{{memory_root}}/<type>/` (0.1.0) does not cover WingFoil2 and UI |
| C11 | Meaning of `dna.yaml` `paths.governance` | `['.wingfoil/']` (WingFoil2, UI) | Memory, plans, retrospectives, feedback inbox, licence; `config` holds `.wingfoil` | — | governance = Memory and plans, `config` = `.wingfoil/`, as here; the charter first checks what reads `paths.governance` in WingFoil |

Consequences:
- `base`'s charter takes C1–C11 as inputs and records, for each, the ruling or the refinement.
- A consumer that aligns with `base` before it is published treats its choices as provisional;
  where it chose differently from the ruling, adopting `base` is not a plain replacement of files.
  Today the consumer differs from the proposals only where the proposal is a parameter (C9).
- **This repository** changes at its own adoption of `base` (dl-003 D10): C1, C2 (its states), C3
  (`rule` → `approve`), C4 (the retrospective's role), C6 (unused `release` types arrive), and C9
  if the agreed agent name differs. Its adoption plan lists them.
- Configuration changes now: none.

## Execution Notes

- Captured 2026-10-10 under plan-022, on the approver's request in chat; no implementation.
- Sources: the working note's §2 (removed in the same change; its §1 and §3 were already recorded
  or superseded, see Context) and the consumer session's relay of 2026-10-09.
- Related: dl-011, dl-012 and dl-013 (pending) assume `base`'s state names (`pending`) and roles
  (facilitator, approver) in their types and phases; at their ruling they follow this decision-log's
  outcome.
