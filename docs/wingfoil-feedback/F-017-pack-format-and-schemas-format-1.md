---
id: F-017
title: "The pack format and its schemas, format 1 (WingFoil-Templates spec-001)"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

Formerly T17.

## Observed

WingFoil-Templates spec-001 and `schema/*.schema.json` (JSON Schema 2020-12) define what WingFoil
will read: `catalog.yaml` (axes and slots as data; one entry per pack, `catalog: official |
community`, `status`; one entry per published version copying `formats`, `requires_capabilities`,
`requires` and `conflicts`, plus `commit`, `digest` and the computed `wingfoil` range),
`compat.yaml` (per WingFoil release: `format_key`, `reads`, `capabilities`), `pack.yaml`, presets
and transitions. Every file carries `format: 1`; every file a pack ships carries `format:` (dl-149).

Observed with WingFoil 0.2.2 from npm, 2026-10-06: `workflow list`, `dna show` and `directives list`
print `unknown field(s) ignored: format` and exit 0 on files with the key, so `compat.yaml` marks
0.2.2 `format_key: false`. A Memory type whose `template.file` is under `memory/templates/built-in/`
works with `memory add`.

## Expected

- Confirm that v0.3 accepts the `format:` key without a warning in all seven kinds: dna, memory,
  roles, workflows, workflow, directive, memory-template.
- If WingFoil generalizes the built-in/custom precedence to Memory templates (F-007), use
  `memory/templates/built-in/`.
- Publish the list of reserved built-in directive ids (spec-001 makes a collision with a pack's id
  an error; overriding stays the project's `custom/`) — see F-019.
- Say whether packs ship `workflows/bindings.yaml` (v0.3, dl-153), which is not a dl-149 kind.
- Agree on a canonical YAML serialization if WingFoil writes its own composer (spec-001 O7, F-015).
- Note: packs ship no `workflows.yaml` fragment, the composer generates the include list;
  `agents/section.md` has no `format:` until dl-137 defines the kind; the composed `workflows.yaml`
  is format 1; the catalog copies each transition's `formats` and `requires_capabilities`.
- spec-001's open points for WingFoil: O11, does `memory add` copy a template's `format:` into
  elements (task-251 decision 4)? O12, WingFoil's own built-in directives share
  `directives/built-in/` with pack files — who owns the folder on upgrade?

Suggested kind in WingFoil: input to the v0.4 planning, with dl-138.

Baseline of the `schema-note` lint rule (task-015): the schemas this note is about.

Schema digest: sha256:1fb43cefb4fee4fe6376dbe5e6515e6d646fd49f7ef3ef78d42020941563d3f9

```text
e81bb71bf7e7fb44d2a652c8600d2445a8aaf7f6f5f321fe933ad32cafb230bf  catalog.schema.json
8e10177bd4d4f145d6c659aa65a662a47bddc777e210a55db8472cfa765cf1b7  compat.schema.json
a39e983745bbca8ebdb45a507f5ca1c1d1dec982e6e2bbe15b6310ea3f2ea3b8  pack.schema.json
147492f7f6fef3fb075b7c825fca9d33784777fb334f33876959b3946c5028c2  preset.schema.json
52746d4c0eaa1dd9a7b2766e09c0d07b7f399444974da2f1557118725c0e0fcf  transition.schema.json
```
