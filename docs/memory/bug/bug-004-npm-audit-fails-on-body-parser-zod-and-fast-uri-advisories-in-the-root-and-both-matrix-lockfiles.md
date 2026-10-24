---
id: bug-004-npm-audit-fails-on-body-parser-zod-and-fast-uri-advisories-in-the-root-and-both-matrix-lockfiles
type: bug
title: "npm audit fails on body-parser, zod and fast-uri advisories in the root and both matrix lockfiles"
status: draft
severity: "major"        # critical | major | minor
pack: ""            # tooling
tags: ["tooling","ci","dependencies"]
---

## Observed

The CI's "Audit the root lockfile" step fails again, the day after bug-003's fix: `main`'s CI run
40071365400 (`1dd597b`, task-041's delivery), both jobs; the last green run is 39975031633
(`e5c95ec`). Three advisories published in between, all on transitive dependencies:

| Package | Locked | Advisory | Severity | Path |
|---|---|---|---|---|
| `body-parser` | 2.3.0 | GHSA-27r3-jxmh-p828 | high | `wingfoil@0.2.2` → `@modelcontextprotocol/sdk` → `express` → `body-parser` |
| `zod` | 4.6.5 | GHSA-mrhx-c7xc-m3w5 | high | `wingfoil@0.2.2` → `zod` (and through `@modelcontextprotocol/sdk`) |
| `fast-uri` | 3.1.8 | GHSA-w74x-v6f9-j3xg, GHSA-xhq7-xmqj-769h, GHSA-wjr9-j795-jxcr, GHSA-333x-w4r6-6crp | moderate | `ajv@8.20.0` (a runtime dependency of the tooling) → `fast-uri` |

`npm audit` on `main`: "3 vulnerabilities (1 moderate, 2 high)", exit 1. The matrix lockfiles have
them too: `src/matrix/wingfoil-0.2.2/` all three, `src/matrix/wingfoil-0.3.0/` `body-parser`
(found locally; the CI skips the matrix step once the root audit fails). No change can be merged
with a green CI until this is fixed, `main` included.

## Expected

`npm audit` exits 0 on the root lockfile and on every matrix release's lockfile (the gate of the
CI's audit steps), with no change to any `package.json` or direct dependency, and
`npm audit signatures` still verifying.

## Reproduction

On a clean checkout of `main` at `1dd597b` or later (any commit, once the advisories are in the
registry), Node.js 22.21.0: `npm ci`, then `npm audit` (exit 1); in `src/matrix/wingfoil-0.2.2`
and `src/matrix/wingfoil-0.3.0`, `npm audit` (exit 1). `npm audit fix --package-lock-only` in
each of the three folders moves, in the root and in 0.2.2, `body-parser` 2.3.0 → 2.4.0, `qs`
6.16.0 → 6.16.1 (required by the new `body-parser`), `fast-uri` 3.1.8 → 3.1.9 and `zod` 4.6.5 →
4.6.7, and in 0.3.0 `body-parser` and `qs`; it changes only the three `package-lock.json` files,
and `npm audit` then exits 0 in each.

## Execution Notes

- 2026-10-24: severity `major`, as bug-003: two of the advisories are high, and every CI run is red,
  `main` included. The approver ruled (2026-10-24): bug-004 and a task fixing the three lockfiles,
  as for bug-003, before task-043; a decision on how the CI treats advisories on transitive
  dependencies may come later.

