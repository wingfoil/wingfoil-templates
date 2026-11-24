---
id: wingfoil-channel
name: wingfoil-channel
type: directive
kind: built-in
format: 1
tags: [feedback-channel]
title: "Feedback channel: WingFoil"
---

# Feedback channel: WingFoil

Serves the target `upstream:wingfoil`.

A feedback item whose outcome is `upstream-note` and whose target is the one above becomes one note
to WingFoil, in WingFoil's format (WingFoil dl-163):

- **Where:** `{{wingfoil_inbox_path}}/F-<nnn>-<slug>.md`, the next free number of the inbox, never
  renumbered.
- **Frontmatter:** these six fields, in this order:
  - `id`, the note's id, `F-<nnn>`;
  - `title`, what the note is about;
  - `kind`: `defect`, `gap` or `request`;
  - `status`: `open`, as the project writes it; every other status is set by the sync
    (`wingfoil-cli` rule 6);
  - `wingfoil_version`, the version the note was observed on;
  - `answered_by`, a list, empty until WingFoil answers.
- **Body:** the sections `## Observed` and `## Expected`, reproducible with WingFoil alone
  (command, output, version), and no `## Replies`.
- **Kinds:** `defect`, `gap` and `request` map one to one; `observation` becomes `request`.
- **Citation:** the note's body cites the feedback id, and the item's `resulting` names the note's
  path.
- **Ledger:** the note's row is added to the ledger in `{{wingfoil_inbox_path}}/README.md`.
