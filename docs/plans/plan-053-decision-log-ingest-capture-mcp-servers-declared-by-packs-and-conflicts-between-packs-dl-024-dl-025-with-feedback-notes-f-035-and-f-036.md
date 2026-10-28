---
id: plan-053-decision-log-ingest-capture-mcp-servers-declared-by-packs-and-conflicts-between-packs-dl-024-dl-025-with-feedback-notes-f-035-and-f-036
type: plan
title: "decision-log-ingest capture: MCP servers declared by packs and conflicts between packs (dl-024, dl-025), with feedback notes F-035 and F-036"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["decision-log","packs","feedback"]
---

## Context

The `capture` phase of `decision-log-ingest`, started on 2026-10-28 on the approver's request in
chat, right after wave W9 closed (plan-052).

On 2026-10-24 the coordinating session relayed the approver's ruling: this repository adds two
decision-logs and two feedback notes whose texts a cloud session of this repository wrote on
2026-10-22 and 2026-10-24, to be added after W9 without interrupting it. The cloud session added
nothing to `main`. The texts are final for submission, each decision-log already reviewed twice
independently (dl-017), its Execution Notes recording both reviews; only the numbers may change. The
session that queued the request lost it; the coordinating session re-sent it unchanged on
2026-10-28. On `main` (`8242f52`) dl-024, dl-025, F-035 and F-036 are still free, so no number
changes:
- **dl-024 "MCP servers declared by packs"**: a pack declares MCP servers in a fragment of a new
  kind (option (b)), with a README entry pasted by hand as the interim (option (a));
- **dl-025 "Conflicts between packs: stricter wins, declared tensions and directive
  precedence"**: four layers (structure, directive precedence, declared tensions, bridges) and an
  escalation rule;
- **F-035** (`request`, from dl-024): packs cannot declare MCP servers for the agents WingFoil
  launches;
- **F-036** (`request`): no verb moves, renames or supersedes an element, and nothing lists the
  elements that cite one.

**Why now.** W9 is done. F-035 and F-036 also block the inbox's numbering: `tests/support/inbox.ts`
requires contiguous note numbers, so task-052 (F-037, plan-048), F-038 and bug-008's note wait for
them. plan-048's ruling 2 gives task-052's build to "the plan that writes them": this plan takes
task-052 over after task-063, so F-037 lands here. The pack-cycle retrospective of the three first
releases follows this plan (approver, 2026-10-28) and writes the notes after F-037.

**The texts since their snapshot.** They were written on `main` at `c12ae90` (2026-10-24). Since
then spec-001 changed (§2, §9, §11 and §18 by dl-026 and dl-027; §7.5 and §18 by task-044; §8.3 by
task-050; §12 by task-059), as did the `pack-authoring` directive (plan-050), the sequencer (1.5,
plan-052) and `compat.yaml` (WingFoil 0.3.1, plan-051). The notes' evidence is WingFoil 0.3.0's.
This plan checks all of them; it does not rewrite the texts. A finding that would change a text goes
to the approver, who rules whether to amend it while `pending` or record it as an Execution Note.

It produces dl-024 and dl-025 (`pending`, ruled by the approver in phase `rule`), and task-063,
which writes F-035 and F-036. **Deviation from the workflow:** `decision-log-ingest` produces
decision-logs only; the notes are hosted here, by a task of their own (as plan-025 hosted task-026),
because the inbox test requires a new note's first line to name a task or a pack-release (none fits
here) and the request asks for a task, as task-041 did. task-063 runs the `tooling-delivery` loop
(`pack: ""`).

It decides nothing beyond the request: the changes the two decision-logs imply (spec-001,
spec-002, `pack-authoring`, the F3.5 lint, `compat.yaml`, the stage charters) are applied later,
each through its own element, after approval.

## Steps

On the branch `dl/dl-024-dl-025-mcp-and-conflicts`, from `main` at `8242f52`.

1. **This plan:** an independent review (dl-017), amended; the approver's OK; `submit`
   (`draft → active`).
2. **dl-024 and dl-025** (claude, facilitator): `memory add --type decision-log` with the
   request's titles. WingFoil 0.2.2's `memory add` numbers by count (1 + the files of the type),
   not by the first free number, so it would give dl-026 again: dl-026 and dl-027 are moved out of
   the repository (to the session's scratchpad) for the two commands, which then give dl-024 and
   dl-025, and put back at once; WingFoil commits only the new file, so the move is never
   committed; `git status` and the new ids are checked before going on, and the workaround is
   recorded in these Execution Notes (`wingfoil-cli` rule 4) ahead of W-14. The bodies are
   committed by hand as received: frontmatter `tags` as the texts give them, `status` left `draft`
   until `submit` (the received `pending` is not copied); prose rewrapped to 100 characters with
   no word changed (as `d1b7261` did for dl-027), tables and code blocks kept. An Execution Note
   each, dated 2026-10-28, records how the text reached the repository (the approver's ruling of
   2026-10-24, relayed by the coordinating session), this plan and the rewrap.
3. **Their review** (dl-017): one independent subagent per decision-log, with its own context. It
   checks every citation against the current sources (spec-001, spec-002, dl-021, task-012's lint,
   the sequencer's W12, the `pack-authoring` directive) and the claims about WingFoil 0.3.0 and
   0.3.1, and rules on the point the request leaves to it: dl-025 D2 defines classes 1–2 (law,
   standard) by subject, not by axis. Findings go to the approver (the rule in Context); then
   `submit` (`draft → pending`). Checks: `npm run -s wingfoil -- workflow list` and
   `npm run lint` exit 0.
4. **task-063** (claude, product-owner then developer; `tooling-delivery`, on
   `task/task-063-feedback-notes`, from this plan's branch):
   1. `plan`: its body in task-041's shape (Context, Acceptance, Design), reviewed independently
      and amended (`draft → pending`); the approver accepts it into the backlog
      (`pending → backlog`); `design` is the body's Design section, as in task-041;
   2. `build` (`submit`, `backlog → in-progress`): F-035 and F-036 written as received, their
      first line `New note (task-063).`, F-035's "(proposed, not yet ruled)" kept even if dl-024
      is ruled first; prose rewrapped as in step 2;
      each `## Observed` re-run in a scratch project on WingFoil 0.3.0
      (`src/matrix/wingfoil-0.3.0/`) and on 0.3.1 (`src/matrix/wingfoil-0.3.1/`): the text stays
      as received when 0.3.0's output matches, and a difference on 0.3.1 is recorded in the task's
      Execution Notes and goes to the approver; one ledger row each in
      `docs/wingfoil-feedback/README.md`, `Last sync` unchanged; a `wingfoil-cli` entry W-14 for
      step 2's numbering by count (0.2.2, the governance pin; rule 3), with the directive's Version
      1.4 → 1.5 and its Date; whether it also needs a feedback note (rule 3) is decided by the
      retrospective after re-checking it on 0.3.1, its note numbered after F-037; no W-entry for
      the notes' 0.3.0 and 0.3.1 behaviours (recorded when the pin moves, as task-041); no other
      file changed outside `docs/wingfoil-feedback/`, the directive and the task's own file; the
      privacy grep on the notes; `npm test`, `lint`, `check:pins`, `check:schemas`,
      `check:packs`, `validate`, `index -- --check` and `workflow list` exit 0 from clean clones
      on Node.js 22.21.0 and 22.12.0; the branch's CI conclusion recorded;
   3. `review`: an independent build review; `submit` (`in-progress → in-review`); the approver's
      approval (`in-review → approved`);
   4. `deliver`: `--no-ff` merge into this plan's branch; `submit` (`approved → done`).
5. **task-052** (F-037, plan-048's ruling 2): after task-063, through the same loop from its
   `build` (its body was accepted into the backlog under plan-048); its evidence re-checked on
   0.3.1 as in step 4.
6. **rule** (phase `rule`, the approver): `memory approve` of dl-024 and dl-025 from the commands
   claude hands over, or a decision to leave them `pending` (as dl-011 … dl-013). Not a
   condition of this plan's close.
7. **Branch close:** push; the real CI conclusion recorded here; on the approver's OK, `--no-ff`
   merge into `main`, push, `main`'s CI conclusion read; the remote and the local branch removed.
   Then the reply to the coordinating session: the ids used, the task, the commits on `main`.

## Handoff

- **claude:** steps 2–5 and 7, except the approvals and the merge OK. It never runs
  `memory approve` or `memory reject`. No pull request. Files staged by name; `docs/notes/` and
  `.idea/` stay untracked. Repository texts cite only public elements.
- **Approver:** this plan before `submit`; any finding that would change a received text; task-063's
  backlog acceptance and approval, task-052's approval; the ruling of dl-024 and dl-025 (now or
  later); the merge OK.
- Done when dl-024 and dl-025 are on `main` (`pending` or ruled), F-035 and F-036 are on `main` with
  their ledger rows, task-063 and task-052 are `done` (F-037 on `main`), the branch is merged and
  removed, and the coordinating session has its reply. The plan then goes `active → done`.

## Execution Notes

- 2026-10-28: written on the approver's OK in chat ("procedi con plan-054 e poi la
  retrospettiva"; `memory add` gave this plan the number 053, the retrospective takes the next).
  `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-28: independent review: approve after amendments, one blocking finding: WingFoil 0.2.2's
  `memory add` numbers by count, so it would give a second dl-026; step 2 now moves dl-026 and
  dl-027 aside for the two commands, and task-063 adds the `wingfoil-cli` entry W-14. Applied with
  the others: the changes since `c12ae90` listed in full; task-052 taken over by this plan
  (plan-048's ruling 2, step 5); the received texts' wrapping and `status`; task-063's full checks,
  branch and `tooling-delivery` transitions; the inbox test's `prel-` alternative.
- 2026-10-28: re-review: approve; three nits applied (the move-aside's safety, W-14's directive
  version, the feedback-note question left to the retrospective).
- 2026-10-28: the approver gave the OK in chat ("ok, procedi con il submit"); submitted.
