---
id: task-066-the-secret-rules-parse-a-pack-s-raw-yaml-with-no-node.js-warning-for-an-unquoted-parameter-plan-057
type: task
title: "The secret rules parse a pack's raw YAML with no Node.js warning for an unquoted parameter (plan-057)"
status: backlog
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
(`src/check-packs.ts`) and the composer (`src/compose-documents.ts`) run on a pack's files as
written, before substitution (the overlay check, `src/validate.ts`, runs it on the overlay's own
files), parses a YAML file with the shared `parseYaml` (`src/yaml-load.ts`). Unquoted,
`{{wip_in_progress}}` parses as a flow map whose key is the flow map `{wip_in_progress}`, and
`document.toJS()` stringifies that collection key and warns. The secret rules
read only the document's scalars, never its JavaScript value. Once `packs/methodology/kanban` is on
`main` (task-067), every `check:packs`, `validate`, `compose`, `check:runs` and publication run, and
every CI log, would print the warning. This task removes it before the pack lands, so that the exit
criterion's "no warning" needs no exception.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **No warning:** `secretProblems` on a YAML pack file holding an unquoted parameter as a value
   (`in-progress: {{wip_in_progress}}`, as `kanban`'s `fragments/memory.yaml`) emits no Node.js
   warning and returns the same findings as before for every other input: every existing case of
   `tests/secret-rules.test.ts` passes unchanged.
2. **Limited to the secret rules:** the change is in `src/secret-rules.ts` alone;
   `src/yaml-load.ts`'s `parseYaml`, which loads `catalog.yaml`, `pack.yaml`, fragments after
   substitution and compositions, is unchanged, so a real collection-valued key there is still seen
   as today. A YAML file that falls back to the whitespace tokens today still does: one that does
   not parse, one with more than one document, and one holding an alias (today refused by `toJS`'s
   `maxAliasCount: 0`); a case of `tests/secret-rules.test.ts` pins the alias fallback with an input
   the two paths read differently: a file holding an alias and a 40-character mixed-case
   alphanumeric value with a digit written as `[<value>,x]` (the tokens read `<value>,x` and find
   nothing; a scalar walk would report it).
3. **Red first** (dl-018 R1–R3), each red run recorded in the Execution Notes with its command and
   failing count:
   - in `tests/secret-rules.test.ts`, an async case calling `secretProblems` on such a file with a
     `process.on('warning')` listener, then awaiting `new Promise((r) => setImmediate(r))` before
     asserting that no warning was emitted (Node.js emits the `'warning'` event on the next tick, so
     a synchronous check passes on `main`) and that no finding is returned; the listener removed in
     a `finally`;
   - in `tests/check-packs.test.ts`, a case spawning the lint's CLI (`dist/src/check-packs-cli.js`)
     with `spawnSync` on a temporary tree holding a pack with an unquoted integer parameter in a
     `limits` fragment, asserting its exit code 0 and an empty stderr; the tree is built from the
     test's own fixture files in the system's temporary directory and removed after the case.
   Both red on `main`'s `src/secret-rules.ts` for behaviour (the warning), not for compilation.
4. **The owed row:** "The composer prints a Node.js warning …" moves to Closed in
   `docs/owed-items.md`, settled by task-066 (plan-057), its cause corrected there (the secret
   rules' parse before substitution, run by the lint and the composer alike).
5. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`, `npm
   test`, `npm run lint`, `check:packs`, `validate`, the overlays `software-exit` and `scrum-exit`,
   `index -- --check`, `check:runs` and `workflow list` exit 0; `packs/`, `.wingfoil/` and the
   fixtures' expected outputs unchanged; the branch CI `success`, recorded; after the merge,
   `main`'s CI read. On a scratch copy of the tree with the untracked draft of `kanban` copied into
   `packs/`, `check:packs` prints no warning (the case of plan-057's reads), recorded; it still
   exits 1 there, with the draft README's `example-section` problem and, outside a git repository,
   `catalog-tag`, which are expected.

## Design

Branch `task/task-066-secret-rules-warning` from `main` (`c3cd768`). A tooling task (dl-018 R1–R3).

**`src/secret-rules.ts`:** `yamlStrings` stops calling the shared `parseYaml`. It parses with the
`yaml` package's `parseAllDocuments` and the same options (`uniqueKeys: true`,
`prettyErrors: false`), and returns `undefined`, so that the whitespace tokens are scanned as
today, when the text holds no document or more than one, when the document has an error, or when
it holds an alias (today refused by `toJS({ maxAliasCount: 0 })`). Otherwise it walks the
document's scalars as today; it never calls `toJS`, which is what stringifies a collection key and
warns. `src/yaml-load.ts` is unchanged.

**Tests, red first** (one commit, on `main`'s `src/secret-rules.ts`):
- `tests/secret-rules.test.ts`: the async no-warning case (Acceptance 3) on a `memory.yaml`
  fragment whose `limits` hold `in-progress: {{wip_in_progress}}`; the alias case of Acceptance 2
  (a file with `a: &x 1`, `b: *x` and the line `c: [<value>,x]`, `<value>` built at run time as
  the suite's other values: no finding, the tokens path), green on `main` and after, pinning the
  fallback.
- `tests/check-packs.test.ts`: a tree from `tests/support/pack-tree.ts` (the clean foundation and
  `kanban`) whose `base` declares an integer parameter and uses it unquoted as a limit in its
  `memory.yaml` fragment; the lint's CLI spawned with `spawnSync` on it: exit 0, stderr empty.

Then the fix; green; the owed row moved to Closed.

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
- 2026-10-30: independent review: approve after amendments, one blocking finding (the in-process red
  test must wait a tick: Node.js emits `warning` on the next one); applied with the fallbacks kept
  (aliases, several documents), the scratch copy's expected lint lines, the wording of the flow map,
  `spawnSync`.
- 2026-10-30: focused re-review: approve; its nits applied. Submitted.
