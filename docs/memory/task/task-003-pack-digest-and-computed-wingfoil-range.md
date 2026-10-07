---
id: task-003-pack-digest-and-computed-wingfoil-range
type: task
title: "Pack digest and computed WingFoil range"
status: draft
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

1. `npm ci`, `npm run build`, `npm test`, `npm run check:pins` and `npm run check:schemas` exit 0;
   no dependency is added.
2. **Test vector.** A test builds the four files of spec-001 §13 in a temporary git repository,
   commits and tags them, and gets exactly the listing and the digest
   `sha256:77a8a72717b5c73b556af940449ff91a609796079139ade0cb98ddf2ca81bd1c` of §13.
3. **Digest rules,** each with a test on a temporary git repository:
   - a symbolic link, and a submodule entry (mode `160000`), in the pack directory make the digest
     fail, naming the path;
   - an executable file (`100755`) gives the same digest as the same file at `100644`;
   - the blob bytes are hashed as committed: a file committed with `CRLF` keeps its `CR`, whatever
     the checkout does;
   - a path whose segments break `^[A-Za-z0-9][A-Za-z0-9._-]*$` makes the digest fail;
   - order is byte order (`B.md` before `a.md`);
   - an empty or missing pack directory at the ref fails;
   - the result does not depend on the working tree (a file changed but not committed).
4. **Transition digest:** §13 on a one-file listing whose path is the file name; a test checks it
   against `sha256sum` arithmetic computed independently in the test.
5. **Computed range,** tested on fixture compat data: none compatible gives `""`; one release gives
   `0.3.0`; a run gives `>=0.3.0 <=0.3.2`; two runs give `>=0.3.0 <=0.3.1 || 0.4.0`; a release
   with `format_key: false`, one missing a kind's format, one without `workflows: [1]` in `reads`,
   and one lacking a required capability are each excluded; the result follows `compat.yaml`'s
   order.
6. **`npm run digest -- <ref> <catalog pack id>`** prints the digest of `packs/<id>` at `<ref>`;
   on the test repository it equals the spec-001 §13 reference command run there (`git ls-files -s`
   mode check, then `sha256sum` of the sorted listing). Exit 1 on a digest rule failure, 2 on a
   missing ref or a git failure.
7. `git` is called with an argument list, never through a shell, and without depending on the
   user's git configuration for the result (no `core.autocrlf` effect, since blobs are read with
   `git cat-file`).
8. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
