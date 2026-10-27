- 2.0.0 (major): `plan_id` defaults to `{workflow}-{phase}-plan`, so that WingFoil's
  `workflow start` fills a started plan's `workflow` and `phase`, which `plan` requires (bug-005);
  `retrospective_path` defaults to `docs/retrospectives/`, and `governance-evolution` › `apply`
  produces `.wingfoil/`: WingFoil reads a `produces` path as a directory only with its trailing
  `/`, so `retrospective` › `explore` and `apply` could never complete (bug-006). Updating from
  1.0.0: a project that relied on a default and keeps its values states them
  (`plan_id: plan-{n}-{slug}`); a `retrospective_path` naming a directory gains its trailing `/`;
  a project that keeps a `plan_id` without `{workflow}` and `{phase}` fills a started plan's
  `workflow` and `phase` by hand and submits it, or uses the new pattern for its new plans. Ids
  already given never change; no file moves.
- 1.0.0: first version.
