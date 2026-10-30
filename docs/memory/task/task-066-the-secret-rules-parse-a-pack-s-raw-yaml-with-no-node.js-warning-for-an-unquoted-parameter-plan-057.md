---
id: task-066-the-secret-rules-parse-a-pack-s-raw-yaml-with-no-node.js-warning-for-an-unquoted-parameter-plan-057
type: task
title: "The secret rules parse a pack's raw YAML with no Node.js warning for an unquoted parameter (plan-057)"
status: draft
pack: ""            # tooling task (tooling-delivery, plan-057 point 2)
depends_on: []
tags: ["tooling","lint","kanban"]
---

## Context

plan-057 point 2 (decided under the approver's allowance of 2026-10-30): the row of
`docs/owed-items.md` left by plan-056 ruling 13 says the composer prints a Node.js warning ("Keys
with collection values will be stringified due to JS Object restrictions: `"{ wip_in_progress }"`")
for an unquoted integer parameter, `{{name}}`, as `methodology/kanban`'s `limits` use it. plan-057's
reads found the cause elsewhere: `secretProblems` (`src/secret-rules.ts`), which the lint
(`src/check-packs.ts`), the overlay check (`src/validate.ts`) and the composer
(`src/compose-documents.ts`) all run on a pack's files as written, before substitution, parses a
YAML file with the shared `parseYaml` (`src/yaml-load.ts`), whose `document.toJS()` turns the
flow map `{{wip_in_progress}}` used as a key into a JavaScript object and warns. The secret rules
read only the document's scalars, never its JavaScript value. Once `packs/methodology/kanban` is on
`main` (task-067), every `check:packs`, `validate`, `compose`, `check:runs` and publication run, and
every CI log, would print the warning. This task removes it before the pack lands, so that the exit
criterion's "no warning" needs no exception.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **No warning:** `secretProblems` on a YAML pack file holding an unquoted parameter used as a
   plain scalar (`in-progress: {{wip_in_progress}}`, as `kanban`'s `fragments/memory.yaml`) emits
   no Node.js warning and returns the same findings as before for every other input: every
   existing case of `tests/secret-rules.test.ts` passes unchanged.
2. **Limited to the secret rules:** the change is in `src/secret-rules.ts` alone; `src/yaml-load.ts`'s
   `parseYaml`, which loads `catalog.yaml`, `pack.yaml`, fragments after substitution and
   compositions, is unchanged, so a real collection-valued key there is still seen as today. A YAML
   file that does not parse still falls back to the whitespace tokens, as today.
3. **Red first** (dl-018 R1–R3), each red run recorded in the Execution Notes with its command and
   failing count:
   - in `tests/secret-rules.test.ts`, a case calling `secretProblems` on such a file with a
     `process.on('warning')` listener, asserting that no warning is emitted (the listener removed
     after the case), and that no finding is returned;
   - in `tests/check-packs.test.ts`, a case spawning the lint's CLI (`dist/src/check-packs-cli.js`)
     on a temporary tree holding a pack with an unquoted integer parameter in a `limits` fragment,
     asserting its exit code 0 and an empty stderr; the tree is built from the test's own fixture
     files in the system's temporary directory and removed after the case.
   Both red on `main`'s `src/secret-rules.ts` for behaviour (the warning), not for compilation.
4. **The owed row:** "The composer prints a Node.js warning …" moves to Closed in
   `docs/owed-items.md`, settled by task-066 (plan-057), its cause corrected there (the secret
   rules' parse before substitution, run by the lint and the composer alike).
5. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`,
   `npm test`, `npm run lint`, `check:packs`, `validate`, the overlays `software-exit` and
   `scrum-exit`, `index -- --check`, `check:runs` and `workflow list` exit 0; `packs/`,
   `.wingfoil/` and the fixtures' expected outputs unchanged; the branch CI `success`, recorded;
   after the merge, `main`'s CI read. On a scratch copy of the tree with the untracked draft of
   `kanban` copied into `packs/`, `check:packs` prints no warning (the case of plan-057's reads),
   recorded.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
