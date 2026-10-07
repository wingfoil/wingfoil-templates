---
id: F-001
title: "Templates are compiled TypeScript; there is no external template source"
kind: gap
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T1.

## Observed

Init templates are string generators in `src/storage/templates.ts` (`SCRUM`, `KANBAN` at :35-49,
`DEFAULT_TEMPLATE` at :58) and `src/storage/builtin-directives.ts`. They have no source files, no
manifest, no version and no remote origin. Nowhere in the code, specs, DLs or plans is there a
remote template repository. The phrase "template registry" (`src/cli/program.ts:131`, spec-008)
only means the in-code `TEMPLATES` array (true at `30f06016`; since then WingFoil has `dl-138`). The
only rendering is JS template literals over `def.name`, `def.slug`, `def.cadence` and
`def.methodologies`. There are no project parameters, not even `project.name`.

## Expected

WingFoil-Templates becomes the single source of truth for packs. The bundled base packs are
**generated from it** by a build step (a vendored, pinned copy), not hand-written TS strings. Check
the spec-015 tarball constraint (`files: ["dist","README.md"]`): either the vendored packs are
compiled into `dist/` as data, or `files` gains a `templates/` directory.

Suggested kind in WingFoil: decision-log (template source of truth and bundling) + tech-spec (pack
format). Related: WingFoil dl-138.
