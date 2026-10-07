---
id: F-014
title: "The base pack depends on the AGENTS.md marker format of dl-137's tech-spec"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T14. Cites the pack base 0.1.0 (archive/draft-2026-10-05).

## Observed

WingFoil-Templates settles who owns `AGENTS.md` once packs exist (its dl-003, rules R1–R4): it is
never a pack file; packs contribute sections and WingFoil generates the file (WingFoil dl-137 Q2
iii); WingFoil owns only a region between markers and regenerates it, the rest belongs to the
project; until WingFoil exports `AGENTS.md` (v0.4), projects write it by hand with the markers in
place. The pack `base` uses **provisional** markers `<!-- wingfoil:generated:begin -->` and
`<!-- wingfoil:generated:end -->` (spec-001 §10 on `main`). WingFoil dl-137 carries R1–R4 as
constraints on its part-(b) tech-spec (amend `eac64831`; ratified, approve `9b915e4f`); only the
marker syntax is still open, with that tech-spec, in v0.4.

## Expected

dl-137's part-(b) tech-spec fixes the marker syntax, whether there is one region or one per section,
what the drift check reports, and what happens when the markers are missing or malformed — before
many projects adopt `base`, so that a change costs `base` a patch release and each adopter two lines
of `AGENTS.md`. If WingFoil2's own `AGENTS.md` (dl-137 part (a), v0.3) lands first, this repository
aligns to the markers it uses.

Suggested kind in WingFoil: none new; a dependency on the dl-137 part-(b) tech-spec.
