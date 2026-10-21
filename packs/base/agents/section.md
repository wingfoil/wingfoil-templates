# {{project_name}}

This project is governed by WingFoil. Its configuration is in `.wingfoil/`; its decisions, tasks
and plans are its Memory.

- **Approvals are the approver's.** An agent never approves or rejects: it hands the approver the
  exact command to run.
- **Memory changes only through the WingFoil CLI** (`memory add`, `memory submit`, `memory park`,
  …; `memory approve` is the approver's), never by editing an element's state by hand.
- **Which workflow to start:**
  - a decision that changes no governance: `decision-log-ingest`;
  - a change of the project's governance (its `.wingfoil/`, this file, the roles, the Memory
    types): `governance-evolution`;
  - a retrospective: `retrospective-periodic`, which runs `retrospective`.
- Read the directives that apply to the role you act in before you change anything.
