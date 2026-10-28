---
id: dl-024-mcp-servers-declared-by-packs
type: decision-log
title: "MCP servers declared by packs"
status: pending
tags: ["packs","format","mcp","wingfoil"]
---

## Context

On 2026-10-22 the approver observed that packs that integrate trackers (such as Jira and Linear)
or infrastructure (Kubernetes, cloud providers) would gain a great deal if, besides directives
and configuration, they provided the **MCP servers** through which agents talk to those
external resources. The approver asked whether this needs a change to WingFoil.

What exists, read on 2026-10-22 from WingFoil 0.3.0 (`cc31d7a8`), installed from npm, pinned by the
lockfile `src/matrix/wingfoil-0.3.0/`, into a scratch project (`git init`, then `wingfoil init
--template Kanban --no-interactive`):
- `wingfoil mcp` starts WingFoil's own MCP server (read-only Resources and role Prompts) over stdio;
- `wingfoil agent execute` launches an agent CLI through an **adapter manifest**,
  `.wingfoil/agents/built-in/claude-code.yaml` and `codex-cli.yaml`, with `mcp.via: config-file` or
  `config-arg` and an `mcp.template`. The template names one server only, WingFoil's:
  `{"mcpServers": {"wingfoil": {"command": "{mcp_command}", "args": {mcp_args}}}}` for Claude Code,
  `mcp_servers.wingfoil={command = "{mcp_command}", args = {mcp_args}, enabled = true, required =
  true}` for Codex CLI. The placeholders a template may use are `{mcp_command}` and `{mcp_args}`,
  both WingFoil's server;
- a project may write its own adapters under `.wingfoil/agents/custom/`, so a project could hand-
  write every server it wants into each adapter's template;
- packs ship neither adapter manifests nor `workflows/bindings.yaml` (spec-001 §12, plan-038), and
  the pack format has no file kind for MCP servers.

So: WingFoil can already hand an MCP configuration to an agent, but only its own server, and a pack
cannot add one. Adding a server through a custom adapter means rewriting the template of every
agent tool the project uses; it is a project value, so a pack cannot do it.

## Options

- **(a) Document only.** A pack ships a directive on how to use the server and, in its README, the
  configuration to add by hand to the project's custom adapters.
  - For: works today; no change in WingFoil or in the format.
  - Against: one hand edit per agent tool and per server; nothing pins, checks or scopes the server.
- **(b) A new pack file kind (provisionally `mcp`): a fragment that declares servers, which the
  composer merges and WingFoil adds to the configuration it passes through every adapter.**
  - For: one declaration per server, whatever the agent tool; pinned, linted, scoped by role and
    phase; the adapters stay WingFoil's.
  - Against: needs WingFoil (a new kind it reads, a placeholder or a merge in every adapter
    template, secrets, approval at install) and a format change here.
- **(c) Packs ship adapter manifests.**
  - Against: an adapter describes an agent tool, not a server; every pack would rewrite every
    adapter, and two packs would collide on the same file (§7.6's one-owner rule).
- **(d) Servers in `dna.yaml`** (for example under `stacks.technologies`).
  - Against: `dna.yaml` is the structural map; a server needs a command, a version, environment
    references and scoping, which are not structure.

## Decision

**Proposed: option (b), with (a) as the interim** until a released WingFoil reads the new kind.
The approver rules at `memory approve`.

### D1 — Packs declare servers; they never ship server code

A server entry names how to start or reach it and pins it:
- `name` (the key of the keyed list), `transport` (`stdio` or `http`), and either `command` and
  `args` with a pinned package version, or `url` for a remote server;
- `env`: names of environment variables only, never values (`security-secrets`; the secret lint
  of F3.5 applies);
- `access`: `read` by default; `write` tools listed explicitly;
- `vendor_hosted: true` with `data_location` for a server that sends data to its vendor, so that a
  stricter pack can restrict it (D2) (not `remote`, which dl-021 R3 uses for the remote asset
  class);
- `roles` and `phases`: where the server is enabled; a write tool only in the workflow phases that
  need it, behind their approval gate. A `phases` entry that names another pack's workflow requires
  that pack (spec-001 §6.3).

**Third-party code.** A pack ships no code, and still, by declaring a `command` with a pinned
package, installing it leads WingFoil to start code that a third party wrote. That is a new kind
of consequence for a pack, and the approver rules it explicitly with this decision; D4's approval
at install is its safeguard.

### D2 — The composer

- A new kind, provisionally `mcp` (the name is WingFoil's, D3 1), fragment `fragments/mcp.yaml`,
  with `format:` like every fragment (spec-001 §5). No pack can ship it before a released WingFoil
  reads the kind: §12's computed range would be empty (hence D5).
- Two keys, so that the merge stays monotonic (§7.2: nothing is ever removed):
  - `servers`: a keyed list by `name`, with **one owner per server**: a second pack declaring the
    same name fails. This is a new list rule, departing from §7.2's merge of keyed-list items that
    share a name, and borrowing §7.6's one-owner rule for asset files by analogy;
  - `restrictions`: two sets of server names, `deny` (never enabled) and `read_only` (write tools
    never enabled). Sets only grow and do not depend on order, so any pack can restrict any server
    without editing its entry: a stricter pack adds to `deny` the vendor-hosted servers it does not
    allow. Naming a server in a restriction is an explicit exception to §6.3: the restricting pack
    does not `require` the pack that declares it.
  The F3.5 lint fails a restriction only when no pack of the tree declares the name; at
  composition, a restriction whose server's pack is absent produces a notice, not a failure.
- Lint: pinned versions; no secret values; a write tool needs a phase with an approval.

### D3 — What WingFoil needs (the feedback note)

The feedback note F-035 asks WingFoil, as a request and not a commitment, to:
1. read the composed MCP declarations, as a file kind WingFoil names;
2. add the declared servers to the configuration every adapter passes to the agent, beside
   WingFoil's own, through a placeholder in the adapter template or a merge WingFoil performs;
3. enable a server only for its declared roles and phases at `agent execute`;
4. resolve environment references at launch, never storing values;
5. ask for explicit approval when a pack update adds or widens a server;
6. record the MCP calls of an agent run with the run (`wingfoil agent show`), so that a run can be
   audited.

A capability `mcp-servers` joins this repository's provisional vocabulary in `compat.yaml` (dl-021
R4) only when a release's CHANGELOG names the feature. A pack that ships `mcp` declares it in
`requires_capabilities`.

### D4 — Security

- An MCP server runs code and its responses can carry prompt injection: approval at install (D3 5)
  is required, and the official catalog lists only servers published by the vendor of the resource
  or by a maintained open-source project.
- Write access is never a default; a write tool is enabled only in the phases D1 names, behind
  their approval gate.

### D5 — The interim (option (a))

Until a released WingFoil reads `mcp`, a pack ships the directive on how to use its server and,
in its README section 3 "Install and update" (spec-002 §2.3), the server entry to paste into the
project's custom adapters, per agent tool. When WingFoil reads the kind, the same entry becomes
the fragment, and the server entry is removed from section 3 (as F6.1's hand steps); the section
  itself stays, as spec-002 §2.1 requires.

### D6 — What this decision implies, after approval

- spec-001: the `mcp` kind in §5, §6.1 (layout), §6.4 (the `fragments` subset), a new §7.x for
  D2's merge, §12 and §18 (the lint rules); `schema/` gains the fragment's schema, with the
  feedback note `wingfoil-cli` rule 8 requires;
- spec-002 §2.3 (and its check CB-3): a pasted server entry stays in section 3 when the section
  shrinks to a link, until WingFoil reads the kind;
- `pack-authoring`: D1's rules;
- the F3.5 lint: D2's rules.

## Execution Notes

- 2026-10-22: drafted at the approver's request; evidence read from WingFoil 0.3.0 in a scratch
  project. An independent review of the draft (dl-017), verdict "approve after amendments", was
  applied before submission: D2's merge made monotonic (one owner per server, restrictions as
  growing sets, instead of narrowing an entry, which §7.2 forbids); `remote` renamed
  `vendor_hosted` (dl-021 R3 uses "remote"); the third-party-code consequence stated for the
  approver; `phases` naming another pack's workflow requires it; D6 lists §6.1, §6.4 and §18.
  F-035 matches.
- 2026-10-24: text revised for submission: the examples in D1, D2 and D4 made generic (a stricter
  pack restricts servers; write tools follow their phase's approval gate), D3's item 6 states its
  purpose (auditing a run). Second independent review (dl-017) of the revised text, verdict
  "approve after amendments", 2 blocking, 6 should-fix, 0 nit, all applied before submission:
  restrictions linted against the tree and a notice at composition (§17, §18), the exception to
  §6.3 stated; the one-owner list rule stated as new (§7.2, §7.6); the kind name provisional and
  unshippable before a release reads it (§12); section 3 kept, spec-002 §2.3 added to D6; Context
  wording aligned with F-035; D1's example generic.
- 2026-10-28, plan-053: added to this repository from the text the approver ruled on 2026-10-24
  that this repository add after W9, relayed by the coordinating session (re-sent unchanged on
  2026-10-28, the first copy lost with the session that queued it). The number is the one the text
  gives. Changes to the received text: the frontmatter `status` is this repository's (`draft` until
  `submit`), and two prose lines over 100 characters rewrapped. No word changed.
- 2026-10-28, plan-053: independent review on adding (dl-017): approve after amendments, nothing
  blocking; every citation still holds on `main` (`8242f52`), and the WingFoil claims hold on 0.3.0
  and on 0.3.1 (identical adapter manifests and agent code). Findings, ruled by the approver to be
  recorded here and applied, if at all, while `pending` when the approver rules this element:
  1. a custom adapter cannot reuse a built-in adapter's name (refused on 0.3.0 and 0.3.1: an
     adapter name is unique across `built-in/` and `custom/`, not an override); a project copies
     a built-in adapter under a name of its own and selects it in `dna.yaml` › `team.agents` ›
     `adapter`: the Context, D5 and option (a)'s "Against" to say so;
  2. D6's spec-001 list misses §2 (the term "fragment"), §6.2 (`formats`), §12 and `compat.yaml`
     (`kinds`, each release's `reads`), §17 (D2's composition notice) and
     `schema/pack.schema.json` (`contents.fragments`); §18's change to say the restriction notice
     is not a refusal;
  3. D3 item 2: an adapter with `mcp.via: args` has no template, so only a merge WingFoil performs
     reaches it;
  4. D1 and D2's "exception to §6.3" overstates the rule: they extend §6.3's list to workflows
     named in `phases`, and a restricted server is not added to it;
  5. F-035's six requests to be checked against D3's items by task-063's review.
