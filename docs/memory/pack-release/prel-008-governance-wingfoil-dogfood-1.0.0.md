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

<!-- The compatibility matrix: every WingFoil version tested, every preset composed, the
     determinism double-run, with the commands and their exit codes. -->

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
