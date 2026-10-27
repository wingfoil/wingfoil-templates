---
id: bug-006-base-1.0.0-a-produces-that-names-a-directory-without-a-trailing-slash-is-never-satisfied-on-wingfoil-0.3.0-retrospective-explore-governance-evolution-apply
type: bug
title: "base 1.0.0: a produces that names a directory without a trailing slash is never satisfied on WingFoil 0.3.0 (retrospective explore, governance-evolution apply)"
status: approved
severity: "major"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","base","workflow"]
---

## Observed

Found by the session running plan-047 on WingFoil 0.3.0 and confirmed here on 2026-10-26 in
WingFoil 0.3.0's code (`cc31d7a8`, `dist/workflow/deduce.js`, `exists`): a `produces` string is
looked up as a file unless it ends with `/`, and only then as a directory prefix:

```
exists(path) {
    if (!path.endsWith('/'))
        return this.tree.has(path);
    return this.snapshot.tree.some((file) => file.startsWith(path));
}
```

`base` 1.0.0 declares two directories without the slash:
- `retrospective` › `explore` produces `"{{retrospective_path}}"`, whose default is
  `docs/retrospectives` (a directory, the charter's "weak evidence"): the phase is never satisfied
  by the files written there; with `docs/retrospectives/` it is;
- `governance-evolution` › `apply` produces `.wingfoil` (a directory) beside `AGENTS.md`: the
  directory half is never satisfied (not run end to end).

The steps cannot be passed by hand either: `workflow finalize --step retrospective.explore` is
refused ("phase 'retrospective.explore' completes from its evidence: produces"), and `workflow end`
refuses an incomplete instance. So, on `base`'s defaults, `retrospective` and
`retrospective-periodic` cannot get past `explore`, and `governance-evolution` cannot get past
`apply`, whose `.wingfoil` is not a parameter (no workaround); `retrospective_path` set to
`docs/retrospectives/` is one for `explore` (checked: `workflow next` moves on to
`additional-points`).

This contradicts the charter: it says `apply`'s evidence is "always satisfied, the directory
existing", and calls `retrospective_path` the inventory's directory; its Execution Notes record
that `.wingfoil/**` and `*` were dropped as load errors on 0.3.0, without the slash form being
adopted. A related limit, already recorded as the charter's weak evidence: once a file is in the
directory, `explore` reads as complete for every later retrospective; with `.wingfoil/`, `apply`'s
evidence is true in every adopted project.

## Expected

Each `produces` that names a directory is satisfied when the directory holds a file: `base` writes
it with a trailing slash (`retrospective_path`'s default `docs/retrospectives/`, its description
saying a directory ends with `/`; `apply`'s `.wingfoil/`), in a patch of `base`, restoring the
charter's intent. Whether the lint should refuse a directory without the slash is the triage's.
`software` has no such `produces`: its one plain path is `inception`'s `"{{inception_path}}"`
(`docs/inception.md`, a file); the others are `{ type, path }` elements.

## Reproduction

1. Compose `base` on its defaults, with `plan_id={workflow}-{phase}-plan` so that `start` succeeds
   (bug-005), into a scratch repository, commit; start `retrospective-periodic`, and write a file
   under `docs/retrospectives/`, committed.
2. `wingfoil workflow next`: `explore` is still the open step; with `retrospective_path` set to
   `docs/retrospectives/` it is complete.

## Execution Notes
- 2026-10-26: independent review: approve after amendments. Applied: the steps cannot be finalized
  by hand either; the contradiction with the charter and its history; `software` has no such
  `produces`; the reproduction through bug-005's workaround.
- 2026-10-26: re-review: approve. Submitted.
- 2026-10-27: fixed on `main` by the merge `52db4dc` (task-054, plan-049); to be released in
  `base` 2.0.0 (plan-049 step 8). task-053's `check:runs` drives it on WingFoil 0.3.0.
