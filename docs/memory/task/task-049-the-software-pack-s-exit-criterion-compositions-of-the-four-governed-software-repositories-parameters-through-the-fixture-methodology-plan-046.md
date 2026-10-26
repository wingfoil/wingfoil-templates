---
id: task-049-the-software-pack-s-exit-criterion-compositions-of-the-four-governed-software-repositories-parameters-through-the-fixture-methodology-plan-046
type: task
title: "The software pack's exit criterion: compositions of the four governed software repositories' parameters through the fixture methodology (plan-046)"
status: backlog
pack: "pack-foundation-software"
depends_on: [task-048]
tags: ["packs","software","W8"]
---

## Context

The last of plan-046's three pack tasks: `software`'s exit criterion (dl-022 S6). `software`
composes and validates on WingFoil 0.3.0 with the parameters of the four governed software
repositories, through the fixture methodology, which is never published (R-12). Under plan-046's
rulings 1 and 3, `base` and `software` stay in `packs/`, the overlay `tests/fixtures/software-exit`
holds the methodology and the compositions, one per distinct parameter set, and the check is
`validate --overlay` in the CI (task-047's step).

**The parameter sets**, read from the public repositories (`wingfoil/wingfoil@eb582cc1`,
`wingfoil/wingfoil-ui@6a5ad5c7`, `wingfoil/wingfoil-benchmark@0ba19e5d`, this repository at
`4b43816f`), for `software`'s parameters and, alongside, `base`'s as task-039 read them:
- **the defaults**: this repository (its `adr`, `tech-spec` and `bug` at `docs/memory/<type>/`,
  no `release` or `release-line` of its own, `base`'s defaults); task-047's `defaults`
  composition already holds it;
- **Benchmark**: `software`'s and `base`'s defaults but `release_path`
  `docs/memory/release/{id}.md` (no folder per release line), `release_id` `rel-{slug}` and
  `release_line_id` `rl-{n}`;
- **WingFoil**: `adr_path` `docs/04_memory/design/adrs/{id}.md`, `tech_spec_path`
  `docs/04_memory/design/specs/{id}.md`, `bug_path` `docs/04_memory/bugs/{id}.md`,
  `release_line_path` `docs/04_memory/planning/{id}.md`, `release_path`
  `docs/04_memory/planning/rl-{release-line}/{id}.md`, `release_id` `{kind}-{version}`,
  `release_line_id` the default; `base`'s values of task-039's `release-folders`;
- **UI**: as WingFoil's but `release_path` `docs/04_memory/planning/{release-line}/{id}.md`;
  `base`'s values of task-039's `release-folders-lean`.

`inception_path` keeps its default in every set: each of the four fills the `inception` slot with
its own workflow (`lean-inception`, `benchmark-inception`, `templates-inception`), which writes
several files and which the charter's Adoption maps to the slot's name, so `software`'s default
`frame`, the one place the parameter is read, is not where they write. Four distinct sets: three new
compositions beside `defaults`, which the approver confirms at the backlog acceptance.

**What the review found on WingFoil 0.3.0** (2026-10-26, each set composed in a scratch tree and
judged by the matrix's own run): all four sets pass `workflow list`, `dna show` and
`directives list` with no diagnostic. `{kind}` in WingFoil's and UI's `release_id` is accepted: a
project gives it at `memory add` (`--set kind=minor`), as those projects add `kind` to `release`'s
required frontmatter in their own `memory.yaml`. One friction the matrix does not see, recorded,
not a failure: with Benchmark's `release_id` (`rel-{slug}`) and its `release_path` without
`{release-line}`, 0.3.0 refuses `--set version` and `--set release-line` (no such token in the id
or path), so those required fields are filled by editing the draft before `submit`; the fixture's
`plan-release` description says so.

Every composition names a fictional project (spec-002 §2.4 does not apply to overlay compositions,
but `pack-authoring`'s rule on fictional situations does) with fictional approver and agent
identities under `*.example`. The overlay's compositions are not README examples: section 7 keeps
its exemption line until W10. Three compositions add three matrix runs to the overlay step
(4 → 7); no tested count of this repository's lint or index moves, and the overlay's own
`overlay: checked <n> files` line grows by three. `tests/validate.test.ts`'s overlay test moves
(`compositions: 4` → 7, `4 runs` → 7) under dl-018 R1–R3.

## Acceptance

1. **The compositions**: `tests/fixtures/software-exit/compositions/{flat-releases,
   release-folders,release-folders-lean}/example.yaml` (Benchmark's, WingFoil's and UI's sets),
   each naming a fictional project that no other fixture names, each `packs: [software@^1,
   methodology/fixture@^1]`, with exactly the values of its set above for `software`'s parameters
   that differ from the defaults and, for `base`'s: none (`flat-releases`); the five of task-039's
   `release-folders` (`release-folders`); the four of `release-folders-lean`, `retrospective_path`
   unset (`release-folders-lean`); and `base`'s four required parameters set to fictional values
   (`*.example` addresses). The fixture's `plan-release` description adds that a required field
   the id and path do not carry is filled by editing the draft before `submit`.
2. **They compose and validate**: `npm run validate -- --overlay tests/fixtures/software-exit`
   exits 0 on WingFoil 0.3.0 alone, every composition composed twice byte-identical, with no
   warning (`matrix: self-test, 7 runs, 0 failed, tolerance applied: none`); the CI's overlay step
   runs them on every branch push.
3. **The test**: `tests/validate.test.ts`'s overlay test, its title naming the four compositions,
   asserts each composition's `composed twice` line, `compositions: 7` and `7 runs`, red first
   (dl-018 R1), the red run recorded.
4. **The mapping**: the Execution Notes record which public repository each composition's set
   matches, at the commits above, including `defaults` for this repository, and two facts of
   Benchmark's at `0ba19e5d`: its `docs/retrospective-inputs/` holds inputs, not a retrospective
   workflow's output, so `retrospective_path` keeps its default; it declares `release-line` with no
   element of it yet.
5. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`,
   `validate -- --overlay tests/fixtures/software-exit`, the golden fixture's step and
   `workflow list` exit 0 with no warning; the CI run on the pushed branch concludes `success`.
   Privacy (plan-041's rule): `git diff main` holds no local path (`/home/`), no name of a private
   project, no real person's name or address, and no address but `*.example`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-26: independent review: approve after amendments, nothing blocking, no ruling changed.
  Every value checked at the pinned commits; each set composed in a scratch tree and judged by the
  matrix's run on WingFoil 0.3.0: no diagnostic. Applied: the `{kind}` contingency replaced by the
  finding; Benchmark's `--set` friction recorded and the fixture's description to say so; the
  inception fillers named (`templates-inception` too) and the charter's Adoption cited; the overlay
  line's count; `base`'s values per composition; set-describing ids and fresh fictional names;
  the overlay test's title and per-composition lines. Submitted for the approver's acceptance into
  the backlog.
