---
id: task-003-pack-digest-and-computed-wingfoil-range
type: task
title: "Pack digest and computed WingFoil range"
status: backlog
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-002-yaml-loading-and-schema-checks-against-schema"]
tags: ["tooling","W5","F3.2"]
---

## Context

Task 3 of plan-015 (`sw-life-cycle` › `tooling`, wave W5, F3.2). Tooling task, no pack.

It comes from:
- **spec-001 §13:** the pack digest (dl-004 4(a)): the files of the pack directory in the tagged
  commit's tree, regular files only (`100644`, `100755`; a symbolic link or a submodule fails), the
  blob bytes as committed, paths relative to the pack directory, a `sha256sum`-style listing sorted
  in byte order, and `sha256:` plus the sha256 of the listing. It gives a test vector;
- **spec-001 §14:** a transition's digest is §13 applied to a one-file listing whose path is the
  file name;
- **spec-001 §12:** the computed `wingfoil` range: the releases of `compat.yaml` compatible with a
  version (`format_key: true`, every kind of `formats` read, `reads.workflows` containing 1, every
  required capability provided), split into runs of consecutive releases, each written
  `>=first <=last` or `first`, joined with ` || `; `""` when none;
- **spec-001 §17:** the composer "computes digests and computed ranges for the release process".

Scope: the two computations, as functions, and a `digest` command. Not in scope: writing
`catalog.yaml` entries (task 11, release evidence), the real `compat.yaml` (task 8, dl-010): the
range is tested on fixture compat data.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.
Test repositories are temporary, with isolated git configuration (`GIT_CONFIG_NOSYSTEM=1`, a
`GIT_CONFIG_GLOBAL` file of the test's own, an identity set, `tag.gpgSign=false`), and tags are
annotated (spec-001 §4). Fixtures are built deterministically: a submodule entry with `git
update-index --add --cacheinfo 160000,<sha>,<path>`, an executable bit with `git update-index
--chmod=+x`, a `CRLF` blob with `git hash-object -w --no-filters` and `git update-index`.

1. `npm ci`, `npm run build`, `npm test`, `npm run check:pins` and `npm run check:schemas` exit 0;
   `package.json` gains the `digest` script and no dependency.
2. **Test vector.** A test commits the four files of spec-001 §13 under `packs/governance/example/`
   in a test repository, tags them, and gets exactly the listing and the digest
   `sha256:77a8a72717b5c73b556af940449ff91a609796079139ade0cb98ddf2ca81bd1c` of §13.
3. **Digest rules,** each with a test:
   - a symbolic link, and a submodule entry, in the pack directory make the digest fail, naming the
     path;
   - an executable file (`100755`) gives the same digest as the same file at `100644`;
   - blob bytes are hashed as committed: a `CRLF` blob keeps its `CR`;
   - a path with a segment that breaks `^[A-Za-z0-9][A-Za-z0-9._-]*$` (`a b.md`, `.hidden`) makes
     the digest fail;
   - order is byte order of the whole path: `B.md`, `a-b.md`, `a.md`, `a/x.md`, `a0.md`;
   - a sibling directory sharing the prefix (`packs/base-x/` next to `packs/base/`) does not enter
     `packs/base`'s listing;
   - no file under `packs/<id>/` at the ref fails;
   - an uncommitted change in the working tree does not change the result.

   The tree is read with `git ls-tree -r -z --full-tree <commit> -- packs/<id>/` and blobs with
   `git cat-file`, so quoting, tabs or newlines in paths cannot corrupt the parse.
4. **Transition digest:** a function (repository, ref, transition file) returns §13 applied to a
   one-file listing whose path is the file's base name (`prototype-to-production.yaml`, not
   `transitions/…`); a test checks it against the sha256 arithmetic computed in the test.
5. **Computed range,** on fixture compat data, which the function requires in ascending order (it
   fails otherwise):
   - none compatible gives `""`; one gives `0.3.0`; a run gives `>=0.3.0 <=0.3.2`; two runs give
     `>=0.3.0 <=0.3.1 || 0.4.0`;
   - excluded, each alone: `format_key: false`; a kind of `formats` absent from `reads`; a kind
     present with the format not in its list; `reads.workflows` without 1; a required capability
     not provided;
   - runs follow adjacency in `compat.yaml`, not semver: with `0.3.0` and `0.3.2` listed next to
     each other and both compatible, the result is `>=0.3.0 <=0.3.2`;
   - empty `formats` and empty `requires_capabilities` are compatible with every release that has
     `format_key: true` and reads `workflows` 1.
6. **`npm run digest -- [--repo <dir>] <ref> <catalog pack id>`** prints the digest of
   `packs/<id>` at `<ref>` (default repository: the working directory). A test runs it with
   `--repo` on a test repository and compares it with the spec-001 §13 reference command run there.
   - The id must follow spec-001 §4 (`base`, `<axis>/<name>`, `phase/<slot>/<name>`):
     `phase/inception` and `../x` are refused;
   - the ref is resolved with `git rev-parse --verify --end-of-options <ref>^{commit}`, so a ref
     starting with `-` never reaches git as an option;
   - exit 1 on a digest rule failure, 2 on a missing ref or a git failure, 3 on bad usage.
7. **Isolation from the user's git:** a test runs the digest with a global configuration setting
   `core.autocrlf=true` and gets the same result; `src/` contains no `exec(`, `execSync(` or
   `shell: true` (`grep` in a test).
8. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review
  that confirmed the §13 test vector: a `--repo` option, id and ref validation, the prefix-sibling
  and nested-order cases, `-z` parsing, deterministic fixture recipes, a check for git isolation,
  the transition interface, the missing range cases, exit code 3 for bad usage.
