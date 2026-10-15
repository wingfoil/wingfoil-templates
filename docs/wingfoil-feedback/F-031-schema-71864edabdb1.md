---
id: F-031
title: "The pack schemas changed (sha256:71864edabdb1)"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-031).

## Observed

The pack schemas under `schema/`, the contract with the WingFoil CLI (spec-001), changed.

Schema digest: sha256:71864edabdb12f05126554fbbf28f700b4e867082d00a37ecaefbf92fce87996

```text
e194df3e06a487d979a20cff40ba819a65962887d5b982ca3f4a4a5bf6df0cad  catalog.schema.json
8e10177bd4d4f145d6c659aa65a662a47bddc777e210a55db8472cfa765cf1b7  compat.schema.json
35e6bc3a51bfd41456247b28d40afbaa52c269038f936c9a109bea61329026e3  pack.schema.json
917e576ef0b02112f152cdbf7887f1eb750d515cbda3ab4d4811d6d7c7f96d34  preset.schema.json
52746d4c0eaa1dd9a7b2766e09c0d07b7f399444974da2f1557118725c0e0fcf  transition.schema.json
```

Changed since F-017:

- changed: `schema/catalog.schema.json`
- changed: `schema/pack.schema.json`
- changed: `schema/preset.schema.json`

What changed for a reader of the contract (WingFoil-Templates dl-022, spec-001 as amended on
2026-10-15):
- **Two foundation packs.** `base`, the core of every project governed by WingFoil, software or
  not, and `software`, the software layer composed right after it, both outside the axes. The
  catalog pack id pattern admits `software`; neither pack has an `axis`; `base` requires nothing,
  `software` requires `base@^<major>` only, and no pack conflicts with either.
- **`catalog.yaml`.** `foundation` is the list `[base, software]`, in composition order.
  `base` is in every composition; `software` only when the project chooses it or a pack requires
  it. The `methodology` axis is `required_with: software` in place of `required: true`: exactly one
  methodology with `software`, at most one without it. The slots' `default` is `software`, which
  now ships `sw-life-cycle` and the slot defaults; `base` ships `retrospective` and
  `governance-evolution`.
- **`conditional` in `pack.yaml`.** At most one entry, `{ with: software@^<major>, contents: {
  workflows, directives } }`, on a pack that is not a foundation pack and does not require
  `software`: content that counts only in a composition holding `software`, such as a
  methodology's `delivery`. `with` never adds a pack; a `software` outside its range is an error.
  A catalog version entry copies `conditional` with its `with` only, as it copies `requires`.
- **Presets** may name `software@^<major>`.
- **Formats.** `pack.yaml` and `catalog.yaml` stay at format 1: nothing is published and no reader
  of them exists yet, so no previous schema is frozen.

## Expected

WingFoil reads the new contract at its release planning (`wingfoil-cli` rule 8): `schema/` is the machine-readable half of the pack format.

In particular, a resolver of this catalog (`pack-install`, WingFoil dl-138):
- reads `foundation` as a list and adds `base` to every composition, `software` only when asked
  for or required unconditionally;
- judges the `methodology` axis's cardinality on the resolved composition, through
  `required_with`;
- composes a pack's conditional part, and includes its workflows after the pack's own, only when
  the composition holds `software`, checking its `with` range then.
