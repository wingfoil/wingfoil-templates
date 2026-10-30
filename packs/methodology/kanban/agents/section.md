## Kanban

This project runs Kanban (the Kanban Guide, May 2025) as the `delivery` of its life cycle.

- **Pull within the limits:** at most {{wip_in_progress}} tasks `in-progress` and
  {{wip_in_review}} `in-review` in the whole repository. WingFoil refuses a move past a limit; a
  state a reject pushed over its limit is brought back within it before anything else moves in.
- **One item's flow** is `work-item`: start, build, review, the approver's approval, done.
- **Service Level Expectation:** {{service_level_expectation}}; an older item is handled first.
- **A task's `release` field** holds the version of the release it is delivered in, or
  `n/a — <reason>` until it is planned.
- **Releases** are decided by the Product Owner, one kept `in-development` to carry the flow; a
  release moves to `releasing` only once its tasks are done or moved to the next release.
- **{{agent_name}}** works for the developers, as their tool, and never approves: it hands the
  approver the exact command.
