---
id: dl-023-the-foundation-s-plan-without-parked-and-the-approver-and-agent-identity-in-base-s-dna
type: decision-log
title: "The foundation's plan without parked, and the approver and agent identity in base's DNA"
status: approved
tags: ["packs","base","dna","W8"]
---

## Context

dl-022 S2 fixes what `base` holds. Three of its points meet WingFoil 0.3.0's behaviour, read at
`wingfoil/wingfoil@v0.3.0` (`cc31d7a8`) while `base`'s charter was being prepared under plan-041
(wave W8):

- **`plan` includes `parked`, whose place in the machine the charter fixes.** The three private,
  non-software projects that use it have `[draft, active, parked, done]`, so every plan passes
  `parked` before `done` (each closed plan of theirs took three `submit`s). WingFoil 0.3.0's
  engine fixes the plan's machine instead: `workflow start` adds a plan and submits it
  `draft → active`; `workflow end` closes it `active → done` along a `waiting` edge; an instance is
  open only while its plan is `draft` or `active` (`OPEN_PLAN_STATUSES`). Its CHANGELOG asks a
  project that uses the engine for the `plan` type that `init` scaffolds, which is
  `[draft, active, done]` with `waiting: [active]`. A `parked` state anywhere in that sequence
  either sends a new plan to `parked` or puts `parked` on the path to `done`, and a parked plan is
  not an open instance.
  Whatever `base` decides is final for the packs above it, since a later pack cannot add
  `returns` at all, nor `waiting` on a state it did not insert (spec-001 §7.5).
- **"`agent_name` and an optional `agent_email`".** A parameter is optional only when it has a
  default (spec-001 §8.1), and substitution has no conditional, so an optional parameter with no
  value cannot write "no email". WingFoil 0.3.0 refuses an empty or reserved-domain agent email,
  and requires one on an agent with an `adapter`; a generic default address would be a project
  value or name a product (`pack-authoring`). For the same reason a generic default for the
  agent's name would be a project value or a product name, which supersedes dl-015 C9's proposal
  of a generic default.
- **"The approver as a member".** WingFoil 0.3.0 grants approval authority by matching the git
  user's email to the `email` of a `dna.yaml` `team.members[]` entry that holds the `approver` role
  (`resolveMemberRoles`). A member with a name and no email matches nobody, so every `approve` and
  `reject` would be refused. dl-022 S2's parameters name no value for the member at all.

The approver ruled on these points in chat on 2026-10-20, on plan-041's independent review and
re-review. This element records the rulings, which amend dl-022 S2.

## Options

**1. `parked` in `base`'s `plan`.**
- (a) WingFoil 0.3.0's `plan`, `[draft, active, done]` with `waiting: [active]`, and no `parked`
  until WingFoil's engine can suspend an instance.
- (b) `[draft, parked, active, done]` with `returns: {active: parked}`: parked by `memory park`,
  resumed by `submit`. Every new plan passes `parked`, `workflow start` leaves it there, and a
  parked plan is no open instance.
- (c) The non-software projects' `[draft, active, parked, done]`: every plan passes `parked`, and
  `workflow end` cannot close it.

**2. The agent's email.**
- (a) No parameter: `base`'s DNA fragment writes no email; a project whose agent has an `adapter`
  adds it to its own `dna.yaml`.
- (b) A required `agent_email`: every adopter must name an address, also without an adapter.

**3. The approver member.**
- (a) Two required parameters with no default, `approver_name` and `approver_email`.
- (b) No member in `base`: each project adds its approver by hand.

## Decision

Ruled by the approver, Roberto Pompermaier, in chat on 2026-10-20: **1(a), 2(a), 3(a)**. The points
take effect when this element is approved.

- **D1 — `plan`:** `[draft, active, done]` with `waiting: [active]`, and no `parked` state; this
  element fixes the machine, not the charter. `submit` can no longer close a plan. A plan that is
  an instance started by `workflow start` is closed by `workflow end`; a phase plan, which carries
  a non-empty `parent` (`<workflow>.<phase>`) so that WingFoil 0.3.0 does not deduce it as an
  instance, by a hand-written `wf(plan): finalize <id> [active → done]` commit, as WingFoil does.
  `parked` may return in a later version of `base` once WingFoil's engine can suspend an instance
  off the `submit` path; a feedback note asks WingFoil for that, and for a verb that closes a plan
  that is not an instance. A project that holds `parked` plans moves them back to `active` by a
  hand-written status commit made before the composed configuration is installed (no verb leaves
  `parked`, and the new machine has no such state), keeping their *Resume when* line and giving a
  phase plan its `parent`.
- **D2 — The agent:** `agent_name` is a required parameter with no default (superseding dl-015
  C9's generic default; dl-015's Execution Note records it under plan-041). There is no
  `agent_email` parameter: `base`'s DNA fragment writes no agent email, and a project whose agent
  has an `adapter` adds the email to its own `dna.yaml`.
- **D3 — The approver:** `approver_name` and `approver_email` are required parameters with no
  default, written into the `team.members[]` entry that holds the `approver` role.

Amendments, effective with this approval:
- **dl-022 S2:** "`plan` includes `parked`, whose place in the machine the charter fixes" is
  replaced by D1, and `plan`'s states are fixed here rather than by the charter; the parameters
  bullet reads "`project_name`, one path per Memory type, `plan_id`, `agent_name`, `approver_name`
  and `approver_email`" (D2, D3); "the approver as a member" gains D3's parameters.

Consequences:
- `base`'s charter (`pack-foundation-base`) writes D1–D3 into its machines, DNA fragment and
  parameters.
- Adopting `base` needs WingFoil 0.3.0 or later, the oldest release of its matrix. From its
  adoption (W9) this repository closes its plans with `workflow end` or the `finalize` commit, and
  its phase plans carry `parent`.
- dl-022 S6 holds: the generic non-software fixture gives `agent_name`, `approver_name` and
  `approver_email` generic, fictional values, and the real projects' values stay outside this
  repository.

## Execution Notes

- Captured 2026-10-20 under plan-041, which hosts it (its Context says why).
- 2026-10-20: independent review: approve after amendments, nothing blocking (the WingFoil 0.3.0
  claims verified at `v0.3.0`). Amended: dl-022 S2's parameters bullet, C9's default superseded,
  the migration of `parked` plans and the phase plan's `parent`, wording.
