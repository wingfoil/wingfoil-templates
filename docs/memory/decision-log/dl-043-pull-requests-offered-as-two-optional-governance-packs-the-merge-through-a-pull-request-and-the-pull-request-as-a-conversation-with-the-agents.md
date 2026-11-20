---
id: dl-043-pull-requests-offered-as-two-optional-governance-packs-the-merge-through-a-pull-request-and-the-pull-request-as-a-conversation-with-the-agents
type: decision-log
title: "Pull requests offered as two optional governance packs: the merge through a pull request, and the pull request as a conversation with the agents"
status: draft
tags: ["packs","governance","pull-request","scope"]
---

## Context

Asked by the approver on 2026-11-20: offer **pull requests** as an option of the catalog, so that a
project governed by WingFoil can choose to work through them, without changing how WingFoil itself,
or this repository, is developed. Nothing in the catalog models a pull request today: the
methodology packs' item loops (`methodology/kanban` `work-item`, `methodology/scrum` `backlog-item`)
carry no branch or merge token, and WingFoil's own workflows integrate a branch with a local `git
merge --no-ff` (WingFoil's `dev-loop`, `git.merge(to: …, ff: false)`). Yet the pull request is one
of the main ways developers talk to each other about a change, so it is also a natural place to talk
to the agents that do the work.

The approver asked for two variants, to be offered side by side:

1. **The merge through a pull request**, changing WingFoil's logic as little as possible: the PR is
   the vehicle of the merge and nothing more.
2. **The pull request as a conversation with the agents**: people write where they already write,
   and the agent that answers works under the role, the directives and the session rules of the step
   the work is in.

The approver also asked for the **examples and the tests** that let the catalog say it supports
both, published with the packs. This decision-log fixes what the two packs are and the questions
their charters need answered; each pack then runs `pack-cycle` (charter, design where a new
mechanism is needed, author, first-release).

The invariants both packs keep, whatever the options chosen:
- **State is the commits.** A forge object (a PR, a review, a check, a comment) changes no Memory
  state and no workflow deduction; WingFoil reads only the commits it carries (WingFoil REQ-SYS-03).
- **A forge approval is not an approval.** An approval is the approver's `wf()` commit, run from the
  approver's own terminal (WingFoil dl-212); a forge "Approve" is at most a signal.
- **The forge is external state**, recorded where it matters (branch protection, a sandbox
  repository) as WingFoil's `service` type does (WingFoil dl-088).

## Options

**Q1 — How the offer is packaged.**
- (a) Two packs on the `governance` axis (cardinality "many", like `governance/feedback`):
  `governance/pull-request-merge` and `governance/pull-request-conversation`, the second requiring
  the first.
- (b) One pack `governance/pull-requests` with a parameter `mode: merge | conversation`.
- (c) A `team-mode` overlay: it could tighten the methodology loops, but the axis takes one pack
  only, so it would exclude `team-mode/agent-first` (F4.4).

**Q2 — How the merge pack meets the methodology's item loop.** Two packs of a composition must not
ship the same workflow (spec-001 §7.6, one owner per file), so a governance pack cannot replace
`work-item` or `backlog-item`.
- (a) The pack ships its own workflows: a sub `pull-request-integration` (open the PR, wait for the
  approval the branch carries, merge with a merge commit) and a startable main that runs it on one
  element, beside the methodology's loop. No other pack changes; the pack's directive says that an
  item reaches its integration branch through it.
- (b) A new slot `integration` in the methodology loops, defaulting to a local `--no-ff` merge and
  filled by the merge pack: the cleanest composition, but a spec-001 change (slots are filled only
  by the `phase` axis today) and a new version of every methodology pack.

**Q3 — The `forge.*` tokens and their bindings.** The packs need project-bound tokens
(`forge.open_pr`, `forge.merge_pr`, `forge.comment`), but packs ship no `workflows/bindings.yaml` in
format 1 (spec-001 §16 O4, "a pack that needs bindings reopens it").
- (a) Reopen O4: a design phase (pack-cycle `design`) amends spec-001 so a pack may ship a bindings
  fragment, merged like `roles.yaml`, with WingFoil's REQ-SEC-12 argument rule; a WingFoil feedback
  note follows (`wingfoil-cli` rule 8).
- (b) Ship no bindings: the tokens stay unbound (WingFoil warns `W_WORKFLOW_UNBOUND_TOKEN`) and the
  pack README gives the bindings a project writes by hand.

**Q4 — The merge gate.** The gate that makes the forge enforce WingFoil's approval: a CI workflow
file, run on a PR into an integration branch, that fails unless the PR's head carries the item's
approve and its finalize, and that makes a squash or rebase merge visible.
- (a) A script shipped with the pack's README, over `wingfoil memory history <id> --format json`,
  which the pinned CLI provides today.
- (b) A rule of WingFoil's governance-check verb (WingFoil dl-222), once a release provides it;
  until then (a).

**Q5 — Where the examples and the tests live.**
- (a) In this repository, with the packs: a preset per variant (`presets/`), the README examples the
  `example-rules` checks compose, `check:runs` fixtures that drive the packs' workflows on the
  newest WingFoil release `compat.yaml` lists (dl-032), and an offline end-to-end script per variant
  with a **fake forge** (a small stand-in for the subset of `gh` the bindings call, storing each PR,
  comment and review as a JSON file).
- (b) As (a), plus the same scripts proposed to WingFoil's `docs/examples/` through a feedback note.

**Q6 — Which forge first.** GitHub only for the first versions, with the token family and the fake
forge's contract written so that another forge is another binding set, not a schema change; or
GitHub and GitLab at once.

**Q7 — The conversation pack's reach before WingFoil executes steps.** WingFoil executes no step and
evaluates no check before its v1.0 (its P4.10/P4.12). A comment can launch `wingfoil agent execute`
on the item's current phase today, but the run cannot advance the workflow by itself.
- (a) Charter both packs now; the conversation pack's first version ships what needs no engine (the
  run's projection on the PR, the conversation ledger, a comment → `agent execute`, the `/wf`
  commands that map to existing verbs), and its next minor the rest once a WingFoil release provides
  `workflow-engine` in `compat.yaml`.
- (b) Charter the merge pack now and the conversation pack after WingFoil v1.0.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **D1 — Packaging (Q1 (a)).** Two governance packs. `governance/pull-request-merge` (requires
  `base@^2`, with a conditional entry for `software@^1`) and `governance/pull-request-conversation`
  (requires `governance/pull-request-merge` at its major). Neither conflicts with any pack.
- **D2 — The merge pack ships** (Q2 (a)):
  - the sub `pull-request-integration` and its startable main: `open` (the push and
    `forge.open_pr(from: <item branch>, to: <integration branch>)`, after the item reaches review),
    `gate` (the approver's approval of the item, as a commit on its branch, before the merge),
    `merge` (`forge.merge_pr(method: merge)`: a merge commit, never squash or rebase, which would
    destroy or rewrite the `wf()` commits);
  - a directive `pull-request-merge`: an item reaches its integration branch through a PR merged
    with a merge commit; the PR's title names the item's id; a forge approval is a signal, never a
    WingFoil approval;
  - the merge gate's CI file and a PR template whose `Implements:` line is the item's id, in the
    pack README as files the project adds (spec-001 has no kind for them), with the branch
    protection to record as a `service` element where the project has that type.
- **D3 — The conversation pack ships**, in its first version (Q7 (a)):
  - the **projection**: the PR body and a checklist of the run's phases, rendered from `workflow
    status` at the head commit; read-only, never read back;
  - **comment → agent run**: a member's mention or "request changes" review launches `wingfoil agent
    execute` on the item's current phase, so the **role is the phase's, not the commenter's**, with
    that role's directives and the phase's session rules;
  - the **conversation ledger**: an agent acts only on input it has first committed — the comment's
    text, its author, its URL and a hash of its body go into the run's record before the run — so a
    re-run from git has the same inputs; a comment no agent acted on is not Memory;
  - **trust**: only a comment by a `team.members` entry starts a run (the forge handle in the member
    entry); every other comment is at most captured as feedback, through `governance/feedback` when
    it is composed;
  - the **`/wf` commands** that map to existing verbs: `/wf status`, `/wf next`, `/wf bug <text>`
    (the project's bug ingest), `/wf dl <text>` (`decision-log-ingest`);
  - a forge approval from the approver's account is answered with the exact command the approver
    runs from their own terminal, and nothing is committed.
- **D4 — Bindings (Q3 (a)).** The merge pack's charter is followed by a `design` phase that reopens
  spec-001 O4 for a bindings fragment; until it is settled, the packs follow Q3 (b) in their README.
- **D5 — The gate (Q4 (a)),** moving to (b) when a WingFoil release ships the governance-check verb.
- **D6 — Evidence (Q5 (a)).** Each pack's exit criterion (pack-cycle `author`) includes its preset,
  its `check:runs` run on WingFoil's newest listed release, and its offline end-to-end script with
  the fake forge, which checks at least: the gate fails before the approval and passes after it; a
  merge commit leaves the deduction equal to a local `--no-ff` merge; a squash is refused; for the
  conversation pack, a member's comment in a phase reaches that phase's role and is in the ledger
  before the run, a non-member's comment launches nothing, a re-run from the ledger reproduces the
  input, and a forge approval writes no commit. A manual live run against a sandbox GitHub
  repository is recorded at each pack's first release (`pack-release-cycle`), never in CI. The
  catalog says "supported" only for what these checks cover.
- **D7 — GitHub first (Q6).**
- **D8 — Order.** The merge pack runs `pack-cycle` first; the conversation pack's charter is written
  after the merge pack's charter is accepted, since it builds on its tokens and its fake forge.
- **D9 — The vision.** On approval, the features list gains one row per pack under F4 (the next free
  numbers) and the sequencer places them; a vision amendment follows, as for dl-012.
- **D10 — No change to this repository's own process, nor to WingFoil's.** The packs are an offer;
  neither repository adopts them now.

## Execution Notes

- 2026-11-20 — captured in plan-078 (`decision-log-ingest`, `capture`), asked by the approver on
  2026-11-20. An independent review is owed before the approver's ruling (dl-017).
