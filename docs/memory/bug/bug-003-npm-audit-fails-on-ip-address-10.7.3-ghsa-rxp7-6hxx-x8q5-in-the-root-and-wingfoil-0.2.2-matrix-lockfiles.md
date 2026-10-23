---
id: bug-003-npm-audit-fails-on-ip-address-10.7.3-ghsa-rxp7-6hxx-x8q5-in-the-root-and-wingfoil-0.2.2-matrix-lockfiles
type: bug
title: "npm audit fails on ip-address 10.7.3 (GHSA-rxp7-6hxx-x8q5) in the root and WingFoil 0.2.2 matrix lockfiles"
status: draft
severity: "major"        # critical | major | minor
pack: ""            # tooling
---

## Observed

The CI's "Audit the root lockfile" step (`npm audit`) fails on every push since advisory
GHSA-rxp7-6hxx-x8q5 (moderate: `ip-address`'s `Address6` matches a zone identifier in quadratic
time) was published: first seen on task-041's branch, CI run 39850352899, both jobs; `main`'s last
green run, 39816927227, predates it. `npm audit` on `main`:

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
lockfile `src/matrix/wingfoil-0.2.2/package-lock.json` holds it too (its `npm audit` exits 1), so
the next step, "Audit every matrix release's lockfile", fails as well; the lockfile of
`src/matrix/wingfoil-0.3.0/` passes. Every push fails the CI until it is fixed, `main` included.

## Expected

`npm audit` exits 0 on the root lockfile and on every matrix release's lockfile, as adr-003 records
(`npm audit`: 0 vulnerabilities), with no change to `package.json` or to any direct dependency.

## Reproduction

On a clean checkout of `main` (`5e348f3` or later), Node.js 22.21: `npm ci`, then `npm audit` (exit
1); `cd src/matrix/wingfoil-0.2.2 && npm audit` (exit 1). `npm audit fix --package-lock-only` on the
root moves `ip-address` to 10.7.4 and changes only `package-lock.json`.

## Execution Notes
