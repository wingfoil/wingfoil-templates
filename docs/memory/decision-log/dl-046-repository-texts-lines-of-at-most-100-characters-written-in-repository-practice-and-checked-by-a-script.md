---
id: dl-046-repository-texts-lines-of-at-most-100-characters-written-in-repository-practice-and-checked-by-a-script
type: decision-log
title: "Repository texts: lines of at most 100 characters, written in repository-practice and checked by a script"
status: approved
tags: ["process","texts","tooling"]
---

## Context

This repository's texts keep lines of at most 100 characters, frontmatter, table rows, link
reference lines and generated sections excepted. The rule is followed by habit and written in no
directive; `npm run lint` is ESLint only. In the cycle of `governance/feedback` long lines were
rewrapped after the fact several times (`2e27c28a`, `30338831`, `66bc66a7`), and one in prel-007
reached `main`: the amending command printed the line's length but did not stop the commit, the
submit and the push (the inventory of 2026-11-21, §4, §5.3, P1). A count on 2026-11-21 finds about
220 … 250 prose lines over 100 characters in about 100 Markdown files already on `main`, outside
`tests/fixtures/`. Candidate GOV-3 of dl-043 (C3); the adoption (W10) does not change it.

## Options

1. **As today.** Rejected: unwritten, unchecked, and slipped through to `main`.
2. **The rule written only**, in `repository-practice`. Rejected alone: it still relies on habit.
3. **The rule written and a script checking the lines a change adds**, blocking in CI on a
   branch and run before a commit, so the lines already on `main` stay as they are.
4. **The script over whole files.** Rejected: about 250 lines on `main` would have to be rewritten
   first, approved elements among them (amended only by notes until G7).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — The rule**, in `repository-practice`: a line a change adds to a Markdown file of this
  repository is at most 100 characters (counted as characters, not bytes), except a frontmatter
  line, a table row, a link reference line and a line inside a fenced code block. Out of its scope:
  `tests/fixtures/` (expected outputs the composer writes from `packs/`), `CATALOG.md`, and the
  regions between a `generated:begin` and a `generated:end` marker.
- **P2 — The check:** `npm run check:texts` reads the lines a diff adds (against `main`, or the
  staged diff before a commit) and exits 1 on a breach, naming the file, the line and its length.
  CI runs it on branches against the merge base with `main`; on `main` it reads the pushed range.
  The agent runs it on the staged diff before every commit, beside the privacy check (rule 2), and
  the commit waits for its exit 0.
- **P3 — Applied after approval** by a dl actions plan: a tooling task (`tooling-delivery`) for the
  script, its tests and the CI step, red first (dl-018); `repository-practice` 1.2 → 1.3 with P1 and
  P2, in one bump with dl-047's rule; the existing long lines left as they are.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
- 2026-11-21: independent review: approve after amendments; one should-fix (the scope: `tests/
  fixtures/`, `CATALOG.md` and the generated regions out) and three nits (one term for link lines;
  English dropped; the commit waits for exit 0), all applied.
- 2026-11-21: re-review: approve; two nits (the count's scope; the shared bump), applied.
- 2026-11-23, plan-081: actions applied (P3): `npm run check:texts` and its CI steps by task-102,
  merged into plan-081's branch (`27240450`), `approved` until its check on `main`;
  `repository-practice` 1.3, rule 5 (`25b1af51`); the row "dl-046's actions" closed there.
