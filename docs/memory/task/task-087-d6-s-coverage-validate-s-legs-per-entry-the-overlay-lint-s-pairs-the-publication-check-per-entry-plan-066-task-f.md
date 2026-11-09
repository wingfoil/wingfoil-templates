---
id: task-087-d6-s-coverage-validate-s-legs-per-entry-the-overlay-lint-s-pairs-the-publication-check-per-entry-plan-066-task-f
type: task
title: "D6's coverage: validate's legs per entry, the overlay lint's pairs, the publication check per entry (plan-066 task F)"
status: pending
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
2. **`validate`'s legs per entry** (§15). For each composition `validate` composes (presets,
   examples, `entries`, the overlay's) that resolves and holds packs with a conditional part (its
   "conditional packs", in resolved order), and for each of them, P, with its entries' packs W1 …
   Wn (each `with`'s id, in written order, a repeated id once; an entry whose `with` names no pack
   directory of the tree, already the lint's problem (task-085), derives nothing; a Wi that is
   itself conditional is not expanded, its own coverage coming from the compositions holding it):
   - **The targets:** the full target is the composition with every Wi it does not hold added;
     then, for each Wi in turn, the full target with Wi left out. A target is a set of packs
     added to and removed from the composition: `+Wi` for a Wi added, `-Wi` for a Wi the
     composition holds and the target leaves out.
   - **A leg per target that differs from the composition**, labelled `<label>` followed by
     `[+<id>]` for each pack added, in entry order, then `[-<id>]` for each removed, in entry
     order (for example `presets/x.yaml[+stage/a][-software]`); a target with the same added and
     removed ids as one already derived for the same composition (by another conditional pack,
     whatever the order of its entries) is not run twice, the first label kept, and a pack added
     by both takes the first P's `with` (every active entry's range is checked by the resolver
     anyway). Legs are never derived from a leg, and a leg keeps its composition's tree and its
     overlay flags (`--overlay`, task-046), as today's legs do. Order: after the composition, P by
     P, the full target first, then the left-out targets in entry order.
   - **Entries of a leg:** the composition's entries, minus each entry whose id is a removed pack
     (`<id>` or `<id>@<range>`), plus each added pack's `with` as P writes it (its range kept, so
     an unsatisfied range is the composition error of §6.5).
   - **No leg** when a removed pack is still in the leg's resolved composition (a pack requires it
     unconditionally), as today's `[-software]`.
   - **A target the format forbids is skipped, not failed** (the approver's ruling, point 3 below):
     judged on the leg's resolved packs, when it would break §3's cardinalities (two methodologies,
     two packs of one axis of cardinality one or of one slot, as the resolver's axis rule reads
     them) or §6.3's conflicts (either way), the leg is not run and the line `matrix <leg label>:
     skipped, <reason>` is printed, `<reason>` the resolver's message. First, before resolving, as
     today: when the leg holds `software` (added, or kept after a removal) and no methodology, it is
     skipped with `skipped, no methodology`; the resolver's skip covers the other breaches (an axis
     taking one pack, a slot, §6.3's conflicts). Any other resolve or composition error of a leg
     fails, as a composition's does. So an entry whose pack cannot join a given composition is
     covered by another composition that holds it, which Acceptance 3 requires to exist.
   - **Parameters** (plan-039 R5, read per leg): the preset's values for parameters no pack of the
     leg declares are dropped (`, dropped <names>` on its line); `--param` values go to the legs
     whose packs declare them; when a pack the leg adds (an added pack or one it pulls in through
     `requires`) declares a parameter with no default and the leg has no value for it, the leg is
     skipped with `skipped, <name> has no value` (the approver's ruling, point 4 below), no value
     invented.
   - **Format 1 unchanged:** for every conditional part whose `with` is `software`, the legs and
     their lines are today's (`[+software]`, `[-software]`), so the golden tree's and this
     repository's `validate` output, the publication evidence and the CI's runs are unchanged;
     only the text of the publication check's failure changes (Acceptance 3).
3. **The publication check per entry** (plan-039 R6 rewritten): in publication mode, for each
   conditional pack and each of its entries' packs W, in byte order of the pack id then entry
   order, a failure when no composition or leg that ran holds both the pack and W:
   `matrix: <pack>'s entry with <W> has no composition holding <W> that ran (plan-039 R6,
   spec-001 §15)`. A pack whose part names only `software` fails exactly when it fails today, with
   this message in place of today's. An entry whose pack no derived leg can join (Acceptance 2's
   skipped targets) therefore needs a documented composition (a preset or a README example)
   holding P and that pack. The left-out side is not checked (the approver's ruling, point 2
   below).
4. **The overlay lint per entry** (§15, §18). Every combination the lint composes (today's overlay
   combinations, the `compose` rule's, and Acceptance 5's pairs) that holds conditional packs gets
   the targets of Acceptance 2 on its request: the full target, then each left-out target, P by P,
   replacing today's leg with `software`. A target holding a pack that needs `software` and no
   methodology takes the first methodology, in byte order, that is not a left-out pack and that no
   pack of it conflicts with (either way), or is not composed. A target whose left-out pack is
   reached through `requires` by the rest is not composed. A target that §3's cardinalities or
   §6.3's conflicts forbid, on its resolved packs (Acceptance 2), is not composed (the approver's
   ruling, point 3). A target equal to one the lint has already composed in this run, compared as
   the set of its resolved pack ids, is not composed again. A refusal is a problem of the
   combination's rule, blamed on the same packs. For a part naming `software` only, the full target
   is today's leg; the left-out target is the combination itself, except when the request names
   `software` explicitly (the `compose` rule's `[<first methodology>, software]`, Acceptance 5's
   `software` pair), where it is that request without `software`, a new composition. In the golden
   tree these are already composed (`software` reached through `methodology/kanban`, `[flow,
   stage/production]` an overlay combination) or compose, so it and this repository report nothing
   new.
5. **The overlay lint's pairs** (§15, dl-025 D6), after today's combinations and before the
   `compose` rule's packs, each composed with `base` like the others, each a problem of rule
   `pair` blamed on both packs when refused, message `<base> + <ids>: <refusal>` as today:
   - **`tensions` pairs:** for each sound pack P (in byte order) and each entry of its `tensions`
     (in written order) naming a sound pack Q of the tree (its id parsed with `parseEntry`, its
     range not judged by the pair): P with Q.
   - **`stage/*` pairs:** for each sound `stage/*` overlay S (a pack of the `stage` axis) and each
     sound pack P that is not `base`, not a methodology, not a team mode and not on the `stage`
     axis (those already composed with S by the overlay combinations): P with S.
   - **For both kinds:** a pair that §3's cardinalities or §6.3's conflicts forbid, on its resolved
     packs (Acceptance 2; a tension naming a pack it conflicts with is already the `tensions` rule's
     problem, task-085), is not composed (the approver's ruling, point 3); a pair equal to a
     composition already composed in this run (Acceptance 4's comparison: Q's `tensions` naming P,
     or a tension between a team mode and a stage, already an overlay combination) is not composed
     again; a methodology is added as Acceptance 4 says when a pair needs `software`; a pair with a
     conditional pack gets Acceptance 4's targets.
   - **Reached:** a pack composed in a pair counts as reached, so the `compose` rule no longer
     composes it alone. A pair's pack that is troubled is left out, as today.
   - The golden tree's lint stays at 0 problems (`blueprint/web-service`, `phase/inception/lean`
     and `software` now composed with `stage/production`); this repository has no `stage/*` pack
     and no tension, so its lint is unchanged.
6. **The tests** (offline; `tests/validate.test.ts` with the stub releases and
   `tests/check-packs.test.ts`, format-2 fixture trees written by the tests' helpers):
   - one fixture tree holding three presets with a format-2 overlay with two entries (one a
     bridge): a preset holding neither entry's pack, one, and both, in one `validate` call; each
     derived leg by label, its order, its entries and dropped values; a leg needing a methodology
     skipped with its line; a removed pack required unconditionally, no leg; an unsatisfied
     `with` range failing the leg; two conditional packs naming the same two packs in opposite
     orders, one leg each target; an entry whose pack is a second methodology, its target skipped
     with the resolver's reason; an added pack's parameter with no default, skipped with its line;
   - the golden tree's labels (`GOLDEN_LEGS`) unchanged;
   - the publication check: a format-2 pack whose entry's pack no composition ran, its line; held,
     no line; the format-1 case with its new message;
   - the overlay lint: the full target refused by §7.6's one owner (P's entry with A ships a
     directive that pack B ships too, refused only with A and B present); on the left-out side, a
     refusal only that target shows if the composer gives one (a workflow of another pack
     including a workflow of P's entry, §7.7), else recorded in the Execution Notes with the
     left-out target asserted composed (it adds no file, so §7.6 and §9 refuse nothing the full
     target does not); a `tensions` pair refused, blamed on both, composed once when both name
     each other; a tension between two packs of one cardinality-one axis not composed; a `stage/*`
     pair refused for a `blueprint/*` pack, and one forbidden by a conflict not composed; the
     golden tree at 0 problems;
   - `npm test`'s duration before and after recorded (G12).
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
   `validate` legs run through the WingFoil matrix. `validate` runs the lint, so a refused pair
   fails `validate` and a publication run too. Recommended: §15's "before D6" sentence names the
   lint's `compose` rule as what "validated" meant for a pack alone, and the pairs are new
   compositions no preset or example holds; today neither way adds a CI run (no `stage/*` pack
   or tension in the CI's trees), but with the first `stage/*` pack each pair as a leg would cost
   two releases × three WingFoil commands on a CI at 21 to 23 minutes of G12's 25. Alternative:
   `validate` derives a leg per pair from a composition that holds one of its packs; its benefit
   is that the pairs meet WingFoil's own commands, which the in-memory lint never runs.
2. **The publication check per entry** (Acceptance 3): a composition holding each entry's pack that
   ran, the left-out side unchecked. Recommended: plan-039 R6 exists because the leg with `software`
   needs a documented methodology and can silently not run; the left-out leg is derived from the
   composition itself and runs whenever it holds the pack, except when another pack of it requires
   that pack unconditionally (no leg, Acceptance 2) or the format forbids it (point 3). Alternative:
   also a failure when no composition without an entry's pack ran.
3. **A target the format forbids** (Acceptance 2, 4, 5): skipped with its line in `validate`,
   not composed by the lint. Recommended: task-085's static order rule admits a pack whose
   entries name two methodologies, or a pack that cannot join a given composition, so §15's
   "with every entry's pack" cannot always be composed; failing a sound pack for it would be a
   refusal §18 does not make. Acceptance 3 keeps the coverage by asking a documented composition
   for such an entry. Recorded as a reading for the wave close (§6.5 and §15 assume the entries'
   packs compose together). Alternative: such a target fails, so a pack whose entries' packs
   cannot be composed together is refused.
4. **An added pack's parameter with no value** (Acceptance 2): the leg skipped with its line.
   Recommended: a preset cannot set a parameter no pack of it declares (`src/tree-rules.ts`) and
   the CI's runs pass no `--param`, so failing would refuse every `[+W]` leg of a W with a
   required parameter, while the lint, which composes with placeholders, accepts it; Acceptance
   3 still asks a composition holding W that ran. Alternative: the leg fails, the author giving
   `--param` or a documented composition.

## Design

Branch `task/task-087-d6-coverage` from `main` at this task's add. A new module `src/coverage.ts`
holding the targets of Acceptance 2 and 4, shared by `validate` and the lint:
`entryTargets(conditional: {id: string; withs: {id: string; entry: string}[]}[], held: (id: string)
=> boolean): Target[]`, a `Target` being `{added: {id, entry}[], removed: string[]}` and its label
suffix `targetLabel(target)`; whether a removed pack is still resolved, the methodology rule and the
format's skips stay in the callers (`validate` judges them with `resolve`, the lint with `reachable`
and `resolve`); `validate.ts`' loop over legs reads it in place of its `[+software]`/`[-software]`
branches, its `parted` map becoming a map per pack and entry; `overlay-rules.ts`' `withSoftware` and
`both` become the targets plus the methodology rule, a set of composed id keys, and the pairs of
Acceptance 5 (`pairs(context, sound)`) before the `compose` rule's loop. The `validate` fixtures are
written into temporary trees by `tests/support/pack-tree` (format 2 already supported by task-085's
tests); the §7.7 fixture of Acceptance 6 must be lint-clean except for the left-out refusal, or its
pack is troubled and never composed. Red steps: (1) the tests of Acceptance 2 … 6, with
`entryTargets`' and `targetLabel`'s signatures and no body (they throw), uncalled (`pairs` stays
internal to `overlay-rules.ts`, written with the code); (2) the code; (3) `pack-compatibility` and
the comments, committed apart (`wf(config)`). No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-09: written as plan-066 task (F), after task-086's merge; `pack` and `depends_on` filled
  by editing the draft (W-02).
- 2026-11-09: independent review: approve after amendments, three blocking (a target §3's
  cardinalities or §6.3's conflicts forbid, now skipped with its line and not composed by the
  lint, ruling point 3 added; a pair forbidden by a conflict or a cardinality, not composed; the
  left-out leg's one-owner test, which cannot be built since that leg adds no file, replaced by
  the full target's and a §7.7 case); applied with the others: an added pack's parameter with no
  value skipped, ruling point 4 added; targets deduplicated by their ids, not their labels; the
  explicit-`software` exception in Acceptance 4; pairs equal to earlier compositions not
  composed again, a tension's range not judged; legs of every composition `validate` composes,
  with its tree and overlay flags; an entry naming no pack directory, a conditional `with` pack;
  ruling 1's and 2's rationales completed; the publication message change named; one fixture
  tree for the presets and `npm test`'s duration recorded; the Design's split between the shared
  targets and the callers.
- 2026-11-09: re-review: approve, five non-blocking findings, applied: the no-methodology skip
  judged first, before resolving, so format 1's lines stay today's; the parameter skip read on a
  pulled-in pack too; ruling 2's second exception; ruling point 3 cited by Acceptance 4 and 5;
  the §7.7 fixture lint-clean (Design).
