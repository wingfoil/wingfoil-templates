# Product Brief — WingFoil-Templates

**Version:** 1.0
**Date:** 2026-10-06
**Status:** Draft
**Source:** the approver's answers (Roberto Pompermaier), 2026-10-06; the design discussion of
2026-10-01..05; the first attempt on `archive/draft-2026-10-05` (unapproved drafts, source material
only)

---

## 1. Summary

WingFoil-Templates is the official, public catalog of **template packs** for WingFoil:
- methodologies;
- team-mode overlays;
- phase methods;
- project blueprints;
- lifecycle stages, with the transitions between them.

The WingFoil CLI downloads the packs to configure a project's `.wingfoil/`: DNA, Memory types,
directives, workflows. WingFoil's npm package bundles the base packs as offline fallback.

## 2. Problem

Today WingFoil's templates are string generators compiled into the CLI (notes T1):
`src/storage/templates.ts`, `Scrum` and `Kanban`. They have no source files, no version, no manifest
and no remote origin. As a consequence:

- **They grow combinatorially.** One template per combination of methodology, team, project type and
  stage does not scale (notes T2).
- **Nothing updates a project after `init`.** A newer template never reaches an existing project, and
  nothing records which template produced a configuration (notes T5, T7).
- **Projects drift apart.** The four repositories governed by WingFoil (WingFoil2, Benchmark, UI,
  Templates) differ on things that have nothing to do with what they are:
  - the same states under different names;
  - capture workflows with different phases;
  - directives still at the init stub.
- **Process strictness is fixed.** Nothing models how a project's process should tighten from
  prototype to production (notes T8).

## 3. Purpose, in priority order

1. **Offer adopters a catalog of process building blocks.** Methodologies, overlays, phase methods,
   blueprints and stages, which a project composes instead of writing its `.wingfoil/` by hand.
2. **Be the single source of the packs WingFoil downloads and bundles.** They replace the templates
   compiled into the CLI.
3. **Align the four WingFoil-governed repositories** through the foundation pack `base`.

Purposes 2 and 3 serve purpose 1. The CLI is the delivery channel, and the four repositories are the
first adopters and the first test of the format.

## 4. Consumers and audiences

**Until WingFoil v0.4** (the release that installs packs, WingFoil dl-138) the real consumers are:
- **the WingFoil CLI and its maintainers:** WingFoil reads the catalog and bundles the base packs.
  Before each release it advances its bundled packs to the newest published version (notes D3);
- **the four governed repositories:** they adopt packs by hand, copying them, and record the version
  they adopted.

**From WingFoil v0.4:**
- **adopters:** projects that run `wingfoil init` with a preset or with one pack per axis, then
  `pack add`, `upgrade` and `stage set`.

**Later:**
- **external contributors:** see §5.

## 5. Contributions

- **Now:** only the approver and AI agents write the repository.
- **Later:** the repository opens to external contributions on WingFoil's model
  (`COLLABORATION.md`, WingFoil dl-020). The steps:
  1. A contribution arrives as a Memory element (bug, decision-log, ADR, tech-spec), captured through
     its ingest workflow, not as a code pull request.
  2. The approver accepts it.
  3. An agent implements it through the normal flow.
  4. The contributor is credited on the element.

  When this opens, the Memory templates need WingFoil's `contributor:` and `credit:` fields.

## 6. Scope

### MVP — ready when WingFoil v0.4 can install packs

- the pack format (spec-001) and its JSON Schemas: the contract with the CLI;
- `catalog.yaml` and `compat.yaml`;
- `base`;
- the first set of packs (notes D4, plus `governance/wingfoil-dogfood`):
  - `methodology/scrum`, `methodology/kanban`;
  - `team-mode/agent-first`;
  - `phase/inception/lean-inception`, `phase/specification/bdd-sbe`;
  - `blueprint/web-service`, `blueprint/cli-library`;
  - `stage/prototype`, `stage/production`, and the transition `prototype-to-production`;
- the validation that proves each pack composes and validates.

The sequencer (`07_sequencer.md`) sets the order and the first publishable set.

### Later

- more methodologies, phase methods, blueprints and stages (notes T2);
- presets beyond the first;
- the `stack` axis;
- external contributions (§5);
- third-party pack sources, which belong to WingFoil (dl-138 Q4).

## 7. Constraints and dependencies

- **`base` waits for WingFoil2 v0.3's formats.** It is not published before v0.3 finishes its format
  changes, expected at the end of wave 3:
  - the `format:` key (WingFoil dl-149, task-251 done);
  - task-180;
  - `bindings.yaml`;
  - dev-loop 1.5/1.6;
  - the Memory templates.
- **Adoption between releases.** Benchmark and UI adopt `base` only between their own releases.
- **No hand-written WingFoil ranges.** Compatibility is declared by file formats and capabilities;
  the WingFoil range is computed (notes D6).
- **WingFoil-side changes go through WingFoil's own process.** They are notes in
  `docs/wingfoil-feedback/`, never direct edits (notes D5).
- **Pinned CLI.** The repository is managed by WingFoil, with the CLI pinned exact (0.2.2 today). Its
  known limits apply: `--set` fills only id tokens, and no verb leaves a `waiting` state.
- **Public repository.** It is public at `https://github.com/wingfoil/wingfoil-templates`, under the
  MIT licence. The approver's contact stays in `dna.yaml` (approver, 2026-10-06).

## 8. Success signals

- **WingFoil bundles packs published here** instead of its compiled templates.
- **All four governed repositories** declare the `base` version they adopted.
- **Every preset validates.** It composes deterministically (byte-identical twice) and passes
  WingFoil's validation on every compatible WingFoil release.
- **Downloads.** Download metrics of the remote repository, per pack where possible.

  Feasibility to confirm in the features phase. What GitHub offers:
  - clone and view traffic, which covers only the last 14 days and needs push access, so it must be
    collected periodically;
  - download counts, but only for assets attached to a GitHub Release. Packs addressed by git tag
    alone are not counted.

  Whether packs are also published as release assets is therefore a choice that affects this metric.

## 9. Assumptions and risks

- **WingFoil v0.4 may slip or change direction.** It is expected to install packs, decided in
  dl-138, ready. If it slips, the adopters of purpose 1 wait with it.
- **WingFoil formats keep changing up to 1.0.** The line policy and `wingfoil migrate` (notes D6,
  T13) mitigate this.
- **The AGENTS.md marker syntax is provisional** until WingFoil dl-137's part-(b) tech-spec is
  published (notes T14).
- **The approver is a single point.** The repository has one approver for every gate.

## 10. Inputs for the next phases

- **Vision and is/is-not:** purpose 1 is the product, and the CLI is its channel.
- **Personas:** WingFoil maintainer, governed-repository maintainer, adopter, pack author, later the
  external contributor.
- **Journeys:**
  - init from a preset;
  - add a pack;
  - upgrade;
  - move stage;
  - author a pack;
  - publish a version;
  - WingFoil advances its bundled packs;
  - later, contribute an element.
- **pack-model:** the decisions D0–D6 of the design discussion, and the identifier conventions of
  the first attempt as proposals.

## 11. Decisions from the brief review

Answers of the approver, 2026-10-06:
- §3 purpose order;
- §4 consumers by WingFoil release;
- §5 contributions;
- §6 MVP horizon (WingFoil v0.4);
- §7 public repository, MIT licence, contact kept, constraints complete;
- §8 the download signal added.
