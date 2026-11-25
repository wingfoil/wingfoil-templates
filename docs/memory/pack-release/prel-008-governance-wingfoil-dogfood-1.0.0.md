---
id: prel-008-governance-wingfoil-dogfood-1.0.0
type: pack-release
title: "governance/wingfoil-dogfood 1.0.0"
status: validating
pack: "pack-governance-wingfoil-dogfood"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.2"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","feedback","governance","wingfoil","dogfood"]
---

## Changes

The first version of `governance/wingfoil-dogfood` (plan-082 … plan-084's `pack-ingest`, which
captured and ruled it, with dl-051, and handed off to its charter plan; plan-085's `charter`;
plan-086's `author`; plan-087's `first-release`), shipping:
- task-104: the pack: the roles fragment, the directive `wingfoil-cli` (the rules of running the
  project's pinned WingFoil CLI, rules 1 … 7, the source key read from the inbox's **Source key**
  line, and the form of the known behaviours) and the directive `wingfoil-channel` (tagged
  `feedback-channel`, serving the target `upstream:wingfoil`: a feedback item routed there becomes
  a note in WingFoil's format in the project's inbox, with its six fields, the kind mapping, the
  citation, the evidence and the ledger); the parameters `wingfoil_command`, `wingfoil_inbox_path`
  and `wingfoil_known_behaviours_path`; its README, with the inbox skeleton in its install steps,
  and the examples `defaults` and `with-software`;
- task-105: the route through `wingfoil-channel` in `check:runs` (`wingfoil-dogfood.yaml`, one run
  per example) and the adoption run once per `init` template (`adoption-wingfoil-dogfood.yaml`,
  dl-032 E3).

It ships no workflow, no Memory type and no bug fix, and depends on no tooling task of its own: the
channel's checks (`servedTargets`, `channelProblems`, `channelConflicts`) were in place with
`governance/feedback`.

Requires `base@^2`, published as 2.0.1, and `governance/feedback@^1`, published as 1.0.0, with
`requires_capabilities: []`. It is the first published pack with no workflow and an empty capability
list: as `pack-compatibility` asks of a pack that ships no `main`, its `check:runs` evidence starts
the composition's `feedback-ingest` and `feedback-review`, which reach `wingfoil-channel` (task-105,
`wingfoil-dogfood.yaml`). It is the first that serves a target of `governance/feedback`'s channel
(spec-003 §5), the first besides `base` with a required parameter with no default
(`wingfoil_command`), and the second published from a `pack.yaml` at format 2. The defaults of its
two path parameters become fixed with this version; `wingfoil_command` has none, each project
setting it (the charter's Parameters, plan-085 point 4); the defaults are the convention for new
projects (the charter's Commitments to adopters).

**Class: `major`**: a first version (`pack-semver`; plan-087 ruling 1). `pack.yaml` reads
`version: 1.0.0`, unchanged. `CHANGELOG.md`'s `1.0.0` entry was rewritten at `prepare`
(`5e0408e6`, plan-087 ruling 2) so that its first line, the tag's annotation (`publish:pack` takes
that line only), is a whole sentence: `- 1.0.0: first version: the channel back to WingFoil and the
rules of the pinned WingFoil CLI.`

`pack.yaml`'s `formats` (`roles` 1, `directive` 1) give the range computed from `compat.yaml`:
`>=0.3.0 <=0.3.2`, its floor from `format_key` (`src/range.ts`: 0.2.2 reads no format key), the
pack's own `requires_capabilities` being empty; its matrix runs on 0.3.0 and 0.3.2, 0.2.2 left out
both by `format_key` and by `governance/feedback`'s `workflow-engine` (plan-087's rehearsal; to be
confirmed by the dry run at `validate`). The README's "Install and update" keeps spec-002 §2.3's
temporary mark: no release in `compat.yaml` provides `pack-install` (CB-3).

No private projects' check (plan-087 ruling 5): the pack is optional, no private project composes
it, and its release changes nothing they compose; the owed row "The private projects' check
scripted" stays untriggered. No notice at this tag and no note to WingFoil (plan-087 ruling 10).

At `publish`, `publish:pack` adds `governance/wingfoil-dogfood` with its first version in
`catalog.yaml` and regenerates `CATALOG.md` and `catalog-index.json`; the approver runs it with
`--report` and the atomic push (plan-087 ruling 6). CB-6's live check then reads `latest: 1.0.0`
and the pack's README and `pack.yaml` at `refs/tags/governance/wingfoil-dogfood@1.0.0` (plan-087
point 7).

## Validation

- Commit: `b41e1589b71563da471a0076c8398bcd5c951176`
- Command: `npm run validate:publication -- --evidence`
- Mode: publication
- Exit code: 0
- WingFoil releases: 0.3.0, 0.3.2
- Compositions: presets/classic-kanban.yaml, presets/classic-scrum.yaml,
  tests/fixtures/examples/base/core-records/example.yaml,
  tests/fixtures/examples/base/release-folders-lean/example.yaml,
  tests/fixtures/examples/base/release-folders/example.yaml,
  tests/fixtures/examples/feedback/added-outcome/example.yaml,
  tests/fixtures/examples/feedback/defaults/example.yaml,
  tests/fixtures/examples/feedback/with-software/example.yaml,
  tests/fixtures/examples/kanban/defaults/example.yaml,
  tests/fixtures/examples/kanban/team-limits/example.yaml,
  tests/fixtures/examples/scrum/defaults/example.yaml,
  tests/fixtures/examples/scrum/release-folders-lean/example.yaml,
  tests/fixtures/examples/software/defaults/example.yaml,
  tests/fixtures/examples/software/release-folders-lean/example.yaml,
  tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml,
  tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml

Report:

```text
schemas: checked 10 files, 0 problems
lint: checked 101 files, 0 problems
index: checked 9 files, 0 not up to date
composition presets/classic-kanban.yaml: composed twice, 36 files, byte-identical
composition presets/classic-scrum.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/base/core-records/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders-lean/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/feedback/added-outcome/example.yaml: composed twice, 44 files, byte-identical
composition tests/fixtures/examples/feedback/defaults/example.yaml: composed twice, 21 files, byte-identical
composition tests/fixtures/examples/feedback/with-software/example.yaml: composed twice, 45 files, byte-identical
composition tests/fixtures/examples/kanban/defaults/example.yaml: composed twice, 36 files, byte-identical
composition tests/fixtures/examples/kanban/team-limits/example.yaml: composed twice, 36 files, byte-identical
composition tests/fixtures/examples/scrum/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/scrum/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml: composed twice, 23 files, byte-identical
composition tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml: composed twice, 46 files, byte-identical
compositions: 16
matrix presets/classic-kanban.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml[+software]: skipped, no methodology
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml[+software]: skipped, no methodology
matrix tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/wingfoil-dogfood/with-software/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix: publication, 32 runs, 0 failed, tolerance applied: none
```

The evidence above ran in the Node.js 22.21.0 clean clone below.

Also, at `validate` (plan-087 step 5, point 4):
- Presets: `presets/classic-kanban.yaml` and `presets/classic-scrum.yaml`, neither holding
  `governance/wingfoil-dogfood`; the pack's documented combinations are its two README examples
  above, `defaults` (23 files) and `with-software` (46 files), each composed twice, byte-identical
  (CB-2, the examples as fixtures). The pack has no conditional part. The line `matrix
  tests/fixtures/examples/wingfoil-dogfood/defaults/example.yaml[+software]: skipped, no
  methodology` is the coverage leg that adds `software` to `defaults`, derived from
  `governance/feedback`'s conditional entry `with: software@^1`, which `defaults` holds: `software`
  requires a methodology and `defaults` holds none, so the format forbids that request and the leg
  is skipped, not failed, as `governance/feedback`'s `defaults` leg (spec-001 §3 and §15; task-087
  ruling 3; `src/resolve.ts` › `forbiddenBy`). `with-software` runs in the matrix above on 0.3.0 and
  0.3.2.
- `npm run check:runs` on 0.3.0 and 0.3.2 (dl-032 E3, `pack-compatibility`): 92 runs, 0 failed,
  exit 0. `governance/wingfoil-dogfood`'s 8, each `pass`:
  `tests/fixtures/runs/wingfoil-dogfood.yaml` (4 runs: `route-upstream-wingfoil-defaults` and
  `route-upstream-wingfoil-with-software`, each starting the composition's `feedback-ingest` and
  `feedback-review`, which reach `wingfoil-channel`, the pack shipping no `main`);
  `tests/fixtures/runs/adoption-wingfoil-dogfood.yaml` (4 runs: the adoption on `with-software` by
  a project `wingfoil init --template Scrum` and `--template Kanban` wrote).
- The overlays (self-test): `software-exit`, `scrum-exit` and `kanban-exit` 40 runs each,
  `feedback-exit` 48 runs, each 0 failed, tolerance none; the golden step (`npm run validate --
  --tree tests/fixtures/compose/tree --param project_name=Golden`), 26 runs, 0 failed, the 0.2.2
  tolerance of its own (dl-009).
- No run by hand (plan-087 point 4): the charter asks for none (no `release`, no `delivery`).
- `npm run publish:pack -- --pack governance/wingfoil-dogfood --dry-run` in the Node.js 22.21.0
  clean clone of `b41e1589`, its remote removed: exit 0; its publication matrix 32 runs, 0 failed,
  tolerance none; the tag `governance/wingfoil-dogfood@1.0.0` at `b41e1589`, the range `>=0.3.0
  <=0.3.2`, the digest `sha256:7c4b949f517d7ef9624b22e618b3247de39cb3ae861218066685e3009acfce49`
  (as plan-087's rehearsal); the clone left clean, no tag added. The tag goes on the approval's
  commit, where `publish:pack` validates again.
- Checks from clean clones of `main` at `b41e1589` on Node.js 22.21.0, then 22.12.0, one after
  the other: `npm ci`, `npm run build`, `npm test` 1504 of 1504, `lint`, `check:pins`,
  `check:schemas` (10 files), `check:packs` (101 files, 0 problems; its README rules are CB-1's
  evidence), `index -- --check` (9 files, 0 not up to date), `validate` (16 compositions, 32 runs,
  0 failed), the golden step, the four overlays, `workflow list`, `check:runs` (92 runs, 0
  failed), `npm audit --omit=dev` in the root and `npm audit` in the four matrix folders
  `src/matrix/wingfoil-*/` (0 vulnerabilities): every command exit 0 on both, each tree left
  clean; the WingFoil matrix cache copied from the checkout after `npm ci`.
- CB-3: the README's "Install and update" against `compat.yaml`, as Changes says: the temporary
  mark kept, no release provides `pack-install`.
- `main`'s CI on `b41e1589`, run 45587710605: `success` (`validate (22.12.0, 1)` 10 min 36 s,
  `(22.12.0, 2)` 5 min 50 s, `(22.21.0, 1)` 10 min 44 s, `(22.21.0, 2)` 6 min 44 s, the step
  "Texts, the lines this push adds to main" `success`); Pages, run 45587710488, `success`.
- No private projects' check (plan-087 ruling 5), as Changes says.
- The privacy check of this element and of the pack's files: no local path, no private
  repository, no private project, no intermediary session.

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. -->

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-25, `prepare` (plan-087 step 4): added by `memory add`; `pack`, `version`, `bump`,
  `wingfoil` and `line` filled by editing the draft (W-02); Changes written; the CHANGELOG entry
  rewritten in its own commit before this element (plan-087 ruling 2); the README's "Install and
  update" checked against `compat.yaml` (CB-3: the temporary mark kept, no release provides
  `pack-install`).
- 2026-11-25: independent review (dl-017, `cf20743d`): approve after amendments; no blocker, one
  should-fix (the channel's first cited to spec-003 §5, not `pack-compatibility`, which instead
  governs the `check:runs` evidence of a pack with no `main`, now stated) and four nits (the
  required parameter cited to the charter's Parameters; `pack-ingest`'s hand-off worded as its
  plan's; 0.2.2 left out by both `format_key` and `workflow-engine`; the tag `dogfood` and the two
  other firsts of plan-087's Reads), all applied in the commit that records this note. No
  re-review: the amendments correct citations and add facts the review verified; no claim of the
  release changes.
- 2026-11-25, `validate` (plan-087 step 5): the evidence of point 4 on `b41e1589`, recorded above.
  A first pass of the clean-clone script ran `validate:publication -- --evidence` before `npm run
  build` (exit 1, no `dist/`) and audited the local matrix cache (`.cache/wingfoil-matrix/0.3.1`,
  older than its committed lockfile, hono 4.13.14: 2 moderate advisories) instead of
  `src/matrix/wingfoil-*/`, the folders the CI audits; both reran in the same clones, exit 0, as
  recorded above. The local cache is not a published input: the matrix reads 0.3.0 and 0.3.2, and
a cached release whose stamp differs from its committed lockfile is reinstalled
(`src/matrix.ts` › `installRelease`), so the copied cache cannot feed the matrix a stale install.
- 2026-11-25: independent review of the Validation (dl-017, `e7d98586`): approve after
  amendments; no blocker, one should-fix (the `[+software]` leg's origin named:
  `governance/feedback`'s entry `with: software@^1`, which `defaults` holds) and two nits (the
  stale cache's reinstall stated, applied; Changes' "to be confirmed by the dry run at `validate`"
  kept, Changes being `prepare`'s record and the Validation its confirmation), applied in the
  commit that records this note. The review verified the counts (16 compositions, 32 runs, 92 runs
  as 84 + 8, the overlays 40/40/40/48 as prel-007's plus 4 each), the digest against the
  rehearsal, the CI run on `b41e1589`. No re-review: the amendments explain, they change no
  evidence. Submitted (`validating → releasing`).
