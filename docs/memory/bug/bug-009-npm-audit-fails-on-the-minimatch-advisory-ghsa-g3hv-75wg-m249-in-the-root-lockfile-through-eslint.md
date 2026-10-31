---
id: bug-009-npm-audit-fails-on-the-minimatch-advisory-ghsa-g3hv-75wg-m249-in-the-root-lockfile-through-eslint
type: bug
title: "npm audit fails on the minimatch advisory GHSA-g3hv-75wg-m249 in the root lockfile, through eslint"
status: draft
severity: "major"        # critical | major | minor
pack: ""            # tooling
tags: ["tooling","ci","dependencies"]
---

## Observed

The CI's "Audit the root lockfile" step fails on every branch and on `main`: `main`'s first red CI
run is 41196364111 on `77510f3`, both jobs, then 41198090730 on `e309390`, and task-070's branch
runs 41198500589 and 41200156986; the last green run on `main` is 41136522706 (`074fa07`). One
advisory, published in between:

| Package | Locked | Advisory | Severity | Path |
|---|---|---|---|---|
| `minimatch` | 10.2.6 | GHSA-g3hv-75wg-m249 (denial of service via globparts amplification; affects `<11.0.1`) | moderate | `eslint@10.12.0` → `minimatch`; `eslint` → `@eslint/config-array@0.23.5` → `minimatch`; `typescript-eslint@8.71.1` → `@typescript-eslint/typescript-estree@8.71.1` → `minimatch` |

`npm audit` on `main`: "11 moderate severity vulnerabilities" (`minimatch` and the ten packages
that depend on it), exit 1. Every path is a development dependency (the lint): `npm audit
--omit=dev` exits 0, and the three matrix lockfiles (`src/matrix/wingfoil-0.2.2/`, `0.3.0/`,
`0.3.1/`) audit clean. No fixed 10.x exists, and no release of the packages that require it accepts
11 (`eslint` 10.14.0 requires `^10.2.6`, `@eslint/config-array` 0.23.5 `^10.2.4`,
`@typescript-eslint/typescript-estree` 8.72.1 `^10.2.2`), so the fix of bug-003 and bug-004 (the
lockfile moved within the ranges) is not available. No change can be merged with a green CI until
this is fixed, `main` included. The fix `npm audit fix --force` proposes is `eslint@4.0.0`, a
major downgrade, not an option.

## Expected

`npm audit` exits 0 on the root lockfile and on every matrix release's lockfile (the gate of the
CI's audit steps), `npm audit signatures` still verifying; `npm run lint`, `npm run check:pins` and
the whole suite unchanged; the runtime dependencies (adr-003) and `.wingfoil/dna.yaml` unchanged.

## Reproduction

On a clean checkout of `main` at `77510f3` or later (any commit, once the advisory is in the
registry), Node.js 22.21.0: `npm ci`, then `npm audit` (exit 1, 11 moderate). With `"overrides": {
"minimatch": "11.0.3" }` (an exact pin, adr-002) added to `package.json` and `npm install
--package-lock-only --ignore-scripts`, only `package.json` (3 lines) and `package-lock.json` (16
lines) change: `minimatch` 10.2.6 → 11.0.3, `@isaacs/nonrecursive-glob-match` 1.0.3 added
(development, BlueOak-1.0.0), and `minimatch`'s declared `brace-expansion` range raised to `^5.0.12`
(the locked 5.0.12 unchanged). After `npm ci`, `npm ls minimatch` shows 11.0.3 on the three paths,
`npm audit` exits 0 ("found 0 vulnerabilities") and `npm run lint` exits 0, on Node.js 22.21.0 and
22.12.0.

## Execution Notes

- 2026-10-31: severity `major`, as bug-003 and bug-004: every CI run is red, `main` included. The
  approver ruled (2026-10-31, in chat, on plan-057's work): bug-009 and a tooling task, task-071,
  with the override, before task-070's gate; if the override fails a check, the task stops and the
  approver rules a CI policy for advisories on development dependencies (the owed row "CI policy
  for advisories in transitive dependencies").
- 2026-10-31: independent review: approve after amendments; it reproduced the advisory, the paths
  and the override (an identical linted file set, a determinism probe still reported). Applied: the
  first red run on `main`; the exact pin; the lockfile's other changes; `check:pins` in Expected;
  `audit fix --force`'s downgrade.
- 2026-10-31: focused re-review: approve; its nits applied. Submitted.
