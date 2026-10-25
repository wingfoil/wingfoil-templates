---
id: task-047-the-software-pack-its-smallest-valid-form-data-templates-roles-determinism-sw-life-cycle-and-its-slots-the-release-workflows-and-its-fixture-methodology-plan-046
type: task
title: "The software pack, its smallest valid form: data, templates, roles, determinism, sw-life-cycle and its slots, the release workflows, and its fixture methodology (plan-046)"
status: draft
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
read, which moves the assertions that count them (the index, the lint, `npm run validate`'s
`schemas:` and `lint:` lines on this repository); the CI step changes `tests/ci-workflow.test.ts`'s
expectations. These test changes follow dl-018 R1–R3, as tooling changes inside a pack task; pack
content is checked by the lint, the composition and the matrix (dl-018, pack tasks).

## Acceptance

1. **`packs/software/pack.yaml`**: `format: 1`, `id: software`, `name: software`, no `axis`,
   `title: "Software"`, `description` the first sentence of the charter's Purpose, `version:
   1.0.0`, `formats` exactly for the kinds shipped (`dna`, `roles`, `memory`, `memory-template`,
   `workflow`, `directive`, all 1), `requires: [base@^1]`, `requires_capabilities:
   [workflow-engine]`, and the charter's eight parameters with its types, defaults and
   descriptions (`adr_path`, `tech_spec_path`, `bug_path`, `release_line_path`, `release_path`,
   `release_line_id`, `release_id`, `inception_path`; a path parameter's description says it takes
   only `[A-Za-z0-9._/{}-]`). `contents` lists every file below and nothing else.
2. **`fragments/memory.yaml`** (`format: 1`): the five types of the charter's table, each with its
   machine, gates, `waiting` (`adr` `[accepted]`, `tech-spec` `[approved]`, none elsewhere),
   `returns` (`bug` `{in-progress: planned}`), id pattern, path from its parameter (every parameter
   reference inside a double-quoted scalar, spec-001 §8.2), `amendable` (`true` but on
   `release-line`), `template.file` at `memory/templates/built-in/<type>.md` and
   `template.frontmatter.required` as the table (spec-001 §7.5, task-044). No `limits`.
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
   WingFoil 0.3.0; every phase with its role, actions, approval, `fallback` and `produces` (R4:
   `{ type, path }` with a `memory.add(type: T)` in the same phase for a Memory element; none for a
   phase whose artefact is not a file); an approval in a sub-workflow selects its element
   (`where`):
   - `sw-life-cycle` (`kind: main`): `inception` → `specification` → `delivery` → `end-of-life`,
     each including the slot of its name;
   - `inception` (`frame`, producing `"{{inception_path}}"`, → `approve`), `specification`
     (`specify`, a tech-spec, → `approve` on `where: { type: tech-spec, status: [pending] }`) and
     `end-of-life` (`announce`, a decision-log at `base`'s `"{{decision_log_path}}"`, →
     `deprecate` on the unreleased releases → `archive`), each `kind: sub`;
   - `release` (`kind: sub`, `element: release`): `submit` (includes `release-submit`) →
     `publishing` (includes `release-publishing`);
   - `release-submit` and `release-publishing` (`kind: sub`, `element: release`) with WingFoil's
     eight phase names and roles; `enter-releasing` and `mark-released` move the element by
     `element.set_state(releasing)` and `element.set_state(released)` (ruling H).
7. **The fixture methodology** (plan-046's paragraph): `tests/fixtures/software-exit/packs/
   methodology/fixture/`, `id: methodology/fixture`, `axis: methodology`, `requires: [base@^1,
   software@^1]`, `delivery` in `contents`; its `delivery` (`kind: sub`, no `element`) creates a
   release and moves it to `in-development`, includes `release` with `iterate_over: release` and
   `where: { status: [in-development] }`, and includes `base`'s `retrospective`. Its `README.md`
   has spec-002 §2's sections, says it is a test fixture never published, and its generated
   sections are what `npm run index` would write for it, which a test holds; with its
   `CHANGELOG.md`. If WingFoil 0.3.0 cannot run the contract as the charter states it (for example
   moving the release to `in-development` from a workflow with no `element`), that goes to the
   approver when found (dl-019), with the reading proposed.
8. **The defaults composition**: `tests/fixtures/software-exit/compositions/defaults/example.yaml`,
   `packs: [software@^1, methodology/fixture@^1]`, every `software` parameter on its default, and
   `base`'s four required parameters set to a fictional project's values (an address under
   `.example`, as task-039's Design checked against 0.3.0).
9. **`CHANGELOG.md`** with an entry line `- 1.0.0: …`, and **`README.md`** per spec-002 §2: its
   generated sections written by `npm run index`; section 3 opening with §2.3's temporary mark,
   linking `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`, and giving
   the hand-adoption steps (F6.1, the charter's Adoption: any project, then WingFoil, UI, Benchmark
   and this repository, and WingFoil's step-key mapping) with no WingFoil CLI command in code
   (CB-3), including the Compatibility note that 0.3.0's `init` writes a `custom/` `determinism`
   directive an adopter removes; section 7 holding §2.4's exemption line (CB-2, no methodology in
   the tree); section 9 linking `CHANGELOG.md` and `…/CATALOG.md#pack-software`.
10. **The CI step**: `.github/workflows/ci.yml` runs `npm run validate -- --overlay
    tests/fixtures/software-exit` on every push of a branch (not on a tag), after the golden
    fixture's step; `tests/ci-workflow.test.ts` asserts it.
11. **The commands**, after `npm run build`, recorded in the Execution Notes with their output:
    `npm run lint`, `check:packs`, `check:schemas`, `index -- --check` exit 0;
    `npm run validate -- --overlay tests/fixtures/software-exit` exits 0, the defaults composition
    composed twice byte-identical and its matrix on WingFoil 0.3.0 alone (`workflow list`,
    `dna show`, `directives list` `pass (self-test)`), no warning; the tests whose counts move
    assert the new counts, each red run recorded (dl-018 R1).
12. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
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
