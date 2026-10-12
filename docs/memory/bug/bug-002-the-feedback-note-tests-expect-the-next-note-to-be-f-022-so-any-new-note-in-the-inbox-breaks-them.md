---
id: bug-002-the-feedback-note-tests-expect-the-next-note-to-be-f-022-so-any-new-note-in-the-inbox-breaks-them
type: bug
title: "The feedback-note tests expect the next note to be F-022, so any new note in the inbox breaks them"
status: approved
severity: minor
pack: ""
tags: ["tooling","feedback","tests"]
---

## Observed

`tests/feedback-note.test.ts` (task-015, `b00e6b5`) copies this repository's live inbox
(`docs/wingfoil-feedback/`) into a scratch tree, generates a note with `npm run feedback:note` or
`npm run publish:pack -- --bundled`, and expects its number to be `F-022` (lines 63, 101, 152,
154). The number is the next free one in the inbox, so the tests hold only while the inbox ends at
F-021.

Found on 2026-10-12 by task-026, which adds F-022 … F-026: in a clean clone of
`retro/2026-10-12-periodic` at `c966e12`, `npm test` gives 803 tests, 800 pass, 3 fail, on Node.js
22.21.0 and 22.12.0:

```
not ok 44 - npm run feedback:note -- --schema (wingfoil-cli rule 8)
  actual: 'F-027-schema-2a53b79db3ff.md'
not ok 46 - npm run feedback:note -- --published
  expected: 'F-022-pack-base-1.0.0-published.md'
  actual: 'F-027-pack-base-1.0.0-published.md'
not ok 47 - npm run publish:pack -- --bundled (F5.4; the W7 exit criterion)
```

CI run 38284275227 on `c966e12` ended in `failure` for the same reason.

## Expected

The tests derive the expected number from the inbox they copy as the tool does
(`src/feedback-inbox.ts`: the highest note number plus one), so adding a note never breaks them;
the tooling is unchanged. `F-017` in the same file is not part of this bug: it is the schema
baseline note the tool reads, and moves only when a new schema note is written.

## Reproduction

1. Check out `c966e12` (it adds F-022 … F-026 to the inbox).
2. `npm test`: tests 44, 46 and 47 fail.

## Execution Notes

- 2026-10-12: captured under plan-025 (the periodic retrospective), which hosts task-026; the
  approver ruled, on 2026-10-12, that task-026 fixes it (dl-019 R1: the conflict between task-026's
  Acceptance 1 and 6 was raised when found). Severity minor: tests only, no tooling behaviour is
  wrong; its cost is that CI fails on any branch that adds a note until it is fixed.
