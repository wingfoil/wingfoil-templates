---
id: traceability
name: traceability
type: directive
kind: custom
title: "Traceability"
---

# Traceability

Keep the chain decision → pack charter → task → pack-release across every change.

- Every task names its `pack` (or is a tooling task), and the element it comes from (the pack
  charter, spec-001, a DL, a bug) in its Context.
- Every pack-release lists the tasks and bugs it ships.
- A rule taken from WingFoil (an element of the WingFoil repository) cites that element's id.
- An erratum of an approved tech-spec, found during a wave, is recorded in the tech-spec's Execution
  Notes with the element that found it, and folded back at wave close (dl-020).
