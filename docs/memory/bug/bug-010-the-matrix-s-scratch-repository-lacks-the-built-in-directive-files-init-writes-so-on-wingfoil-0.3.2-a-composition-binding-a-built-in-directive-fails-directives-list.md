---
id: bug-010-the-matrix-s-scratch-repository-lacks-the-built-in-directive-files-init-writes-so-on-wingfoil-0.3.2-a-composition-binding-a-built-in-directive-fails-directives-list
type: bug
title: "The matrix's scratch repository lacks the built-in directive files init writes, so on WingFoil 0.3.2 a composition binding a built-in directive fails directives list"
status: pending
severity: "major"        # critical | major | minor
pack: ""            # tooling
tags: ["tooling","matrix","wingfoil"]
---

## Observed

Found by task-074 (plan-060, the intake of WingFoil 0.3.2) during its build, on 2026-11-03. With
0.3.2 listed in `compat.yaml` and in the golden fixture's (`tests/fixtures/compose/tree/`),
`npm run validate:publication -- --tree tests/fixtures/compose/tree --param project_name=Golden`
reports `matrix: publication, 26 runs, 13 failed`: on 0.3.2, every composition's
`directives list` fails with

```text
stdout: warning: directive 'security' bound to every role (roles.yaml 'global') has no directive file;
stdout: warning: directive 'testing' bound to role 'developer' has no directive file
```

The same holds in self-test mode, so the CI step "Validate the golden fixture against the listed
releases" would fail once 0.3.2 is recorded. The golden fixture's `base` binds WingFoil's built-in
directives `security` and `testing` (`packs/base/fragments/roles.yaml`), which spec-001 §7.4
allows ("shipped by a pack of the composition or one of WingFoil's built-in directives"). The
matrix (`src/matrix.ts`, `runRelease`) commits the composed `.wingfoil/` alone in its scratch
repository, so no built-in directive file is there; a project `init` created holds them
(`directives/built-in/architecture.md`, `code-quality.md`, `code-review.md`, `documentation.md`,
`security.md`, `testing.md`: the same six ids on 0.2.2, 0.3.0, 0.3.1 and 0.3.2, each release
its own content). WingFoil 0.3.2
warns on a binding with no file without `--role` too (its CHANGELOG, `directives list`), which
0.3.0 and 0.3.1 did only with `--role`. The published packs bind no built-in directive: this
repository's nine README examples pass on 0.3.2 (18 runs, 0 failed).

## Expected

The matrix runs a composition as a project would hold it: a directive id that spec-001 §7.4
allows to bind (a WingFoil built-in) has its file, as `init` writes it, so `directives list`
passes on every release for a composition that ships or binds only what §7.4 allows. The golden
tree passes on 0.3.2, in both modes, with no change to the fixture.

## Reproduction

1. On `task/task-074-record-0.3.2` at `7c6c70d` (0.3.2 recorded): `npm ci`, `npm run build`.
2. `npm run validate:publication -- --tree tests/fixtures/compose/tree --param project_name=Golden`:
   exit 1, `26 runs, 13 failed`, the two warnings above on each composition's 0.3.2 run.
3. With WingFoil 0.3.2 alone, in an empty git repository: `wingfoil init --template Kanban`, then
   `git rm .wingfoil/directives/built-in/security.md`, commit, `wingfoil directives list --format
   json`: its `warnings` holds the `security` line; with the file kept, none.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-03: severity `major`: it blocks the record of 0.3.2 (task-074), whose CI would fail. The
  approver ruled (2026-11-03, plan-060): a defect of the matrix, fixed by task-075 before task-074
  records 0.3.2.
- 2026-11-03: independent review: approve, one nit applied (the six ids alike, their content per
  release); it reproduced Observed and step 3 (on 0.3.1 the removed file gives no warning).
