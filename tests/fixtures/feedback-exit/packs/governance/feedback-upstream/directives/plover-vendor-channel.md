---
id: plover-vendor-channel
name: plover-vendor-channel
type: directive
kind: built-in
format: 1
tags: [feedback-channel]
title: "Feedback channel: Plover Vendor"
---

# Feedback channel: Plover Vendor

Serves the target `upstream:plover-vendor`.

Plover Vendor is a fictional upstream. A feedback item whose outcome is `upstream-note` and whose
target is the one above becomes one note:

- **Where:** `docs/upstream/plover/<feedback id>.md`, one file per item.
- **Frontmatter:** these six fields, in this order:
  - `id`, the note's id;
  - `title`, what the note is about;
  - `kind`: `defect`, `gap` or `request`;
  - `status`: `open`, `needs-info`, `captured`, `resolved`, `declined` or `duplicate`;
  - `wingfoil_version`, the version the note was observed on;
  - `answered_by`, a list of ids, empty until the upstream answers.
- **Body:** the sections `## Observed` and `## Expected`, and no `## Replies`.
- **Kinds:** `defect`, `gap` and `request` map one to one; `observation` becomes `request`.
- **Citation:** the note's body cites the feedback id, and the item's `resulting` names the note's
  path.
