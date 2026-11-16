---
id: spec-003-configurable-value-lists-upstream-channels-and-conditional-directives
type: tech-spec
title: "Configurable value lists, upstream channels and conditional directives"
status: draft
tags: ["packs","format","feedback","governance"]
---

## 1. Purpose and scope

This specification answers the questions of dl-012 D8, which the charter
`pack-governance-feedback` lists as its Open points 1 … 5. It is the `design` phase of
`governance/feedback` (`pack-cycle`, plan-074). It fixes:
- **list parameters:** a parameter that holds a list of allowed values, how a preset sets it, and
  who checks a value (§3); for `governance/feedback`, its three lists and the `bug` outcome
  (§4);
- **upstream channels:** how an upstream pack declares its channel to `governance/feedback`
  (§5);
- **routes that exist only with another pack:** the shape of a conditional entry that carries a
  route (§6);
- **an entry's directive:** how it reaches an agent, with no `roles.yaml` assignment (§7);
- **the back-reference field** of the elements a feedback item is routed to (§8);
- the `pack.yaml` format of `governance/feedback` (§9).

§10 gives the text these rules add to spec-001 and to `pack-authoring`. It is folded back once
this specification is `approved` (plan-074 step 6, dl-020). §11 lists the checks, and §12 the open
points.

dl-013 shares two of the questions:
- §3 serves its levels, types and the values of its task fields;
- §7 serves its directives.

Its own questions stay in its own `design` phase: the directive model, `parent` and `release` as
not applicable, and the dispatch of a type workflow. dl-011's `guided-init-software` reuses §7.

Unchanged: every file under `schema/` (no JSON Schema changes, `wingfoil-cli` rule 8), the digest
(spec-001 §13), and spec-002.

The key words **must**, **must not**, **should** and **may** are normative.

## 2. Terms

- **List parameter:** a `string` parameter whose value is a list of items separated by commas
  (§3.1).
- **Item:** one value of a list parameter, after the split.
- **Channel directive:** a directive an upstream pack ships, tagged `feedback-channel`, that turns
  a routed feedback item into a note in the upstream's format (§5).
- **Route directive:** a directive of a conditional entry, tagged `feedback-route` in
  `governance/feedback`, that tells the agent how to run that entry's route (§7).
- **Lookup by tag:** a file that names a tag, never a directive id, and lets the agent read every
  directive of the composition that carries it (§5.2, §7.2).

## 3. List parameters

### 3.1 Declaration and use

WingFoil 0.3.2's `memory.yaml` has no allowed-values key: `template.frontmatter` holds
`required`, `not_applicable_allowed`, `lists` and `exempt`, and `fields` is passed through and
never read (`dist/memory/schema.js`). spec-001 §8.1 has no list type. A list parameter is
therefore a convention over `string`, and no schema changes:
- **Declaration:** a `string` parameter whose `description` **must** begin with "List of". The
  description is what marks it. A list parameter's name **should** be plural.
- **Value:** items separated by `,`. Each item is trimmed of spaces at both ends.
- **Use in YAML:** a list parameter **may** stand unquoted only as the whole content of a YAML
  flow sequence: `[{{name}}]`, with spaces allowed between the brackets and the braces. Only the
  files of the pack that declares it **may** use it so. Any other unquoted use of a `string`
  parameter is an error. `integer` and `boolean` parameters stay as spec-001 §8.2 has them
  (`methodology/kanban`'s `in-progress: {{wip_in_progress}}`).
- **Use in Markdown:** it **may** appear in a directive's or an AGENTS.md section's text, where it
  reads as the list.

### 3.2 The item rule

Every value of a list parameter (its default, a preset's value and a value given at composition)
**must** pass this rule, which the composer checks before substitution and the lint checks on
every default, preset and example:
- at least one item; items unique;
- each item matches `^[a-z][a-z0-9-]*(:[a-z0-9-]+)?$`: a slug, optionally followed by `:` and a
  second slug (so `upstream:plover-vendor` passes, and a catalog pack id with its `/` does not);
- each item is a string under YAML's core schema: never `null`, `true`, `false`, `yes`, `no`,
  `on`, `off`, `~` or a number (the regex leaves out numbers, and the core-schema words are
  refused by name).

plan-074 step 2 shows why: today's composer accepts `x], kind: [defect`, which turns
`outcome: [{{feedback_outcomes}}]` into `outcome: [x], kind: [defect]`. It also accepts
`null, task`, the empty value (`outcome: []`, which selects nothing) and `task, task`. Only a value
that produces a duplicate key is refused.

### 3.3 Presets and who checks a value

- A preset sets a list parameter through `parameters` as any other value (spec-001 §15). A list of
  generic values is generic.
- **WingFoil 0.3.2 checks no value of a Memory field.** A list parameter fixes the list the
  pack's files and directives use. Values are checked as follows:
  - the agent, through the directive that names the list, when it writes a field;
  - the approver, at the gate that reads the field;
  - the fixture-element checks, on the fixtures ([E], dl-012 D8).
- A request to WingFoil for an allowed-values key in `memory.yaml` is a feedback note of the
  feedback-notes task (`docs/owed-items.md`). When a release has such a key, a pack may declare it
  from the same list parameter, under `pack-compatibility`'s rules.

## 4. `governance/feedback`'s value lists

### 4.1 The parameters

| Parameter | Default | Used in |
|---|---|---|
| `feedback_kinds` | `defect, gap, request, observation` | the `feedback` directive, the AGENTS.md section |
| `feedback_targets` | `product, governance` | the `feedback` directive |
| `feedback_outcomes` | `decision-log, task, upstream-note, declined, duplicate` | `feedback-review`'s `where`, the `feedback` directive |

`upstream:<name>` targets are added by the project when it composes an upstream pack (§5.3).

### 4.2 `bug`

- `bug` is never an item of `feedback_outcomes`. The entry `with: software@^1` owns it:
  `feedback-bug-route` selects `outcome: [bug]`, and its route directive adds `bug` to the
  allowed outcomes.
- This gives dl-012 D2's "without `software` the default `outcome` list has no `bug`" without a
  conditional default (spec-001 §8.1: one declaration, one default). It also keeps a `bug` item
  off `feedback-review`'s frontier, so one item never sits on two frontiers.
- The `feedback` directive says that a project never adds `bug`. The fixture check refuses `bug`
  in a preset's or an example's `feedback_outcomes` (§11).

### 4.3 The triage and the routes

- **The allowed outcomes** are the items of `feedback_outcomes` plus those the composed entries
  add (`bug` with `software`).
- **The triage rule.** An outcome that is empty, or not allowed, is rejected to `draft`. This
  replaces the charter's interim clause "an unrouted outcome is proposed as decision-log naming
  what it would have been", except for a would-be `bug` without `software`, which is still
  proposed as `decision-log` naming it (dl-012 D3).
- **The routes.** `feedback-review` selects every item whose outcome is in `feedback_outcomes`.
  `feedback-item`'s route step applies the `feedback` directive's table:
  - `decision-log`, through `decision-log-ingest`, or a governance change through
    `governance-evolution`;
  - `task`, as a `task` in `draft`;
  - `upstream-note`, through a channel (§5);
  - `declined` and `duplicate`, closed with the reason;
  - any other allowed outcome, and an `upstream-note` that no channel serves, become a
    decision-log naming it (dl-012 D3).

  plan-074 step 2 drove an added outcome (`deferred`) this way.

### 4.4 The type's fields

- `kind`, `target` and `source` stay required `string`s (FA-3).
- `context` stays a required `string` holding at least one reference (a Memory element id, a
  workflow and phase, a commit or a version). It is not a `lists` field, so a capture never
  writes an empty `[]`.
- `outcome` and `resulting` stay optional (plan-073 ruling 2).
- `fields` does not carry the allowed values: nothing in WingFoil 0.3.2 reads it, and the
  fixture-element checks read the composed parameter values instead.

## 5. Upstream channels

### 5.1 The convention

An upstream is added by a governance pack of its own that `requires` `governance/feedback`
(dl-012 D3). That pack:
- ships a **channel directive** tagged `feedback-channel`;
- binds it to `facilitator` in its own `roles.yaml`, so it is in the agent's context;
- names in the directive's text:
  - the target it serves, `upstream:<name>`, `<name>` a slug naming the upstream;
  - where a note is written and in which format;
  - the mapping of kinds (for WingFoil, `observation` becomes `request` or is not routed,
    dl-012 D3);
  - that the note cites the feedback id.

For an `upstream-note` item, the `feedback` directive tells the agent to read the channel
directive that serves the item's `target`, and to route the item to a decision-log naming the
target when none does.

### 5.2 Why the lookup by tag is allowed

- `governance/feedback` is composed before the upstream pack and cannot require it (spec-001
  §7.1). spec-001 §6.3 asks a pack that uses a directive it does not ship to require the pack
  that ships it.
- A lookup by tag is not such a use, within these bounds:
  - the reading pack names no directive id;
  - it owns the tag and defines it in its own directive;
  - it defines what happens when no directive carries the tag, or none serves the case.
- dl-025 D4's `exit-check` tag (spec-001 §6.5, Bridges) is the precedent within one pack. Its
  known limit (the owed row "a tag alone cannot tell which stricter pack a directive covers") is
  answered here by the target that the directive's text names.
- **Two channel directives serving one target** are an error: the facilitator raises it to the
  approver, and the lint refuses it in a composition of the tree (§11).
- A `feedback-channel` directive **must** come from a pack that requires `governance/feedback`
  (§11).

### 5.3 The targets

An upstream pack cannot add its target to `feedback_targets`: a parameter has one declaration, and
its value comes from its default, a preset or the composition (spec-001 §8.1). The project adds
`upstream:<name>` when it composes the upstream pack, as that pack's README install procedure
says. FA-8's fixture upstream pack follows this section, and so does `governance/wingfoil-dogfood`.
plan-074 step 2 drove an `upstream-note` route through a fixture channel to `closed`.

## 6. Routes that exist only with another pack

plan-073 ruling 3 is the pattern for a route that exists only in a composition with another pack:
- the entry holds a main workflow that selects the outcome it owns (`feedback-bug-route`, `where:
  { status: [triaged], outcome: [bug] }`), and the sub it includes (`feedback-bug-item`);
- the route step is an `agent.execute` action naming the route directive (§7.3), recorded with
  `workflow finalize`; the close step is `memory.submit`;
- the target workflow (`bug-ingest`) is started on its own and owns what it creates. WingFoil 0.3.2
  has no `workflow transfer`, so an element created in one run cannot be handed to another
  (plan-073 step 2);
- **no rule rests on a `checks` string**, which WingFoil 0.3.2 does not evaluate (plan-073
  step 2). A check a rule needs is written in a directive, or is a lint or test of this
  repository.

plan-074 step 2 drove this route to `closed` on 0.3.2, the bug captured by `bug-ingest`.

## 7. How an entry's directive reaches an agent

### 7.1 The constraint

- **No `roles.yaml` path.** Fragments are never conditional (spec-001 §6.5), and no
  unconditional `roles.yaml` assignment may name a directive of an entry (isolation).
- **No phase binding.** A WingFoil 0.3.2 phase has no key that binds a directive
  (`dist/workflow/schema.js`).
- **What `workflow next` prints:** a step's action texts and the role's `roles.yaml` directives
  (`dist/core/workflow-next.js`).
- **What `agent execute` gives the agent:**
  - a bootstrap: the run, the role, the element and the MCP session resource;
  - a context: the element, `dna.yaml`, the role's `roles.yaml` directives and Memory;
  - never the step (`dist/agent/execute.js`, `dist/core/context.js`).

  It also needs an agent with an adapter, which the packs' `dna.yaml` does not give (plan-074
  step 2: exit 1).

### 7.2 The rule

A pack whose conditional entry ships a directive an agent needs **must** give it all three paths:
1. **The path in the agent's context.** An unconditional directive of the pack, bound to a role
   in its `roles.yaml`, names a tag that the entry's directive carries. The tag is never the
   directive's id. That unconditional directive tells the agent to read every directive with
   the tag whenever the entry's content may apply, and to read the step with `workflow next` at
   such a step. In `governance/feedback`:
   - the tag is `feedback-route`, read whenever an outcome is proposed and at every route step;
   - the reading directive is `feedback`, bound to `facilitator`.

   This is the lookup by tag of §5.2, within one pack.
2. **The action text.** Every phase of the entry's workflows that has an `agent.execute` action
   names the directive in it: single-quoted (unquoted, YAML reads `a(b: c)` as a map) and without
   braces (WingFoil substitutes `{…}` as a token). For example:
   `'agent.execute(directive: feedback-bug-route)'`. `workflow next` prints it (plan-074 step 2).
   `agent.*` is a built-in token, so no binding warning can catch a wrong id
   (`dist/workflow/bindings.js`): the lint checks it (§11).
3. **The AGENTS.md section** names the directive as present only with the entry's pack (spec-001
   §10 allows it). This path reaches an agent only once the project pastes the generated region,
   until WingFoil exports `AGENTS.md` (spec-001 §10, R4).

The generic part (the action text, its lint, the AGENTS.md mention, and the reading directive's
duty) goes into spec-001 §6.5 and §10 (§10.1). The tag's name is each pack's own. A request
to WingFoil for a directive binding per phase is a feedback note of the feedback-notes task.

## 8. The back-reference field

- **The field.** `reported_by`, an optional list, as in WingFoil 0.3.2's `init` templates of
  `adr`, `bug`, `decision-log` and `tech-spec` (`dist/storage/templates.js`), where it names
  feedback notes "as provenance only". This repository extends it to `task` and to feedback ids:
  its values are the feedback ids, or the feedback note paths, that the element answers.
- **The types.** `base`'s `decision-log` and `task`; `software`'s `adr`, `bug` and `tech-spec`.
- **Who ships it.** A Memory template has one owner, the defining pack (spec-001 §7.6), and an
  overlay cannot change `template.file` (§7.5). So `base` and `software` ship the field in their
  next minor release (the owed row on the Memory templates' optional fields).
- **Until then.** With a `base` or `software` that lacks it, the routed element's body cites the
  feedback id, and the `feedback` directive says so. plan-074 step 2 found the composed `bug`
  template without the field.
- **FA-6's back-reference** is checked [E] by the fixture-element checks, through the field
  where the template has it and through the body otherwise.

## 9. The format of `governance/feedback`'s `pack.yaml`

`pack.yaml` format 2, as spec-001 §5 and `pack-authoring` say for a new pack (plan-074 ruling,
point 8). This departs from the charter's Compatibility line (format 1), which gets an Execution
Note at the fold-back. The pack uses no key of format 2 beyond the format itself. Its single entry
`with: software@^1` is valid in both formats (spec-001 §6.5). plan-074 step 2 validated the draft
at format 2 on 0.3.0 and 0.3.2.

## 10. Amendments

### 10.1 To spec-001

Each item below is the text the fold-back writes (plan-074 step 6), with an Execution Note on
spec-001 naming plan-074 and this specification.

- **§6.3**, after the paragraph on a pack that uses what it does not ship, add:
  > A lookup by tag is not a use. A pack's file may name a tag, never a directive id, and let the
  > agent read every directive of the composition that carries it, when the pack owns the tag,
  > defines it in its own directive, and defines what happens when no directive carries it
  > (spec-003 §5.2). A later pack's directive may carry it without the reading pack requiring the
  > later one.
- **§6.5**, after the isolation bullets, add:
  > - **An entry's directive and the agent.** A directive an entry ships reaches no role through
  >   `roles.yaml`. The pack gives it three paths (spec-003 §7.2):
  >   - an unconditional directive, bound to a role, names a tag the entry's directive carries,
  >     and tells the agent when to read it and to read the step with `workflow next`;
  >   - every phase of the entry's workflows with an `agent.execute` action names the directive
  >     in it, single-quoted and without braces;
  >   - the AGENTS.md section names it as present only with the entry's pack (§10).
- **§8.1**, after the types table, add:
  > - **List parameters.** A `string` parameter whose `description` begins with "List of" is a
  >   list parameter: items separated by `,`, each trimmed (spec-003 §3). Its every value passes
  >   §18's item rule.
- **§8.2**, after "inside double-quoted YAML scalars, or in Markdown text", add:
  > A list parameter may also stand unquoted as the whole content of a flow sequence
  > (`[{{name}}]`, spaces allowed between the brackets and the braces), only in the files of the
  > pack that declares it. Any other unquoted use of a `string` parameter is an error.
- **§10**, the third bullet, add at its end:
  > A section names an entry's directive this way when the agent needs it (§6.5); until WingFoil
  > exports `AGENTS.md`, this path reaches an agent only once the project pastes the region (R4).
- **§18**, under "`pack.yaml` and the pack directory", add:
  > - every value of a list parameter (§8.1) has at least one item, its items unique, each
  >   matching `^[a-z][a-z0-9-]*(:[a-z0-9-]+)?$` and none a YAML core-schema word (`null`,
  >   `true`, `false`, `yes`, `no`, `on`, `off`, `~`); the composer checks every value before
  >   substitution, the lint every default, preset and example; a list parameter is unquoted
  >   only as §8.2 allows, and no other `string` parameter is unquoted;
  > - every phase of a conditional entry's workflows with an `agent.execute` action names, in
  >   it, a directive of that same entry (§6.5);
  > - a directive tagged as another pack's channel comes from a pack that requires it, and two
  >   directives of a composition never serve the same channel target (spec-003 §5.2);
  > - no rule of a pack rests on a workflow's `checks` string, which WingFoil 0.3.2 does not
  >   evaluate: a check a rule needs is a directive's, a lint's or a test's (spec-003 §6).
  The `feedback-channel` check names this pack's tag. A pack that adds a tag of the same kind
  adds its own line through its design.

### 10.2 To `pack-authoring`

In a commit of its own, as plan-067 did, `pack-authoring` gains:
- under parameters: list parameters (spec-001 §8.1, §8.2) and their item rule;
- under conditional entries: an entry's directive and its three paths (spec-001 §6.5);
- under workflows: no rule rests on a `checks` string.

### 10.3 To the charter and the root README

- **The charter** gets an Execution Note citing this specification for its Open points 1 … 5,
  the triage rule of §4.3 and the format of §9.
- **The root `README.md`'s list of specifications** gains this one.

## 11. Checks

Owed, in the row of the fixture-element checks (`docs/owed-items.md`, plan-074 rulings):
- **the composer:** §3.2's item rule on every list parameter value, before substitution;
- **the lint:**
  - the item rule on defaults, presets and examples;
  - the unquoted-use rule (§3.1);
  - the action text of an entry naming a directive of that entry (§7.2);
  - the `feedback-channel` source pack and one channel per target (§5.2);
- **the fixture-element checks** (dl-012 D8), all [E]:
  - required fields;
  - allowed values: a list parameter's items plus those a composed entry adds;
  - references that resolve;
  - back-references through `reported_by` or the body (§8);
  - `outcome` and `resulting` on a `closed` item;
  - `bug` refused in a preset's or an example's `feedback_outcomes`.

## 12. Open points

| # | Point | Owner |
|---|---|---|
| S3-O1 | An allowed-values key in WingFoil's `memory.yaml`: once a release has it, a pack may declare its list there from the list parameter (§3.3). | WingFoil, through the feedback-notes task's request |
| S3-O2 | A directive binding per workflow phase: once a release has it, an entry's workflow may bind its directive and §7.2's first path may become optional. | WingFoil, through the feedback-notes task's request |
| S3-O3 | `agent execute` on a composed project needs an agent with an adapter, which no pack's `dna.yaml` gives (§7.1). | this repository, at the adoption (W10) |
| S3-O4 | `reported_by` in `base`'s and `software`'s templates (§8). | the next minor release of `base` and `software` |

## Execution Notes

- 2026-11-16: written under plan-074 step 3, from the approver's rulings on its outline and step
  2's probes; `tags` filled by editing the draft (W-02).
