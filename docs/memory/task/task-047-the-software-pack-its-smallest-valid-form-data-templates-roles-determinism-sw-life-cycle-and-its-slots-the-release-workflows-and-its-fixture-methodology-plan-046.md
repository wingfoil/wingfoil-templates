---
id: task-047-the-software-pack-its-smallest-valid-form-data-templates-roles-determinism-sw-life-cycle-and-its-slots-the-release-workflows-and-its-fixture-methodology-plan-046
type: task
title: "The software pack, its smallest valid form: data, templates, roles, determinism, sw-life-cycle and its slots, the release workflows, and its fixture methodology (plan-046)"
status: done
pack: "pack-foundation-software"
depends_on: []
tags: ["packs","software","W8"]
---

## Context

The first of plan-046's three pack tasks (ruling 2): the smallest `software` that the lint, the
composer and WingFoil 0.3.0 all accept, written from the accepted charter `pack-foundation-software`
(its open points 1–3 accepted as written, plan-041). `software` composes only with a methodology
(spec-001 §3), so WingFoil sees it only through task-046's overlay, with the exit criterion's
fixture methodology (R-12, plan-041 ruling 12). `sw-life-cycle` includes the four slots, and the
fixture's `delivery` includes `release` (the charter's contract), so the smallest valid form holds
`sw-life-cycle`, the `inception`, `specification` and `end-of-life` defaults, `release`,
`release-submit` and `release-publishing`. task-048 adds `adr-ingest`, `bug-ingest` and the
AGENTS.md section; task-049 the compositions of the four governed repositories' parameters.

No `catalog.yaml` entry (as plan-043 ruling O): `first-release` adds it, and needs a methodology in
`packs/` (plan-046 ruling 6). `packs/software` raises the numbers of files this repository's checks
read. With the 19 files below (`pack.yaml`, `README.md`, `CHANGELOG.md`, three fragments, five
templates, one directive, seven workflows), the assertions that count them move: the index
(`tests/index.test.ts`, 4 → 5 files), the lint (`tests/check-packs.test.ts`, 23 → 42) and
`npm run validate` on this repository (`tests/validate.test.ts`, schemas 3 → 4, lint 23 → 42; its
`compositions: 3` and `3 runs` stay), with the titles that name "the base pack" naming both packs;
the Design confirms the numbers. Two new assertions come with them: the CI step
(`tests/ci-workflow.test.ts`) and the fixture README's generated sections. These test changes
follow dl-018 R1–R3, as tooling changes inside a pack task; pack content is checked by the lint,
the composition and the matrix (dl-018, pack tasks).

## Acceptance

1. **`packs/software/pack.yaml`**: `format: 1`, `id: software`, `name: software`, no `axis`,
   `title: "Software"`, `description` written as `base`'s (what the pack holds, without the
   subject or a decision reference), `version: 1.0.0`, `formats` exactly for the kinds shipped
   (`dna`, `roles`, `memory`, `memory-template`, `workflow`, `directive`, all 1),
   `requires: [base@^1]`, `requires_capabilities: [workflow-engine]`, and the charter's eight
   parameters with its types, defaults and descriptions (`adr_path`, `tech_spec_path`, `bug_path`,
   `release_line_path`, `release_path`, `release_line_id`, `release_id`, `inception_path`; a path
   parameter's description says it takes only `[A-Za-z0-9._/{}-]`). `contents` lists every file
   below and nothing else.
2. **`fragments/memory.yaml`** (`format: 1`): the five types of the charter's table, each with its
   machine, gates, `waiting` (`adr` `[accepted]`, `tech-spec` `[approved]`, none elsewhere),
   `returns` (`bug` `{in-progress: planned}`), id pattern, path from its parameter (every parameter
   reference inside a double-quoted scalar, spec-001 §8.2), `amendable` (`true` on `adr`,
   `tech-spec`, `bug` and `release`, an explicit `false` on `release-line`), `template.file` at
   `memory/templates/built-in/<type>.md` and `template.frontmatter.required` as the table
   (spec-001 §7.5, task-044). No `limits`.
3. **Memory templates** `memory-templates/{adr,tech-spec,bug,release,release-line}.md`, each
   declaring `format: 1` and `type` equal to its stem, with the fields its required frontmatter
   names.
4. **`fragments/dna.yaml`** and **`fragments/roles.yaml`** (`format: 1`): `team.roles` adds
   `architect`, `developer`, `reviewer`, `qa`, `tech-lead` with descriptions; `base`'s agent
   (`"{{agent_name}}"`) gains `executes_as: [developer, reviewer, qa, architect]`, with
   `approval_authority: false` (spec-001 §7.3); no member, no email. `roles.yaml` assigns
   `determinism` to `developer`, `reviewer` and `architect`.
5. **The directive** `directives/determinism.md`, with WingFoil 0.3.0's directive frontmatter (`id`
   and `name` `determinism`, `type: directive`, `kind: built-in`, `title`, `format: 1`), written as
   real rules.
6. **The workflows**, as the charter's table states them, each `format: 1` with no key newer than
   WingFoil 0.3.0, every phase with its role:
   - `sw-life-cycle` (`kind: main`): `inception` → `specification` → `delivery` → `end-of-life`,
     each including the slot of its name;
   - `inception` (`kind: sub`): `frame` (product-owner; `produces` `"{{inception_path}}"`) →
     `approve` (approver; an approval checkpoint, `fallback: { step: frame }`);
   - `specification` (`kind: sub`): `specify` (architect; `memory.add(type: tech-spec)`,
     `memory.submit`, `produces` `{ type: tech-spec, path: "{{tech_spec_path}}" }`) → `approve`
     (approver; `memory.approve` on `where: { type: tech-spec, status: [pending] }`,
     `fallback: { step: specify }`);
   - `end-of-life` (`kind: sub`): `announce` (product-owner; `memory.add(type: decision-log)`,
     `memory.submit`, `produces` `{ type: decision-log, path: "{{decision_log_path}}" }`, approval
     by the approver) → `deprecate` (tech-lead; `memory.deprecate` on `where: { type: release,
     status: [draft, planning, in-development, releasing] }`) → `archive` (tech-lead);
   - `release` (`kind: sub`, `element: release`): `submit` (includes `release-submit`) →
     `publishing` (includes `release-publishing`);
   - `release-submit` (`kind: sub`, `element: release`): `pre-release-checks` (qa) →
     `enter-releasing` (tech-lead; `element.set_state(releasing)`) → `approve-release` (approver;
     approval, `fallback: { step: pre-release-checks }`);
   - `release-publishing` (`kind: sub`, `element: release`): `release-commit` (tech-lead) →
     `staging-rehearsal` (qa) → `tag` (tech-lead) → `publish` (tech-lead, approval by the
     approver) → `mark-released` (tech-lead; `element.set_state(released)`, ruling H).

   A phase whose artefact is a file declares it in `produces` (R4), with a `memory.add(type: T)` in
   the same phase for a Memory element. A phase with no file artefact and no state action
   (`pre-release-checks`, `staging-rehearsal`, `release-commit`, `tag`, `archive`) declares
   `actions: [agent.execute]` and no `produces`, as `base`'s `assess` does: the lint refuses an
   empty phase and WingFoil 0.3.0 warns on a token it does not bind. A memory verb in a sub with no
   `element` and no `memory.add` before it in the phase selects by `where` with a `type` key
   (`specification` › `approve`, `end-of-life` › `deprecate`); an element-bound sub's phases carry
   no `where`.
7. **The fixture methodology** (plan-046's paragraph):
   `tests/fixtures/software-exit/packs/methodology/fixture/`, its `pack.yaml` with
   `id: methodology/fixture`, `axis: methodology`, `name: fixture`, a `title` and a `description`
   saying it is a test fixture, `version: 1.0.0`, `formats: { workflow: 1 }`,
   `requires: [base@^1, software@^1]`, `requires_capabilities: [workflow-engine]`, `delivery` in
   `contents`. Its `delivery` (`kind: sub`, no `element`) follows the charter's contract: one phase
   `memory.add(type: release)` then `element.set_state(in-development)` on the release it created,
   with `produces` `{ type: release, path: "{{release_path}}" }`, its description saying that the
   release's `version` and `release-line` are given as `--set` values when it runs (WingFoil 0.3.0
   binds only `type`); one phase including `release` with `iterate_over: release` and
   `where: { status: [in-development] }`; one phase including `base`'s `retrospective`. Its
   `README.md` has spec-002 §2's sections, as `resolve` requires (section 3 opening with the
   temporary mark and linking `…/CATALOG.md#install`; section 7 "None: a test fixture." rather
   than §2.4's exemption line; section 9 linking `CHANGELOG.md` and
   `…/CATALOG.md#pack-methodology-fixture`, an anchor that never exists, as in the golden tree), and
   says it is never published; its generated sections are those `generatedSections` writes for it
   (`src/readme-generate.ts`), which a test holds; with its `CHANGELOG.md`. If WingFoil 0.3.0
   cannot run the contract as the charter states it, that goes to the approver when found
   (dl-019), with the reading proposed.
8. **The defaults composition**: `tests/fixtures/software-exit/compositions/defaults/example.yaml`,
   `packs: [software@^1, methodology/fixture@^1]`, setting none of `software`'s parameters, and
   `base`'s four required parameters set to a fictional project's values (an address under
   `.example`, as task-039's Design checked against 0.3.0).
9. **`CHANGELOG.md`** with an entry line `- 1.0.0: …`, and **`README.md`** per spec-002 §2: its
   generated sections written by `npm run index`; section 3 opening with §2.3's temporary mark,
   linking `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`, and giving
   the generic hand-adoption procedure of the charter's Adoption ("Any project": set the parameters
   to the current values, compare types, states, workflows and phases, migrate renamed states by
   explicit commits, record an old → new key mapping), the step-key rules stated generically (a
   slot's filler carries the slot's name; `release-submit` and `release-publishing` keep their
   phase names), and the Compatibility note that 0.3.0's `init` writes a `custom/` `determinism`
   directive an adopter removes, with no WingFoil CLI command in code (CB-3); the rows of the known
   adopters stay in the charter, as `base`'s README does; section 7 holding §2.4's exemption line
   (CB-2, no methodology in the tree); section 8 crediting WingFoil's release workflows and phase
   names as the source adapted; section 9 linking `CHANGELOG.md` and `…/CATALOG.md#pack-software`.
10. **The CI step**: `.github/workflows/ci.yml` runs `npm run validate -- --overlay
    tests/fixtures/software-exit` with the golden fixture step's `if` (`github.ref_type != 'tag'`),
    after it; `tests/ci-workflow.test.ts` asserts it in its list of steps.
11. **The commands**, after `npm run build`, recorded in the Execution Notes with their output:
    `npm run lint`, `check:packs`, `check:schemas`, `index -- --check` exit 0;
    `npm run validate -- --overlay tests/fixtures/software-exit` exits 0, the defaults composition
    composed twice byte-identical and its matrix on WingFoil 0.3.0 alone (`workflow list`,
    `dna show`, `directives list` `pass (self-test)`), its summary
    `matrix: self-test, 4 runs, 0 failed, tolerance applied: none`, no warning. Red first
    (dl-018 R1), each red run recorded: the moved counts, the CI step's assertion and the fixture
    README's generated sections.
12. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
    `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`,
    `validate -- --overlay tests/fixtures/software-exit`, the golden fixture's step and
    `workflow list` exit 0 with no warning; the CI run on the pushed branch concludes `success`.
    Privacy (plan-041's rule): `git diff main` holds no local path (`/home/`), no name of a private
    project, no real person's name or address, and no address but `*.example`.

## Design

Written 2026-10-25, before the build. Branch `task/task-047-software-smallest` from `main`. A
prototype of every file below, in a scratch copy of this repository, already passes: the lint
(42 files, 0 problems), `index -- --check`, and `npm run validate -- --tree <copy> --overlay
tests/fixtures/software-exit` on WingFoil 0.3.0 (`compositions: 4`, the defaults composition
composed twice byte-identical in 30 files, `matrix: self-test, 4 runs, 0 failed, tolerance
applied: none`, no warning). So the contract of `delivery` runs on 0.3.0 as the charter states it,
and dl-019 is not needed.

- **Tests first** (dl-018 R1), committed red before `packs/software` exists:
  - `tests/index.test.ts` (this repository's index, 4 → 5 files), `tests/check-packs.test.ts`
    (its lint, 23 → 42) and `tests/validate.test.ts` (schemas 3 → 4, lint 23 → 42; the titles
    naming "the base pack" name both packs);
  - `tests/ci-workflow.test.ts`: `npm run validate -- --overlay tests/fixtures/software-exit` in
    the list of the steps run with `if: github.ref_type != 'tag'`;
  - a new test in `tests/readme-generate.test.ts`: the fixture README equals
    `rewriteReadme(text, generatedSections('tests/fixtures/software-exit',
    'methodology/fixture'))`, so its generated sections cannot drift (red: the file is missing);
  - a new test in `tests/validate.test.ts`: `validate --overlay tests/fixtures/software-exit` on
    this repository, on WingFoil's stub, composes `defaults` (red: the overlay is missing).
- **The pack** (`packs/software/`, 19 files), from the charter for every value and `base` for the
  shapes: `pack.yaml` (each workflow `version: 1`, as `base`'s); `fragments/memory.yaml` (the
  gates of `bug` as `{ reject: closed }` on `open`, `triaged`, `planned` and
  `{ reject: in-progress }` on `in-review`, `resolved`); `fragments/dna.yaml` (`team.roles` and the
  agent keyed by `"{{agent_name}}"`, merged into `base`'s by name, spec-001 §7.3);
  `fragments/roles.yaml`; the five templates (frontmatter `type`, `format: 1`, `title`, and
  `version`, `release-line` where required; one section with a comment, as `base`'s); the
  directive (rules on inputs, ordering, pinning and flaky tests, naming no project, since
  `project_name` is `base`'s parameter); the seven workflows of criterion 6, each phase with a
  `description`; `CHANGELOG.md`; `README.md` with sections 2, 3, 7, 8, 9 written and 1, 4, 5, 6
  generated by `npm run index`.
- **The fixture** (`tests/fixtures/software-exit/`, 5 files): `methodology/fixture`'s
  `pack.yaml`, `workflows/delivery.yaml` (phases `plan-release` (tech-lead), `release`,
  `retrospective`), `CHANGELOG.md`, `README.md` (sections 1, 4, 5, 6 from `generatedSections`,
  written by the same call the test makes), and `compositions/defaults/example.yaml` (Kestrel
  Ledger, a fictional accounting tool, its lead and agent, `lead@kestrel-ledger.example`).
- **README section 3**, as `base`'s, naming files and keys only: compose `software` with `base`
  and a methodology, the required parameters and, for a governed project, its current path and id
  values; copy the composed `.wingfoil/` files over the project's, keeping `custom/` and
  re-adding the project's own entries; remove 0.3.0's `custom/` `determinism` stub; migrate states
  by explicit commits (for example a `bug` on the default machine: `pending` → `open`,
  `approved` → `planned`); record an old → new key mapping for the renamed workflows and phases
  (a slot's filler carries the slot's name; `release-submit`'s and `release-publishing`'s phases
  keep theirs); record the adopted version.
- **The CI step**, after the golden fixture's: `Validate software through its fixture methodology
  (self-test, dl-022 S6)`, `if: github.ref_type != 'tag'`, `run: npm run validate -- --overlay
  tests/fixtures/software-exit`.
- **The evidence** of criterion 11 run after `npm run build`, its output in the Execution Notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-25: independent review: request changes, one blocking finding: five phases of the
  charter's table have no artefact and no action, which the lint refuses as empty and WingFoil
  0.3.0 warns on for any token it does not bind; they declare `agent.execute`, as `base`'s
  `assess`. Applied, with the non-blocking ones: `where` scoped to the two untargeted verbs; the
  fixture's `delivery` written as 0.3.0 runs it (`memory.add` then `element.set_state`, R4, the
  `--set` values); the fixture README's checks and its generated sections through
  `generatedSections`; the counts; README section 3 generic, the adopters' rows left in the
  charter as `base`'s README does (the reviewer's suggestion, the approver's choice); small
  precisions; the CI step's `if`. Re-review requested.
- 2026-10-25: re-review: approve, nothing blocking, no ruling changed; section 3's generic
  procedure is the charter's Adoption ("Any project"). Its optional point, recorded here: the eight
  release phases keep their step keys; `agent.execute` on the four with no artefact is the pack's
  default, and a project with its own tokens for those phases binds them in its own
  `bindings.yaml`. Submitted for the approver's acceptance into the backlog.
- 2026-10-25, red (`35b23d1`): on Node.js 22.21, six tests failed before `packs/software` and its
  fixture existed: the index (4 → 5 files), the lint (23 → 42) and `validate`'s (schemas 3 → 4,
  lint 23 → 42) counts of this repository, the CI step, the fixture README's generated sections
  (the file missing) and the overlay run on this repository.
- 2026-10-25, green (`fff34d3`): the six pass; `lint`, `check:packs` (42 files, 0 problems),
  `check:schemas` (4 files), `index -- --check` (5 files) exit 0;
  `npm run validate -- --overlay tests/fixtures/software-exit` on WingFoil 0.3.0: the defaults
  composition composed twice byte-identical in 30 files, `compositions: 4`,
  `matrix: self-test, 4 runs, 0 failed, tolerance applied: none`, no warning.
- 2026-10-25, build review: approve after amendments. Applied: README section 9 without a version
  line (spec-002 §2.2); section 2 names the adoption profiles (§2.1); section 8 names the source's
  edition and no longer credits WingFoil with the roles, and says how a project binds its own
  commands; `init`'s stub named for 0.3.0; a description on every include phase; the fixture's
  lines and its "Sources" line; the directive's pinning rule. The approver ruled in chat
  (2026-10-25), on the review's point that `announce`'s approval left the decision-log
  `in-discussion`: `end-of-life` gains an `approve` phase after `announce` (approver,
  `memory.approve` on `where: { type: decision-log, status: [in-discussion] }`,
  `fallback: { step: announce }`), as `base`'s `decision-log-ingest`; criterion 6 reads with it,
  its text unchanged (dl-019), and `end-of-life`'s step keys gain `approve`. The fixes change
  behaviour: re-review requested (dl-017).
- 2026-10-25, re-review: approve, nothing blocking. Its two points, ruled by the approver in chat
  (2026-10-25): `end-of-life`'s announcement is tagged `end-of-life` (`memory.add(type:
  decision-log, tags: [end-of-life])`, the description saying to pass `--tags`, since WingFoil
  0.3.0 binds only `type`, F-034) and `approve` selects it by that tag, as `base`'s
  `retrospective` does, so no other decision-log in discussion is ruled there; and the charter,
  whose `end-of-life` row and WingFoil step-key table no longer match the pack (the `approve`
  phase, a new step key), is recorded at plan-046's close (step 4) and reported with the key
  mapping, not amended mid-task. On WingFoil 0.3.0 the overlay run still gives 4 runs, 0 failed.
- 2026-10-25: checks from clean clones of `2b80b1e` on Node.js 22.21.0 and 22.12.0: `npm ci`,
  `npm test` 967 of 967, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
  `validate` (3 runs, 0 failed), the golden fixture's step (26 runs, 0 failed),
  `validate -- --overlay tests/fixtures/software-exit` (4 runs, 0 failed) and `workflow list`
  exit 0 with no warning. Privacy grep of `git diff main`: no local path, no private project, only
  a `*.example` address. CI run 40232352598 on the branch: `success`.
  `in-progress → in-review`.
