# Owed items

The register of owed items (dl-031): work a plan, a task or another element defers to a later
element. Outside every Memory path. Its rules are rule 4 of the directive `repository-practice`
(`.wingfoil/directives/custom/repository-practice.md`).

- **Open:** one row per item: the item, its source (element and section), its owner and its
  trigger. An item without an owner names the approver; an item without a trigger takes "the next
  retrospective" (dl-031 R1). Rows are sorted by the first element id in Source; rows without one
  come last.
- **Who writes a row:** a plan or a task, in the same commit as the note that leaves the item; a
  pack, a pack-release, a bug or a decision-log, at the latest by the close of the plan that hosts
  it. The note, or for a row added later the hosting plan's note, cites the row (dl-031 R2). The
  element that settles an item moves its row to Closed, with its own id.
- **Who reads it:** every retrospective, in `explore`; it proposes keep, assign or drop for each
  row, and its decision-log rules them (dl-031 R3).

First content: the debts of the inventory of 2026-10-28
(`docs/retrospectives/2026-10-28-periodic-friction-inventory.md` §8), with the rows of dl-028 D1
and D2, approved as a backlog by dl-028 (dl-031 R4), and the row of dl-033 O4.

## Open

| Item | Source | Owner | Trigger |
|---|---|---|---|
| CI policy for advisories in transitive dependencies (met again by bug-009, answered by an override) | bug-004 › note 2026-10-24; bug-009; dl-035 A4 (closes it) | approver | the next retrospective |
| `check:pins` covering `overrides` in `package.json`, which it does not read today (`src/check-pins.ts`, its dependency fields) | bug-009; task-071 | approver | the next dependency update |
| The `minimatch` override removed once `eslint`, `@eslint/config-array` and `typescript-eslint` accept `minimatch` 11; until then it forces every `minimatch` of the tree onto 11.0.3, a later dependency needing another major included, with no warning | bug-009; task-071 | approver | the next dependency update |
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
| The dl actions of dl-035 … dl-037 (`ci.yml` and its test, `repository-practice` 1.2 shared by dl-035 and dl-036, `docs/owed-items.md`'s header, `pack-cycle` v7, `pack-compatibility`, the notes on dl-030, dl-031 and dl-032), a dl actions plan | dl-034 D3; dl-035 A4, dl-036 R6, dl-037 E3; plan-060 ruling 8 | approver | right after the periodic retrospective that WingFoil 0.3.2's intake starts, with that retrospective's governance decision-logs, before WingFoil UI's feedback (plan-060 ruling 8) |
| Charter text drift of `software` (`base@^1`, `end-of-life` row, step-key table, W9) | pack-foundation-software › Execution Notes | approver | the next retrospective |
| `kanban` charter open point 2 exercised: a limit counts the refs WingFoil sees (a holder recorded on a second branch, a branch not fetched), where this repository's per-pack rule meets the whole-repository count | pack-methodology-kanban › Open points 2; dl-034 D2 | W10 | the adoption |
| `kanban` charter open point 3 exercised: two releases of one version on two release lines carry their tasks indistinctly | pack-methodology-kanban › Open points 3; dl-034 D2 | approver | a `software` whose `release` template declares `id`, or the first adopter with parallel release lines |
| Charter text drift of `kanban`: Ships and Acceptance name the composer as the Node.js warning's source, corrected only by plan-057's note | pack-methodology-kanban › Ships, Acceptance, Execution Notes; dl-034 D2 | approver | the next retrospective |
| `scrum` charter open point 1 (UI's test-first steps) | pack-methodology-scrum › Open points, note 2026-10-28 | UI's adoption | UI's adoption |
| `scrum` charter open point 2 (`explore`'s weak evidence), shared by `kanban`'s open point 4 | pack-methodology-scrum › Open points, note 2026-10-28; pack-methodology-kanban › Open points 4 (dl-034 D2) | approver | the next retrospective |
| A decision-log making in-place amendment general; see also G7 | plan-031 › Context | approver | the next retrospective |
| `pack-delivery`'s selection over `accepted` packs (`charter` creates a `draft` pack) | plan-041 › Context; dl-033 O1 | approver | the next retrospective |
| `--param` applies to an `entries` composition only (hit again at prel-003) | plan-043 › note (task-039's review) | approver | the next retrospective |
| `pack-semver` rule for fixes and changed defaults | plan-049, plan-052 › close | approver | the next retrospective |
| This repository keeps `plan-{n}-{slug}` or takes `{workflow}-{phase}-plan` | plan-049 › close; pack-foundation-base › Adoption | W10 | the adoption |
| `check:runs` scenarios of the full scrum and kanban runs (`memory park`, `memory reject`, a field rewritten, `set_state`, a refusal expected) and the `include:` null branch test; a tooling task of its own | plan-050 ruling 3; plan-052 › close; plan-057 ruling 5; dl-032 E5 | approver | the next tooling task on `runs.ts` |
| Check 0.3.1's `COLLABORATION.md` inbox text | plan-051 ruling 4; inbox README › Rules | approver | the first sync |
| README step 3 "own entries" for Memory types and roles `init` scaffolded, in `base`'s, `software`'s and `scrum`'s READMEs (`kanban`'s answers it, task-067) | plan-052 › close (task-061's review); task-067 | approver | the next README pass |
| Sequencer: W8 has four features | plan-052 › step 2, close | approver | the sequencer's next review |
| dl-012's F4.9 placement | plan-052 › step 2, close | approver | dl-012's ruling |
| W10: presets, `governance/wingfoil-dogfood`, this repository's adoption, its pin, the first inbox sync | plan-052 ruling 7 | W10 | W10 |
| dl-024 and dl-025 ruled (both `pending` until then); plan-022 closed | plan-052, plan-053 › close; trigger asked by the approver on 2026-11-01 | approver | WingFoil v0.4's planning |
| `docs/01_vision/06_features.md` 1.5 → 1.6, with its date: F3.3 adds `check:runs`, with a scenario for every `main`, and the adoption run once per `init` template for a pack with install steps (dl-032 E3), beside `workflow list`, `dna show` and `directives list`; F5.2 adds that `wingfoil-release-intake` starts the periodic retrospective at its close (`retrospective-start`, dl-029) | plan-055 › Execution Notes (leftovers); trigger asked by the approver on 2026-11-01 | approver | the next plan that changes the documentation |
| This repository's per-pack WIP rule under `methodology/kanban`, whose `limits` count the whole repository (a total limit, or the rule kept by hand over a looser one) | plan-056 ruling 10; pack-methodology-kanban › Adoption | W10 | the adoption |
| How this repository's tasks carry a `release` under `methodology/kanban`, its packs being released per pack, not through `software`'s `release` | plan-056 › step 4; pack-methodology-kanban › Adoption | W10 | the adoption |
| This repository's custom `retrospective`, `decision-log-ingest`, `bug-ingest` and `adr-ingest` share `base`'s and `software`'s workflow names (bug-007's pattern) | plan-056 › step 4; pack-methodology-kanban › Adoption | W10 | the adoption |
| This repository's `pack-author` phases (`design`, `build`, `deliver`) map to `developer` under `methodology/kanban`'s `work-item` | plan-056 › step 4; pack-methodology-kanban › Adoption | W10 | the adoption |
| The private projects' check scripted | prel-001 … prel-003 | approver | the next retrospective |
| dl-026's stale Consequences ("reported late until it completes", no longer true after plan-047 ruling 15 and task-057; the WingFoil side is F-036) | task-057 › notes | approver | the next retrospective |
| WingFoil UI's feedback after adopting `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0 by hand on WingFoil 0.3.1: a gate on `software`'s `release` at `releasing` and on `release-line` at `active` (UI's local deviations), `bug`'s `planned` gate, gates offered out of phase, the AGENTS.md region's fixed agent roles and `bug` gates, `security-secrets` against the approver's email in `dna.yaml`, `governance-evolution` › `apply` asking for a generated region updated, a `sprint` field naming no Sprint accepted at `submit`; captured by a plan of its own (`bug-ingest` or `decision-log-ingest`) | WingFoil UI's adoption feedback, 2026-11-02; trigger asked by the approver on 2026-11-02 | approver | after WingFoil 0.3.2's intake, its periodic retrospective and the dl actions plan of dl-035 … dl-037 (asked by the approver on 2026-11-02, plan-059; plan-060 ruling 8) |

## Closed

| Item | Source | Settled by |
|---|---|---|
| F-038 `workflow start` fills `workflow`/`phase` | plan-049 › close | task-064 (plan-054) |
| F-039 bug-008 option (iii) | plan-052 ruling 2, close | task-064 (plan-054) |
| The note on 0.3.0's `finalize --dry-run`: moot, fixed in 0.3.1 (plan-051 › Context) | plan-045, plan-046 › close | plan-054 (dl-031 R4) |
| `recheck`'s wording in `wingfoil-release-intake` | plan-051, plan-052 › close | plan-055 (`wingfoil-release-intake` v5) |
| The Node.js warning on an unquoted integer parameter, `{{name}}` (`methodology/kanban`'s `limits`): from the parse of a pack's raw YAML, before substitution, at two sites: the secret rules (run by the lint and the composer) and the index's reads of a pack's fragments and workflows (`npm run index`, `validate`, `validate:publication`, `publish:pack`) | plan-056 ruling 13; plan-057 ruling 6 | task-066, task-070 (plan-057) |
| The README generator writes an empty `Memory types` line (``- `task`: `` with a trailing space) for a type whose fragment `states` holds only `limits`, as `methodology/kanban`'s `task` (`memoryLines`, `src/readme-generate.ts`: no `—` without a sequence) | task-067 › review | task-072 (plan-057) |
| W10: `methodology/kanban`, its first version | plan-052 ruling 7 | plan-058 (prel-006) |
| `kanban`'s own `pack-cycle` retrospective | plan-058 ruling 5; dl-033 O2 | plan-059 (dl-034) |
