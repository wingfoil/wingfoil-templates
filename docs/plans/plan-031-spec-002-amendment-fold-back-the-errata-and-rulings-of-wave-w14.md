---
id: plan-031-spec-002-amendment-fold-back-the-errata-and-rulings-of-wave-w14
type: plan
title: "spec-002 amendment: fold back the errata and rulings of wave W14"
status: draft
workflow: "sw-life-cycle"
phase: "specification"
tags: ["spec","W14"]
---

## Context

The element dl-020 R2 asks for: it folds back into spec-002's body the errata and rulings of wave W14
that spec-002's Execution Notes record (2026-10-12), before wave W8, which builds on spec-002
(`base`'s README, CB-1, CB-2, CB-6; dl-020 R3). Opened on the approver's request in chat on
2026-10-13. Hosted by `sw-life-cycle` › `specification`, the phase that produces tech-specs; it
reopens only for this amendment.

**How.** The `tech-spec` type has only `draft → pending → approved`, with no state for an amendment
of an approved element. The approver chose on 2026-10-13, among (a) a new tech-spec superseding
spec-002, (b) spec-002's body edited in place under a plan with the approver's OK, (c) a new state
or type (a process change), option **(b)**: spec-002 keeps its id, its links and `approved`; its
Execution Notes list every change and the approver's OK. The choice is for this amendment; making it
the general rule for approved bodies would be a decision-log of its own (dl-006 R2).

The content was approved by the approver on 2026-10-13 ("tabella ok"), each change from a ruling
or erratum already recorded:

| Section | Change | Source |
|---|---|---|
| §2.4 | the exemption holds while the tree holds no methodology, not until the first is published | approver's ruling 2026-10-11, task-022 |
| §3.1, §3.3 | a version's `tag` is derived as `<catalog pack id>@<version>`, not read from `catalog.yaml` | task-019 |
| §3.2 | the README column links the README rendered on github.com at the latest version's tag | approver's ruling, task-019 |
| §3.3 (P2) | `excerpt` is section 2's first paragraph only, no profile text | approver's ruling 2026-10-11, task-019 |
| §5 (P1) | no third-party library: the page's own script `index/vendor/search.js`, its sha256 in `index/vendor/search.js.sha256`, checked by the build | approver's ruling 2026-10-11, task-024 |
| §5 | the page renders no README Markdown: the excerpt is escaped text, each result links the README on github.com | approver's ruling at plan-024's presentation |
| §5 (P3) | `npm run site -- [--tree <dir>] --out <dir>`, writing `index.html`, `site.css`, `search.js`, `catalog-index.json`, `llms.txt` | task-024 |
| §5 | the sentence on the deployment waiting for CI dropped: Pages deploys from `main` since 2026-10-12 | task-024 |
| §6 CB-7 | "the vendored library's checksum" becomes the vendored script's | follows from P1 |
| §7 | P1–P3 closed, each with its ruling | — |

Not in this plan: spec-001's amendment (its §4 erratum, dl-021's changes); any code, test or
generated file, since the tooling already implements the corrected text; CB-8.

## Steps

On the branch `spec/spec-002-amendment`, from `main` at `a15b053`.

1. **claude (architect):** the changes of the table in spec-002's body, nothing else; an Execution
   Note listing them and the approver's choice (b) with its date. One commit.
2. **claude:** checks: `npm test` (`tests/root-readme.test.ts` links spec-002 by path), `npm run
   lint`, `npm run index -- --check` and `npm run validate` exit 0; `git diff` of spec-002 limited
   to the sections of the table and the Execution Notes.
3. **claude:** an independent review of the amendment against each source (dl-017), its findings
   fixed, a re-review when a fix changes a rule.
4. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–4, except the merge OK. It never runs `memory approve` or `memory reject`.
- **Approver:** the choice (b) and the content (given in chat on 2026-10-13); the merge OK, which is
  the OK the Execution Note of spec-002 records.
- Done when the amended spec-002 is on `main`, pushed. The plan then goes `active → done`.

## Execution Notes

- 2026-10-13: written; `workflow` and `phase` filled by editing the draft (W-02).
