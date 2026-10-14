---
id: dl-022-the-scope-of-base-a-core-common-to-every-governed-project-and-a-software-foundation-layer
type: decision-log
title: "The scope of base: a core common to every governed project, and a software foundation layer"
status: draft
tags: ["packs","base","conventions"]
---

## Context

dl-003 made `base` the foundation under every other pack, from a comparison of the four governed
software repositories: WingFoil2, WingFoil2-Benchmark, WingFoil-UI and this repository. Its D2
puts in `base` the common Memory types, the capture workflows, the `sw-life-cycle` skeleton with
its slots, `retrospective`, the global directives, the DNA and roles fragments and the path and id
parameters. dl-015 lists the conventions `base`'s charter fixes, with the same four repositories as
its reference.

WingFoil also governs projects that are not software. On 2026-10-14, while `base`'s charter
(wave W8) was being prepared, the approver asked to compare them too. This session read the
`.wingfoil/` configurations of three private, non-software projects governed by WingFoil 0.2.2, and
how each governed repository, software or not, changes its own governance. The governed software
repositories were read at `wingfoil/wingfoil@32d8871b`, `wingfoil/wingfoil-ui@2458a459` and
`wingfoil/wingfoil-benchmark@89fa2d8e`.

**What the non-software projects use of dl-003 D2:**
- **Used, with the names `base` proposes:** `decision-log`, `task` and `plan`, with WingFoil2's
  decision-log states; `plan` adds a `parked` state. `decision-log-ingest` (capture, approve), a
  periodic retrospective whose approval phase has the role `approver`, the DNA fragments (the
  approver as a member, the agent without approval authority) and every path and id parameter.
- **Not used:** `adr` (declared, never instantiated), `tech-spec`, `bug`, `release`,
  `release-line`, `adr-ingest`, `bug-ingest`, the release id parameters and the `determinism`
  directive.
- **Harmful:** `sw-life-cycle` and its four slot defaults. None of the three has a life cycle;
  each runs a flat set of `main` workflows under Kanban.
- **Variants:** `traceability` names a chain specific to each project; claims are sourced by a
  directive of their own (URL and access date, `<repository>@<sha>:<path>`, inference kept apart
  from fact), where the software repositories have a command-centric `claim-evidence`.

Since a pack only adds to `base` or tightens it (dl-003 D1), every unused or harmful element would
be carried by every non-software project that adopts `base`.

**How the governed projects change their own governance:**
- the three non-software projects run a `governance-evolution` workflow: `assess` (a plan),
  `propose` (in the plan), `rule` (the approver; the ruling is a decision-log), `apply` (directly,
  by the facilitator);
- WingFoil2 and WingFoil-UI have no workflow for it: a retrospective point spins off a
  decision-log, the approver rules it, and a task (WingFoil2) or an ad-hoc plan (UI) applies it;
- WingFoil2-Benchmark records configuration defects as bugs, fixed by Kanban tasks;
- this repository rules with decision-logs and applies them through "dl actions" plans hosted
  under `decision-log-ingest › rule`, a phase that does not describe that work (plan-033's Context);
  tooling changes run through `tooling-change`.

Every project records the ruling as a decision-log, never as an `adr` or a change-proposal, and has
it ruled by the approver. They differ on whether the change is applied directly or through a task.

The question has to be answered before `base`'s charter, because the charter fixes what `base`
ships and W8's exit criterion fixes the repositories it validates against.

## Options

**1. Which projects `base` serves.**
- (a) Software projects only, as dl-003 assumes. Non-software projects either carry the software
  elements or do not adopt `base`.
- (b) Every project governed by WingFoil. `base` holds only what all of them use; the software
  elements move to a layer above it.

**2. Where the software elements go, under 1(b).**
- (a) **A second foundation pack**, composed right after `base` and required by every pack that
  needs the software elements.
- (b) **A blueprint** (`blueprint/software`). Blueprints are composed after the methodology and the
  phase packs (spec-001 §7.1), so a phase pack would replace a slot default that is not composed
  yet, and a methodology could not require it (a requirement on a later pack is an error).
- (c) **Inside each methodology.** This is dl-003's option 2, rejected for the same reason: the
  content would be duplicated across methodologies.

**3. How a project changes its own governance, in `base`.**
- (a) Nothing in `base`; each project keeps its own way.
- (b) A `governance-evolution` workflow in `base`, written with `base`'s types only.

## Decision

Ruled by the approver, Roberto Pompermaier, in chat on 2026-10-14, on the proposal built from the
comparison: **1(b), 2(a), 3(b)**, with two changes to the proposal: `adr` and `adr-ingest` move to
the software layer ("come consigli ma muovi adr e adr-ingest nel livello software"), and
`governance-evolution` is in `base`, because every WingFoil project needs it sooner or later. The
points below take effect when this element is approved.

- **S1 — `base` serves every project governed by WingFoil**, software or not. It holds only what
  all of them use.
- **S2 — What `base` holds** (replaces dl-003 D2):
  - the Memory types `decision-log`, `task` and `plan`, with WingFoil2's state names where they
    exist; `plan` includes `parked`, whose place in the machine the charter fixes;
  - the workflows `decision-log-ingest`, `retrospective` and `governance-evolution` (S4);
  - the global directives, written as real rules: `traceability` as a generic rule (each project
    or pack names its own chain), `doc-versioning`, `security-secrets`, and a generic rule on the
    sources of claims, which the software layer and other packs tighten with directives of their
    own;
  - the DNA and roles fragments: the approver as a member, the agent without approval authority;
  - the parameters `project_name`, one path per Memory type, `plan_id` and `agent_name`.

  The exact states, directive ids and parameters are fixed by the charter. A directive id must not
  equal a WingFoil built-in's (spec-001 §7.6).
- **S3 — A software foundation layer**, a second pack of the foundation, named `software` unless
  its charter names it otherwise:
  - composed right after `base`, outside the axes; it requires `base@^<major>`;
  - it holds the Memory types `adr`, `tech-spec`, `bug`, `release` and `release-line`; the
    workflows `adr-ingest`, `bug-ingest` and `sw-life-cycle` with its slots and their defaults
    (dl-003 D4 and D11, unchanged in content); the `determinism` directive; and the release id
    parameters;
  - every phase pack requires it, and so does every pack that uses its types or workflows. Whether
    a methodology always requires it, and whether the `methodology` axis stays required for a
    composition without it, are ruled by the spec-001 amendment that follows this decision (the
    non-software projects run Kanban without a life cycle).
- **S4 — `governance-evolution` in `base`:** `kind: main`, only the keys of the WingFoil workflow
  format, no `waiting` state:
  1. **assess** (facilitator): a plan, made `active`; its inputs are Execution Notes,
     retrospective points, feedback notes and the approver's requests;
  2. **propose** (facilitator): a decision-log, submitted for discussion, that says what changes in
     `.wingfoil/`, `AGENTS.md`, the roles and the Memory types, and why;
  3. **approve** (approver): the decision-log is ruled; a rejection goes back to `propose`;
  4. **apply** (facilitator): the change is applied, CLI verbs first, with version bumps and
     `AGENTS.md` updated; it produces `.wingfoil/**` and `AGENTS.md`, and the plan goes `done`. A
     change too large for one session becomes tasks, run through the methodology's delivery.

  Rules around it:
  - `retrospective` signals the points that change governance and starts `governance-evolution`
    for each; it does not rule them itself;
  - `decision-log-ingest` stays for decisions that change no governance;
  - other packs tighten it with directives: the software layer can require an `adr` or a tech-spec
    amendment for an architectural change, and application only through a task with CI and a
    reviewer;
  - changes that other repositories must also make are out of scope.
- **S5 — Not in `base` or in the software layer**, recorded as proposals for later elements and
  outside milestone M2:
  - a blueprint for coordination and editorial projects: request intake, inbox triage, decision
    hand-off, cross-repository requests, and their directives on sessions and messaging;
  - a `governance`-axis pack for anonymous projects;
  - the Kanban work rules belong to `methodology/kanban`; the WingFoil CLI rules and the feedback
    inbox stay in `governance/wingfoil-dogfood` (dl-003 D6, unchanged).
- **S6 — Validation** (amends W8's exit criterion): `base` validates with the parameters of every
  governed project, the software repositories and the non-software ones; `software` validates with
  those of the four governed software repositories. The non-software projects are private, so their
  parameters are not recorded in this repository: the tests use a generic non-software fixture,
  and the check against the real projects runs outside this repository and records only its
  outcome.

Amendments of approved elements, effective with this approval:
- **dl-003:** D2 is replaced by S2 and S3. D4 and D11 stand, with `software` in place of `base` as
  the pack that ships `sw-life-cycle` and the slot defaults. D5 gains "the software life cycle and
  the software Memory types, which belong to `software`". D1 stands, and also applies to `software`
  for the packs that require it.
- **dl-004 1(a):** `foundation` is the `axis` value of both foundation packs' elements:
  `pack-foundation-base` and `pack-foundation-software`.
- **dl-015** (pending): its points split between the two charters. C1 (decision-log), C3, C4 and
  C7–C11 go to `base`'s; C1 (adr and tech-spec), C2, C5 and C6 go to `software`'s. dl-015 is ruled
  with both charters.

Changes this decision implies, each applied later through its own element:
- **spec-001**, in the amendment that dl-021 and dl-020 already require before W8: §3 (two
  foundation packs), §6.2 and §6.3 (requirements on `software`), §7.1 (`software` composed after
  `base`), §7.5 (`defaults` still `base`'s only), §9 (slot defaults shipped by `software`), §11
  (`catalog.yaml`'s `foundation`), §18 (`sw-life-cycle` only from `software`, `retrospective` and
  `governance-evolution` only from `base`), and S3's open points;
- **`catalog.yaml`** and its schema: `foundation` names both packs, and the slots' `default` names
  `software`; the schema change also produces a feedback note (`wingfoil-cli` rule 8);
- **the tooling:** the composer's order and the lint rules on the foundation (spec-001 §18);
- **vision:** `06_features.md` F4.1 (and a feature for `software`), `07_sequencer.md` W8 (its
  scope holds both foundation packs, and S6's criterion);
- **configuration:** `pack-authoring` (the foundation rule and the slot rule name `software`);
- **this repository's adoption** (dl-003 D10): its "dl actions" plans move to
  `governance-evolution`, whose boundary with `tooling-change` is one plan of `governance-evolution`
  with a tooling task for the code part.

## Execution Notes

- Captured 2026-10-14 under plan-037, on the approver's request in chat.
