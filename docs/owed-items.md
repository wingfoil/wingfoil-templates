# Owed items

The register of owed items (dl-031): work a plan, a task or another element defers to a later
element. Outside every Memory path. Its rules are rule 4 of the directive `repository-practice`
(`.wingfoil/directives/custom/repository-practice.md`).

- **Open:** one row per item: the item, its source (element and section), its owner and its
  trigger. An item without an owner names the approver; an item without a trigger takes "the next
  retrospective" (dl-031 R1). Rows are sorted by the first element id in Source; rows without one
  come last.
- **Who writes a row:** the element that leaves the item, in the same commit as its note (dl-031
  R2). The element that settles an item moves its row to Closed, with its own id.
- **Who reads it:** every retrospective, in `explore`; it proposes keep, assign or drop for each row,
  and its decision-log rules them (dl-031 R3).

First content: the debts of the inventory of 2026-10-28
(`docs/retrospectives/2026-10-28-periodic-friction-inventory.md` §8), with the rows of dl-028 D1
and D2, approved as a backlog by dl-028 (dl-031 R4), and the row of dl-033 O4.

## Open

| Item | Source | Owner | Trigger |
|---|---|---|---|
| CI policy for advisories in transitive dependencies | bug-004 › note 2026-10-24 | approver | the next retrospective |
| Recheck W-01 … W-14 and the open notes against 0.3.x (F-003, F-005, F-012, F-017) | dl-021's note; `wingfoil-cli` rule 5 | W10 | the pin bump |
| G7: in-place amendment (the `pack` type `amendable`, the rulings held in plans, a rule on amend versus note); see also plan-031's row | dl-028 D1 (inventory §7) | W10 | W10 |
| G8: dl-017 R2 for documents and configuration | dl-028 D1 (inventory §7) | W10 | W10 |
| G9: the inbox's first line may name a plan or a decision-log; reserved gaps revisited (the inbox's contiguous numbering is this repository's own test, dl-031 R5) | dl-028 D1 (inventory §7) | W10 | W10 |
| G11: a terminal state for a fixed bug, fixed by `software`'s `bug` type at the adoption | dl-028 D1 (inventory §7) | W10 | W10 |
| G12: the suite's duration tracked against the CI timeout | dl-028 D1 (inventory §7) | W10 | W10 |
| A check of the CHANGELOG's first line, which becomes the tag annotation | dl-028 D1 (inventory §1) | approver | the next `publish:pack` change |
| Whether a version known to fail its runs needs a "known defects" marker in `catalog.yaml` | dl-028 D1 (inventory §1) | approver | the next retrospective |
| This repository's custom `sw-life-cycle` shares its name with `software`'s (bug-007's pattern) | dl-028 D2 (inventory, P3) | W10 | the adoption |
| `software`'s `tech-lead` needs a holder in this repository's DNA | dl-028 D2 (inventory, P3) | W10 | the adoption |
| `pack-cycle` v6 checked on the engine: its reordered phases, and whether a pack covered by a shared retrospective can complete `retrospective` by reference | dl-033 O4 | W10 | the pin bump (W10) |
| Charter text drift of `software` (`base@^1`, `end-of-life` row, step-key table, W9) | pack-foundation-software › Execution Notes | approver | the next retrospective |
| `scrum` charter open point 1 (UI's test-first steps) | pack-methodology-scrum › Open points, note 2026-10-28 | UI's adoption | UI's adoption |
| `scrum` charter open point 2 (`explore`'s weak evidence) | pack-methodology-scrum › Open points, note 2026-10-28 | approver | the next retrospective |
| A decision-log making in-place amendment general; see also G7 | plan-031 › Context | approver | the next retrospective |
| `pack-delivery`'s selection over `accepted` packs (`charter` creates a `draft` pack) | plan-041 › Context; dl-033 O1 | approver | the next retrospective |
| `--param` applies to an `entries` composition only (hit again at prel-003) | plan-043 › note (task-039's review) | approver | the next retrospective |
| `pack-semver` rule for fixes and changed defaults | plan-049, plan-052 › close | approver | the next retrospective |
| This repository keeps `plan-{n}-{slug}` or takes `{workflow}-{phase}-plan` | plan-049 › close; pack-foundation-base › Adoption | W10 | the adoption |
| `check:runs` scenario of the full scrum run (`memory park`, a field rewritten, `set_state`) and the `include:` null branch test; a tooling task of its own | plan-050 ruling 3; plan-052 › close; dl-032 E5 | approver | the next tooling task on `runs.ts` |
| Check 0.3.1's `COLLABORATION.md` inbox text | plan-051 ruling 4; inbox README › Rules | approver | the first sync |
| README step 3 "own entries" for Memory types and roles `init` scaffolded | plan-052 › close (task-061's review) | approver | the next README pass |
| Sequencer: W8 has four features | plan-052 › step 2, close | approver | the sequencer's next review |
| dl-012's F4.9 placement | plan-052 › step 2, close | approver | dl-012's ruling |
| W10: `methodology/kanban`, presets, `governance/wingfoil-dogfood`, this repository's adoption, its pin, the first inbox sync | plan-052 ruling 7 | W10 | W10 |
| dl-024 and dl-025 ruled; plan-022 closed | plan-052, plan-053 › close | approver | the next retrospective |
| The private projects' check scripted | prel-001 … prel-003 | approver | the next retrospective |

## Closed

| Item | Source | Settled by |
|---|---|---|
| F-038 `workflow start` fills `workflow`/`phase` | plan-049 › close | task-064 (plan-054) |
| F-039 bug-008 option (iii) | plan-052 ruling 2, close | task-064 (plan-054) |
| The note on 0.3.0's `finalize --dry-run`: moot, fixed in 0.3.1 (plan-051 › Context) | plan-045, plan-046 › close | plan-054 (dl-031 R4) |
| `recheck`'s wording in `wingfoil-release-intake` | plan-051, plan-052 › close | plan-055 (`wingfoil-release-intake` v5) |
