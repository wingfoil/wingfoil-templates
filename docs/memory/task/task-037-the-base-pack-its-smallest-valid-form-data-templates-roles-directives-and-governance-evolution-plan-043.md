---
id: task-037-the-base-pack-its-smallest-valid-form-data-templates-roles-directives-and-governance-evolution-plan-043
type: task
title: "The base pack, its smallest valid form: data, templates, roles, directives and governance-evolution (plan-043)"
status: approved
pack: "pack-foundation-base"
depends_on: []
tags: ["packs","base","W8"]
---

## Context

The first of plan-043's three tasks (the approver's ruling N, 2026-10-21): the smallest `base` that
the lint, the composer and WingFoil 0.3.0 all accept, written from the accepted charter
`pack-foundation-base` and dl-023. WingFoil refuses a composition with no `main` workflow
(`E_NO_MAIN_WORKFLOW`), and `base`'s `roles.yaml` names its directives, so `governance-evolution`
and the four directives come here; task-038 adds `decision-log-ingest`, `retrospective`,
`retrospective-periodic` and the AGENTS.md section, and task-039 the README's examples.

No `catalog.yaml` entry yet (ruling O): `first-release` adds it. `packs/base` raises the numbers of
files this repository's checks read, which moves four assertions in three tests: the index
(`tests/index.test.ts`, 3 → 4 files), the lint (`tests/check-packs.test.ts`, "two files" → 16) and
`npm run validate` on this repository (`tests/validate.test.ts`, schemas 2 → 3, lint 2 → 16; its
`compositions: 0` and `0 runs` stay). These test changes follow dl-018 R1–R3, as tooling changes
inside a pack task. Pack content is checked by the lint, the composition and the matrix (dl-018,
pack tasks).

## Acceptance

1. **`packs/base/pack.yaml`**: `format: 1`, `id: base`, `name: base`, no `axis`, `title: "Base"`,
   `description` the first sentence of the charter's Purpose, `version: 1.0.0`, `formats` exactly
   for the kinds shipped (`dna`, `roles`, `memory`, `memory-template`, `workflow`, `directive`, all
   1), `requires_capabilities: [workflow-engine]`, no `requires`, and the parameters the files of
   this task use, with the charter's types, defaults and descriptions: `project_name`,
   `approver_name`, `approver_email`, `agent_name` (required, no default), `decision_log_path`,
   `task_path`, `plan_path`, `plan_id` (defaults as the charter; a path parameter's description says
   it takes only `[A-Za-z0-9._/{}-]`, as the charter's Compatibility does). `retrospective_path`
   comes with task-038. `contents` lists every file below and nothing else.
2. **`fragments/memory.yaml`** (`format: 1`): `defaults` `[draft, pending, approved]`, gate
   `pending` → `draft`; `decision-log` `[draft, in-discussion, ready]`, gate `in-discussion` →
   `draft`; `task` `[draft, pending, backlog, in-progress, in-review, approved, done]`, gates
   `pending` → `draft` and `in-review` → `in-progress`, `returns: {in-progress: backlog}`; `plan`
   `[draft, active, done]`, `waiting: [active]` (dl-023 D1). No other `waiting`; no `limits`. Ids
   `dl-{n}-{slug}`, `task-{n}-{slug}`, `"{{plan_id}}"`; paths from the three path parameters, every
   parameter reference inside a double-quoted scalar (spec-001 §8.2); `amendable: true` on the three
   types; `template.file` at `memory/templates/built-in/<type>.md`; `template.frontmatter.required`:
   `decision-log` and `task` `[title]`, `plan` `[title, workflow, phase]` (plan-043 ruling 6).
3. **Memory templates** `memory-templates/{decision-log,task,plan}.md`, each declaring `format: 1`
   and `type` equal to its stem; the plan template carries `workflow`, `phase`, `element` and
   `parent`.
4. **`fragments/dna.yaml`** (`format: 1`): `project.name: "{{project_name}}"`; `modules: []`;
   `stacks: { technologies: [], methodologies: [] }`; `team.roles` `approver`, `facilitator`,
   `product-owner` with descriptions; one member `"{{approver_name}}"`, `email:
   "{{approver_email}}"`, roles `[approver]`; one agent `"{{agent_name}}"`, `executes_as:
   [facilitator, product-owner]`, `approval_authority: false`, no email (dl-023); `paths.config:
   [.wingfoil]`. No real name or address anywhere in the pack.
5. **`fragments/roles.yaml`** (`format: 1`): `global: [doc-versioning, security-secrets,
   claim-sources]`; `assignments.facilitator: [traceability]`.
6. **Directives** `directives/{traceability,doc-versioning,security-secrets,claim-sources}.md`, each
   with WingFoil 0.3.0's directive frontmatter (`id` and `name` equal to the stem, `type:
   directive`, `kind: built-in`, `title`, `format: 1`), written as real rules: `traceability`
   generic (each project or pack names its own chain); `claim-sources` the generic rule on the
   sources of claims, which other packs tighten.
7. **`workflows/governance-evolution.yaml`**: `name: governance-evolution`, `kind: main`, `format:
   1`, the charter's four phases and roles: `assess` (`agent.execute`, no `memory.add`, no
   `produces`), `propose` (`memory.add(type: decision-log)`, `memory.submit`, `produces` `{ type:
   decision-log, path: "{{decision_log_path}}" }`), `approve` (`memory.approve`, `approval: {
   by_role: approver }`, `fallback: { step: propose }`), `apply` (`produces` `.wingfoil` and
   `AGENTS.md`); no key newer than WingFoil 0.3.0.
8. **`CHANGELOG.md`** with an entry line `- 1.0.0: …` (the form `publish:pack` reads), and
   **`README.md`** per spec-002 §2: its generated sections written by `npm run index`, never by
   hand; section 3 ("Install and update") opening with §2.3's temporary mark, linking
   `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`, and giving the
   hand-adoption steps (F6.1, the charter's Adoption) with no WingFoil CLI command in code (CB-3);
   section 7 holding §2.4's exemption line until task-039; section 9 linking `CHANGELOG.md` and
   `…/CATALOG.md#pack-base` (an anchor that exists from `first-release`, as §2.5 allows).
9. **The commands**, after `npm run build`, recorded in the Execution Notes with their output:
   - `npm run lint`, `npm run check:packs`, `npm run check:schemas`, `npm run index -- --check`
     exit 0;
   - `npm run validate -- base --param project_name=Sample --param "approver_name=Sample
     Approver" --param approver_email=approver@sample.example --param "agent_name=Sample Agent"`
     exits 0: composed twice byte-identical, the matrix on WingFoil 0.3.0 alone (`workflow list`,
     `dna show`, `directives list` `pass (self-test)`), its summary
     `matrix: self-test, 1 run, 0 failed, tolerance applied: none`;
   - the three tests of the Context assert the new counts, each red run recorded (dl-018 R1), and
     the "two files" test titles say what they now count.
10. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`, `npm run
    check:pins`, `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`, `npm
    run validate` exit 0; the CI run on the pushed branch concludes `success`. Privacy (plan-041's
    rule): `git diff main` holds no local path (`/home/`), no name of a private project, no real
    person's name or address in the pack, and no address but `*.example`.

## Design

Written 2026-10-21, before the build. Branch `task/task-037-base-smallest` from `main`.

- **Tests first** (dl-018 R1): `tests/index.test.ts` (3 → 4 files), `tests/check-packs.test.ts`
  (this repository's lint count) and `tests/validate.test.ts` (this repository's schema and lint
  counts) asserted on the new numbers and committed red, before `packs/base` exists; the exact lint
  count is the number of files the pack holds plus the repository's two, fixed when the pack's
  file list is final.
- **The pack** (`packs/base/`), modelled on the golden fixture's `base` for the file shapes and on
  the charter for every value: `pack.yaml`; `fragments/{dna,roles,memory}.yaml`;
  `memory-templates/{decision-log,task,plan}.md` (section headings of this repository's own
  templates, made generic); `directives/{traceability,doc-versioning,security-secrets,
  claim-sources}.md` (each a short rule with `{{project_name}}` only where it reads naturally);
  `workflows/governance-evolution.yaml`; `CHANGELOG.md` (`- 1.0.0: first version.`); `README.md`
  with sections 2, 3, 7, 8, 9 written and 1, 4, 5, 6 generated by `npm run index`.
- **README section 3**, hand steps naming files and keys only: compose `base` with the four
  required parameters into a scratch directory with the reference composer (named, not quoted as
  a command), copy the composed `.wingfoil/` files over the project's (keeping `custom/`), set
  the path and id parameters to the project's current values (the charter's commitment 2), remove
  WingFoil 0.3.0's `init` stubs of the same directive ids, migrate states by explicit commits, and
  record the adopted version.
- **The evidence** of criterion 9 run after `npm run build`, its output in the Execution Notes.


## Execution Notes
- 2026-10-21: independent review of the body: approve after amendments. Applied while `pending`:
  the three tests and four assertions `packs/base` moves (not one); section 3's and 9's absolute
  links; the identity keys of templates, directives, the workflow and the fragments; quoted
  parameter references; the CHANGELOG line form; the privacy check spelt out; distinct sample
  values, an `.example` address, the matrix summary; `npm run build` first.
- 2026-10-21, build on `task/task-037-base-smallest`:
  - red (`a9b641b`): three failing without `packs/base`:
    `tests/index.test.ts` (4 files), `tests/check-packs.test.ts` (lint, 16 files),
    `tests/validate.test.ts` (schemas 3, lint 16); green once the pack exists (109 of 109 and 1 of
    1 on those files). The lint counts 16: the pack's 14 files and the repository's two.
  - the pack (`3e0e461`): 14 files; `npm run index` wrote its README's generated sections (the
    marker pairs must already hold their headings); `npm run lint`, `check:packs`
    (`lint: checked 16 files, 0 problems`), `check:schemas` (3 files), `index -- --check`
    (4 files, 0 not up to date) exit 0.
  - criterion 9: `npm run validate -- base --param project_name=Sample --param "approver_name=Sample
    Approver" --param approver_email=approver@sample.example --param "agent_name=Sample Agent"`
    exit 0: `composition entries: composed twice, 13 files, byte-identical`; `matrix entries
    wingfoil@0.3.0 workflow list|dna show|directives list: pass (self-test)`; `matrix: self-test,
    1 run, 0 failed, tolerance applied: none`. WingFoil 0.3.0 accepts the member's `.example`
    address.
  - privacy: the diff's added lines hold no local path, no private project's name, no real name
    and no address but `*.example`.
- 2026-10-21: independent review of the branch: approve after amendments, nothing blocking.
  Applied: the README's hand steps keep a project's own entries in the four composed files, follow
  the charter's Adoption in full (comparison, `parked` first, key mapping, plan closing), and name
  the range through the catalog; section 2 names its profiles and when not to use it; section 8
  names WingFoil 0.3.0's configuration as the source; `traceability` fixes no link of the chain;
  `security-secrets`' wording; long parameter descriptions in block form; test titles; the
  Context's lint count (16). Re-checked: `check:packs` 16 files 0 problems, `index` unchanged,
  `validate -- base …` 1 run, 0 failed, tolerance none.
- 2026-10-21: re-review: approve; its two optional nits applied (`658bcf7`: the README names
  spec-002's adoption profiles; a wrap). Branch pushed: CI run 39590724856 on `658bcf7`,
  conclusion `success` (`validate (22.12.0)` and `validate (22.21.0)` both `success`).
  `in-progress → in-review`; the clean-clone checks are recorded at delivery.
- 2026-10-21, delivery: checks from a clean clone at `510236c` on Node.js 22.21.0 and 22.12.0: 936
  of 936 tests, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
  `index -- --check` and `workflow list` exit 0 (the later commit changes README and directive text
  only, covered by the CI on `658bcf7`). The approver accepted the task (`in-review → approved`)
  and gave the merge OK; `--no-ff` merge into `main` (`b6e9755`), `approved → done`, `main` pushed, the
  branch removed.
