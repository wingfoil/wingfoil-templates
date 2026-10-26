## The software life cycle

This project runs `sw-life-cycle`: inception, specification, delivery and end of life. Each of
these is a slot: its workflow is a phase pack's or `software`'s default, and `delivery` is the
methodology's. `delivery` creates the releases and runs `release` over each one: `submit` (the
checks, `releasing`, the approval), then `publishing` (commit, rehearsal, tag, publication,
`released`).

- **Which workflow to start:**
  - an architecture decision: `adr-ingest`;
  - a bug found: `bug-ingest`.
- **{{agent_name}} acts as developer, reviewer, qa and architect**, and never approves: it hands
  the approver the exact command. A `bug` past `triaged`, and an element after `memory park`,
  moves only by the approver's `approve`.
- **End of life:** `announce` passes `--tags end-of-life` to `memory add`, since `approve` selects
  the announcement by that tag.
