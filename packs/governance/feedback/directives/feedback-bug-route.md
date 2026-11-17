---
id: feedback-bug-route
name: feedback-bug-route
type: directive
kind: built-in
format: 1
tags: [feedback-route]
title: "Feedback: the bug route"
---

# Feedback: the bug route

This project composes `software`: `bug` is an allowed outcome of a feedback item, beside those
`feedback-review` routes.

- An item whose outcome is `bug` is routed by `feedback-bug-route`, never by `feedback-review`.
- `software`'s `bug-ingest`, started on its own, captures and triages the bug, citing the item:
  through the bug's `reported_by` where its template has one, otherwise in its body, naming the
  feedback id.
- At `feedback-bug-item` › `bug`, the facilitator writes the bug's id in the item's `resulting`
  and records the step with `workflow finalize`; `feedback-bug-item` › `close` then closes the
  item. `bug-ingest` owns the bug: `feedback-bug-route` only records the route.
- `feedback-bug-route` is started at the cadence the project chooses. A completed run still takes
  an item triaged after it, so end it (`workflow end`) once the project has routed its bugs.
