---
id: task-080-intake-prepare-the-mechanical-part-of-a-release-s-record-written-by-a-deterministic-script-plan-065-task-b
type: task
title: "Intake prepare: the mechanical part of a release's record written by a deterministic script (plan-065 task B)"
status: approved
pack: ""            # tooling task (tooling-delivery v3), plan-065 task (B)
depends_on: []
tags: ["tooling","intake"]
---

## Context

plan-065's task (B) (rulings 1 to 3), third after task-078 and task-079: the mechanical part of
`wingfoil-release-intake`'s `record`, written today by hand in each intake task (task-059,
task-074), written instead by a deterministic script, `npm run intake:prepare -- <version>`. Task
(C) runs it in its **prepare** job and uploads its diff; this task writes the script and its tests
only, no workflow. The files it writes are task (C)'s allowlist: the pin folder
`src/matrix/wingfoil-<version>/`, `compat.yaml`, `catalog.yaml`, `CATALOG.md`,
`catalog-index.json` and the golden fixture's `compat.yaml` (`tests/fixtures/compose/tree/`,
dl-010). task-079 made `npm test` pass on such a diff with no hand edit. dl-042 (approved
2026-11-05) rules the row's content: I2, `capabilities` carried forward from the newest recorded
release for a verified patch, a new one only from a CHANGELOG entry, which makes the report guided;
I3, the release's facts in its `notes`, which the intake writes by hand: the script writes a
placeholder. The CHANGELOG, the bar of "verified" and the checks on the new release are task (C)'s;
this script runs no WingFoil release and reads no network but the lockfile's resolution.

## Acceptance

`npm run build` precedes the commands.

1. **The command.** `npm run intake:prepare -- <version> [--tree <dir>]` (`src/intake-prepare.ts`,
   its CLI `src/intake-prepare-cli.ts`, the script in `package.json`); `--tree` defaults to the
   current directory, as `index-cli` does, and must be the top level of the tree's git repository
   (the index reads its tags). Exit 0 with one line per file whose text changes, in byte order
   (`byBytes`); exit 2 on a wrong command line; exit 1 otherwise, writing nothing, naming the
   reason: one exit code for a refusal and a failed step alike, since either way nothing is
   written (`intake-detect`'s 1 and 2 tell a found version from a failed read; here only 0
   writes).
   Refused: a version not a strict `X.Y.Z`, already recorded in `compat.yaml`, or not greater than
   the newest recorded release (a backport: plan-065 (A) prepares none, dl-042 I1 has (C) prepare
   only the lowest missing version); and a tree already inconsistent, so that the diff carries the
   intake only: the golden fixture's `compat.yaml` not byte-equal to the root's (dl-010),
   `src/matrix/wingfoil-<version>/` already present, text after the last release row of
   `compat.yaml`, a `catalog.yaml` range not equal to `computeRange` from the current `compat.yaml`,
   or the index not up to date. A minor or a major is not refused: classing is task (C)'s, and
   plan-065 point 5 needs the checks on a prepared tree for a guided intake too. Every file's new
   text is computed in memory and checked before the first write: every refusal and failed step
   comes before it; an I/O error during the writes is the one exception, the CLI then naming the
   files already written.
2. **The pin folder** `src/matrix/wingfoil-<version>/`: `package.json` as `JSON.stringify(…, null,
   2)` plus `\n`, keys in the order `name` (`wingfoil-matrix-<version>`), `private` (`true`),
   `description`, fixed and naming no task (`WingFoil <version> as the compatibility matrix
   installs it: exact pin, committed lockfile`), `dependencies` (`wingfoil` at the exact version);
   `package-lock.json` from the resolver: it writes that `package.json` into a temporary directory
   outside the tree, runs `npm install --package-lock-only --ignore-scripts` there (spawned with
   `shell: false`, the Node.js and npm the job names, no `--before`, plan-065 ruling 3), returns the
   lockfile's text and removes the directory. The script writes that text byte for byte (dl-042 I1:
   never regenerated), after checking it in memory with `check-pins`'s rules (`checkPins` and the
   matrix release's: `lockfileVersion` 2 or higher, `node_modules/wingfoil` at exactly
   `<version>`); a failure is a refusal.
3. **The `compat.yaml` row**, appended after the last release row, every other byte kept, in the
   rows' exact format: two-space `- wingfoil: <version>`, then four-space `format_key`, `reads`,
   `capabilities`, `notes`; `reads` copied as the newest release's flow-mapping text,
   `capabilities` its flow sequence (dl-042 I2's carry-forward); `format_key: true` written
   provisionally (task (C)'s zero-warning publication run confirms it, a mismatch making the
   report guided); `notes` a fixed, greppable placeholder that the intake replaces (`"Prepared by
   intake:prepare; the intake writes this sentence (dl-042 I3)."`), so that a check of (C) or v7's
   `record` can find one left in place. The same row appended to the golden fixture's `compat.yaml`
   (dl-010). The file still loads with `loadCompat` and its schema.
4. **The ranges and the index.** Every version entry's `wingfoil` in `catalog.yaml` set to
   `computeRange` from the new `compat.yaml`, the code and inputs `src/tag-rules.ts` checks, only
   those scalars rewritten with their quoting kept (`">=0.3.0 <=0.3.3"`), every other byte kept;
   then the index's two root outputs, `CATALOG.md` and `catalog-index.json`, as `npm run index`
   computes them (`rootOutputs` over the working tree overlaid with the new `catalog.yaml` and
   `compat.yaml`, as `publish.ts` does), in memory before any write; no other file of the index
   (`llms.txt`, the READMEs' sections) changes, since a range is not in them; `npm run index --
   --check` exits 0 and `npm run check:packs` reports 0 problems on the result.
5. **Deterministic and offline-tested** (the `testing` directive), in
   `tests/intake-prepare.test.ts`: the tree a temporary git repository with published versions
   (`tests/support/git-repo.ts`, `published-repo.ts`, as `index.test.ts` builds one), its
   `compat.yaml` from `FROZEN_COMPAT` or a frozen copy of its own, neither this repository's nor
   the golden fixture's (task-045's rule), no test reading this repository's `catalog.yaml`
   (`catalog-fixture.test.ts`'s rule); fixtures, if any, under `tests/fixtures/intake/prepare/`.
   The resolver injected, so the module's tests run no npm: the files written checked against the
   expected text (`CATALOG.md` and `catalog-index.json` against `rootOutputs` of the expected
   tree), two runs on equal trees with the same resolver byte-identical, each refusal of
   Acceptance 1 and 2 tested and writing nothing, a `catalog.yaml` comment kept. The CLI's real
   resolver tested with a stub `npm` on `PATH`, as task-078's tests do (no real npm): it receives
   exactly `install --package-lock-only --ignore-scripts` in a directory holding the pin's
   `package.json`; a stub exiting non-zero gives exit 1, names the step and writes nothing; the
   CLI's exit codes and lines.
6. **On this repository**, run once on a local-only scratch clone (its tags kept, never pushed, run
   alone) for a `0.3.3`, with a resolver answering the 0.3.2 lockfile with the top-level `name`
   (`wingfoil-matrix-0.3.3`), `packages[""].name`, `packages[""].dependencies.wingfoil` and
   `node_modules/wingfoil`'s `version` changed, its `resolved` and `integrity` left as 0.3.2's
   (no such release exists on npm; nothing installs it there): the diff touches only (C)'s
   allowlist; `npm run check:pins`, `npm run index -- --check` and `npm run check:packs` pass; `npm
   test` passes, as task-079's tree did; recorded with the commands, the tests run and failing. The
   real resolver runs in task (C)'s CI.
7. **No other file changes** than the two sources, `package.json`'s script, the tests and their
   fixtures, this task and `docs/owed-items.md`; no workflow (task (C)'s), no change to
   `intake-detect`. `ci.yml` needs none: its cache key hashes
   `src/matrix/wingfoil-*/package-lock.json` and its audit loops over every pin folder.
8. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success` (both jobs, run id and durations)
   and dl-039's local list on Node.js 22.21.0; `npm run lint` exits 0; Acceptance 6's tree, with
   the frozen commit's changes, passes. The privacy check of the branch's diff recorded.

## Design

Branch `task/task-080-intake-prepare` from `main` at this task's add. `src/intake-prepare.ts`
exports `prepareIntake(tree, version, resolve)`: the checks, then every file's new text computed in
memory (the lockfile from `resolve`, the `compat.yaml` rows as text appended after the last row, the
`wingfoil:` scalars replaced at their ranges from `yaml`'s `parseDocument`, as `catalog-edit.ts`
reads the file, the index by `rootOutputs` over an `overlay`), then the writes. The CLI's resolver
spawns `npm` with `shell: false`, as `intake-detect-cli.ts` does. Red steps: (1) the tests of
Acceptance 5 and the module's signature with no body: red, the failing count; (2) the module and
its CLI: green; (3) Acceptance 6's scratch tree, by a script in the task's notes (not committed).

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-06: written under plan-065 (task (B)), added on `main` after task-079 was done, no
  other task added on any branch meanwhile (W-14).
- 2026-11-06: independent review of the body: approve after amendments, two blocking findings
  (nothing written on a failed step cannot hold with `runIndex`, which reads and writes the tree:
  the index by `rootOutputs` in memory; the lockfile resolved in the pin folder, a write before the
  checks: a temporary directory, the lockfile checked in memory); applied with the others: the
  fixture tree a git repository, task-045's rule in full, the refusals of an inconsistent tree, a
  minor or major not refused, the stub `npm`, the fake lockfile's fields, the exact byte format,
  the exit codes, the placeholder greppable, `ci.yml` unchanged.
- 2026-11-06: re-review: approve; its one nit (an I/O error during the writes) applied.
- 2026-11-06: accepted into the backlog by the approver; started (backlog → in-progress) on
  `task/task-080-intake-prepare`. Red (dl-018): `tests/intake-prepare.test.ts` with the module's
  signature returning a refusal and an empty CLI, `npm run build && node --test
  dist/tests/intake-prepare.test.js`: 19 tests, 19 failing, each on its assertion (the trees
  build). Green: `19661ce` (`src/intake-prepare.ts`, `src/intake-prepare-cli.ts`, the script in
  `package.json`): 19 tests, 0 failing; two test bugs fixed on the way (a `trim()` cutting git's
  status column; a `PATH` hiding git as well as npm, replaced by a failing stub `npm` never run).
  Mutations of the built module, each caught by one failing test: the golden fixture's equality,
  the pin folder present, the text after the last row, the stale index, the lockfile's pins, the
  backport, the range's quoting.
- 2026-11-06: independent build review of `19661ce`: approve after amendments, nothing blocking;
  should-fix: the stale-index test covering `CATALOG.md` only (a check narrowed to the root outputs
  survived), the quotes kept untested from a quoted range, an error other than a refusal crashing
  the CLI; nits: an indented comment after the last row, a block or alias range, `lockfileVersion
  1` with a `packages` map, npm's stderr dropped, the temporary directory's removal on a failure,
  the I/O-error path, duplicated helpers, the matrix rule's comment, CRLF; all applied in
  `bc02c04`, the frozen commit (23 tests, 0 failing; the reviewer's two surviving mutations now
  caught). Re-review: approve; its two nits need no change (the `lockfileVersion: 1` case is in the
  lockfile test already; `Refusal` kept as documentation).
- 2026-11-06: Acceptance 6, on a local-only scratch clone with its tags, run alone, by a script run
  outside the repository (`git clone`, `npm ci`, `npm run build`, then `prepareIntake` for `0.3.3`
  with a resolver answering the 0.3.2 lockfile with the top-level `name`, `packages[""].name`,
  `packages[""].dependencies.wingfoil` and `node_modules/wingfoil`'s `version` changed): on
  `19661ce` and again on `bc02c04`, exit 0, the diff the seven files of task (C)'s allowlist, the
  six ranges `>=0.3.0 <=0.3.3`; `npm run check:pins`, `npm run index -- --check` and `npm run
  check:packs` exit 0; `npm test` 1099 tests, 0 failing on `19661ce`, 1103 tests, 0 failing on
  `bc02c04`.
- 2026-11-06: checks (dl-039 R1, R2), once, on `bc02c04`: the branch CI, run 42227582673,
  `success`, jobs Node.js 22.12.0 20 min 21 s and 22.21.0 20 min 17 s (none over 25 minutes); from a
  clean working tree on Node.js 22.21.0 after `npm ci` and `npm run build`: `npm run
  validate:publication`, the golden tree in publication mode and `npm run -s wingfoil -- workflow
  list` exit 0, `directives list --format json` with `"warnings": []`; `npm run lint` exits 0;
  Acceptance 6's tree passes (above). This commit changes only `docs/memory`: no new run. Privacy
  check of the branch's diff and messages: no local or scratch path, no maintainer name or email,
  no private project, no intermediary session.
