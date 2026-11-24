---
id: wingfoil-cli
name: wingfoil-cli
type: directive
kind: built-in
format: 1
tags: [wingfoil, cli, governance]
title: "Using the pinned WingFoil CLI"
---

# Using the pinned WingFoil CLI

Global. Applies to every role, human or agent, that runs the WingFoil CLI in the project.

## Rules

1. Run the pinned CLI (`{{wingfoil_command}} …`); never a global `wingfoil` of another version.
2. Every governance change goes through a CLI verb when one exists; hand edits only where an entry
   of `{{wingfoil_known_behaviours_path}}` says so.
3. A wrong, missing or surprising behaviour gets an entry in `{{wingfoil_known_behaviours_path}}`.
   If it is a WingFoil defect or gap, also write a note in `{{wingfoil_inbox_path}}/` (evidence:
   command, output, version, commit).
4. Do not work around silently: a workaround goes in its entry in
   `{{wingfoil_known_behaviours_path}}` and in the Execution Notes of the element being worked on.
5. When the pin advances: re-check every entry of `{{wingfoil_known_behaviours_path}}`, remove the
   fixed ones, bump its *Checked against*. A note whose answer has shipped stays `resolved`; there
   is no `verified` status (WingFoil dl-163).
6. `answered_by` and the statuses `needs-info`, `captured`, `resolved`, `declined` and `duplicate`
   are set only by the sync, from what WingFoil published, never by judgement. WingFoil cites a note
   as `<service id>/F-<nnn>@<sha>`.
7. Sync the inbox at every release planning of WingFoil and at every bump of the WingFoil pin:
   read what WingFoil published about the project's notes under the source key on the
   **Source key** line of `{{wingfoil_inbox_path}}/README.md`, set `status` and `answered_by` from
   it (rule 6), and record the sync under **Last sync** in `{{wingfoil_inbox_path}}/README.md`.
   While the **Source key** line is empty, WingFoil has not registered the project and there is
   nothing to sync.

## Known behaviours

The known behaviours are the project's, for the WingFoil it pins:
`{{wingfoil_known_behaviours_path}}` holds them, outside the inbox, which WingFoil reads as one file
per note. The file opens with a line *Checked against:* naming the pinned version (rule 5), then
holds one table, one row per entry:

| # | Behaviour | How to work with it | Note | WingFoil element |
|---|-----------|---------------------|------|------------------|

`#` is the entry's id; *Note* names the inbox's note, if any (rule 3); *WingFoil element* names
WingFoil's answer, once published.
