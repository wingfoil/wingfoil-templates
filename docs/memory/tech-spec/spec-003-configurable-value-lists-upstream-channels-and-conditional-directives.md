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
- **Use in YAML:** in a YAML file, or in a Markdown file's YAML frontmatter, a parameter of any
  type other than `integer` and `boolean` **must** stand inside a double-quoted scalar. A list
  parameter **may** also stand as the whole content of a YAML flow sequence, `[{{name}}]`, with
  spaces allowed between the brackets and the braces, and only in the files of the pack that
  declares it. Any other placement (plain, single-quoted, a block scalar, a comment) is an error.
  `integer` and `boolean` parameters stay as spec-001 §8.2 has them (`methodology/kanban`'s
  `in-progress: {{wip_in_progress}}`, the only unquoted uses in the published packs). `path`
  and `pattern` values hold `{…}` tokens (spec-001 §8.3), which YAML reads as a flow mapping
  outside double quotes.
- **Use in Markdown:** it **may** appear in a directive's or an AGENTS.md section's text, where it
  reads as the list.
- **Why not a list type.** A `list` type in `parameters` (plan-074 point 2, option (b)) would
  move `pack.yaml` to format 3, with a frozen v2 schema and a feedback note (spec-001 §5), and
  still need the item rule. The convention needs neither.

### 3.2 The item rule

Every value of a list parameter (its default, a preset's value and a value given at composition)
**must** pass this rule, which the composer checks before substitution and the lint checks on
every default, preset and example:
- at least one item; items unique;
- each item matches `^[a-z][a-z0-9-]*(:[a-z0-9-]+)?$`: a slug, optionally followed by `:` and a
  second slug (so `upstream:plover-vendor` passes, and a catalog pack id with its `/` does not);
- each item reads as a string under YAML 1.2's core schema and YAML 1.1 alike: never `null`,
  `true`, `false` (core schema) or `yes`, `no`, `on`, `off`, `y`, `n` (YAML 1.1), refused by
  name; the regex already leaves out numbers and `~`.

plan-074 step 2 shows why: today's composer accepts `x], kind: [defect`, which turns
`outcome: [{{feedback_outcomes}}]` into `outcome: [x], kind: [defect]`. It also accepts
`null, task`, the empty value (`outcome: []`, which selects nothing) and `task, task`. Today only
the type rule (`"`, `\`, `{{`) and the YAML parse after substitution stop a value: a duplicate
key, or `x]]`, fails to parse.

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

dl-012 D2's default for `target` holds `upstream:<name>`, a placeholder that is not a valid item:
the default leaves it out, and the project adds `upstream:<name>` when it composes an upstream
pack (§5.3).

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
  replaces the charter's interim clause (Ships, "Items no review selects": an unrouted outcome is
  proposed as `decision-log` naming what it would have been), except for a would-be `bug`
  without `software`, which is still proposed as `decision-log` naming it (dl-012 D3).
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
  workflow and phase, a commit or a version). WingFoil has no typed reference (F-043), so the
  fixture-element checks resolve it. It is not a `lists` field, so a capture never
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
- states the target it serves on a line of its own, exactly `Serves the target
  \`upstream:<name>\`.`, `<name>` a slug naming the upstream, which the lint reads (§11);
- names in the directive's text:
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
  approver, and the lint refuses it in a composition of the tree, from the "Serves the target"
  lines (§11).
- A `feedback-channel` directive **must** come from a pack that requires `governance/feedback`
  (§11).

### 5.3 The targets

An upstream pack cannot add its target to `feedback_targets`: a parameter has one declaration, and
its value comes from its default, a preset or the composition (spec-001 §8.1). The project adds
`upstream:<name>` when it composes the upstream pack, as that pack's README install procedure
says. FA-8's fixture upstream pack follows this section, and `governance/wingfoil-dogfood`'s
charter, not yet written, will.
plan-074 step 2 drove an `upstream-note` route through a fixture channel to `closed`.

## 6. Routes that exist only with another pack

plan-073 ruling 3 is the pattern for a route that exists only in a composition with another pack:
- the entry holds a main workflow that selects the outcome it owns (`feedback-bug-route`, `where:
  { status: [triaged], outcome: [bug] }`), and the sub it includes (`feedback-bug-item`);
- the route step is an `agent.execute` action naming the route directive (§7.2, path 2),
  recorded with `workflow finalize`; the close step is `memory.submit`;
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

**Scope.** The rule applies to a directive that an entry ships and that an agent needs at a step
of that entry's workflows. Content an entry ships without such a directive is untouched:
- a methodology's `delivery` and its sub-workflows in its entry `with: software`, whose plain
  `agent.execute` actions need only the role's `roles.yaml` directives (spec-001 §6.5);
- a bridge's `exit-check` directives, read by tag from an unconditional transition step
  (spec-001 §6.5, Bridges), which is their path in the agent's context.

Such a directive reaches the agent through three paths:
1. **The path in the agent's context.** The pack reads the directive by a tag it owns, never by
   its id, from a file the agent already has: an unconditional directive bound to a role, or an
   unconditional workflow step (as the Bridges do). This is the lookup by tag of §5.2, within
   one pack. In `governance/feedback`:
   - the tag is `feedback-route`, carried by `feedback-bug-route`;
   - the reading directive is `feedback`, bound to `facilitator`. It tells the agent to read
     every directive tagged `feedback-route` whenever it proposes an outcome and at every route
     step, and to read the step with `workflow next` at a route step.

   The tag and the reading duty stay in this pack's directive (plan-074 point 5): they are not
   a rule of spec-001.
2. **The action text.** A phase of the entry's workflows that needs the directive names it in its
   `agent.execute` action: single-quoted (unquoted, YAML reads `a(b: c)` as a map) and without
   braces (WingFoil substitutes `{…}` as a token). For example:
   `'agent.execute(directive: feedback-bug-route)'`. `workflow next` prints it (plan-074 step
   2). A plain `agent.execute` stays allowed. An `agent.execute` that names a directive names
   one in the entry's scope: the entry's own, the pack's unconditional ones, or one of the
   `with` pack's. `agent.*` is a built-in token, so no binding warning can catch a wrong id
   (`dist/workflow/bindings.js`): the lint checks it (§11).
3. **The AGENTS.md section** names the directive as present only with the entry's pack (spec-001
   §10 allows it). This path reaches an agent only once the project pastes the generated region,
   until WingFoil exports `AGENTS.md` (spec-001 §10, R4).

The generic part goes into spec-001 §6.5, §10 and §18 (§10.1): the scope, the action text and its
check, and the AGENTS.md mention. A request to WingFoil for a directive binding per phase is a
feedback note of the feedback-notes task.

## 8. The back-reference field

- **The field.** `reported_by`, an optional list, as in WingFoil 0.3.2's `init` templates of
  `adr`, `bug`, `decision-log` and `tech-spec` (`dist/storage/templates.js`), where it names
  feedback notes "as provenance only". This repository extends it to `task` and to feedback ids:
  its values are the feedback ids, or the feedback note paths, that the element answers.
- **The types.** `base`'s `decision-log` and `task`; `software`'s `adr`, `bug` and `tech-spec`.
- **Who ships it.** A Memory template has one owner, the defining pack (spec-001 §7.6), and an
  overlay cannot change `template.file` (spec-001 §7.5). So `base` and `software` ship the field
  in their next minor release (the owed row on the Memory templates' optional fields).
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

Each quoted block below is the text the fold-back writes (plan-074 step 6), with an Execution Note
on spec-001 naming plan-074 and this specification. The text outside the quotes is commentary.

- **§6.3**, a new last bullet:
  > - A lookup by tag is not a use. A pack's file may name a tag, never a directive id, and let
  >   the agent read every directive of the composition that carries it, when the pack owns the
  >   tag, defines it in its own directive, and defines what happens when no directive carries
  >   it or none serves the case (spec-003 §5.2). A later pack's directive may carry it without
  >   the reading pack requiring the later one.
- **§6.5**, after the isolation bullets:
  > - **An entry's directive and the agent.** A directive an entry ships reaches no role through
  >   `roles.yaml`. When an agent needs it at a step of the entry's workflows, the pack gives it
  >   three paths (spec-003 §7.2): a lookup by tag (§6.3) from a file the agent already has, an
  >   unconditional directive bound to a role or an unconditional workflow step, as the Bridges
  >   below do; the directive named in that step's `agent.execute` action, single-quoted and
  >   without braces; and the AGENTS.md section naming it as present only with the entry's pack
  >   (§10). A plain `agent.execute` stays allowed; one that names a directive names one in the
  >   entry's scope: the entry's own, the pack's unconditional ones, or one of the `with` pack's.
- **§8.1**, after the types table:
  > - **List parameters.** A `string` parameter whose `description` begins with "List of" is a
  >   list parameter, its name preferably plural: items separated by `,`, each trimmed
  >   (spec-003 §3). Every value of it passes §18's item rule. WingFoil checks no value of a
  >   Memory field: a list parameter is the list a pack's files and directives use.
- **§8.2**, after the sentence that ends "inside double-quoted YAML scalars, or in Markdown text":
  > In a YAML file, or in a Markdown file's YAML frontmatter, a parameter of any type other than
  > `integer` and `boolean` stands inside a double-quoted scalar; a list parameter may also stand
  > as the whole content of a flow sequence (`[{{name}}]`, spaces allowed between the brackets
  > and the braces), only in the files of the pack that declares it. Any other placement is an
  > error.
- **§10**, at the end of the third bullet:
  > A section names an entry's directive this way when the agent needs it (§6.5); until WingFoil
  > exports `AGENTS.md`, this path reaches an agent only once the project pastes the region (R4).
- **§18**, under "`pack.yaml` and the pack directory":
  > - every value of a list parameter (§8.1) has at least one item, its items unique, each
  >   matching `^[a-z][a-z0-9-]*(:[a-z0-9-]+)?$` and none a word YAML 1.2's core schema or YAML
  >   1.1 reads as other than a string (`null`, `true`, `false`, `yes`, `no`, `on`, `off`, `y`,
  >   `n`); the lint checks every default and example, and the composer every value before
  >   substitution;
  > - every parameter in a YAML file or a Markdown file's frontmatter is placed as §8.2 says
  >   (lint and composer);
  > - an `agent.execute` action of a conditional entry's workflows that names a directive names
  >   one in the entry's scope (§6.5) (lint);
  > - a directive tagged `feedback-channel` comes from a pack that requires
  >   `governance/feedback`, and states its target on a "Serves the target" line; two such
  >   directives of a composition never serve the same target (spec-003 §5.2) (lint);
  > - a pack's rule never rests on a workflow's `checks` string, which WingFoil 0.3.2 does not
  >   evaluate: a check a rule needs is a directive's, a lint's or a test's (spec-003 §6). A
  >   review rule, judged at `pack-release-cycle` › `prepare`, not a lint.

  The `feedback-channel` line names this pack's tag: a pack that adds a tag of the same kind adds
  its own line through its design.
- **§18**, under "Presets:":
  > - every value a preset gives a list parameter passes the item rule (§8.1).

### 10.2 To `pack-authoring`

In a commit of its own, as plan-067 did, `pack-authoring` gains:
- after the bullet on the parameters a pack declares in `pack.yaml`: list parameters, their item
  rule and the placement of a parameter in YAML (spec-001 §8.1, §8.2);
- after the bullet "every directive id a pack references is shipped by the pack itself or by a
  pack it `requires`": a lookup by tag is not a use (spec-001 §6.3);
- after the bullet on the conditional part: an entry's directive and its three paths (spec-001
  §6.5);
- after the bullet on workflows: no rule rests on a `checks` string (spec-001 §18).

### 10.3 To the charter, dl-013 and the root README

- **The charter** gets an Execution Note citing this specification for its Open points 1 … 5,
  the triage rule of §4.3 and the format of §9.
- **dl-013** gets an Execution Note pointing its `design` phase to §3 and §7 for its shared
  questions (plan-074 point 10).
- **The root `README.md`'s list of specifications** gains this one.

## 11. Checks

Owed, in the row of the fixture-element checks (`docs/owed-items.md`, plan-074 rulings):
- **the composer:** the item rule (§3.2) on every list parameter value, and the placement rule
  (§3.1), before substitution;
- **the lint:**
  - the item rule on defaults, presets and examples;
  - the placement rule (§3.1); `src/pack-files.ts` already walks every `{{name}}` with its
    offset, so the lint can test the YAML token around it (a double-quoted scalar, or the only
    item of a flow sequence);
  - an entry's `agent.execute` naming a directive in the entry's scope (§7.2);
  - the `feedback-channel` source pack, its "Serves the target" line, and one channel per target
    (§5.2);
- **the review** (`pack-release-cycle` › `prepare`): no rule rests on a `checks` string (§6);
- **the fixture-element checks** (dl-012 D8), all [E]:
  - required fields;
  - allowed values: a list parameter's items plus those a composed entry adds;
  - references that resolve (F-043);
  - back-references through `reported_by` or the body (§8);
  - `outcome` and `resulting` on a `closed` item;
  - `bug` refused in a preset's or an example's `feedback_outcomes`.

## 12. Open points

| # | Point | Owner |
|---|---|---|
| S3-O1 | An allowed-values key in WingFoil's `memory.yaml`: once a release has it, a pack may declare its list there from the list parameter (§3.3). | WingFoil, through the feedback-notes task's request |
| S3-O2 | A directive binding per workflow phase: once a release has it, an entry's workflow may bind its directive and §7.2's first path may become optional. | WingFoil, through the feedback-notes task's request |
| S3-O3 | `agent execute` on a composed project needs an agent with an adapter, which no pack's `dna.yaml` gives (§7.1). | this repository, at the adoption (W10): the row "The engine way of working, adopted with this repository's adoption" |
| S3-O4 | `reported_by` in `base`'s and `software`'s templates (§8). | the next minor release of `base` and `software` |

## Execution Notes

- 2026-11-16: written under plan-074 step 3, from the approver's rulings on its outline and step
  2's probes; `tags` filled by editing the draft (W-02).
- 2026-11-16: independent review (dl-017): approve after amendments; one blocker, nine
  should-fix, seven nits, all applied in the commit that records this note; every WingFoil 0.3.2
  claim confirmed in its code.
  - **Blocker.** The entry-directive rule was narrowed to a directive an agent needs at an
    entry's step. A plain `agent.execute` stays allowed, a named directive is one in the entry's
    scope, and a bridge's tag read by a transition step counts as the first path (§7.2, §10.1).
    Without the narrowing, a methodology's `delivery` and the Bridges would have broken it.
  - **Should-fix.**
    - The tag and the reading duty stay in this pack (§7.2).
    - The placement rule covers every type but `integer` and `boolean`, in YAML files and
      frontmatter (§3.1, §10.1).
    - The composer's checks are named (§10.1, §11).
    - A machine-readable "Serves the target" line (§5.1).
    - The `feedback-channel` line written as such, the commentary marked.
    - The `checks` rule is a review rule.
    - The traceability: the owed row extended, S3-O3 tied to the adoption row, dl-013's note.
    - `pack-authoring`'s anchors and the §6.3 bullet (§10.2).
    - §7.2's reference and §3.2's claim corrected.
  - **Nits.** YAML 1.1 words; `upstream:<name>` left out of D2's default; the charter's clause
    cited, not quoted; §10.1's insertion points and the Presets line; "spec-001 §7.5"; plural
    names and "WingFoil checks no value" in §8.1's text; F-043, the dogfood charter, and why
    not a list type.

  The blocker and the placement rule change rules the approver ruled (plan-074 points 2 and 5):
  they go back to the approver, then to a re-review.
