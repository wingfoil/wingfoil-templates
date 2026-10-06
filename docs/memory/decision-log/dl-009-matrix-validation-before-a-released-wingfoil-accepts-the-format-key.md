---
id: dl-009-matrix-validation-before-a-released-wingfoil-accepts-the-format-key
type: decision-log
title: "Matrix validation before a released WingFoil accepts the format key"
status: pending
tags: ["tooling","compatibility","validation"]
---

## Context

spec-001 §5 requires `format:` in every file a pack ships, and §12 makes a pack version compatible
with a WingFoil release only when the release has `format_key: true`. The `pack-compatibility`
directive validates a composition with `wingfoil workflow list`, `dna show` and `directives list`,
with exit code 0 **and no warning**.

No released WingFoil accepts the key without a warning. 0.2.2, the only release, prints
`Warning: <file>: unknown field(s) ignored: format` on stderr and exits 0 (spec-001 Execution Notes,
checked 2026-10-06), so the `compat.yaml` example of spec-001 §12 marks it `format_key: false`; the
real file arrives with dl-010. WingFoil v0.3 accepts the key (WingFoil task-251, `done`, merged in
WingFoil2 at `28f550bc`), but v0.3 is not released, and the development build still reports
version `0.2.2`.

The tooling phase (sequencer M1, W6, F3.3) has to prove that the compatibility matrix works on
fixtures that follow spec-001, before any released WingFoil can pass them. spec-001 §16 O10 gives
this decision to the tooling phase. It blocks task 8 of plan-015.

Whatever is decided here applies to the tooling's own tests only. A publication follows
`pack-compatibility` unchanged: no pack is published before `compat.yaml` lists a released WingFoil
that accepts its formats.

## Options

- **(a) An unreleased v0.3 build, for the tooling only.** The matrix's self-tests run against a
  WingFoil2 build pinned by commit, never against it for a publication.
  - For: the real zero-warning path runs with real `format:` files; the tooling is ready the day
    v0.3 is released.
  - Against: the build is not on npm, so CI needs a tarball built from a sibling repository; it
    reports version `0.2.2`, so it can be told apart only by commit; `compat.yaml` lists only
    released versions (spec-001 §12), so the build lives outside it, and the matrix needs a second
    source of releases.
- **(b) Fixtures without `format:`, in the tests only.** The matrix's self-tests compose fixtures
  that omit the key, and 0.2.2 passes them with no warning.
  - For: a real zero-warning run on a released, npm-pinned WingFoil.
  - Against: the fixtures violate spec-001 §5, so the lint (F3.5) needs a test-only exemption, and
    the tests exercise a format nobody publishes. A composer path that only fixtures use can hide
    defects of the real one.
- **(c) A data-driven tolerance, in self-test mode only.** The matrix has two modes:
  - **publication** (`pack-release-cycle` › `validate`): `pack-compatibility` unchanged. Any warning
    fails. Releases are taken from the computed compatibility (§12), so 0.2.2 is never selected.
    An empty compatible set (the range `""`) fails: a publication run that runs nothing is not a
    pass;
  - **self-test** (the tooling's own tests, and CI on pull requests): the matrix may also run a
    release that `compat.yaml` marks `format_key: false`, and then tolerates exactly the warning
    lines `Warning: <file>: unknown field(s) ignored: format`, whose `<file>` resolves inside the
    composed `.wingfoil/`. A line that lists `format` together with another field fails, as do any
    other warning and any non-zero exit. The tolerance follows from `format_key: false` in
    `compat.yaml`, not from a hard-coded version. The zero-warning logic is tested with a stub CLI.
  - For: fixtures stay conformant; the matrix runs a real, npm-pinned WingFoil in CI; nothing
    published depends on the tolerance; it disappears by itself when compat lists a release with
    `format_key: true`.
  - Against: until v0.3 is released, the zero-warning path is proven against a stub only; the
    self-test result on 0.2.2 is weaker evidence than a clean run.
- **(d) Wait for v0.3.** Close W6 only when v0.3 is released.
  - Against: blocks M1 on WingFoil's calendar, which the sequencer ruled out (M1 "waits for nothing
    in WingFoil").

## Decision

**Proposed: option (c)**, captured as proposed with plan-015 on 2026-10-06. The approver rules at
`memory approve`.

- The matrix has a publication mode and a self-test mode. Only the self-test mode tolerates the
  `format` warning, only for releases marked `format_key: false`, and only that exact warning.
- The output of the self-test mode says that the tolerance was applied and for which release, so
  that its evidence is never read as a clean run.
- **Publication mode fails on an empty compatible set.** Until `compat.yaml` lists a released
  WingFoil with `format_key: true`, every publication run fails, which is what
  `pack-compatibility` requires.
- **The mode is fixed by the caller, never by the data.** The publication path
  (`pack-release-cycle` › `validate`, and CI on release tags) has no way to select self-test mode;
  CI on pull requests runs self-test mode.
- `pack-release` evidence (F5.1) is produced only in publication mode. The evidence writer refuses a
  result whose mode is not publication, or that applied a tolerance.
- **Scope of `pack-compatibility`.** The directive governs the validation and publication of the
  catalog's packs. A fixture under `tests/fixtures/` is not a pack of the catalog: it is never under
  `packs/`, never listed in `catalog.yaml` and never published. Composing it is a test of the
  tooling, so self-test mode does not depart from the directive.
- When `wingfoil-release-intake` adds the first release with `format_key: true`, the self-tests
  also run it, and option (a) is no longer needed.

Configuration changes this decision implies: one sentence in `pack-compatibility` stating its
scope, the catalog's packs, so that fixture compositions are not read as covered. It is applied with
the configuration follow-ups of plan-015 step 2. Directives carry no `version:` key, so nothing is
bumped.

## Execution Notes

- 2026-10-06: amended while `pending`, as the approver asked, after an independent review (plan-015
  Execution Notes): an empty compatible set fails publication; the caller fixes the mode, and CI
  on tags runs publication mode; the evidence writer refuses self-test results; the exact matching
  of the tolerated line; the scope of `pack-compatibility`, with its one-sentence configuration
  change; `compat.yaml` is cited as spec-001's example, since the real file arrives with dl-010.
