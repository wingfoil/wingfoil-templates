---
id: dl-021-align-with-wingfoil-s-plans-no-bundled-packs-no-stage-set-the-remote-asset-class-a-provisional-capability-vocabulary
type: decision-log
title: "Align with WingFoil's plans: no bundled packs, no stage set, the remote asset class, a provisional capability vocabulary"
status: approved
tags: ["wingfoil","compatibility","base"]
---

## Context

This repository's approved elements assume four things WingFoil does not plan. The periodic
retrospective of 2026-10-12 mapped them
(`docs/retrospectives/2026-10-12-periodic-friction-inventory.md` §8; dl-016 O1). On 2026-10-13 the
WingFoil session that drives WingFoil's v0.3 release line confirmed each with citations (WingFoil
`main` at `db0e2752`) and proposed a resolution; this repository prepared its own options; the
approver compared them and ruled in chat. WingFoil then reviewed the summary of the rulings and
confirmed it, with two precisions recorded in the Decision (the requests, and R4).

D1 and D3 fix how `base` is written and what it promises, so they come before `base`'s charter
(wave W8, milestone M2). D2 and D4 matter at W12 and at every `wingfoil-release-intake`.

## Options

### D1 — Base packs in WingFoil's npm package

- **Ours:** dl-001 D4 ("The base packs stay bundled in WingFoil's npm package as offline fallback…
  WingFoil advances its bundled packs"), dl-003 D7 ("`base` is bundled in WingFoil's npm package"),
  F-003 (`advance-bundled-packs`), `wingfoil-cli` rule 8 and `npm run publish:pack -- --bundled`
  (a note for each publication of a bundled pack), the product brief's purpose 2, journey J3 and an
  MVP success metric.
- **WingFoil:** partly confirmed. dl-138 Action 3: "the packs become content of the template
  repository rather than of the package" (`923113a6`); no bundled fallback is planned anywhere.
  Offline use comes from vendoring (dl-138 Q1 (a), recorded in the message of approve commit
  `32d58132`): `init` copies the chosen content into `.wingfoil/`, a lock records each source's URL
  and exact commit. Who installs `base` at `init`, and any "default set", are not specified; the
  closest is WingFoil dl-164 (in discussion), an Initialization Template that drives `init`.
  WingFoil's proposal: no bundled packs; `init` installs `base` from this repository as a `remote`
  source pinned by the lock; the default set goes to dl-138's Action 2 tech-spec with dl-164.
- **Options:** (A) align: no bundling; (B) keep the assumption and ask WingFoil to bundle; (C) a
  "default set" marked in our catalog that `init` installs at a pinned version, `--bundled` renamed
  `--default`, which depends on WingFoil accepting it.

### D2 — `wingfoil stage set`

- **Ours:** a lifecycle stage axis with transitions this repository defines and WingFoil runs
  (`wingfoil stage set <stage>`): dl-001 D1 ("Transitions move a project…") and D5 (the
  `prototype-to-production` transition), F-008, spec-001 §11 and §14, the `stage-transitions`
  capability in `compat.yaml`, `dna.yaml`, the brief, the personas and journey J8; wave W12. dl-001
  D3, the stage scale itself, stays.
- **WingFoil:** confirmed, nothing planned, at any release: no stage axis, command or overlay in
  its vision, decision-logs, specifications or code. Its proposal: a stage change as a
  governance-change or pack update (dl-164's mechanism), not a new verb; transitions stay
  workflows or packs a project runs.
- **Options:** (A) a stage is an overlay; changing it is a pack update replacing one `stage/*`
  overlay with another, and the transition is a workflow the project runs; (B) wait for WingFoil
  to plan the command, W12 on hold.

### D3 — dl-138's `remote` asset class against dl-003

- **Ours:** packs install only into `.wingfoil/<kind>/built-in/` today, into `remote/` "if ratified"
  (dl-003 › its configuration changes, `pack-authoring`, spec-001 §7.6 and its install mapping; the
  folder changes the composer, not the pack format); F-005 (a project lock), F-007.
- **WingFoil:** partly confirmed. The class is decided (dl-138 Q3, `32d58132`: "a third class,
  `remote`, vendored under its own folder with its own removability and override rules"); the
  folder name, layout, lock and mapping wait for dl-138's Action 2 tech-spec. `built-in/` holds
  only the content WingFoil ships in npm (WingFoil spec-011, REQ-SEC-07). Its proposal: packs land
  in a `remote/` folder per kind, mapped by `pack-install`; a pack uses kind-relative paths and does
  not know its install folder.
- **Options:** (A) adopt `remote/` as dl-138 ratifies it, through the composer; (B) stay on
  `built-in/`, against WingFoil's v0.4 model.

### D4 — `wingfoil capabilities`

- **Ours:** a pack declares `formats` and `requires_capabilities`; `compat.yaml` maps each release
  to the formats it reads and the capabilities it provides (dl-002, spec-001 §12, F-013); the
  vocabulary, this repository's proposal: `pack-install`, `workflow-engine`, `stage-transitions`.
- **WingFoil:** corrected, "not yet proposed" rather than "not planned": a capabilities query is a
  separate proposal of WingFoil dl-149 Action 3 (`95b910a8`), to be weighed at the v0.3
  retrospective or the v0.4 release-planning. The `format:` key exists (WingFoil task-251,
  `283fd17f`); no capability vocabulary does. Its proposal: until then a consumer reads the
  `format:` keys and the CHANGELOG; our vocabulary is input for that proposal. Its precision:
  the CHANGELOG names features and commands, not capabilities.
- **Options:** (A) keep `requires_capabilities` and `compat.yaml` as this repository's own record,
  with a small provisional vocabulary; (B) drop `requires_capabilities` and rely on formats only,
  a schema change.

## Decision

**Ruled by the approver in chat on 2026-10-13.** The rulings below take effect when this element
is approved.

- **R1 (D1) — No bundled packs; option (A), with a request.** `base` and every other pack are
  installed from this repository by WingFoil's `pack-install`, as a `remote` source pinned by its
  lock; offline use comes from the vendored copy. The "default set" of option (C) is not a
  dependency: it is filed as a feedback request, input to dl-138's Action 2 tech-spec and to dl-164.
  Our catalog already resolves every version to an exact commit (tag `<catalog pack id>@<version>`,
  digest).
- **R2 (D2) — A stage is an overlay; option (A).** Changing a stage is a pack update of the
  `stage/*` overlay; a transition is a workflow the project runs. Nothing depends on a `stage set`
  verb. A feedback note supersedes F-008's request.
- **R3 (D3) — The `remote` class; option (A).** `built-in/` stays WingFoil's own. Packs use
  kind-relative paths and land where `pack-install` maps them; the composer follows dl-138's
  tech-spec once it fixes the folder, layout and lock. F-005's lock is covered by dl-138's lock.
- **R4 (D4) — A provisional vocabulary; option (A), reduced.** `requires_capabilities` and
  `compat.yaml` › `capabilities` stay; the vocabulary is `pack-install` and `workflow-engine`,
  provisional until WingFoil publishes one; `stage-transitions` leaves it (R2). At
  `wingfoil-release-intake` a release is recorded as providing a capability only when its
  CHANGELOG names the feature or command behind it (for example the `pack-install` command).
  F-013 stays open as input to WingFoil dl-149 Action 3.

**Open, for the spec-001 amendment:** whether the `transition` kind
(`schema/transition.schema.json`, `catalog.yaml` › `transitions`, spec-001 §11 and §14, the
`transitions/` module, the tooling) stays as a kind of its own or folds into the workflows of the
`stage/*` packs (R2). The approver rules it when that amendment is written; a schema change also
produces a note (`wingfoil-cli` rule 8).

**Requests to WingFoil, pending its v0.4 release-planning, not commitments** (WingFoil's
precision): the dl-138 Action 2 tech-spec (how `init` installs `base` as a pinned `remote` source;
the `remote/` folder, layout and lock); the REQ-SEC-07/REQ-SEC-10 amendments (dl-138 Action 4); a
notice to this repository when the `remote/` folder is fixed; the capabilities query (dl-149 Action
3), with F-013.

Changes this decision implies, each applied later through its own element:
- **Decision-logs:** dl-001 D1, D4, D5 and its Execution Notes (bundling, transitions), dl-002 (the
  vocabulary), dl-003 D7 and its install-folder line, dl-012 (the bundling note of the feedback
  pack), each through an amending element;
- **Vision:** `01_product-brief.md` (purpose 2, success signals, `stage set`),
  `02_product-vision.md`, `03_is-isnot.md`, `04_personas.md`, `05_journeys.md` (J1 step 7, J2 and
  J7 step 3, J3, J4 step 1, J8), `06_features.md` (F2.4, F4.7, F5.4), `07_sequencer.md` (W7's
  "note" criterion, W10, W12), `08_mvp-canvas.md` (J3 and its persona, the success metric, W4's
  open point);
- **spec-001**, in one amendment next to spec-002's, before W8 (dl-020): §6.2 (which packs WingFoil
  bundles), §7.6, §7.7 and the install mapping (R3), §11 and §14 (R2 and the open point above),
  §12 the vocabulary (R4), §16 O3, O5 and O12, and its §4 erratum;
- **Configuration:** `wingfoil-cli` rule 8 (no bundled packs), `pack-release-cycle` › `publish`
  and the `pack-release` template (no bundling note), `wingfoil-release-intake` (R4's rule in
  `record`; its header's `advance-bundled-packs`), `templates-inception` (its bundling mention),
  `pack-authoring` (kind-relative paths, no install folder), `dna.yaml` (description, `stage set`),
  `compat.yaml` (drop `stage-transitions`);
- **Tooling**, through a tooling task: `npm run publish:pack -- --bundled`, the bundled-pack note of
  `src/feedback-note.ts`, and their tests, removed;
- **Feedback inbox**, through a task: three new notes, each naming the earlier requests it
  supersedes: the pinned default set at `init`, with offline use by vendoring (R1; F-001, F-003,
  F-005's `--offline`); stage changes as pack updates (R2; F-008); packs landing in `remote/` with
  dl-138's lock (R3; F-005's lock, F-007's `built-in/`). The README's decision D3 and its open
  question updated. Earlier notes stay, and only WingFoil's answers change their status
  (`wingfoil-cli` rule 6).

## Execution Notes
- 2026-10-13, after the submit: WingFoil's approver ruled on the default-set resolution, relayed by
  a WingFoil session as input for the default-set note, to be recorded in WingFoil dl-138 (not yet
  merged there): no packs in the npm package; F-003's `advance-bundled-packs` and F-005's
  `--offline` with bundled packs are superseded by D1, offline use coming from vendoring and the
  lock (the first `init` needs the network); the default set is an open question of dl-138's
  Action 2 tech-spec, where WingFoil recommends (b): each WingFoil release pins a commit of this
  repository's catalog that names the default set, `init` uses it unless a source or version is
  given, with a forward-only advance step on WingFoil's side; (a), always the latest default set,
  is not recommended. On this side it needs a catalog commit that resolves the default set and is
  never rewritten (`main`'s protection already forbids rewriting). The approver confirmed in chat:
  the default-set note of R1 proposes (b); F-003 and F-005 get an update line pointing to D1 and
  to the new notes, their status and body otherwise unchanged. The rulings R1–R4 do not change.
- 2026-10-14, plan-034 (merged `e2de1fd`): the vision changes are applied (`01_product-brief.md`
  1.1, `02_product-vision.md` 1.3, `03_is-isnot.md` 1.4, `04_personas.md` 1.2, `05_journeys.md`
  1.2 with J3 "Pin this catalog in a WingFoil release" and J8 as a pack update, `06_features.md`
  1.4, `07_sequencer.md` 1.3, `08_mvp-canvas.md` 1.2), and dl-001, dl-002 and dl-012 carry an
  Execution Note each. With plan-032, plan-033, task-027 and task-028, every change of this
  decision is applied except the tooling one (the removal of `publish:pack --bundled`).
