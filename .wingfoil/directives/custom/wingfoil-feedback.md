---
id: wingfoil-feedback
name: wingfoil-feedback
type: directive
kind: custom
title: "WingFoil feedback"
tags: [process]
---

# WingFoil feedback

This repository is managed by WingFoil and is WingFoil's template source, so it finds WingFoil's
defects and gaps first. They are fixed in the WingFoil repository, through its own process (dl-001 D5).

- A defect, gap or friction of the WingFoil CLI found here is not a `bug` of this repository. Record
  it as a note in `docs/wingfoil-feedback/` (a temporary inbox, not Memory) with evidence: the
  command, its output, the WingFoil version and commit.
- Do not work around it silently. If a workaround is needed to proceed, write it in the note and in
  the Execution Notes of the element being worked on.
- A change to `schema/` (the contract with the WingFoil CLI) and the publication of a pack that
  WingFoil bundles both produce a note, so WingFoil's release planning sees them.
- A note is deleted once WingFoil has an official element for it; the note names that element.
