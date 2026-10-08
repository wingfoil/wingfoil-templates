---
id: F-012
title: "Format key distinct from version:"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T12.

## Observed

WingFoil files carried only `version:`, the content revision; nothing declared the format a file is
written in, so a reader could not tell an old format from a new one.

## Expected

Every WingFoil file declares its format in a `format:` key distinct from `version:`.

WingFoil already has this: **dl-149** (every WingFoil file declares its format in a `format:` key)
and **task-251** (add the key to the config, workflow, directive and template schemas, check it in
the loaders, write it in the init scaffold), delivered on 2026-10-05 through the session "Note per
DL e bug wingfoil" as urgent for v0.3. Differences the receiving session found: Memory templates
already carry `tmpl_version` (their revision, not their format, which stays); agent adapter
manifests already carry `format: 1` (task-177, `ADAPTER_MANIFEST_FORMAT`), the model for the key;
`wingfoil migrate` (F-013) is a separate proposal. `answered_by` stays empty until a sync records
them.
