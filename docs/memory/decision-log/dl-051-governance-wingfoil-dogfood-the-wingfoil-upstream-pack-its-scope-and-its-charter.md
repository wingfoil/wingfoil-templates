---
id: dl-051-governance-wingfoil-dogfood-the-wingfoil-upstream-pack-its-scope-and-its-charter
type: decision-log
title: "governance/wingfoil-dogfood: the WingFoil upstream pack, its scope and its charter"
status: draft
tags: ["packs","governance","dogfood","scope"]
---

## Context

Asked by the approver on 2026-11-24: open `governance/wingfoil-dogfood`'s charter through
`pack-ingest`, the next step of W10 in the sequencer 1.8 (the presets and `governance/feedback`
done, then this pack, then the pack release round, then this repository's adoption). This is the
first request started under `pack-ingest` (plan-082); dl-049, captured before the workflow existed,
joins it later (dl-050 D4).

What is already ruled about the pack:
- **dl-003 D6** puts the feedback channel to WingFoil outside `base`, in a `governance` pack for
  the repositories that dogfood WingFoil; **D7** adds it to the first scope.
- **dl-012 D3** makes it an upstream pack of `governance/feedback`: `requires: [base@^<major>,
  governance/feedback@^<major>]`; it ships the `wingfoil-cli` directive, the
  `docs/wingfoil-feedback/` README skeleton, the WingFoil channel and the known behaviours of the
  pinned CLI; rules 1 … 7 of `wingfoil-cli` and the dl-163 note format do not change. **dl-012 D6**
  lists the knock-on effects for this repository's adoption (`wingfoil-cli` moving from `custom/`
  to the pack, `tests/wingfoil-feedback.test.ts`'s path with it). **dl-012 D7** opens the charter
  "written as an upstream pack".
- **spec-003 §5** fixes how an upstream pack meets `governance/feedback`: a `feedback-channel`
  directive whose "Serves the target" line names `upstream:<name>`, one per target; the project
  adds `upstream:<name>` to `feedback_targets` as the pack's README says (§5.3); WingFoil's kinds
  map `observation` to `request` or leave it unrouted. FA-8's fixture upstream pack
  (`tests/fixtures/feedback-exit/`) is the pattern; spec-003 §5.3 names this charter as the one
  that "will" follow it.
- **F4.2** has its row in `docs/01_vision/06_features.md` and its place in W10 (the sequencer),
  so `pack-ingest` › `vision` has nothing to add for it.
- **The MVP canvas** names it among the packs the four governed software repositories adopt.

What is not ruled, and this decision-log asks: the pack's exact contents beyond dl-012 D3's list,
what in `wingfoil-cli` belongs to a project rather than to the pack, its parameters and
requirements, and the evidence its charter needs.

## Options

**The pack asked for** (dl-050 Q1 (a)): axis `governance`, name `wingfoil-dogfood` (catalog id
`governance/wingfoil-dogfood`, charter `pack-governance-wingfoil-dogfood`); purpose: the channel
from a project that uses WingFoil back to WingFoil, and the discipline of running its pinned CLI;
requires `base` and `governance/feedback` (dl-012 D3); conflicts with none known.

**How it meets the catalog's packs.** `base` and `software` stay free of any upstream (dl-022);
`governance/feedback` 1.0.0 owns the feedback element, its triage and its routes, and reads the
channel by its tag (spec-003 §5.2); this pack is its first real upstream, after FA-8's fixture. It
adds no methodology, no Memory type and no stage. This repository's own `wingfoil-cli` (custom,
1.6) and `docs/wingfoil-feedback/` are its source and its first user.

**Q1 — What the pack ships.**
- (a) dl-012 D3's list as one pack: the `wingfoil-cli` directive (rules 1 … 8, generalised), the
  `docs/wingfoil-feedback/` README skeleton (Rules, Ledger, Last sync), and the `feedback-channel`
  directive serving `upstream:wingfoil` (the mapping onto dl-163's kinds, the note's location and
  format, the citation of the feedback id).
- (b) The channel only, `wingfoil-cli` left to each project. Rejected: dl-012 D3 rules that
  `wingfoil-cli` is WingFoil-specific and belongs to this pack, not to a project or to `base`.

**Q2 — The known behaviours of the pinned CLI.** `wingfoil-cli`'s table (W-01 … W-14) is checked
against one version (0.2.2) and rewritten at every pin bump (rule 5).
- (a) The pack ships the rules and the table's form, and each project keeps its own entries for its
  own pin, in a project directive or file the README names; the pack's entries would go stale with
  each WingFoil release and each project's pin.
- (b) The pack ships the entries for the WingFoil releases its compatibility range lists, refreshed
  by a pack release at every WingFoil release. Each release of WingFoil would force one of the
  pack.
- (c) Both: the pack ships the entries of its range as a starting point, the project adds its own.

**Q3 — What is project-bound.** Today's text names this repository's things: `npm run -s
wingfoil -- …` (rule 1), the source key `svc-018` (rule 7), the dl-163 note ids `F-<nnn>` and the
`docs/wingfoil-feedback/` path.
- (a) Parameters with defaults (the CLI command, the service's source key, the inbox path), as
  `governance/feedback` 1.0.0 does for its paths and ids; the dl-163 format stays fixed (dl-012
  D3).
- (b) Fixed text, edited by each project after install. Rejected: a hand edit of a composed file
  is lost at the next compose.

**Q4 — Requirements.**
- (a) `requires: [base@^2, governance/feedback@^1]`, the current majors (catalog: `base` 2.0.1,
  `governance/feedback` 1.0.0); no `software`, since the channel and the CLI rules serve any
  WingFoil project, and an `npm` CLI command is a parameter's default (Q3), not a requirement.
- (b) `software` required as well, since the four adopters are software repositories. Rejected
  unless a rule needs a `software` element.

**Q5 — The evidence the charter needs** (pack-compatibility; dl-032 E2, E3; dl-037).
- The pack ships no workflow and fills no slot of a required pack's workflow, if Q1 (a) holds:
  then dl-032 E2's run before acceptance does not apply, and `governance/feedback`'s
  `upstream-note` route through this pack's channel is the run its exit criterion needs, by
  `check:runs` (a scenario reaching the route, as plan-074 step 2 did with the fixture).
- Its README carries install steps (adding `upstream:wingfoil` to `feedback_targets`), so the
  adoption run on a composition that holds it, once per init template (dl-032 E3).
- Presets: none changes (`classic-scrum`, `classic-kanban`); an optional pack, as
  `governance/feedback` is.
- Examples: one composition under `tests/fixtures/` with `base`, `software`, a methodology,
  `governance/feedback` and this pack, as the README's example.

**Q6 — Open questions for the charter** (not ruled here):
- the lint's and the tests' references to `wingfoil-cli`'s custom path, which the adoption moves
  (dl-012 D6);
- whether `wingfoil-cli` keeps its id once shipped by a pack (an id is unique in a composition);
- whether the WingFoil channel needs a `design` phase (a new mechanism) or only follows spec-003
  §5, as dl-012 D3 already describes it;
- the pack's name, kept as dl-003 D6 gave it unless the charter finds a reason.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **D1 — The pack is accepted**: `governance/wingfoil-dogfood`, as the pack asked for above. No
  pack of this request is refused or deferred (dl-048 P1).
- **D2 — Its scope** for the charter: Q1 (a), Q2 (a), Q3 (a), Q4 (a); the evidence of Q5; Q6's
  questions answered in the charter or in a `design` phase if one is needed.
- **D3 — The vision** (`pack-ingest` › `vision`): skipped, since F4.2 already has its row and its
  place in W10; said in the plan that carries this element's ruling.
- **D4 — The hand-off**: one `pack-cycle` charter plan for `pack-governance-wingfoil-dogfood`,
  next in W10's order, hosted as plan-073 was (`pack-delivery` selects `accepted` packs while
  `charter` creates a `draft` one; the owed row on that selection stays with W10). Its charter
  plan is the first step after this element's `rule`.
- **D5 — No change to this repository's process** now: `wingfoil-cli` stays in `custom/` until
  this repository's adoption (dl-012 D6), which follows the pack release round in W10.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
