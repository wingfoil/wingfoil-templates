---
id: bug-003-npm-audit-fails-on-ip-address-10.7.3-ghsa-rxp7-6hxx-x8q5-in-the-root-and-wingfoil-0.2.2-matrix-lockfiles
type: bug
title: "npm audit fails on ip-address 10.7.3 (GHSA-rxp7-6hxx-x8q5) in the root and WingFoil 0.2.2 matrix lockfiles"
status: draft
severity: "major"        # critical | major | minor
pack: ""            # tooling
tags: ["tooling","ci","dependencies"]
---

## Observed

The CI's "Audit the root lockfile" step (`npm audit`) fails on every push since advisory
GHSA-rxp7-6hxx-x8q5 (moderate: `ip-address`'s `Address6` matches a zone identifier in quadratic
time) was published, on 2026-10-22: it first failed on `main` in CI run 39831936093 (`4d84334`),
and in every CI run since, task-041's 39850352899 included, both jobs; the last green run is
39818697576 (`aa9222e`). `npm audit` on `main`:

```
ip-address  <=10.7.3
Severity: moderate
ip-address: Address6 matches a zone identifier in quadratic time ahead of its length limit, ...
fix available via `npm audit fix`
node_modules/ip-address
1 moderate severity vulnerability
```

`ip-address` 10.7.3 is a transitive development dependency: `wingfoil@0.2.2` →
`@modelcontextprotocol/sdk@1.32.1` → `express-rate-limit@8.7.0` → `ip-address@10.7.3`. The matrix
lockfile `src/matrix/wingfoil-0.2.2/package-lock.json` holds `ip-address@10.7.3` too (via
`express-rate-limit@8.7.1`; its `npm audit` exits 1, found locally), so the next step, "Audit every
matrix release's lockfile", which the CI skips once the root audit fails, would fail as well; the
lockfile of `src/matrix/wingfoil-0.3.0/` already holds 10.7.4 and passes. No change can be merged
with a green CI until this is fixed, `main` included.

## Expected

`npm audit` exits 0 on the root lockfile and on every matrix release's lockfile, the gate of the
CI's audit steps (`.github/workflows/ci.yml`), with no change to any `package.json` or direct
dependency, and `npm audit signatures` still verifying.

## Reproduction

On a clean checkout of `main` at `4d84334` or later (any commit, once the advisory is in the
registry), Node.js 22.21: `npm ci`, then `npm audit` (exit 1); `cd src/matrix/wingfoil-0.2.2 &&
npm audit` (exit 1). `npm audit fix --package-lock-only`, run in the root and in
`src/matrix/wingfoil-0.2.2`, moves `ip-address` to 10.7.4 in each; together they change only the
two `package-lock.json` files (three lines each), and `npm run check:pins` still passes.

## Execution Notes

- 2026-10-23: severity `major`: the advisory is moderate and the dependency is a development one,
  but it turns every CI run red, `main` included, so no change merges with a green CI until it is
  fixed (bug-002 was `minor`: it broke only the branches that add a feedback note). Found on
  task-041's CI run; `main`'s own runs since `4d84334` were red and not read at their push (the
  plan-044 close, plan-045's commits). Independent review: approve after amendments. Applied: the
  first failing run and the last green one; the matrix lockfile's path; the matrix step skipped in
  CI; the reproduction's commit and both fix commands; the CI as the gate.

