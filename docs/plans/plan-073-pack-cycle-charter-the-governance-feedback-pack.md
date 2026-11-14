---
id: plan-073-pack-cycle-charter-the-governance-feedback-pack
type: plan
title: "pack-cycle charter: the governance/feedback pack"
status: done
workflow: "pack-cycle"
phase: "charter"
tags: ["packs","feedback","governance","W10"]
---


## Context

The `charter` phase of `pack-cycle` (v7) for `governance/feedback`, feature F4.9, which dl-012
(approved on 2026-11-12) defines. It is the second of W10's remaining features in the order the
approver set on 2026-11-12 and 2026-11-13 (sequencer 1.7, "W10's order"): the presets (done,
plan-070), `governance/feedback`, `governance/wingfoil-dogfood`, a pack release round, this
repository's adoption, the periodic retrospective. `governance/wingfoil-dogfood` comes after it
because it becomes an upstream pack that requires this one (dl-012 D3).

**Why now.** The presets are published (plan-070); the vision documents carry F4.9 in W10
(plan-071: features 1.7, sequencer 1.7, MVP canvas 1.5); no row of `docs/owed-items.md` blocks a
charter. The W10 "Ends with" asks for `governance/feedback` published.

**What this plan produces:** the charter `pack-governance-feedback`, `accepted`, with dl-012 D1 …
D5 as its scope and acceptance, the run on the engine of dl-032 E2 recorded here, and the open
questions the `design` phase answers (dl-012 D8) listed in the charter. The `design` phase is
**required** for this pack (dl-012 D7, D8): a tech-spec, the next plan; no task is opened before it.

**Hosting,** the two deviations plan-041, plan-047 and plan-056 accepted, for the same reasons:
`sw-life-cycle` › `pack-delivery` iterates over packs already `accepted`, while `charter` creates
and accepts one (the row "`pack-delivery`'s selection over `accepted` packs"); and no workflow
engine runs this repository's plans (it pins WingFoil 0.2.2 until the adoption). The plan runs on
branch `pack/governance-feedback-charter`, from `main` at the commit that submits it. It is the
first charter of a `governance` pack, the first non-foundation pack that does not require
`software`, and the first that carries a conditional entry (`with: software@^1`, spec-001 §6.5).

**Preconditions, met.** `base` 2.0.1, `software` 1.0.0, `methodology/scrum` 1.0.0 and
`methodology/kanban` 1.0.0 published, their charters `active`; spec-001 and spec-002 with the
format-2 readings folded back (plan-066, plan-067; no erratum open for them, dl-020); the
conditional part, its isolation rule and its lint (spec-001 §6.5, task-085, task-087);
`check:runs` and its scenarios under `tests/fixtures/runs/`; `tests/feedback-note.test.ts` and
`tests/wingfoil-feedback.test.ts` (FA-8's checks to factor); `compat.yaml` listing WingFoil 0.3.0
… 0.3.2, 0.3.2 the newest.

**`main`'s CI before this plan** (dl-038 C3): plan-071's close and plan-072's dl-020 note, pushed
as `671ddf37`; its CI run 43608497488, read and recorded in the Execution Notes before `submit`.
The run before it, on plan-071's merge `ccb35be3`, is 43460500399, `success`.

**Inputs the session reads first.**
- dl-012 (D1 … D8, its Execution Notes); `pack-cycle.yaml` v7 (the `charter` phase, dl-032 E2,
  dl-037 E1 and E2); dl-017 … dl-020; dl-022 (S2 … S5); dl-032, dl-033, dl-037; dl-011 D4 and
  AC-10, dl-013 (the shared design questions); WingFoil's dl-163 as this repository applies it.
- The model charters: `pack-methodology-kanban` and `pack-methodology-scrum` (sections, Adaptations,
  Adoption, Acceptance, Open points), with plan-056 and plan-047 and their Execution Notes.
- spec-001 §3, §6.3 … §6.5, §7.1, §7.4, §7.5, §8, §10, §12, §18; spec-002 §2 (README, CB-1 …
  CB-6, examples as fixtures §2.4).
- `base`'s fragments and workflows (`retrospective`, `governance-evolution`,
  `decision-log-ingest`), `software`'s `bug-ingest`; the directives `pack-authoring`, `pack-semver`,
  `pack-compatibility`, `traceability`, `repository-practice`, `wingfoil-cli`.
- The names in use: WingFoil 0.3.2's built-in directives and workflows and the `custom/` files its
  `init` templates write; this repository's `custom/` files; WingFoil Benchmark's, read at a commit
  recorded here.

## Proposed outline (ruled by the approver before `submit`)

1. **Identity and compatibility.** Catalog id `governance/feedback` (the name dl-012 D1 left to the
   approver, confirmed here), `axis: governance`, `name: feedback`,
   `pack_path: packs/governance/feedback`, element `pack-governance-feedback`;
   `requires: [base@^2]`, `conflicts: []`, `requires_capabilities: [workflow-engine]`; one
   conditional entry `with: software@^1`. **`pack.yaml` format 1**, which allows exactly that one
   entry for a pack that does not require `software` (spec-001 §6.5); format 2 only if the design
   phase needs a second entry. The v0.3 formats by kind, 0.3.0 the oldest release of the matrix,
   the range computed from `compat.yaml`, never written. The pack enters the official catalog
   with a maintained line (dl-001 D7, dl-012 D6): the approver confirms the commitment here.
2. **Scope: dl-012 D1 … D5 as approved.** The Memory type `feedback` and its template; a capture
   workflow `feedback-ingest` (capture → triage gate); a review workflow `feedback-review`,
   startable on its own at the project's cadence; a directive `feedback`, bound to `facilitator`
   in a `roles.yaml` fragment (point 8); README and CHANGELOG; the entry with `software` carrying
   the `bug` route. No executable logic, no methodology named. Every `include` reaches a
   `kind: sub`, so `feedback-review`'s pass per item needs a **third workflow** dl-012 D1 does not
   list, a sub with `element: feedback` (proposed `feedback-item`): the engine's shape, ruled by
   the approver (dl-019). Every name the pack ships (`feedback`, `feedback-ingest`,
   `feedback-review`, `feedback-item`, the entry's file, proposed `feedback-bug-route`) is checked
   in step 1 against the names in use (Inputs), bug-007's pattern.
3. **The type `feedback`, its states and fields** (dl-012 D1, D2). States
   `[draft, pending, triaged, closed]`, gate `pending: { reject: draft }`; `draft → pending` by
   `submit` (facilitator), `pending → triaged` by `approve` (approver: the triage), `triaged →
   closed` by `submit` (facilitator), `memory deprecate` for an item captured by mistake.
   `kind`, `target`, `source` and `context` in `template.frontmatter.required` (FA-3), as
   dl-012 asks. `outcome` and `resulting`, set later, are **proposed optional** (dl-012 requires
   neither): the directive says when each is set; FA-6 [E] catches a `closed` item without
   `resulting`, and a check of `outcome` on a `closed` item joins the fixture-element tooling task
   (point 9). The alternative, both required with `not_applicable_allowed` (as
   `kanban`'s `release`), makes the capture write a placeholder; step 2 tests at which verbs
   WingFoil 0.3.2 checks required fields (`submit` only, or `approve` too) before the approver
   chooses. **Who writes `outcome`:** proposed, the facilitator writes the classification and the
   proposed outcome before the triage, and the approver's `approve` confirms it or a `reject`
   sends it back to `draft` (dl-012 D1: "classification confirmed and outcome decided").
   Defaults proposed: path `docs/memory/feedback/{id}.md`, id pattern `feedback-{n}-{slug}`, both
   parameters.
4. **Value lists: the design phase's.** The default lists of dl-012 D2 (`kind`, `target`,
   `outcome`) are the charter's text; how a pack declares a configurable list and who checks a
   value, and how the `outcome` default drops `bug` without `software` while fragments are never
   conditional (spec-001 §6.5) and a parameter has one declaration and one default (§8.1), are
   design questions (dl-012 D8).
   Until then the run's draft holds them as plain `string` fields, the lists in the directive,
   unchecked by the engine.
5. **Routing** (dl-012 D3). `feedback-review` iterates over the `triaged` items (`iterate_over:
   feedback`, `where: { status: [triaged] }`, `include: feedback-item`), one pass per item: route,
   then close. Routes: `decision-log` (`decision-log-ingest`; a governance change through
   `governance-evolution`), `task` (a `task` in `draft`, cited back), `upstream-note` (an upstream
   pack's channel), `declined` and `duplicate` (closed with the reason), any other outcome to a
   decision-log naming it. The targets are `kind: main` workflows, which no step can `include`: a
   route adds the target element (`memory.add`) and cites it, or leaves the target workflow to be
   started on its own; step 2's run settles which. **The `bug` route** lives only in the entry: no
   unconditional file names `bug-ingest` or the `bug` type (isolation, spec-001 §6.5; the lint
   checks `include`, `element`, `iterate_over` and the directive ids of `roles.yaml`, the review
   checks action strings, `where` values and directive text), so `feedback-item` cannot route an
   item whose `outcome` is `bug`. Two candidates for step 2 and the approver: (a) the entry ships
   its own main workflow (`feedback-bug-route`) selecting `outcome: bug` (with a sub of its own in
   the entry if it iterates, both names in step 1's check and its main in `check:runs`, point 10),
   and `feedback-review`'s `where` leaves those items out: the packs' `where`s only list values
   (step 2 tests whether one can leave a value out); if not, leaving one out means listing the
   others, which a scalar parameter cannot hold (§8.1) and which drops outcomes a project adds
   (dl-012 D3), unless the run finds another way; (b) the route is the entry's directive alone, the
   facilitator closing the item by hand once the bug exists. Either way the charter states how a bug
   item avoids staying on the review's frontier.
6. **Upstreams** (dl-012 D3): the charter states the commitment (an upstream pack `requires` this
   one and ships its channel; the mapping of kinds, `observation` to `request` for WingFoil);
   how a channel is declared is the design phase's (D8). `governance/wingfoil-dogfood`'s charter
   as an upstream pack is W10's next plan, not this one.
7. **Roles:** no new role. `facilitator` captures and closes, `approver` triages (`base`'s); the
   agent captures as facilitator and never approves. The `approver`'s gate is the triage.
   `base`'s `retrospective` is unchanged: its exploration reads open feedback through the
   `feedback` directive bound to `facilitator` (dl-012 D3).
8. **Directive, parameters, AGENTS.md section.** The `feedback` directive as dl-012 D1 lists it
   (what counts as feedback, required fields, classification rules, routing table, the trace both
   ways, who closes). A `roles.yaml` fragment binds it: `assignments: { facilitator: [feedback]
   }`, the unconditional directive only (spec-001 §7.4, §6.5). Parameters: the path, the id
   pattern, and the value lists as the design phase shapes them; nothing else until needed.
   AGENTS.md section level 2, `## Feedback`: capture with source and context, triage only by the
   approver, routing through the governance. Being composed whether or not the entry is, it may
   name the entry's directive as present only with `software` (spec-001 §10); whether that is how
   the directive reaches an agent is D8's question (shared with dl-011).
9. **The design phase and the shared tooling** (dl-012 D7, D8): the charter's Open points list
   D8's four questions; the next plan is the `design` phase, one tech-spec answering them for
   dl-012 and dl-013 (or an amendment of spec-001 through it); the fixture-element checks are a
   tooling task (`pack: ""`, `tooling-change`) before the first `author` task that needs them.
   Both get their row in `docs/owed-items.md` at this plan's close (rule 4).
10. **Acceptance and exit criterion.** The charter's Acceptance is FA-1 … FA-8 with their checkers
    ([V], [E], [A]); fixtures under `tests/fixtures/examples/feedback/<example>/`, README examples
    of fictional projects only (spec-002 §2.4); FA-1's fixture packs for `team-mode/agent-first`
    and a blueprint until W11 and W12 publish them (not needed by step 2: the pack fills no slot).
    `author`'s exit criterion includes, per dl-032 E4, a run of both workflows through every route
    at least once, with and without `software`; `check:runs` scenarios starting every main the
    pack ships (`feedback-ingest`, `feedback-review`, and the entry's if point 5 gives it one) on
    the oldest and the newest release (dl-032 E3);
    every composition validated with no warning on every compatible release. The adoption run of
    dl-032 E3, once per `init` template if the README gives install steps, is `first-release`'s,
    prepared by `author` (as plan-056's point 10); CB-1 … CB-6 at the first tag. The proposed tasks
    are dl-012 D7's seven.
11. **Adoption:** the procedure for any project (fresh, or one with feedback kept elsewhere), and
    this repository's, which is W10's adoption plan with dl-012 D6's knock-ons, not this
    charter's. dl-011 D4 (guided-init proposing the pack) is recorded as a commitment, W16's.
12. **No feedback note** to WingFoil for this charter or the publication (dl-021 R1); a schema
    change the design phase makes still produces one (`wingfoil-cli` rule 8).

## The approver's rulings

Given on 2026-11-14, in chat: the outline is approved as recommended. Points 1 … 12 stand as
written: the name `governance/feedback` and the maintained line confirmed (point 1); the third
workflow `feedback-item` (point 2); `outcome` and `resulting` optional, the facilitator proposing
the outcome and the approver's triage confirming it (point 3); the `bug` route's candidates (a)
and (b) left to step 2's run and a ruling then (point 5).

## Steps

On branch `pack/governance-feedback-charter`; one commit per step that writes. Before every
commit, the privacy check (`repository-practice` rule 2).

1. **Reads** (product-owner). The inputs above; the names check of point 2 (Benchmark at a
   recorded commit). Findings that change a point go to the approver before step 2.
2. **The run on the engine** (dl-032 E2, dl-037 E1 and E2; architect for the draft). A draft of
   the pack as an overlay in a directory of its own under `tests/fixtures/`, untracked, never
   committed (plan-047's and plan-056's precedent): the type, both workflows, the directive, the
   entry with its route. `npm run validate -- --overlay <draft>` with no warning on every release
   from 0.3.0, composed with `base` alone, with `software` and `methodology/kanban`, and with
   `software` and `methodology/scrum`. Then, in a scratch repository outside this one, on WingFoil
   0.3.2: `feedback-ingest` driven for at least three items (one rejected back to `draft` and
   resubmitted, one deprecated); `feedback-review` with two `triaged` candidates driven to
   `closed` through different routes, an item joining the `where` while the review runs and one
   leaving it; every route at least once (`decision-log`, `task`, `declined`, `duplicate`, and
   `bug` in the first scratch repository, composed with `software` and `methodology/kanban`; a
   would-be bug in a second one, `base` and the pack alone); at which verbs required fields are
   checked (point 3); whether a `where` can leave a value out (point 5); whether 0.3.2 evaluates a
   workflow's `checks` strings (D8). Recorded here with commands and exit codes, no local or
   scratch path. Its findings settle points 2 … 5 with the approver, and feed the design
   questions (dl-019, dl-037 E1).
3. **The charter** (product-owner). `npm run -s wingfoil -- memory add --type pack --title
   Feedback --set axis=governance --set name=feedback` (check the printed id:
   `pack-governance-feedback`); `pack_path` filled by editing the draft (W-02). Its sections as
   `pack-methodology-kanban`'s (Purpose; Ships; Adaptations; Commitments to adopters; Adoption;
   Out of scope; Compatibility; Acceptance; Open points), step 2 cited.
4. **Independent review** of the charter by a subagent (dl-017), amended while `draft`; a
   re-review when a fix changes a ruling. Then `memory submit` (`draft → proposed`); a later
   finding becomes an amendment while `proposed` (dl-037 E1).
5. **The approver's gate.** The approver accepts the charter (`proposed → accepted`) with
   `npm run -s wingfoil -- memory approve pack-governance-feedback --reason "…"`, run by the
   approver (the command given in full), or sends it back.
6. **Branch close.** The branch is text-only (the charter, this plan's notes): its CI on the
   frozen commit, the job durations recorded (dl-039 R3); `npm run -s wingfoil -- workflow list`
   exit 0; `git diff main --stat` naming only the charter and this plan; the privacy check of the
   branch's diff recorded. On the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI
   read; the branch removed. The rows of point 9 and any item left owed added to
   `docs/owed-items.md` (rule 4). `active → done`; the close's CI left to the next plan.

**Not in this plan:** the `design` tech-spec (the next plan), the fixture-element tooling task, the
pack's tasks, its first release, `governance/wingfoil-dogfood`, the pack release round, this
repository's adoption and pin, dl-011 and dl-013's packs.

## Handoff

- **claude (drafting for the product-owner and the architect; facilitator):** steps 1 … 4 and 6,
  except the approvals and the merge OK. It never runs `memory approve` or `memory reject`. No
  pull request. Files staged by name; reviews by an independent subagent with no part in the text.
- **Approver:** this outline before `submit` (the name and the maintained line, point 1; points
  2 … 5: the third workflow `feedback-item`, the machine and fields, the `bug` route); any
  finding of steps 1 … 2 that changes a point; the charter's acceptance; the merge OK.
- **Start:** the approver rules this outline; the plan is then submitted (`draft → active`) and
  run, in this session or a new one.
- **Done when:** `pack-governance-feedback` is `accepted` on `main`, step 2's run recorded, its
  review applied, the owed rows added, the branch's privacy check recorded, the branch CI and
  `main`'s CI `success`. The plan then goes `active → done` (`memory submit`).

## Execution Notes

- 2026-11-14: written after plan-071's and plan-072's close; `workflow`, `phase` and `tags`
  filled by editing the draft (W-02). Next free numbers when written: plan-074, task-092,
  bug-017, dl-043.
- 2026-11-14: independent review: approve after amendments; no blocker, five should-fix, five
  nits, all applied: the third workflow, a sub per item (`feedback-item`, points 2 and 5); the
  `bug` route's isolation from the unconditional review, with two candidates (point 5); the
  `feedback` directive bound to `facilitator` in a `roles.yaml` fragment, `retrospective`
  unchanged (points 7, 8); `outcome` and `resulting` proposed optional, the verbs that check
  required fields tested in step 2, who writes `outcome` (point 3); dl-032 E3 moved to
  `first-release`, prepared by `author` (point 10); with the nits: FA-1's fixture packs, the
  methodology in step 2's composition, §8.1 for parameters, the AGENTS.md wording left open to
  D8, dl-037 E1 in step 4, step 5's command, the Start line, dl-043, "non-foundation". Points 2,
  3 and 5 change: re-review.
- 2026-11-14: re-review: approve after amendments; no blocker, three should-fix, three nits, all
  applied: points 2 … 5 named in the Handoff; the AGENTS.md section may name the entry's
  directive as present only with `software` (spec-001 §10, point 8); what the isolation lint
  checks and what the review checks (point 5); `outcome` on a `closed` item checked by the
  tooling task, FA-6 covering `resulting` (point 3); the `check:runs` scenarios kept in
  `author`'s exit criterion as plan-056's, every main counted (point 10); option (a)'s `where`
  and names (point 5). No ruling changes beyond the wording: no further re-review.
- 2026-11-14: final check of the re-review's fixes: approve after amendments, two should-fix and
  two nits, wording only, applied: option (a)'s one main in `check:runs`; the `where` claim left
  to step 2's test; the lint's checks named as `src/workflow-rules.ts` has them; `check:runs` on
  the oldest and the newest release. No rule changes.
- 2026-11-14: `main`'s CI before this plan (dl-038 C3): run 43608497488 on `671ddf37`,
  conclusion `success`, no annotation; jobs validate (22.21.0, 1) 11m05, (22.21.0, 2) 8m53,
  (22.12.0, 1) 11m13, (22.12.0, 2) 9m27 (dl-039 R3, under G12's 25 minutes).
- 2026-11-14: the approver's OK on the outline as recommended, in chat; recorded in "The
  approver's rulings". Submitted (`draft → active`).
