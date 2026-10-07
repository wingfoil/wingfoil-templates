# WingFoil-Templates: notes for WingFoil's next retrospective and release planning

> **Branch note (2026-10-05).** This note was written on a first attempt that skipped phases of
> this repository's own `sw-life-cycle`. That attempt is kept on the branch
> `archive/draft-2026-10-05`, and `main` restarts from the WingFoil configuration commit
> (`539e943`). The ids cited below exist only on that branch, as unapproved drafts:
> `dl-001`, `dl-002`, `dl-003`, `spec-001`, `pack-*`, `task-001`, `prel-001`. So do
> `catalog.yaml`, `compat.yaml`, `schema/` and `packs/`. On `main` they are recreated through the
> workflows, and their ids may differ.

**Status:** temporary inbox, not Memory. Read during WingFoil's next `retrospective`
(`additional-points` phase) and `release-planning` (v0.4, the release that already carries P4.18–P4.20
and the "methodology packs" idea, `docs/04_memory/planning/rl-v1/minor-v0.4.md:45-50`). Turn each note
into official WingFoil Memory elements there (decision-log / tech-spec / task / bug). Delete each
note here once it has an official counterpart.

**Official counterpart in WingFoil (found 2026-10-05):** `dl-138-wingfoil-consumes-templates-configurations-methodologies-and-directives-from-a-remote-versioned-source`
(`ready`, release v0.4) decides the direction these notes assume. Its open questions map onto them:
- Q1 (vendored and pinned, with a lock) ↔ T5;
- Q2 (an explicit update command with a three-way merge) ↔ T7;
- Q3 (a third asset class, `remote`) ↔ T7 and the `pack-authoring` directive here;
- Q4 (trust: allowlist, schema check, secret scan) ↔ T4;
- Q5 (release v0.4) ↔ open question 6.

Read each note together with dl-138. What the notes add beyond it: the axes model (T2), versioning
by format and capability (D6, T12, T13), stages and transitions (T8), the bundled-pack release
step (T3).

**Context:** the repository `WingFoil-Templates` was opened on 2026-10-01 to become the **official,
live source of WingFoil templates** (configurations, workflows, directives) that the `wingfoil` CLI
downloads. These notes come from the design discussion held before any implementation, and from an
analysis of WingFoil at commit `30f06016` (`v0.2.2-1778-g30f06016`, v0.3 in development, wave 1).
Every reference below points into the WingFoil repo at that commit.

---

## Decisions already taken by the approver (2026-10-05)

These are inputs to the planning, not proposals. A DL should record them.

| # | Decision |
|---|---|
| D1 | The AI-agent variants of the methodologies are an **overlay** (`team-mode`), applied on top of any methodology, not separate methodology packs. |
| D2 | The lifecycle **stage** axis uses the full scale: `prototype` → `mvp` → `production` → `maintenance` → `sunset`. |
| D3 | Every **pack has its own semver**. The base packs **stay bundled in the npm package** as offline fallback. **Before each WingFoil release, WingFoil advances its bundled packs to the newest version published on WingFoil-Templates.** |
| D4 | First scope of WingFoil-Templates: methodologies `scrum`, `kanban`; overlay `team-mode/agent-first`; phase methods `inception/lean-inception`, `specification/bdd-sbe`; blueprints `web-service`, `cli-library`; stages `prototype`, `production`, plus the transition between them. |
| D5 | The WingFoil-side changes go through WingFoil's own process (these notes → retrospective/planning), not as direct edits from the templates repo. |
| D6 | (2026-10-05, WingFoil-Templates `dl-002`) A pack's compatibility contract is the **file formats** its content is written in plus the WingFoil **capabilities** it needs, not a hand-written range of WingFoil versions. A `compat.yaml` maps each WingFoil release to the formats it reads and the capabilities it provides; the version range is computed from it. Before WingFoil 1.0: one living line per pack, older versions frozen. From 1.0: lines N and N-1 maintained for a declared window. Depends on T12 and T13. |

---

## T1 — Templates are compiled TypeScript; there is no external template source

Init templates are string generators in `src/storage/templates.ts` (`SCRUM`, `KANBAN` at :35-49,
`DEFAULT_TEMPLATE` at :58) and `src/storage/builtin-directives.ts`. They have no source files, no
manifest, no version and no remote origin. Nowhere in the code, specs, DLs or plans is there a remote
template repository. The phrase "template registry" (`src/cli/program.ts:131`, spec-008) only means the
in-code `TEMPLATES` array (true at `30f06016`; since then WingFoil has `dl-138`, see the header). The only rendering is JS template literals over `def.name`, `def.slug`,
`def.cadence` and `def.methodologies`. There are no project parameters, not even `project.name`.

Proposal: WingFoil-Templates becomes the single source of truth for packs. The bundled base packs
(D3) are **generated from it** by a build step (a vendored, pinned copy), not hand-written TS strings.
Check the spec-015 tarball constraint (`files: ["dist","README.md"]`): either the vendored packs are
compiled into `dist/` as data, or `files` gains a `templates/` directory.

Suggested kind: decision-log (template source of truth and bundling) + tech-spec (pack format).

## T2 — Pack model: orthogonal axes instead of monolithic templates

With one template per combination (methodology × team × project type × stage) the number of templates
grows combinatorially. The proposed model composes **one pack per axis**:

| Axis | Decides | Initial / candidate values |
|---|---|---|
| `methodology` | delivery cadence, delivery sub-workflow, roles, ceremonies | `scrum`, `kanban`; later `scrumban`, `shape-up`, `xp` |
| `team-mode` (overlay, D1) | who executes and who approves | `human`, `hybrid`, `agent-first` |
| `phase/<slot>` | how each `sw-life-cycle` phase is run; one pack per slot | inception: `lean-inception`, `design-sprint`, `working-backwards`, `event-storming`. specification: `bdd-sbe`, `story-mapping`, `rfc-driven`. release: `trunk-based`, `gitflow`, `release-train`. operations: `sre-lite`, `incident-mgmt` |
| `blueprint` | `paths`/`modules` skeleton, domain directives, extra Memory types, checks | `web-service`, `web-frontend`, `mobile-app`, `cli-library`, `iac`, `data-pipeline`, `embedded-iot` |
| `stage` (overlay, D2) | how strict the process is | `prototype`, `mvp`, `production`, `maintenance`, `sunset` |
| `stack` (later) | per-language quality directives | `typescript-node`, `python`, `go`, `terraform` |
| `governance` (later) | compliance / community obligations | `open-source`, `regulated`, `gdpr` |

**Presets** name curated combinations, for example `startup-mvp` = kanban + agent-first + web-service +
lean-inception + mvp.

Each pack ships:
- `pack.yaml`: id, axis, semver, `formats` + `requires_capabilities` (D6), `requires`/`conflicts`, the slots it
  fills, and its parameters;
- declarative fragments merged into `dna.yaml`, `roles.yaml` and `memory.yaml`;
- directives, workflows and Memory templates.

Composition must be **deterministic**: the same packs, versions and parameters produce byte-identical
files, which is the north star (Determinism Index).

**Reclassification of dl-009.** dl-009 lists "Scrum, Kanban, Lean Inception, Trunk-Based" as four
methodology templates. In this model only Scrum and Kanban are methodologies. Lean Inception fills
the `inception` slot, and Trunk-Based fills the `release` slot. `docs/01_vision/X_cli-cmds.md:205`
(`METHODOLOGY` enum) has the same mix. The P4.18–P4.20 features
(`docs/02_requirements/02_bdd/features/p4-workflow/`) should be re-read against the axes. In
particular, P4.19 "expansion conflict" is the slot/conflict rule above.

Suggested kind: decision-log (the axes and the composition rules), then a tech-spec.

## T3 — Pack versioning and the "advance bundled packs" release step (D3)

Packs are semver'd one by one. Their compatibility is declared as formats + capabilities (D6, T12,
T13), and the WingFoil range shown to users is computed from them. D3 adds a release rule: before a
WingFoil release, the bundled base packs move to the newest published version on WingFoil-Templates
that is compatible.

This mirrors `release-planning`'s `advance-pinned-build` (dl-095 Q3): forward only, published only,
and one commit that touches only the vendored packs and their lock. Proposal: add a phase,
`advance-bundled-packs`, to `release-submit` (or to `release-planning`). Its post-check: every
bundled pack's version equals the newest compatible published version, and the full test suite
passes on the new packs.

Open point: how a published pack version is addressed. Candidates:
- per-pack git tags, `<axis>/<pack>@<semver>`;
- a `catalog.yaml` that maps each version to a commit.

Suggested kind: decision-log + a change to the `release-submit`/`release-planning` workflow.

## T4 — Remote content conflicts with dl-031 ("no digest, no manifest")

`src/core/init.ts:134-135` applies `dl-031-req-sec-10-integrity-depth`: the integrity check on
built-in templates is schema validation only, with "no digest, no manifest, no checksum". That was
right for assets compiled into the package. It is not enough for content downloaded from a network.

Proposal:
- a `catalog.yaml`/manifest with a digest per pack version;
- verification before anything is written;
- schema validation and the secret scan (task-135) applied to downloaded packs exactly as to built-ins;
- the official repository as the only source by default (third-party sources are a later decision).

Suggested kind: decision-log that extends or supersedes dl-031 for remote packs.

## T5 — Projects need a lock to make `init` reproducible and upgrades possible

Today nothing in a project records which template produced its `.wingfoil/`, apart from
`project.methodology` in `dna.yaml`, which is a free string that nothing reads afterwards.

Proposal: `.wingfoil/templates.lock` records:
- the source (repository plus tag or commit);
- every pack with its version and parameters;
- the current stage;
- a digest of every generated file.

The digests let an upgrade tell "the pack changed this file" from "the user changed this file" (a
three-way merge). The lock is also what makes `init` repeatable on another machine.

Suggested kind: tech-spec (lock format) + task.

## T6 — `init` asks one question; the vision asked for more

`selectTemplate` (`src/cli/init-command.ts`) asks only `Select a methodology template [Scrum, Kanban]`.
The vision (`docs/01_vision/X_cli-cmds.md:196`) planned
`--mode wizard/params/infer`, `--tech-stack` and `--team-size`.

Proposal:
- `wingfoil init --preset <name>`, or one flag per axis (`--methodology`, `--team-mode`,
  `--blueprint`, `--stage`, `--phase inception=lean-inception`);
- an interactive wizard that asks the same questions;
- `--no-interactive` that requires the flags;
- `wingfoil template list` / `template show <pack>` to browse the catalog.

The current `--template Scrum|Kanban` stays as an alias for `--methodology` during a deprecation
window.

Suggested kind: tech-spec update (spec-008 init) + tasks.

## T7 — No command updates the configuration after init

There is no `update`, `upgrade`, `migrate`, `sync`, `profile` or `stage` command. A second `init` is
refused (`src/core/init.ts:56`): "edit the files under .wingfoil/ and commit them". The automatic
"Sync Process" on `dna set methodology` / `tech-stack` (`docs/01_vision/X_cli-cmds.md:101-108`,
`:155-159`) was specified but never implemented. Nothing re-applies newer built-in directives to an
existing project, and the dogfood project itself was never migrated to its shipped built-ins (bug-040).

Proposal, with explicit commands rather than side effects of `dna set`:
- `wingfoil pack add <pack>` / `pack remove <pack>`. This is the "addable afterwards" half of the
  methodology-packs idea in `minor-v0.4.md`.
- `wingfoil upgrade [--dry-run]`: move packs to newer compatible versions. It shows the diff first and
  uses the lock (T5) for the three-way merge.

Both build on the existing `built-in/` / `custom/` split. Packs only ever write `built-in/`, and a
`custom/` file with the same id overrides the pack (dl-037, today directives only). Extend that
precedence to workflows (`.wingfoil/workflows/built-in/` exists but is always empty) and to Memory
templates.

Suggested kind: decision-log (explicit commands replace the vision's implicit sync; dl-037 precedence
generalized) + tech-spec + tasks.

## T8 — No lifecycle stage: moving from demo to production, or pre- to post-release, is manual

There is no config key for the project's maturity. Stage exists only as workflow position and element
state (release states, `sunset`/`end-of-life`). Moving a project from prototype to production, or
from pre-public-release to post-public-release, changes what the process should demand:
- approval gates;
- a semver and breaking-change policy;
- `CHANGELOG`;
- a deprecation policy;
- global security directives;
- coverage thresholds.

Today nothing models that change.

Proposal:
- stage is a pack axis (D2), and the current stage is recorded in the lock and in `dna.yaml`
  (`project.stage`, new key);
- `wingfoil stage set <stage>` runs a **transition** that WingFoil-Templates defines (for example
  `transitions/prototype-to-mvp.yaml`, `mvp-to-production.yaml`), with three parts:
  - **pre-checks**, for example: an approver exists (relates to dl-071, where init seeds no
    approver), CI is green, no open critical bug;
  - **actions**: swap the stage overlay, enable gates, create a `decision-log` element that records
    the transition;
  - **one commit**: `wf(stage): mvp → production [...]`.

The transition is itself traceable in Memory, like every other mutation.

Related: dl-105 (phase `cadence: once|recurring`), dl-132 (changing the vision after inception, a
neighbouring "the project changed shape" process), task-183 (`version:` bump check on the config
files, which an upgrade or transition must honour).

Suggested kind: decision-log (stage model + transitions) + tech-spec + tasks.

## T9 — The `agent-first` overlay depends on v0.3/v0.4 agent work

The overlay (D1) does the following:
- declares `team.agents` with `executes_as`, with humans kept as approvers;
- sizes tasks small, with machine-checkable acceptance criteria;
- turns the WIP limit into parallel worktrees/agents;
- turns ceremonies into asynchronous checkpoints: the sprint review becomes an approval gate, and the
  retrospective becomes a generated decision-log;
- makes the determinism and claim-evidence directives mandatory.

It leans on work not yet landed: adapters (spec-016, adr-012, task-196 installs them at init),
`paths.runs` (task-138), `agent execute` (v0.3), and perennial agents (dl-080, unmerged). The overlay's
`pack.yaml` must declare the minimum WingFoil version that provides those pieces.

Suggested kind: dependency note on the v0.4 planning; no element by itself.

## T10 — The first packs fix known scaffold gaps

Extracting the first packs from WingFoil's own workflows (as `minor-v0.4.md` already proposes) should
close the scaffold gaps already reported:
- benchmark note N1: the scaffold's `sw-life-cycle` has empty phases, there is no inception workflow
  and no `plan` type, and the ingest workflows have no actions;
- bug-144: the Kanban template includes a workflow by path.

A pack is accepted into WingFoil-Templates only if every preset composed from it passes
`wingfoil workflow list` and the config validation with zero errors. This mirrors task-199 for the
dogfood workflows. WingFoil-Templates CI will run that check against the WingFoil versions in the
pack's compatibility range.

Suggested kind: acceptance criterion on the P4.18 tasks; CI contract between the two repos.

## T11 — `memory add --set` fills only id tokens, so required fields cannot be set at creation

Found while bootstrapping this repository with WingFoil 0.2.2 (npm, pinned exact), 2026-10-05.
The `pack` type requires `axis` and `pack_path` in its frontmatter. Running
`npx wingfoil memory add --type pack --title Scrum --set pack=methodology-scrum --set axis=methodology
--set pack_path=packs/methodology/scrum` exits 1 with
`--set axis: memory type 'pack' has no token {axis} in its id_pattern or path`. A field can be set at
creation only if it is also a token of the id. The workaround here was to change the id pattern to
`pack-{axis}-{name}` (which happens to suit this type) and to fill `pack_path` by editing the draft.
For a type whose required fields do not belong in its id, the only way is to edit the file by hand
before `submit`, which N13 of the benchmark notes already flags as committed silently.

Also observed: `memory add` reads the **committed** `memory.yaml`, so a just-edited id pattern is not
seen until it is committed. That is consistent with REQ-SYS-03, but the error above does not say so.

Suggested kind: bug or decision-log (should `--set` write any frontmatter field the template
declares?), plus a hint in the error when the working-tree `memory.yaml` differs from the committed one.

## T12 — Format key distinct from `version:` — **delivered, has official counterparts**

Delivered on 2026-10-05 to the session "Note per DL e bug wingfoil" as urgent for v0.3. It is now:
- **`dl-149`** (`every-wingfoil-file-declares-its-format-in-a-format-key-distinct-from-version-…`),
  decision-log, `in-discussion` at delivery;
- **`task-251`** (`add-the-format-key-to-the-config-workflow-directive-and-template-schemas-…`),
  v0.3, feature, priority high, `pending`. Handed to the v0.3 dev-loop as urgent.

Differences from this note, found by the receiving session in the WingFoil repo:
- Memory templates already carry `tmpl_version`. It is the template's revision, not its format, and
  it stays as it is.
- Agent adapter manifests already carry `format: 1` (task-177, `ADAPTER_MANIFEST_FORMAT`). They are
  the model for the new key.
- `wingfoil migrate` (T13) is cited there as a separate proposal and is not part of dl-149.

Remove this stub once dl-149 is ratified and task-251 is done.

## T13 — `wingfoil migrate` and `wingfoil capabilities`

Two commands that D6 relies on. Both are useful to WingFoil projects regardless of packs.

- **`wingfoil migrate [--to <format>] [--dry-run]`.** Rewrites a project's files from format N to
  N+1 for each file kind.
  - Deterministic, with the diff shown before writing, and one commit
    (`wf(migrate): workflow 1 → 2 [...]`).
  - Each step is shipped by WingFoil with the release that introduces the new format.
  - Without it, every WingFoil project, not only pack users, has to rewrite its files by hand at
    the first format change.
  - In WingFoil-Templates, migrations also produce the first draft of a pack's next version in the
    new format.
- **`wingfoil capabilities --format json`.** Prints, for the running WingFoil:
  - the format versions it reads per file kind;
  - the capabilities it provides (for example `workflow-engine`, `agent-execute`, `pack-install`,
    `stage-transitions`, `migrate`).

  The pack resolver of `init` / `pack add` / `upgrade` matches it against a pack's `formats` and
  `requires_capabilities`. WingFoil-Templates reads it to keep its `compat.yaml` true without
  parsing changelogs. The vocabulary proposed in WingFoil-Templates `compat.yaml` is a starting
  point; WingFoil owns the names.

Release: `migrate` is needed in the first release that ships a format 2 (v0.3 if T12's change
lands there, else v0.4); `capabilities` with pack installation (v0.4).

Suggested kind: decision-log + tech-spec (migration step contract) + tasks.

## T14 — The base pack depends on the AGENTS.md marker format that WingFoil dl-137's tech-spec will define

WingFoil-Templates `dl-003` (D3.8, rules R1–R4) settles who owns `AGENTS.md` once packs exist:
- **R1.** It is never a pack file.
- **R2.** Packs contribute sections; WingFoil generates the file (dl-137 Q2 iii).
- **R3.** WingFoil owns only a region between markers and regenerates it. The rest belongs to the
  project, and the drift check reads only that region.
- **R4.** Until WingFoil exports `AGENTS.md` (v0.4), projects write it by hand with the markers
  already in place.

The pack `base` 0.1.0 ships its section, `packs/base/agents/section.md`, with **provisional**
markers: `<!-- wingfoil:generated:begin -->` and `<!-- wingfoil:generated:end -->`. The repositories
adopting `base` by hand (Templates, Benchmark, UI) will copy them into their `AGENTS.md`.

**What WingFoil needs to fix** (dl-137 or its tech-spec):
- the marker syntax;
- whether there is one region, or one region per contributed section;
- what the drift check reports;
- what happens when the markers are missing or malformed.

**What depends on it:** if dl-137 picks a different syntax, `base` needs a patch release and every
adopting repository rewrites two lines of `AGENTS.md`. That stays cheap only if the syntax is
fixed before many projects adopt `base`.

**Status (2026-10-05):** WingFoil dl-137 now carries R1–R4 as constraints on its part-(b) tech-spec,
with a relation to dl-138 (amend `eac64831`). It is ratified (`ready`, approve `9b915e4f`), so the
rule itself is decided. Still open is only the **marker syntax**, which comes with the part-(b)
tech-spec in v0.4. Realign `base` (a patch release) to that tech-spec when it is published. If
WingFoil2's own `AGENTS.md` (dl-137 part (a), v0.3) lands first, align to the markers it uses.

Suggested kind: none new. This is a dependency of WingFoil-Templates on the dl-137 part-(b)
tech-spec; delete the note once `base` uses the final markers.

## T15 — One composer for packs, written in WingFoil-Templates and proposed to WingFoil

Decided by the approver on 2026-10-06, in the features review of WingFoil-Templates
(`docs/01_vision/06_features.md`, F3.2, option c). The context and the proposal:

- **Why a composer is needed now.** Until WingFoil installs packs (v0.4, dl-138), nothing composes
  them, so nothing can validate them. WingFoil-Templates therefore writes a minimal composer for its
  own validation: TypeScript on Node.js ≥ 22.12, as WingFoil.
- **The risk.** Two composers, one in each repository, can diverge, and a pack can then validate in
  one and fail in the other.
- **The proposal.** WingFoil adopts this composer as the implementation of the composition step of
  `init`, `pack add` and `upgrade`, instead of writing a second one. Composition is specified in
  WingFoil-Templates spec-001, the pack format.
- **To decide in WingFoil:**
  - whether the composer moves into WingFoil, or becomes a package that both repositories depend on;
  - how it relates to the lock (T5) and to the three-way merge (T7).

Suggested kind: decision-log in WingFoil, with dl-138, during the v0.4 planning.

**Recorded in WingFoil-Templates (2026-10-06):**
- `adr-001-a-reference-composer-in-this-repository-proposed-to-wingfoil-as-its-implementation`
  holds the decision;
- `adr-002-repository-tooling-in-typescript-on-node.js-22.12-or-later` holds the language. It uses
  WingFoil's toolchain, compiles with `tsc` and pins every dependency exact.

Both are `pending` at the time of writing. The composer implements only composition: the merge,
parameters, slots, `requires`/`conflicts` and cardinalities. Download, lock, upgrade and three-way
merge stay WingFoil's. A difference between the two composers, once WingFoil composes, is reported
here.

**Libraries (2026-10-06, WingFoil-Templates `adr-003-tooling-libraries-yaml-ajv-semver-and-the-node.js-test-runner`,
`pending`):** the composer depends on `yaml` 2.9.1, `ajv` 8.20.0 (Ajv2020) and `semver` 7.8.5, with
`node:test` for tests. WingFoil uses `js-yaml`, which reads `format: 1.0` as the integer 1 with no
trace of the source text; spec-001 §18 must reject that, and `yaml` keeps the source text. If
WingFoil adopts the composer, it either takes `yaml` as a dependency or reimplements that check.

## T16 — A workflow phase cannot declare the method it follows

Approved as a proposal by the approver on 2026-10-06, in the session that compared the phases of
the four governed repositories.

**Observed.** The workflow format has no field for the method a phase follows. The method is
named only in YAML comments and descriptions, so a phase without one goes unnoticed:
- named: `lean-inception` (Lean Inception), `specification-downcast` (User Story Mapping, BDD,
  Volere), `dev-loop` (TDD) in WingFoil2 and UI; GQM and Kanban in Benchmark;
- house-made, marked only *"Best practice adapted to WingFoil"*: `release-planning`,
  `retrospective`, `release-submit`, `release-publishing`, `end-of-life`. `release-cycle` even says
  *"story points"* for planning, but no phase of `release-planning` estimates them.

**Proposal.** An optional per-phase (or per-workflow) key, for example:

```yaml
method: { kind: methodology | standard | house, ref: "Kanban Method — replenishment" }
```

`house` makes the absence of a method explicit instead of silent. `standard` covers mechanical
phases, which follow a convention rather than a methodology (SemVer, Keep a Changelog, ADRs).

**The rule that must come with it.** The label never replaces the steps. Every practice the method
requires is spelled out as phases, checks, `produces` or Memory templates. A bare reference such
as "Shape Up" leaves the definition to the model's own knowledge. Different agents read it
differently, and the variance between two runs grows instead of shrinking.

**Effect on the Determinism Index (dl-131).**
- **I:** none. It is already 100% by tests.
- **P:** none while no check reads the key. It grows only if a method maps to checks that P can
  measure (e.g. Kanban: replenishment yields an ordered backlog within the WIP limits).
- **O:** small and not measurable yet. The phases concerned (planning, retrospective, roadmap)
  hardly change the software's behaviour.
- The real gain is traceability. It is also what lets a pack be checked against the method it
  claims. WingFoil2-Benchmark could measure P with and without the expanded method on a scenario
  that includes release planning.

**Related in WingFoil-Templates:** dl-003 D11 restores the `release` slot, so a phase pack can fill
release planning with a named method.

Suggested kind: decision-log in WingFoil, with the workflow format (dl-149 `format:` key) during
the v0.4 planning; the `pack-authoring` directive of WingFoil-Templates then adopts the rule.

## T17 — The pack format and its schemas, format 1 (WingFoil-Templates spec-001)

Written on 2026-10-06 on the branch `spec/spec-001`. spec-001 is `pending`, so the contract may
still change at the approver's review. Required by the `wingfoil-feedback` directive: a change to
`schema/` is reported to WingFoil.

**What WingFoil will read** (spec-001 §11–§15, `schema/*.schema.json`, JSON Schema 2020-12):
- `catalog.yaml`. It holds:
  - the axes and slots as data;
  - one entry per pack (`catalog: official | community`, `status`);
  - one entry per published version, copying `formats`, `requires_capabilities`, `requires` and
    `conflicts`, so that a resolver needs no download to resolve. It also has `commit`, `digest`
    and the computed `wingfoil` range.
- `compat.yaml`: per WingFoil release, `format_key`, `reads` and `capabilities`.
- `pack.yaml`, presets and transitions.
- Every file of this repository carries `format: 1`. Every file a pack ships carries `format:`
  (dl-149).

**Points for WingFoil:**
- **0.2.2 warns on `format:`.** `workflow list`, `dna show` and `directives list` print
  `unknown field(s) ignored: format` and exit 0. This was checked on a scratch clone, 2026-10-06,
  WingFoil 0.2.2 from npm.
  - It is expected and not a bug, since the key is dl-149 (v0.3).
  - Consequence: `compat.yaml` marks 0.2.2 `format_key: false`, and no pack is compatible with it.
  - Please confirm that v0.3 accepts the key, without warning, in all seven kinds: dna, memory,
    roles, workflows, workflow, directive, memory-template.
- **Memory templates under `memory/templates/built-in/`.** Packs install directives and workflows
  under `built-in/`. For Memory templates there is no such folder, so spec-001 writes them to
  `.wingfoil/memory/templates/built-in/<type>.md` and sets the type's `template.file` to that path.
  0.2.2 reads it (`memory add` works, checked 2026-10-06).
  - If WingFoil generalizes the built-in/custom precedence to templates (T7), please use this
    folder.
- **Pack directive ids vs WingFoil's built-in directive ids** (`architecture`, `documentation`,
  `security`, …). spec-001 makes a collision an error. Overriding stays the project's `custom/`.
  WingFoil should publish the list of reserved ids.
- **`workflows/bindings.yaml`** (v0.3) is not a dl-149 kind. Will packs ship it?
- **Composition determinism across implementations.** spec-001 requires byte-identical output from
  one composer only (adr-001, T15). If WingFoil writes its own composer, a canonical YAML
  serialization has to be agreed.
- **Generated `workflows.yaml`.** Packs ship no `workflows.yaml` fragment. The composer generates
  the include list from each pack's inventory.
- **AGENTS.md section.** `agents/section.md` has no frontmatter and no `format:` until dl-137
  defines the kind. The markers are still T14's provisional ones.

**Amended after the independent review (2026-10-06):**
- the composed `workflows.yaml` is fixed at format 1, and the compatibility check includes
  `reads.workflows`;
- the catalog copies each transition's `formats` and `requires_capabilities`;
- spec-001 records two new open points for WingFoil:
  - O11: task-251 decision 4. Does `memory add` copy a template's `format:` into elements?
  - O12: WingFoil's own built-in directives share `directives/built-in/` with pack files. Who owns
    the folder on upgrade?
- `workflows/bindings.yaml` is now cited against WingFoil dl-153.

Suggested kind: input to the v0.4 planning, with dl-138 (the resolver reads `catalog.yaml` and
`compat.yaml`).

## T18 — `where:` on `iterate_over` is declared but nothing evaluates it

Found on 2026-10-06 in WingFoil-Templates, at the first real iteration of `sw-life-cycle` ›
`tooling` (`iterate_over: task`, `where: { pack: "" }`), WingFoil 0.2.2 from npm.

- `workflow list` accepts the `where` clause, with exit 0 and no warning, so the declaration parses.
- No command evaluates it. `memory search` filters only by `--type`, `--status`, `--tag` and a
  keyword, and does not print the `pack` field. Nothing lists the elements a phase iterates over.
- So the iteration is followed by hand: the agent selects the tasks with an empty `pack` by reading
  their frontmatter. Expected with no workflow engine, but the clause cannot be tested either.

Suggested for the v0.3 workflow engine: a command that lists an iteration's elements (for example
`wingfoil workflow elements <workflow> <phase>`), or a `memory search --field pack=` filter, and a
check that a `where` key is a field of the iterated type.

Suggested kind: input to the workflow engine's tech-spec (v0.3).

---

## Open questions for the planning

1. Pack addressing (T3): per-pack git tags, or a catalog mapping versions to commits?
2. Where the current stage lives: lock only, or `dna.yaml` `project.stage` too (T8)?
3. Which packs are bundled as fallback: exactly the D4 set, or only `scrum` + `kanban` + the
   `prototype` stage?
4. Cache location and offline behaviour: `~/.cache/wingfoil/templates`, plus an `--offline` flag that
   uses only bundled and cached packs?
5. Third-party or private pack sources: dl-138 opens WingFoil to them, with an allowlist (Q4). Are
   they in v0.4, or only the official source first?
7. dl-138 Q3: if a third asset class `remote` is ratified, packs install there instead of
   `built-in/`. The `pack-authoring` directive of WingFoil-Templates follows that ruling.
6. Which release: everything in v0.4 alongside P4.18–P4.20, or `stage` and `upgrade` in a later minor?
