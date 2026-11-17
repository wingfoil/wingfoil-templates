## Feedback

This project collects feedback as `feedback` elements and routes it into its governance.

- **Capture** each item through `feedback-ingest`, one item per run, with its source and context;
  its kind is one of {{feedback_kinds}}.
- **Only the approver triages** (`pending → triaged`); a reject sends the item back to `draft`.
- **`feedback-review`** routes each triaged item as the `feedback` directive's table says and
  closes it once the facilitator has written `resulting`.
- **With `software` only**, the directive `feedback-bug-route` is present and routes the items
  whose outcome is `bug`.
- **{{agent_name}}** captures and routes as the facilitator and never approves: it hands the
  approver the exact command.
