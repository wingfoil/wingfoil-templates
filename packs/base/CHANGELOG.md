- 2.0.1 (patch): the adoption steps remove the workflows WingFoil's `init` scaffolds (bug-007).
  A note on the retrospective's approval under an iterated sub (bug-008). "Install and update" step
  3 re-includes only the `custom/` workflows the project wrote itself, and step 4 removes, with
  their `include` entries, the workflows `init` writes under `workflows/custom/` (bug-007); "Sources
  and adaptations" says that a closed iteration's `approve` step is listed again while a later one's
  retrospective decision-log is `in-discussion`, one approval clearing both (bug-008). Updating from
  2.0.0: nothing to recompose; a project that kept and re-included `init`'s `custom/` workflows
  removes them with their `include` entries.
- 2.0.0 (major): new defaults for `plan_id` and `retrospective_path`; `apply` produces `.wingfoil/`.
  `plan_id` defaults to `{workflow}-{phase}-plan`, so that WingFoil's `workflow start` fills a
  started plan's `workflow` and `phase`, which `plan` requires (bug-005); `retrospective_path`
  defaults to `docs/retrospectives/`, and `governance-evolution` › `apply` produces `.wingfoil/`:
  WingFoil reads a `produces` path as a directory only with its trailing `/`, so `retrospective`
  › `explore` and `apply` could never complete (bug-006). Updating from 1.0.0: a project that
  relied on a default and keeps its values states them (`plan_id: plan-{n}-{slug}`); a
  `retrospective_path` naming a directory gains its trailing `/`; a project that keeps a
  `plan_id` without `{workflow}` and `{phase}` fills a started plan's `workflow` and `phase` by
  hand (the main's name and the instance number, e.g. `1`) and submits it, or uses the new
  pattern for its new plans. Ids already given never change; no file moves.
- 1.0.0: first version.
