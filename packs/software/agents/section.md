## The software life cycle

This project runs `sw-life-cycle`: inception, specification, delivery and end of life. Each of
these is a slot: its workflow is a phase pack's or `software`'s default, and `delivery` is the
methodology's. `delivery` creates the releases and runs `release` over each one: `submit` (the
checks, `releasing`, the approval), then `publishing` (commit, rehearsal, tag, publication,
`released`).

- **Which workflow to start:**
  - an architecture decision: `adr-ingest`;
  - a bug found: `bug-ingest`.
- **{{agent_name}} acts in the roles `dna.yaml` › `team.agents` gives it** (its `executes_as`),
  and never approves: it hands the approver the exact command. A `bug` moves through the gates
  `memory.yaml` declares for it, including one parked back by its `returns`, only by the
  approver's `approve`.
- **The release approvals:** until a WingFoil release in the pack's range binds a gate's approval
  to the phase that owns it, the approvals stay in `release-submit` › `approve-release` and
  `release-publishing` › `publish`. A project not running the engine follows those steps by hand:
  the approver's OK is recorded at `approve-release` (in `releasing`, before the release commit)
  and at `publish` (before the tag), and a release never moves past `releasing` by `submit` alone.
- **End of life:** `announce` passes `--tags end-of-life` to `memory add`, since `approve` selects
  the announcement by that tag.
