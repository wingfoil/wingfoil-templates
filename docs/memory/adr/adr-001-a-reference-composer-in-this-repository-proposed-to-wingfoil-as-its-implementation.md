---
id: adr-001-a-reference-composer-in-this-repository-proposed-to-wingfoil-as-its-implementation
type: adr
title: "A reference composer in this repository, proposed to WingFoil as its implementation"
status: pending
tags: ["tooling","composer"]
---

## Context

A pack is validated by composing it with the other packs into a `.wingfoil/` configuration, then
running the pinned WingFoil CLI on the result (`pack-compatibility` directive):
- `wingfoil workflow list`, `wingfoil dna show` and `wingfoil directives list`;
- exit code 0 and no warning;
- with the oldest and the newest compatible WingFoil release;
- composed twice from a clean state, giving byte-identical output.

Nothing composes packs today. WingFoil will install them from v0.4 (WingFoil dl-138: `init`,
`pack add`, `upgrade`), and the configuration WingFoil scaffolds is still compiled TypeScript
(feedback notes T1). Until then, no pack can be validated, `base` included, which the sequencer
wants validated by the real command rather than by hand (`07_sequencer.md`, decision 1).

The features review asked how to compose before WingFoil can (`06_features.md`, open question 1).
The approver ruled option (c) on 2026-10-06. dl-005's Execution Notes route that ruling to an ADR.

Requirements implemented:
- F3.2, the reference composer;
- F3.4, the determinism check, and F3.1, the one validation command, which run it;
- F1.2, the fragment merge, which it implements;
- the north star in `dna.yaml`: every pack combination composes deterministically into a
  `.wingfoil/` that every compatible WingFoil validates with zero errors.

## Decision

**This repository keeps a minimal reference composer, and proposes it to WingFoil as the
implementation of WingFoil's composition step.**

- **Specified, then implemented.** spec-001 specifies composition:
  - the merge order of the fragments, and the add-or-tighten rule for Memory state machines;
  - parameter substitution;
  - slot filling;
  - where each file is written.

  The composer implements spec-001 and nothing more. Where the composer and spec-001 disagree, the
  composer is wrong.
- **Scope.** Given a set of packs (each at a path in this repository, or at a tag), their
  parameters and an output directory, it writes a `.wingfoil/`:
  - it resolves `requires` and `conflicts` and checks the axis cardinalities and the slots;
  - it merges the fragments, substitutes parameters and copies the asset files.

  It does not download packs, write a lock, upgrade a project or merge with a project's own files.
  Those belong to WingFoil (dl-138; notes T5, T7).
- **Deterministic.** The same packs, versions and parameters give byte-identical files: no clock,
  no randomness, no filesystem ordering (`determinism` directive).
- **One composer.** A feedback note proposes to WingFoil that it adopts this composer for the
  composition step of `init`, `pack add` and `upgrade`, instead of writing a second one (notes
  T15). Whether it moves into WingFoil or becomes a package both repositories depend on is
  WingFoil's decision (dl-001 D6).
- **When WingFoil composes.** Once a released WingFoil installs packs (the `pack-install`
  capability in `compat.yaml`), the validation also composes with WingFoil. A difference between
  the two outputs is a defect: of this repository (a `bug`) if the composer departs from spec-001,
  of WingFoil (a feedback note) otherwise.

## Alternatives

- **(a) A composer used only for validation, never proposed to WingFoil.** Rejected: two
  composers diverge, and a pack can then validate here and fail in WingFoil.
- **(b) Specify composition in spec-001 and wait for WingFoil to implement it.** Rejected: nothing
  is validated before WingFoil v0.4, and `base` (M2) would be validated by hand.

## Consequences

- Composition is part of the contract with WingFoil, like the schemas: a change to it changes
  spec-001 and produces a feedback note (`wingfoil-feedback` directive).
- The tooling phase (sequencer M1, wave W5) builds the composer as tasks with no pack
  (dl-005 G7). Its language is adr-002.
- The composer is the reference for spec-001's examples: each example of the merge rules is a
  test fixture.
- The risk of divergence moves to the moment WingFoil decides: if WingFoil writes its own
  composer anyway, this one stays as a validator and its differences from WingFoil are reported
  as feedback notes.

## Execution Notes
