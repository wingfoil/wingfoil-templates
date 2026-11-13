---
id: bug-016-npm-audit-fails-on-hono-and-hono-node-server-ghsa-4m76-xfj5-7975-and-six-more-in-the-wingfoil-0.2.2-0.3.0-and-0.3.1-matrix-lockfiles
type: bug
title: "npm audit fails on hono and @hono/node-server (GHSA-4m76-xfj5-7975 and six more) in the WingFoil 0.2.2, 0.3.0 and 0.3.1 matrix lockfiles"
status: draft
severity: "major"        # critical | major | minor
pack: ""            # tooling
tags: ["tooling","ci","dependencies"]
---

## Observed

The CI's "Audit every matrix release's lockfile" step (`npm audit` in each `src/matrix/wingfoil-*/`)
fails on `main` since the advisories below were published, on 2026-11-12 or 2026-11-13: it first
failed in CI run 43390069004 on `c7ea0e33`, both shard-1 jobs (`validate (22.12.0, 1)` and
`validate (22.21.0, 1)`); the shard-2 jobs, which run no audit, passed; the last green run is
43311916342 on `d9946a9d` (2026-11-12, 21:36 UTC). In the matrix lockfiles of WingFoil 0.2.2
(`hono` 4.13.13, `@hono/node-server` 2.1.4), 0.3.0 (4.13.13, 2.1.5) and 0.3.1 (4.13.14, 2.1.5),
`npm audit` reports:

```
@hono/node-server  2.0.0 - 2.1.5
Severity: moderate
  GHSA-qv5m-9pm6-hqp3, GHSA-jpvv-r467-5p4w
hono  <=4.13.15
Severity: moderate
  GHSA-4m76-xfj5-7975, GHSA-h7mg-cq63-vhpq, GHSA-3gg2-335m-rxc6, GHSA-46wx-v44x-9hh2,
  GHSA-4h7h-rv7c-7m2v
fix available via `npm audit fix`
2 moderate severity vulnerabilities
```

Both are transitive development dependencies: `wingfoil` → `@modelcontextprotocol/sdk` →
`@hono/node-server` and `hono`. The lockfile of WingFoil 0.3.2 already holds `@hono/node-server`
2.1.6 and `hono` 4.13.16, and passes. The root lockfile holds `hono` 4.13.13 and
`@hono/node-server` 2.1.3 through `wingfoil@0.2.2`: "Audit the root lockfile" (`npm audit
--omit=dev`) passes, and "Audit the whole root tree, warning only" warns, as dl-035 R1 has it for
an advisory in a development dependency. No change can be merged with a green CI until the matrix
lockfiles are fixed, `main` included.

## Expected

`npm audit` exits 0 on every matrix release's lockfile, the gate of the CI's matrix audit step
(`.github/workflows/ci.yml`, dl-035), and the whole root tree's audit no longer warns, with no
change to any `package.json` or direct dependency, the pinned `wingfoil` versions unchanged, and
`npm audit signatures` still verifying.

## Reproduction

On a clean checkout of `main` at `c7ea0e33` (any commit, once the advisories are in the registry),
Node.js 22.21: `cd src/matrix/wingfoil-0.3.0 && npm audit` (exit 1; the same in `wingfoil-0.2.2`
and `wingfoil-0.3.1`; exit 0 in `wingfoil-0.3.2`); `npm audit` in the root (exit 1, the warning
step's input). `npm audit fix --package-lock-only`, tried on a copy of `src/matrix/wingfoil-0.3.0/`,
moves `@hono/node-server` to 2.1.8 and `hono` to 4.13.18, and `npm audit` then exits 0.

## Execution Notes

- 2026-11-13: severity `major`: the advisories are moderate and the dependencies development ones,
  but they turn every CI run red, `main` included (bug-003's reasoning). Found on `main`'s CI before
  plan-071's `submit` (dl-038 C3), which waits for the fix; fixed by plan-072's task (a
  `tooling-change`, as the approver chose on 2026-11-13).
