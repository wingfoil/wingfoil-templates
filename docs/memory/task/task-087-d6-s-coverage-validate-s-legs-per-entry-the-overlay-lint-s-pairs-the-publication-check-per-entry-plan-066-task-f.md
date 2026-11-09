---
id: task-087-d6-s-coverage-validate-s-legs-per-entry-the-overlay-lint-s-pairs-the-publication-check-per-entry-plan-066-task-f
type: task
title: "D6's coverage: validate's legs per entry, the overlay lint's pairs, the publication check per entry (plan-066 task F)"
status: draft
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (F)
depends_on: ["task-086-the-waiver-heuristic-a-review-list-in-check-packs-for-an-overlay-s-or-a-stage-pack-s-directives-bridges-exempt-plan-066-task-e"]
tags: ["tooling","validate","lint"]
---

## Context

plan-066 (point 1, task (F)), its sixth task, after task-086 (the waiver heuristic); it needs
task-083 (the catalog), task-084 (the composer per entry) and task-085 (the lint per entry).
spec-001 §15 (dl-025 D6): "A pack with a conditional part is validated in the composition with
every entry's pack and in each with one entry's pack left out in turn", and "A pack that declares
`tensions` is validated in a composition with each pack they name, and every pack with each
`stage/*` overlay: the declared and the known-risky pairs, not the Cartesian product"; before D6,
"each pack of the `phase`, `blueprint` and `governance` axes was validated with `base`, and with
the first methodology when it needs `software` (task-012, task-031)", which is the overlay lint's
`compose` rule (`src/overlay-rules.ts`). §18: §7.6's one-owner rule and §9's slot rule "are checked
on the composition with every entry's pack and on each with one entry's pack left out in turn".
plan-066 point 1: "`validate`'s legs and the overlay lint per entry (each `with` pack present,
each left out in turn, a `tensions` pack with each pack it names, every pack with each `stage/*`),
the publication check rewritten from plan-039 R6, `pack-compatibility`'s bullet in the same task".
task-085's note for (F): §7.6's one owner and §9's slots on the compositions with an entry's pack
left out.

What exists (`main` at task-086's merge):
- **`validate`'s legs** (`src/validate.ts`, plan-039 R2, R5): a composition holding a pack with a
  conditional part gets one other leg, `[+software]` when it lacks `software` (none, and the line
  `matrix <label>[+software]: skipped, no methodology`, when it holds no methodology) or
  `[-software]` when it holds it (none when a pack requires `software` unconditionally), the
  preset's values for parameters no pack of the leg declares dropped. A leg is itself never
  expanded. The legs read `software`, never an entry's `with`.
- **The publication check** (plan-039 R6): in publication mode, a pack with a conditional part
  that no composition holding `software` ran fails, `matrix: <pack> has a conditional part and no
  composition with software that ran (plan-039 R6)`.
- **The overlay lint** (`overlayProblems`): every methodology × team-mode or none × stage or none
  (not none and none) is composed in memory with `base`; every pack none of them reaches is
  composed once (`compose` rule); a combination holding a conditional part and no pack needing
  `software` also gets a leg with `software` and, when it holds no methodology, the first
  methodology no pack of it conflicts with. No leg without an entry's pack, no `tensions` pair,
  no pack paired with a `stage/*` overlay besides methodologies and team modes.
- **The composer** (task-084) checks §7.6's one owner and §9's slots on the active entries of
  each composition it composes, so a composition that is composed is checked; what is missing is
  the compositions.
- No published pack is at format 2, has two entries or a tension; every published conditional
  part names `software`. The golden tree (`tests/fixtures/compose/tree`) holds one conditional
  pack (`methodology/flow`, format 1, `with: software`) and one `stage/*` pack
  (`stage/production`).

Not here: the index and the generators (task G); the `mcp` kind's tooling; plan-066 point 7's
open points (their rows, trigger the first `stage/*` charter); any published pack moved to
format 2 (plan-063 ruling 3).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 6 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as such);
   the failing run recorded with its command and count.
2. **`validate`'s legs per entry** (§15). For each composition that resolves and holds packs with
   a conditional part (its "conditional packs", in resolved order), and for each of them, P, with
   its entries' packs W1 … Wn (each `with`'s id, in written order, a repeated id once):
   - **The targets:** the full target is the composition with every Wi it does not hold added;
     then, for each Wi in turn, the full target with Wi left out. A target is a set of packs
     added to and removed from the composition: `+Wi` for a Wi added, `-Wi` for a Wi the
     composition holds and the target leaves out.
   - **A leg per target that differs from the composition**, labelled `<label>` followed by
     `[+<id>]` for each pack added, in entry order, then `[-<id>]` for each removed, in entry
     order (for example `presets/x.yaml[+stage/a][-software]`); a label already derived for the
     same composition (by another conditional pack) is not run twice. Legs are derived from the
     tree's compositions only, never from a leg. Order: after the composition, P by P, the full
     target first, then the left-out targets in entry order.
   - **Entries of a leg:** the composition's entries, minus each entry whose id is a removed pack
     (`<id>` or `<id>@<range>`), plus each added pack's `with` as P writes it (its range kept, so
     an unsatisfied range is the composition error of §6.5).
   - **No leg** when a removed pack is still in the leg's resolved composition (a pack requires it
     unconditionally), as today's `[-software]`. When an added pack is `software` or reaches it
     through `requires` and the leg holds no methodology, the leg is not run and the line
     `matrix <leg label>: skipped, no methodology` is printed, as today. Any other resolve or
     composition error of a leg fails, as a composition's does.
   - **Parameters** (plan-039 R5, read per leg): the preset's values for parameters no pack of the
     leg declares are dropped (`, dropped <names>` on its line); `--param` values go to the legs
     whose packs declare them; an added pack's parameter with no default and no value fails the
     leg, as any composition (no value is invented).
   - **Format 1 unchanged:** for every conditional part whose `with` is `software`, the legs and
     their lines are today's (`[+software]`, `[-software]`), so the golden tree's and this
     repository's `validate` output, the publication evidence and the CI's runs are unchanged.
3. **The publication check per entry** (plan-039 R6 rewritten): in publication mode, for each
   conditional pack and each of its entries' packs W, in byte order of the pack id then entry
   order, a failure when no composition or leg that ran holds both the pack and W:
   `matrix: <pack>'s entry with <W> has no composition holding <W> that ran (plan-039 R6,
   spec-001 §15)`. A pack whose part names only `software` fails exactly when it fails today, with
   this message (the approver's ruling, point 2 below).
4. **The overlay lint per entry** (§15, §18). Every combination the lint composes (today's
   overlay combinations, the `compose` rule's, and Acceptance 5's pairs) that holds conditional
   packs gets the targets of Acceptance 2 on its request: the full target, then each left-out
   target, P by P, replacing today's leg with `software`. A target holding a pack that needs
   `software` and no methodology takes the first methodology, in byte order, no pack of it
   conflicts with (either way), or is not composed. A target whose left-out pack is reached
   through `requires` by the rest is not composed. A target equal, as a set of pack ids, to one
   the lint has already composed in this run is not composed again. A refusal is a problem of the
   combination's rule, blamed on the same packs. For a part naming `software` only, the targets
   reduce to today's leg (the one without `software` is the combination itself), so the golden
   tree and this repository report nothing new.
5. **The overlay lint's pairs** (§15, dl-025 D6), after today's combinations and before the
   `compose` rule's packs, each composed with `base` like the others, each a problem of rule
   `pair` blamed on both packs when refused, message `<base> + <ids>: <refusal>` as today:
   - **`tensions` pairs:** for each sound pack P (in byte order) and each entry of its `tensions`
     (in written order) naming a sound pack Q of the tree: P with Q. A pair already composed (Q's
     `tensions` naming P) is not composed again. A pair the axis rule forbids (P and Q on the
     same axis of cardinality one) or naming a pack P `conflicts` with (already the `tensions`
     rule's problem, task-085) is not composed.
   - **`stage/*` pairs:** for each sound `stage/*` overlay S (a pack of the `stage` axis) and each
     sound pack P that is not `base`, not a methodology, not a team mode and not on the `stage`
     axis (those already composed with S by the overlay combinations): P with S.
   - **A methodology** is added as Acceptance 4 says when a pair needs `software`; a pair with a
     conditional pack gets Acceptance 4's targets.
   - **Reached:** a pack composed in a pair counts as reached, so the `compose` rule no longer
     composes it alone. A pair's pack that is troubled is left out, as today.
   - The golden tree's lint stays at 0 problems (`blueprint/web-service`, `phase/inception/lean`
     and `software` now composed with `stage/production`); this repository has no `stage/*` pack
     and no tension, so its lint is unchanged.
6. **The tests** (offline; `tests/validate.test.ts` with the stub releases and
   `tests/check-packs.test.ts`, format-2 fixture trees written by the tests' helpers):
   - a format-2 overlay with two entries (one a bridge) in a preset holding neither entry's pack,
     one, and both: each derived leg by label, its order, its entries and dropped values; a leg
     needing a methodology skipped with its line; a removed pack required unconditionally, no leg;
     an unsatisfied `with` range failing the leg; two conditional packs naming the same pack, one
     leg;
   - the golden tree's labels (`GOLDEN_LEGS`) unchanged;
   - the publication check: a format-2 pack whose entry's pack no composition ran, its line; held,
     no line; the format-1 case with its new message;
   - the overlay lint: a left-out leg refused by §7.6's one owner or §9's slot rule (a problem only
     that leg shows); a `tensions` pair refused, blamed on both, composed once when both name each
     other; a same-axis tension not composed; a `stage/*` pair refused for a `blueprint/*` pack;
     the golden tree at 0 problems.
7. **`pack-compatibility`'s bullet** (its file under `.wingfoil/directives/custom/`), the one on a
   conditional part, rewritten: a pack with a conditional part (spec-001 §6.5) is validated in the
   composition with every entry's pack and in each with one entry's pack left out in turn;
   `npm run validate` derives these legs (`[+<pack>]`, `[-<pack>]`) from each composition that holds
   it; a leg adding `software` needs a methodology, so for a pack that is not one it comes from a
   documented combination (a README example or a preset) that holds a methodology; a publication
   fails when an entry's pack is held by no composition with the pack that ran (plan-039 R2, R6);
   and `npm run check:packs` composes a pack declaring `tensions` with each pack they name and
   every pack with each `stage/*` overlay (dl-025 D6). The comments of `src/validate.ts` and
   `src/overlay-rules.ts` say the same.
8. **Nothing else moves:** the four published packs, the golden trees, `check:schemas`, the
   generated root files and the publication evidence unchanged; `npm test` and `npm run lint` exit
   0. No schema change, so no schema note.
9. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   (G12's 25 minutes: no composition is added to the CI's `validate` runs, Acceptance 2's last
   point), and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's diff
   recorded.

**For the approver's ruling before `backlog`:**
1. **Where the pairs are composed** (Acceptance 5): in the overlay lint only, in memory, not as
   `validate` legs run through the WingFoil matrix. Recommended: §15's "before D6" sentence names
   the lint's `compose` rule as what "validated" meant for a pack alone, the pairs are new
   compositions no preset or example holds, and every matrix leg is two releases' runs on a CI at
   21 to 23 minutes of G12's 25. Alternative: `validate` derives a leg per pair from a composition
   that holds one of its packs, and the CI time grows with each pair.
2. **The publication check per entry** (Acceptance 3): a composition holding each entry's pack
   that ran, the left-out side unchecked. Recommended: plan-039 R6 exists because the leg with
   `software` needs a documented methodology and can silently not run; the left-out leg is
   derived from the composition itself and runs whenever it holds the pack. Alternative: also a
   failure when no composition without an entry's pack ran.

## Design

Branch `task/task-087-d6-coverage` from `main` at this task's add. A new module
`src/coverage.ts` holding the targets of Acceptance 2 and 4, shared by `validate` and the lint:
`entryTargets(conditional: {id: string; withs: {id: string; entry: string}[]}[], held: (id:
string) => boolean): Target[]`, a `Target` being `{added: {id, entry}[], removed: string[]}` and
its label suffix `targetLabel(target)`; `validate.ts`' loop over legs reads it in place of its
`[+software]`/`[-software]` branches, its `parted` map becoming a map per pack and entry;
`overlay-rules.ts`' `withSoftware` and `both` become the targets plus the methodology rule, a set
of composed id keys, and the pairs of Acceptance 5 (`pairs(context, sound)`) before the `compose`
rule's loop. The `validate` fixtures are written into temporary trees by `tests/support/pack-tree`
(format 2 already supported by task-085's tests). Red steps: (1) the tests of Acceptance 2 … 6,
with `entryTargets`' and `targetLabel`'s signatures and no body (they throw), uncalled; (2) the
code; (3) `pack-compatibility` and the comments, committed apart (`wf(config)`). No new
dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-09: written as plan-066 task (F), after task-086's merge; `pack` and `depends_on` filled
  by editing the draft (W-02).
