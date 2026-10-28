---
id: F-035
title: "Packs cannot declare MCP servers for the agents WingFoil launches"
kind: request
status: open
wingfoil_version: 0.3.0
answered_by: []
---

New note (task-063). From this repository's dl-024 (proposed, not yet ruled).

## Observed

WingFoil 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`, then `wingfoil init --template
Kanban --no-interactive`):

```
$ wingfoil --help                                           # excerpt
  mcp                         start the WingFoil MCP server (read-only Resources
                              and role Prompts) over stdio
  agent                       launch an agent on an element, and read recorded
                              agent runs
$ ls .wingfoil/agents/*
.wingfoil/agents/built-in:
claude-code.yaml
codex-cli.yaml

.wingfoil/agents/custom:
$ grep -A3 '^mcp:' .wingfoil/agents/built-in/claude-code.yaml
mcp:
  via: config-file
  template: |
    {"mcpServers": {"wingfoil": {"command": "{mcp_command}", "args": {mcp_args}}}}
$ grep -A2 '^mcp:' .wingfoil/agents/built-in/codex-cli.yaml
mcp:
  via: config-arg
  template: 'mcp_servers.wingfoil={command = "{mcp_command}", args = {mcp_args}, enabled = true, required = true}'
```

The MCP configuration `wingfoil agent execute` passes to an agent names one server, WingFoil's own;
the template's placeholders (`{mcp_command}`, `{mcp_args}`) are that server's. A project can add
other servers only by hand-writing them into the template of a custom adapter under
`.wingfoil/agents/custom/`, once per agent tool. No file a template pack ships can declare a
server: packs ship neither adapter manifests nor bindings.

## Expected

Request, for WingFoil's release planning and not a commitment. Packs for trackers (Jira, Linear),
infrastructure (Kubernetes, cloud providers) and specifications (OpenAPI) would give agents the
MCP servers that reach those resources. This repository proposes (dl-024) that a pack declare
servers in a fragment of a new kind, which its composer merges (one owner per server; later
packs may only add restrictions: servers denied, servers kept read-only). It asks WingFoil to:

1. read the composed declarations, as a file kind whose name is WingFoil's;
2. pass the declared servers to the agent beside WingFoil's own, through every adapter (a
   placeholder in the adapter template, or a merge WingFoil performs), so that a pack never edits
   an adapter;
3. enable a server only for the roles and workflow phases it declares, at `agent execute`;
4. resolve environment-variable references at launch; declarations carry names, never values;
5. ask for explicit approval when a pack install or update adds a server or widens its access;
6. record an agent run's MCP calls with the run (`wingfoil agent show`).

Until then, packs ship the server entry in their README, to paste into custom adapters by hand.
The capability name is WingFoil's (WingFoil dl-177); this repository would record a provisional
`mcp-servers` in `compat.yaml` only when a release's CHANGELOG names the feature. A decision-log on
WingFoil's side is welcome, not required.
