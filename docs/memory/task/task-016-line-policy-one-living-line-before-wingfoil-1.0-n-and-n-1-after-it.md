---
id: task-016-line-policy-one-living-line-before-wingfoil-1.0-n-and-n-1-after-it
type: task
title: "Line policy: one living line before WingFoil 1.0, N and N-1 after it"
status: in-progress
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-015-feedback-notes-on-publication-and-schema-change"]
tags: ["tooling","W7","F5.3"]
---

## Context

Task 13 of plan-015 (`sw-life-cycle` › `tooling`, wave W7, F5.3), the last of the tooling phase's
backlog. Tooling task, no pack. Below, "plan-015 task N" names a step of that plan, not a Memory
element.

It comes from:
- **F5.3 and dl-002** (ruled 2026-10-05): before WingFoil 1.0, one living line per pack, written in
  the newest formats; older versions stay tagged and listed, frozen, and get no further fix. From
  WingFoil 1.0, lines N and N-1 are maintained for a declared window of at least one WingFoil minor;
  N-1 gets fixes only;
- **`pack-semver`** (Lines and maintenance): N-1 lives on the branch
  `maint/<catalog pack id>/<major>.x` and receives fixes only, never features; a fix for both lines
  is made on N first, then backported, and the two `pack-release` elements cite each other;
- **spec-001 §4 and dl-004 3(b):** the maintenance branch name, from WingFoil 1.0 only; **§11:** a
  pack's `versions` are in ascending semver order;
- **task-014:** `publish:pack` today refuses any version that is not above every published version
  of the pack, which is the rule before WingFoil 1.0; the `pack-release` template's `line` field is
  `current`, or `<major>.x` for an N-1 line.

"From WingFoil 1.0" is read from `compat.yaml`: the policy of lines N and N-1 applies once it lists a
release `1.0.0` or later. Today it lists 0.2.2 only, so the single-line rule is the one in force;
the N-1 path is proven in the tests, as task-014 proved the publication path.

Ruled by the approver on 2026-10-10:
- **N-1 is the pack's previous major:** the newest published major below the current one. dl-002
  speaks of format generations; a format move is always a major (`pack-semver`), and any other major
  starts a new line too. This is the reading of dl-002 the tooling applies;
- **N-1 takes a patch or a minor** above the line's newest version, with the line's formats (a
  format move is a major); "a fix, not a feature" stays the review's judgement (`pack-release`
  `bump`, `pack-semver`);
- **an N-1 publication tags the maintenance branch's head and commits the catalog entry on
  `main`,** where `catalog.yaml` lives (spec-001 §11 order: the tag, then the catalog commit); the
  maintenance branch's own `catalog.yaml` is never edited.

Not in scope: the length of the maintenance window and when an N-1 line freezes: the window is
declared in the N release's `pack-release` element, the tool does not check it, and a publication on
an expired line is stopped at `approve-publication`; `catalog.yaml` format 1 has no marker of a
frozen line. Also not in scope: classifying a change's bump (`pack-semver`); backport tooling;
`pack-semver`'s `0.x` rule, untouched.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network.
2. **Before WingFoil 1.0** (no release `1.0.0` or later in `compat.yaml`): `publish:pack` keeps
   task-014's rule, a version above every published version of the pack. On a `maint/…` branch it
   refuses (exit 1: "maintenance lines start with WingFoil 1.0"), before the validation and the
   range check.
3. **From WingFoil 1.0**, `publish:pack` decides the line from the version and the branch; the
   published versions are always read from `catalog.yaml` on `main` (`git show main:catalog.yaml`):
   - **current line (N):** a version above every published version of the pack, from any branch
     that is not a `maint/…` branch, as before;
   - **N-1 line:** a version below the newest published one is accepted only when all hold, or exit
     1 naming the rule broken:
     - the checked-out branch is `maint/<catalog pack id>/<major>.x`, of this pack, with `<major>`
       the version's major;
     - that major is the newest published major below the current one (N-1, not older);
     - the version is a patch or a minor above the newest published version of that major;
     - its `pack.yaml` `formats` equal those of that newest version (no format move);
     - the branch's head descends from that version's tag;
   - on the N-1 line the tag is made at the maintenance branch's head, and the catalog commit is
     made on `main` without checking it out (git plumbing on `main`'s tree), so the maintenance
     branch's working tree and its `catalog.yaml` are untouched;
   - the Publication section prints `- Line: current` or `- Line: <major>.x`, the value of the
     `pack-release` element's `line` field.
4. **Catalog order:** `catalog-edit` inserts a version entry at its semver position among the pack's
   versions, so an N-1 version published after a newer major keeps `versions` ascending (§11). The
   lint rules of task-012 and task-014 pass on `main` afterwards, the tag rules included for a tag
   whose commit is reachable only from the maintenance branch.
5. **Tests** on scratch repositories (task-014's helpers):
   - before 1.0, with a fixture `compat.yaml` whose stub release is `0.9.0` (`format_key: true`): a
     `maint/` branch is refused before any validation;
   - from 1.0, with task-014's fictional `9.0.0` stub: `1.0.0`, then `2.0.0` on the current line,
     then `1.0.1` and `1.1.0` on `maint/base/1.x` cut from the tag `base@1.0.0`, their entries
     placed before `2.0.0` in `main`'s catalog, the branch's own `catalog.yaml` unchanged;
   - refused: `1.0.1` from `main`; `1.0.1` on `maint/base/2.x` or `maint/methodology/kanban/1.x`;
     an N-2 version (`1.0.1` when `3.0.0` is the newest); a `2.0.0` on `maint/base/1.x`; a format
     move on N-1; a maintenance branch that does not descend from the line's newest tag.
6. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-016-lines`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`.

- **`src/lines.ts`:** `decideLine({ pack, version, formats, branch, published, fromOne,
  descends })` returns the current line or the maintenance line `<major>.x`, or throws `LineError`
  naming the rule broken (acceptance 2–3). `published` comes from `main`'s `catalog.yaml`; `fromOne`
  is "compat.yaml lists a release 1.0.0 or later"; `descends(tag)` asks git whether the branch's
  head descends from a tag.
- **`src/publish.ts`:** reads the branch (`symbolic-ref --short HEAD`), `main`'s catalog
  (`git show main:catalog.yaml`) and `compat.yaml` before the validation, and decides the line
  first. On the current line nothing changes. On a maintenance line it tags the branch's head, then
  writes the catalog commit on `main` with plumbing and a temporary index (`read-tree main`,
  `hash-object`, `update-index`, `write-tree`, `commit-tree -p main`, `update-ref` with the old
  value), so the branch's working tree is untouched; the rollback also moves `main` back.
  `--bundled` is refused on a maintenance line: the note goes to `main`'s inbox with
  `npm run feedback:note` there. `--dry-run` clones the checked-out branch and creates a local
  `main` in the clone.
- **`src/catalog-edit.ts`:** `addVersion` inserts the entry at its semver position.
- **Tests,** red first: `tests/lines.test.ts` (the decision, unit), `tests/publish.test.ts` (the
  scenarios of acceptance 5), `tests/catalog-edit.test.ts` (the insertion);
  `tests/support/published-repo.ts` takes the fixture release's version (`0.9.0` before 1.0).

## Execution Notes

- 2026-10-10: amended while `pending`, after an independent review and the approver's three rulings
  (N-1 is the previous major; patch or minor on N-1; tag on the maintenance branch, catalog commit
  on `main`): the published versions read from `main`'s catalog; the before-1.0 fixture with a
  `0.9.0` stub, since task-014's `9.0.0` stub is already "from 1.0"; the maintenance refusal before
  the validation; the window recorded in the N release's `pack-release` element; the checks on the
  branch's descent and on formats; the tag rules on a tag reachable only from the maintenance
  branch.
- 2026-10-10, build on `task/task-016-lines`, as `developer`: `src/lines.ts` (the decision);
  `publish:pack` decides the line before the tag check, the CHANGELOG and the validation, reading
  the published versions from `main`'s catalog; on `maint/<id>/<major>.x` it tags the branch's head
  and commits the catalog entry on `main` with plumbing; `addVersion` inserts at the semver
  position; `--dry-run` clones the checked-out branch and adds a local `main`. Tests: the decision
  (unit), the four scenarios of acceptance 5 (a refusal leaves the branch, its tags and `main` as
  they were, and never reaches the validation), the insertion. 606 tests, ESLint, `check:pins`,
  `check:schemas`, `check:packs`, `npm audit` 0.
- In the scenario tests, kanban's `requires` follows base's major (`base@^2` once base is 2.0.0): a
  methodology requires `base@^<major>` (the schema), so base 2.0.0 composes with kanban only so.
