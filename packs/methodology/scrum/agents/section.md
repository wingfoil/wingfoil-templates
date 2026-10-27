## Scrum

This project runs Scrum (the Scrum Guide, November 2020) as the `delivery` of its life cycle.

- **Sprints of {{sprint_length}}, one at a time.** `delivery` runs each Sprint: planning, its
  Sprint Backlog (the tasks whose `sprint` names it) through `backlog-item`, its releases, the
  review, the retrospective, then `close`.
- **Roles:** the Product Owner is `product-owner`, the Scrum Master `facilitator`, the Developers
  `developer` with `architect`, `reviewer`, `qa` and `tech-lead`.
- **Definition of Done:** an item is done only when the `definition-of-done` directive holds.
- **Releases** are decoupled from the Sprint boundary and gated by no review, but a release of a
  Sprint is approved and published only once its Sprint Backlog is done or moved.
- **{{agent_name}}** works for the Developers, as their tool, holds no Scrum accountability and
  never approves: it hands the approver the exact command.
