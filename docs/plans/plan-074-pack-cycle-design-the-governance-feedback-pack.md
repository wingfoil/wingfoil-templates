---
id: plan-074-pack-cycle-design-the-governance-feedback-pack
type: plan
title: "pack-cycle design: the governance/feedback pack"
status: active
workflow: "pack-cycle"
phase: "design"
tags: ["packs","feedback","governance","spec","W10"]
---

## Context

The `design` phase of `pack-cycle` (v7) for `governance/feedback` (F4.9), whose charter
`pack-governance-feedback` is `accepted` (plan-073). The phase is optional in `pack-cycle`, and
**required** for this pack (dl-012 D7, D8): the pack needs mechanisms the format does not have
(a parameter holding a list of values, a channel an upstream pack declares, a directive of a
conditional entry reaching an agent). One tech-spec answers dl-012 D8's questions for dl-012 and
dl-013. This pack opens it because the sequencer reaches it first (W10). No task of the pack is
opened before it is approved. It closes the row "`governance/feedback`'s `design` phase" of
`docs/owed-items.md`.

**What this plan produces:**
- a new tech-spec, `spec-003`, `approved`, answering the charter's Open points 1 … 5;
- the text it amends in spec-001 (and in the charter, through an Execution Note), folded back
  in this plan once it is approved (point 9);
- the probes on the engine that back its answers, recorded here (step 2);
- the rows it leaves owed (tooling, feedback notes, the `base` and `software` template fields).

**Hosting.** One of the two deviations plan-073 accepted still applies: no workflow engine runs
this repository's plans (it pins WingFoil 0.2.2 until the adoption). The other one no longer
applies: the pack is now `accepted`, so `sw-life-cycle` › `pack-delivery` would select it. The
plan runs on branch `pack/governance-feedback-design`, from `main` at the commit that submits
it. The phase's role is `architect`; its actions are `memory.add(type: tech-spec)` and
`memory.submit`, and the approver closes it (`approval: { by_role: approver }`). A tech-spec
follows `defaults`: `draft → pending` (gate) `→ approved`.

**Preconditions, met.**
- The charter is `accepted`, with its Open points, the interim triage rule and plan-073's
  rulings 1 … 5.
- spec-001 and spec-002 have no open erratum (plan-067 folded the last ones back, dl-020).
- The untracked draft of plan-073 step 2 (`tests/fixtures/feedback-draft/`) is still on disk,
  ready for step 2's probes.
- WingFoil 0.3.2 is installed in the matrix cache.

**`main`'s CI before this plan** (dl-038 C3): plan-073's close (`7c4c5054`) and its `submit`,
pushed as `d0cdd18f`. Its CI run 43834416789 is `success`, with no annotation. Job durations
(dl-039 R3, under G12's 25 minutes):
- validate (22.12.0, 1) 10m08;
- validate (22.21.0, 1) 8m43;
- validate (22.21.0, 2) 5m55;
- validate (22.12.0, 2) 5m54.

The Pages run on the same commit, 43834416898, is `success`. The run before them, on plan-073's
merge `40431243`, is 43832641156, `success`.

**What WingFoil 0.3.2 offers, read in its installed code** (`dist/memory/schema.js`,
`dist/workflow/schema.js`, `dist/directives/schema.js`):
- **Memory.** `template.frontmatter` has `required`, `not_applicable_allowed`, `lists` and
  `exempt`, and no allowed-values key. `fields` is passed through and not checked.
- **Workflow phases.** A phase has no key that binds a directive. Its keys are `name`,
  `description`, `role`, `optional`, `actions`, `include`, `iterate_over`/`where`, `produces`,
  `awaits`, `checks`, `approval`, `fallback`, `mode`, `distinct_from` and `cadence`. Only
  `workflow next` prints a step's action texts (`dist/core/workflow-next.js`); `workflow show`
  and the MCP `workflows.show` resource serve the whole definition, `description` included.
  `agent execute` gives the agent a bootstrap (run, role, element, the MCP session resource),
  and its context holds the element, `dna.yaml`, the role's `roles.yaml` directives and Memory,
  never the step (`dist/agent/execute.js`, `dist/core/context.js`). An `agent.*` token is
  built in, so its argument raises no binding warning (`dist/workflow/bindings.js`).
- **Directives.** A directive carries optional `tags`. Only `roles.yaml` (`assignments`,
  `global`) loads a directive for a role.

Plan-073 step 2 adds two facts: `checks` strings are not evaluated, and `where` values are
inclusion lists.

**A finding for the approver** (point 8). spec-001 §5 says "a new pack is written at format 2".
The accepted charter chose `pack.yaml` format 1 (its Compatibility section and plan-073
point 1), and the draft is at format 1. `governance/feedback` is the first new pack since
format 2 (plan-066), so the two texts disagree for the first time.

**Inputs the session reads first.**
- **Decisions:** dl-012 (D2, D3, D7, D8 and its Execution Notes); dl-013 (D3, D5, D11: the
  questions it shares); dl-011 (D4, AC-10, `guided-init-software`); dl-017 … dl-021; dl-025 D4
  (the `exit-check` tag pattern); dl-032; dl-037.
- **This pack:** the charter `pack-governance-feedback` (Ships, Compatibility, Acceptance, Open
  points); plan-073 (its rulings and step 2's run).
- **The specifications:** spec-001 §5, §6.2 … §6.5, §7.4, §7.5, §8, §10, §15, §16, §18;
  spec-002 §2.
- **The draft:** `pack.yaml`, its workflows, its directives and its AGENTS.md section.
- **The packs:** `base`'s and `software`'s Memory templates; the row on the Memory templates'
  optional fields (`reported_by`).
- **WingFoil:** the 0.3.2 schemas named above; F-043 (no typed references).
- **Precedents:** plan-012 (the first tech-spec) and plan-067 (an amendment of an approved
  spec).

## Proposed outline (ruled by the approver before `submit`)

1. **The element and its scope.** It is a new tech-spec, `spec-003` (proposed title:
   "Configurable value lists, upstream channels and conditional directives"). It does not
   replace spec-001. spec-003 answers the five Open points of the charter, for dl-012, and
   the questions dl-013 shares with them:
   - list-valued parameters (its levels, types and the values of its task fields) and how a
     preset sets them;
   - how an entry's directive reaches an agent.

   dl-013's own questions stay in its own `design` phase: the directive model, `parent` and
   `release` as not applicable, and the dispatch of a type workflow. The generic rules spec-003
   fixes become spec-001 text through its section "Amendments to spec-001", folded back after
   approval (point 9). The pack-specific answers stay in spec-003 and reach the charter as an
   Execution Note. The alternative is an amendment of spec-001 alone, through a plan like
   plan-067. It would put the feedback pack's own choices (channel, routes, back-reference) in
   the format, so it is not proposed.
2. **Configurable value lists** (Open point 1, dl-012 D2, dl-013 D3).
   - **Recommended (a): a convention over `string`.** A `string` parameter holds a
     comma-separated list ("decision-log, task, upstream-note, declined, duplicate"). The
     workflow places it inside a YAML flow sequence, `where: { status: [triaged], outcome:
     [{{feedback_outcomes}}] }`, and the directive text names it.
     - **The schema does not change, the format's rules do.** §8.2 asks for parameters inside
       double-quoted scalars, and a `string` allows `]`, `:`, `#`, `[` and `{`, so an unquoted
       value could break the YAML or change its structure. spec-001 gains:
       - §8.1 and §8.2: a **list parameter** is a `string` parameter whose `description`
         begins with "List of"; it may stand unquoted only as the whole content of a flow
         sequence (`[{{x}}]`, whitespace allowed inside the brackets), and only in its
         declaring pack's files; any other unquoted use of a `string` parameter is an error
         (`integer` and `boolean` parameters stay as they are, as `methodology/kanban`'s
         `{{wip_in_progress}}`); the value is split on `,`, each item trimmed, so `a, b,` fails
         on its empty item. The three parameters below are list parameters, whether or not a
         file uses them in a flow sequence;
       - §18: the item rule for a list parameter's value: at least one item, items unique, each
         a string under YAML's core schema (never `null`, `true`, `false` or a number), matching
         `^[a-z][a-z0-9-]*(:[a-z0-9-]+)?$` (so `upstream:<name>` passes, `<name>` a slug naming
         the upstream, never a catalog pack id with its `/`); checked by the composer on every
         value (default, preset, composition), before substitution, and by the lint.
     - WingFoil gets no feedback note: no schema of `schema/` changes.
     - A preset sets it through `parameters` (§15: a list of generic values is generic).
   - **(b): a `list` parameter type.** It means `pack.yaml` format 3: a frozen v2 schema, a
     feedback note (§5) and a renderer for flow sequences; the item rule is needed either way.
   - **The parameters.** `feedback_kinds`, `feedback_targets` and `feedback_outcomes`, with
     dl-012 D2's defaults, `feedback_outcomes` without `bug` (D3).
   - **`bug` is never a value of `feedback_outcomes`.** It is the entry's: `feedback-bug-route`
     selects `[bug]`, and the entry's directive adds it to the allowed outcomes. This gives the
     default "without `bug` without `software`" without a conditional default (§8.1). It also
     keeps a `bug` item off the unconditional review's frontier. This pack's fixture check
     refuses `bug` in a preset's or an example's value; the directive says a project never adds
     it (point 10).
   - **Outcomes a project adds** are in the parameter, so `feedback-review` selects them, and
     `feedback-item` routes any outcome without a route of its own to a decision-log naming it
     (dl-012 D3). The interim triage rule then narrows to "an outcome that is empty, or neither
     in `feedback_outcomes` nor added by a composed entry (`bug` with `software`), is rejected
     to `draft`". It replaces the charter's clause "an unrouted outcome is proposed as
     decision-log", except for a would-be `bug` without `software`, still proposed as
     decision-log naming it. Added outcomes, and `upstream-note` with no channel, reach
     `feedback-item`'s decision-log fallback.
   - **Who checks a value.** WingFoil 0.3.2 checks none. The facilitator proposes through the
     directive, the approver confirms at the triage, and the fixture-element checks test the
     fixtures ([E]). A request to WingFoil for an allowed-values key in `memory.yaml` is
     proposed as a feedback note in plan-073 ruling 5's task (point 10).
3. **An upstream's channel** (Open point 2, dl-012 D3).
   - **Recommended (a): a tag convention.** An upstream pack `requires` this one and ships a
     directive tagged `feedback-channel`, bound to `facilitator` in its own `roles.yaml`, so it
     reaches the agent. The directive names in its text the `target` value it serves
     (`upstream:<name>`), the note's format and location, and the mapping of kinds. For an
     `upstream-note` item, `feedback-item`'s route step reads the directive tagged
     `feedback-channel` that serves the item's `target`. If no channel serves a target, the item
     routes to a decision-log naming the target.
     - **What rule it meets.** Here an earlier pack reads directives of a later pack that
       requires it, so the rule is §6.3 (a pack that uses a directive it does not ship must
       require its pack), not §6.5's isolation. spec-003 argues that a lookup by tag is not a
       use under §6.3, and §6.3 joins the fold-back (point 9). dl-025 D4's `exit-check` tag is
       the nearest precedent, within one pack. Its known limit (the owed row "a tag alone
       cannot tell which stricter pack a directive covers") is answered here by the target
       named in the directive's text.
     - **The target values.** An upstream pack cannot add `upstream:<name>` to
       `feedback_targets` (§8.1: one declaration; values only by default, preset or
       composition). The project adds it when it installs the upstream pack, as the upstream's
       README procedure says.
     - **Bounds of the reading,** in the amendment text: the reading pack names no id, owns the
       tag, and defines what happens when no directive matches (the decision-log fallback). Two
       channels serving one `target` is an error the facilitator raises to the approver. A lint
       checks that a `feedback-channel` directive comes from a pack that requires
       `governance/feedback`.
   - **(b): a parameter naming the channel directives.** It couples this pack's parameters to
     the upstreams' ids.
   - **(c): a new fragment kind.** It needs a later format.
   - FA-8's fixture upstream pack follows (a). `governance/wingfoil-dogfood`'s charter applies
     it (W10's next pack).
4. **The entry's shape** (Open point 3). spec-003 records plan-073 ruling 3 as the pattern for a
   route that exists only with another pack:
   - the entry holds a main workflow selecting the outcome it owns, and the sub it includes;
   - the route steps are `agent.execute`, recorded with `workflow finalize`;
   - the target workflow (`bug-ingest`) is started on its own and owns what it creates.

   It also states that no rule rests on a `checks` string, which 0.3.2 does not evaluate. That
   statement is generic and goes into `pack-authoring` and spec-001 §18 (point 9).
5. **How an entry's directive reaches an agent** (Open point 4, shared with dl-011). It cannot
   go through `roles.yaml`: fragments are never conditional, and isolation applies. A phase has
   no directive key in 0.3.2, and `agent execute`'s context holds only the `roles.yaml`
   directives, never the step. **Recommended:** three parts, made a generic rule in spec-001
   §10 and §6.5:
   - **the path already in the agent's context:** the unconditional `feedback` directive (bound
     to `facilitator`) says that the agent reads any directive tagged `feedback-route` whenever
     it proposes an outcome (so it knows `bug` is allowed with `software`) and at every route
     step, and that at a route step it reads the step with `workflow next` and follows the
     directive its action names. The entry's directive carries that tag. The `feedback`
     directive names the tag, never the entry's directive id: a lookup by tag within one pack,
     whose precedent is §6.5's Bridges (an unconditional workflow reading the `exit-check`
     directives its entries ship); the tag itself is this pack's own;
   - **the action text:** every phase with an `agent.execute` action in the entry's workflows
     names the directive in it, single-quoted (unquoted, YAML reads it as a map) and without
     braces (which WingFoil substitutes as a token), for example `'agent.execute(directive:
     feedback-bug-route)'`. `agent.*` is a built-in token, so no binding warning can catch a
     wrong id: a lint check (§18) that every `agent.execute` in an entry's workflows names a
     directive, and that the directive exists in that same entry;
   - **the AGENTS.md section** names the entry's directive as present only with the entry's
     pack (as §10 allows). This path reaches an agent only once the project pastes the region,
     until WingFoil exports `AGENTS.md` (v0.4; §10, R4).

   The generic rule for §10 and §6.5 is the named directive in the action text, its lint and
   the AGENTS.md mention; the tag rule stays in this pack's directive.

   A request to WingFoil for a phase-level directive binding is proposed in the same
   feedback-notes task (point 10).
6. **The back-reference field** (Open point 5, plan-073 ruling 4). The field is `reported_by`,
   an optional list, as in WingFoil 0.3.2's `init` templates.
   - Its values are the feedback ids, or the feedback note paths, that the element answers, as
     provenance only.
   - It goes on `base`'s `decision-log` and `task` and on `software`'s `adr`, `bug` and
     `tech-spec`.
   - An overlay cannot add a field to another pack's template: a Memory template has one
     owner, the defining pack (§7.6), and `template.file` must be equal (§7.5). So `base` and
     `software` ship the field in their next minor release: the row on the Memory templates'
     optional fields, extended with `task`. WingFoil 0.3.2's `reported_by` covers `adr`, `bug`,
     `decision-log` and `tech-spec` and names feedback notes; `task` and the feedback ids are
     this repository's extension.
   - FA-6's back-reference is checked [E] on the fixtures through it.
   - In a composition with a `base` or `software` that does not have the field yet, the trace
     back is the routed element's body citing the feedback id. The directive says so.
7. **The value lists in the type** (Open point 1, its Memory side). `kind`, `target` and `source`
   stay required `string`s (FA-3); `outcome` and `resulting` stay optional (plan-073 ruling 2);
   none goes into `lists`. `context` stays a `string` holding at least one reference (FA-3), not
   a list, so a capture never writes an empty `[]`. `fields` does not carry the allowed values:
   nothing in WingFoil 0.3.2 reads it, and the fixture-element checks read the composed
   parameter values instead, which already follow a project's list. The allowed outcomes are
   `feedback_outcomes` plus those a composed entry adds (`bug` with `software`), as the narrowed
   triage rule says.
8. **The format of `pack.yaml`** (the finding above).
   - **Recommended: format 2**, as spec-001 §5 says for a new pack. It is the format the
     reference composer writes new packs in. It would also allow a second entry, should the
     design need one: none is proposed.
   - The charter's Compatibility line gets an Execution Note (point 9), and the draft moves to
     format 2 in step 2.
   - **Or:** keep format 1 and record the departure from §5 in spec-003, with the reason.
9. **The fold-back.** Once spec-003 is `approved`, its section "Amendments to spec-001" is
   applied to spec-001:
   - §8.2 and §18: the list parameter and its item rule (point 2);
   - §6.5 and §10: the entry's directive (point 5);
   - §6.3: a lookup by tag is not a use (point 3);
   - §18 and `pack-authoring`: no rule rests on a `checks` string (point 4);
   - `pack-authoring`, in a commit of its own as plan-067 did, for what points 2 … 5 change in
     it;
   - the root `README.md`'s list of specifications gains spec-003.

   This works as plan-067 did: the edited text with an Execution Note naming this plan, the
   approver's merge OK approving the edited text. The charter gets an Execution Note citing
   spec-003 for its Open points 1 … 5, the narrowed triage rule and point 8. No erratum is left
   open (dl-020).
10. **What it leaves owed** (rule 4, dl-036 R2: a row in the commit that records the ruling
    that leaves it, on `main` before the branch; a row a later note leaves, in that note's
    commit).
    - **Tooling:** the composer's and the lint's checks of points 2, 3 and 5 (the list
      parameter and its item rule, the `feedback-channel` source, the directive named in an
      entry's action text), and the fixture check that `bug` is not in `feedback_outcomes` in a
      preset or an example. Either a tooling task (`pack: ""`) of its own, or the row of the
      fixture-element checks extended to name the composer and the lint, as the approver
      rules.
    - **WingFoil:** the feedback-notes row (plan-073 ruling 5) extended with two requests,
      proposed: an allowed-values key in `memory.yaml`, and a directive binding per phase. Next
      free id F-048.
    - **`base` and `software`:** the template-fields row extended with `task`'s `reported_by`.
    - **dl-013's `design` phase:** a pointer to spec-003 for its shared questions, as an
      Execution Note on dl-013 at the close.
11. **No feedback note for the format** under recommendation (a) of point 2: the rules change,
    no schema does. Under (b), the format-3 schema needs one (§5, `wingfoil-cli` rule 8).

## The approver's rulings

Given on 2026-11-16, in chat: the outline is approved as recommended. Points 1 … 11 stand as
written:
- a new tech-spec, spec-003 (point 1);
- the convention over `string` (option (a) of point 2), with `bug` never in
  `feedback_outcomes`;
- the `feedback-channel` tag (point 3);
- the AGENTS.md section together with the phase descriptions (point 5; superseded by the
  amended point 5, ruled again);
- `reported_by` (point 6);
- `pack.yaml` format 2 (point 8);
- the two requests to WingFoil and the rows of point 10; the tooling checks join the row of the
  fixture-element checks (confirmed in chat the same day).

The independent review, re-review and final check that followed changed points 2, 3 and 5
(Execution Notes, 2026-11-16). Given on 2026-11-16, in chat, after them: points 2, 3 and 5 are
approved as amended (the list parameter and its item rule; the `feedback-channel` tag read under
§6.3; the `feedback-route` tag, the directive named in the action text and its lint, the
AGENTS.md mention).

spec-003's review and re-review (its Execution Notes, 2026-11-16) changed points 2 and 5 again.
Given on 2026-11-16, in chat, after them: points 2 and 5 are approved as amended there. Point 2:
in a substituted YAML file, or a Markdown file's YAML frontmatter, every parameter other than an
`integer` or a `boolean` stands inside a double-quoted scalar, save a list parameter as the only
item of `[...]`; the composer and the lint check it. Point 5: the rule covers an entry's
directive an agent needs at a step of the entry's workflows; a plain `agent.execute` stays
allowed, a named directive is one in the entry's scope, required packs included; the tag is the
pack's own choice, and a bridge is outside the rule.

The rows these rulings leave, extended in `docs/owed-items.md` in the commit that records them
(rule 4): "The fixture-element checks" (points 2, 3, 5, 10), "The packs' Memory templates"
(point 6, `task`'s `reported_by`) and "Two feedback notes to WingFoil" (point 10, the two
requests); the row of the fixture-element checks extended again with the last ruling (spec-003
§11).

## Steps

On branch `pack/governance-feedback-design`, with one commit per step that writes. The privacy
check runs before every commit (`repository-practice` rule 2).

1. **Reads** (architect). The inputs above. Any finding that changes a point goes to the
   approver before step 2.
2. **Probes on the engine** (architect; dl-037 E1, E2). The probes run on the untracked draft of
   plan-073, never committed, moved to `pack.yaml` format 2 if point 8 is ruled so:
   - **The list convention.** `feedback-review`'s `where` reads `[{{feedback_outcomes}}]`,
     `feedback-bug-route` keeps `[bug]`, and the three list parameters are declared.
     - `npm run validate -- --overlay <draft>` and `npm run index -- --check` pass with no
       warning on every release from 0.3.0, with the default value and with an overlay example
       whose `parameters` add an outcome.
     - In a scratch repository outside this one, on WingFoil 0.3.2, composed with `software` and
       `methodology/kanban`, `feedback-review` selects an item with the added outcome. It leaves
       out a `bug` item, which `feedback-bug-route` selects.
   - **The channel tag.** The overlay gets a fixture upstream pack that `requires`
     `governance/feedback` and ships a directive tagged `feedback-channel`, bound to
     `facilitator` (FA-8's shape). The probe checks that WingFoil 0.3.2 keeps the tag in the
     composed file and shows it in `directive` listings, and drives one `upstream-note` route
     to `closed` (the charter marks it not exercised). Exit codes recorded.
   - **The entry's directive.** Before it, the draft's `feedback-bug-item` › `bug` phase becomes
     `'agent.execute(directive: feedback-bug-route)'` (plan-073 ruling 3), and the entry's
     directive gets `tags: [feedback-route]`. The probe checks that `workflow next` and `agent
     execute
     --dry-run` at `feedback-bug-item`'s `bug` step: `workflow next` prints the action text
     naming the directive, and the dry run's bootstrap does not (recorded). It also checks that
     the AGENTS.md region names it only as present with `software`, and that the `feedback`
     directive's tag rule finds the entry's directive tagged `feedback-route`.

   Recorded here with commands and exit codes, and no local or scratch path. Findings that change
   a point go to the approver before step 3 (dl-019).
3. **The tech-spec** (architect). `npm run -s wingfoil -- memory add --type tech-spec --title
   "Configurable value lists, upstream channels and conditional directives"` (check the printed
   id, `spec-003-…`; tags filled by editing the draft, W-02).
   - Its sections, after spec-002's model: purpose and scope; terms; one section per point 2 … 7;
     the format (point 8); "Amendments to spec-001" (the exact text); open points with owners;
     Execution Notes.
   - It cites step 2's probes.
4. **Independent review** of spec-003 by a subagent (dl-017), amended while `draft`; its verdict,
   counts and fixing commit recorded in spec-003's notes (dl-017 R3). A re-review follows when a
   fix changes a rule. Then `memory submit` (`draft → pending`); a later finding
   becomes an amendment while `pending` (dl-037 E1).
5. **The approver's gate.** The approver approves spec-003 (`pending → approved`) with `npm run
   -s wingfoil -- memory approve spec-003-<slug> --reason "…"`, run by the approver (the command
   given in full), or rejects it to `draft`.
6. **The fold-back** (architect; point 9). spec-001 is edited with its Execution Note, and the
   charter gets its Execution Note. An independent review checks the fold-back against
   spec-003's "Amendments to spec-001" section, and a re-review follows if a fix changes a rule.
7. **Branch close.** The branch is text-only (spec-003, spec-001, `pack-authoring`, the root
   `README.md`, the charter's note, dl-013's note, `docs/owed-items.md`, this plan's notes). The
   design row moves to Closed in the close commit, citing spec-003; the rows the rulings of
   points 6 and 10 leave are already on `main`, written with those rulings (point 10).
   - Its CI runs on the frozen commit, and the job durations are recorded (dl-039 R3).
   - `npm run -s wingfoil -- workflow list` exits 0.
   - `git diff main --stat` names only those files.
   - The privacy check of the branch's diff is recorded.

   On the approver's OK (which approves spec-001's and `pack-authoring`'s edited text, as
   plan-067), the branch is merged into `main` with `--no-ff` and pushed, `main`'s CI is read,
   and the branch is removed. Then the plan goes `active → done`, and the close's CI is left to
   the next plan.

**Not in this plan:**
- the pack's tasks and its `author` phase;
- the fixture-element tooling task;
- the feedback-notes task;
- the list-convention lint;
- `governance/wingfoil-dogfood`;
- the pack release round (the `reported_by` fields);
- dl-013's own design questions.

## Handoff

- **claude** (drafting for the architect; facilitator) does steps 1 … 4, 6 and 7, except the
  approvals and the merge OK.
  - It never runs `memory approve` or `memory reject`.
  - No pull request.
  - Files are staged by name.
  - Reviews are by an independent subagent with no part in the text.
- **The approver** rules:
  - this outline before `submit`: point 1 (a new spec-003), point 2 ((a) or (b), and the
    format rules (a) changes), point 3 (the tag), point 5, point 6 (the field, its types and
    the fallback through the body, which commit `base` and `software` releases), point 8 (the
    format) and point 10 (the requests to WingFoil, the tooling row);
  - any finding of steps 1 … 2 that changes a point;
  - spec-003's approval;
  - the merge OK.
- **Start:** the approver rules this outline. The plan is then submitted (`draft → active`), by
  the agent on the approver's request in chat or by the approver, and run, in this session or a
  new one.
- **Done when:** all of these hold, and the plan then goes `active → done` (`memory submit`):
  - spec-003 is `approved` on `main`, and spec-001's fold-back is merged;
  - the charter's and dl-013's Execution Notes are written;
  - step 2's probes are recorded;
  - the reviews are applied;
  - the owed rows are written;
  - the branch's privacy check is recorded;
  - the branch CI and `main`'s CI are `success`.

## Execution Notes

- 2026-11-16: written after plan-073's close; `workflow`, `phase` and `tags` filled by editing
  the draft (W-02). Next free numbers when written: plan-075, spec-003, task-092, bug-017, dl-043,
  F-048.
- 2026-11-16: independent review: approve after amendments; two blockers, eight should-fix,
  seven nits, all applied.
  - **Blockers.** Option (a) of point 2 changes the format's rules, though not its schema: the
    list parameter as the whole content of a flow sequence (§8.2), and its item rule (§18),
    checked by the composer too. The entry's directive reaches an agent through the action text,
    not the phase `description`, which `workflow next` and `agent execute` do not print
    (point 5), with the AGENTS.md path's R4 limit.
  - **Should-fix.** The channel tag read against §6.3, with the upstream's own `roles.yaml` and
    the target values added by the project (point 3); the empty list and the narrowed triage
    rule (point 2); the reason for leaving `fields` out, and `context` (point 7); step 2's
    fixture upstream pack, the `upstream-note` route and `npm run index -- --check`; the owed
    rows written on the branch (point 10, step 7); the root `README.md` and `pack-authoring`
    (points 9, step 7); point 6 in the Handoff.
  - **Nits.** The phase keys, `pack-authoring` and §18 for the `checks` rule, dl-013's task
    fields, `bug` out of the default, §7.6 and 0.3.2's `reported_by` types, "does not replace",
    dl-017 R3 in step 4, who submits.

  Points 2, 3 and 5 change: re-review.
- 2026-11-16: re-review: approve after amendments; one blocker, six should-fix, four nits, all
  applied. **Blocker:** `agent execute` does not print action texts, only `workflow next` does;
  point 5 gains the path already in the agent's context, the `feedback` directive's rule to read
  the step and the `feedback-route` tag, and step 2's probe records what the dry run shows.
  **Should-fix:** `agent.*` raises no binding warning, so a lint checks the directive named in an
  entry's action text, written without braces; only phases with `agent.execute`; the list
  parameter reserved to the declaring pack, its pattern and split (point 2); the tag named
  (point 5); the allowed outcomes with the entry's (point 7); the owed rows written with the
  rulings on `main`, the composer and the lint named, dl-013 in step 7 and in "Done when".
  **Nits:** the superseded ruling marked; the bounds of the lookup by tag, two channels for one
  target, the channel's source checked (point 3); `<name>` a slug; this pack's fixture check
  for `bug`; the charter's clause the narrowed triage rule replaces. Point 5 changes again: a
  final check of the fixes.
- 2026-11-16: final check of the re-review's fixes: approve after amendments; one blocker, three
  should-fix, three nits, all applied; every WingFoil 0.3.2 fact of the Context confirmed.
  **Blocker:** the unquoted rule limited to `string` parameters (`methodology/kanban`'s
  `{{wip_in_progress}}` is an unquoted `integer`). **Should-fix:** the `feedback-route` tag read
  whenever an outcome is proposed, not only at a route step; the action text single-quoted; the
  draft's `bug` phase and tag changed before step 2's probe. **Nits:** list parameters marked by
  their description, so all three get the item rule; §6.5's Bridges as the precedent, the lint
  checking every `agent.execute` names a directive, the generic part named; the rulings to cite
  their rows. The fixes narrow or make explicit what the re-review accepted: no further review.
- 2026-11-16: the plan submitted by the agent on the approver's request in chat (`draft →
  active`, `f8f37eca`). `main` was pushed at `f8f37eca` on the approver's request, with
  `main`'s CI on `d0cdd18f` green beforehand. Branch `pack/governance-feedback-design` starts from
  `f8f37eca`.
- 2026-11-16, step 1 (reads). The inputs above. `pack-authoring` repeats spec-001 §5's "a new pack
  is written at format 2", which point 8 rules. spec-001 §6.3 and §18 are as points 3 and 9 read
  them. The draft's `feedback-bug-item` › `bug` still held candidate (a), `'memory.add(type:
  bug)'`, which step 2 changes as point 5 says. No point of the outline changes.
- 2026-11-16, step 2 (dl-037 E1, E2). **The draft:** the untracked overlay of plan-073, never
  committed, changed as follows:
  - `pack.yaml` moves to format 2. It declares `feedback_kinds`, `feedback_targets` and
    `feedback_outcomes` (`string`, descriptions beginning "List of", `feedback_outcomes`
    without `bug`).
  - `feedback-review`'s `where` reads `outcome: [{{feedback_outcomes}}]`, and
    `feedback-bug-route`'s reads `outcome: [bug]`.
  - `feedback-bug-item` › `bug` becomes `'agent.execute(directive: feedback-bug-route)'`, and
    the entry's directive is tagged `feedback-route`.
  - The `feedback` directive names the three lists and states point 5's tag rule.
  - A fixture upstream pack `governance/feedback-upstream` (format 2, `requires: [base@^2,
    governance/feedback@^1]`) ships `plover-vendor-channel`, tagged `feedback-channel` and
    bound to `facilitator`.
  - A fourth composition, `upstream`, adds `upstream:plover-vendor` to `feedback_targets` and
    `deferred` to `feedback_outcomes`.
  - **Validation.** `npm run validate -- --overlay <draft>` exits 0: schemas and lint 0
    problems, overlay 23 files 0 problems, 15 compositions byte-identical, the matrix 30 runs 0
    failed with no tolerance on 0.3.0 and 0.3.2, and `alone[+software]` skipped ("no
    methodology"). The first two attempts failed on the fixture pack only (a missing
    `requires_capabilities`, and its README's catalog link, spec-002 §2.5). `npm run index --
    --check` exits 0.
  - **The list value, against today's composer** (`npm run compose` with `--param
    feedback_outcomes=…`).
    - `x], status: [closed` is refused (DUPLICATE_KEY after substitution).
    - `x], kind: [defect` exits 0 and changes the `where` to `outcome: [x], kind: [defect]`.
    - `null, task`, the empty value (`outcome: []`) and `task, task` exit 0 too.
    - So point 2's item rule and its composer check are needed: today only a duplicate key
      stops a value.
- 2026-11-16, step 2, **the run** on WingFoil 0.3.2 (`6de2e13c`, the matrix's install), in a
  scratch repository outside this one. It was composed by `npm run compose` from the branch with
  the draft and the `upstream` composition's parameters (fictional Plover Desk, `.example`
  addresses).
  - **Listing.** `workflow list` exit 0, `"diagnostics": []`. `directives list` exit 0:
    `feedback-bug-route` with `tags: [feedback-route]` and `unassigned`;
    `plover-vendor-channel` with `tags: [feedback-channel]`, assigned to `facilitator`;
    `feedback` assigned to `facilitator`. The AGENTS.md region holds the pack's section.
  - **Four items** (`memory add`, fields filled by editing and committing, since `--set` fills
    only path and id tokens; `memory submit`, `memory approve`, each exit 0) were triaged with
    outcomes `deferred`, `bug`, `upstream-note` (target `upstream:plover-vendor`) and `task`.
  - **`feedback-review`** (`workflow start` exit 0): its frontier holds the `deferred`,
    `upstream-note` and `task` items and leaves out the `bug` item. An outcome the project adds
    is selected through the substituted `where`.
  - **The `upstream-note` route.** A note written where the channel directive says, `resulting`
    naming it, `workflow finalize --step feedback-item.route@…` exit 0, and `memory submit`
    (`triaged → closed`) exit 0.
  - **The `deferred` item** went to the decision-log fallback (`memory add --type decision-log`
    exit 0, `resulting` naming it), with finalize and close exit 0. The `task` item was left on
    the frontier.
  - **`feedback-bug-route`** (`workflow start` exit 0). `workflow next` exit 0 prints
    `agent.execute(directive: feedback-bug-route)` with its `agent execute` command line. Its
    `directives:` line lists the `roles.yaml` directives (`feedback`, `plover-vendor-channel`,
    …), not `feedback-bug-route`.
  - **`agent execute --dry-run`** at that step exits 1: "no agent in dna.yaml with an adapter
    executes as role 'facilitator'". `base`'s composed `dna.yaml` gives the agent no adapter.
    That the bootstrap carries no step is read in the code (`dist/agent/execute.js`
    `renderBootstrap`, as the Context says).
  - **The bug.** `bug-ingest` was started on its own (exit 0) and `memory add --type bug
    --workflow … --step bug-ingest.capture` exit 0. The composed `bug` template has no
    `reported_by` (the row on the Memory templates' optional fields), so the bug's body cites
    the item. Then `memory submit` exit 0, `resulting` naming the bug, finalize and close of the
    item exit 0. `feedback-bug-route` is complete, and the bug waits for `bug-ingest`'s triage,
    owned by its own run.
  - **Findings.** None changes a point. Two facts go to spec-003:
    - the substituted `where` works on 0.3.2;
    - `agent execute` needs an adapter that the packs' `dna.yaml` does not give, so point 5's
      path through the `feedback` directive and `workflow next` is the one that works on a
      composed project.
- 2026-11-16, step 3: spec-003 added (`memory add --type tech-spec`, the printed id
  `spec-003-configurable-value-lists-upstream-channels-and-conditional-directives`); `tags`
  filled by editing the draft (W-02); its sections as point 1 and step 3 list them, step 2 cited.
- 2026-11-16: the approver asked, in chat, for a row on the engine way of working to adopt with
  this repository's adoption (W10): the row "The engine way of working, adopted with this
  repository's adoption" of `docs/owed-items.md`, Source "asked by the approver on 2026-11-16",
  cited here as the plan active on `main` (dl-036 R4). It changes no point of this plan.
- 2026-11-16: spec-003's review and re-review applied (its Execution Notes); the approver ruled
  points 2 and 5 again as amended there ("The approver's rulings"), and the row of the
  fixture-element checks now reads spec-003 §11.
- 2026-11-16, step 5: the approver approved spec-003 (`pending → approved`, 6fb9219b).
- 2026-11-16, step 6: the fold-back, from spec-003 §10. spec-001 amended in place with its
  Execution Note (170413c5, §10.1); `pack-authoring` in a commit of its own (e44ee8af, §10.2);
  the charter's and dl-013's Execution Notes and the root `README.md`'s list of specifications
  (§10.3) in the commit that records this note.
