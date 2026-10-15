---
id: spec-001-the-pack-format-manifest-fragments-composition-catalog-compatibility-and-digest
type: tech-spec
title: "The pack format: manifest, fragments, composition, catalog, compatibility and digest"
status: approved
tags: ["packs","format","contract"]
---

## 1. Purpose and scope

This specification fixes the format of a WingFoil-Templates pack, and how packs are composed into a
project's `.wingfoil/`. It also fixes the files of this repository that WingFoil reads to list,
resolve and verify packs: `catalog.yaml`, `compat.yaml`, presets and transitions. Its JSON Schemas,
under `schema/`, are the machine-readable half of the contract with the WingFoil CLI
(`sw-life-cycle` › `specification`).

It implements `docs/01_vision/06_features.md` F1.1–F1.7 and F2.1–F2.6, and sequencer milestone M0
(waves W1–W4). It applies:
- dl-001: the pack model;
- dl-002: compatibility by formats and capabilities;
- dl-003: `base`, the slots, the `governance` axis, AGENTS.md R1–R4;
- dl-004: identifiers, tags, branches, digest, ruled 1(a), 2(a), 3(b), 4(a);
- dl-008: no `operations` slot;
- dl-022: the scope of `base`, the `software` foundation pack, a methodology's `delivery` only with
  `software`;
- adr-001: the reference composer;
- WingFoil dl-149: the `format:` key.

Two deviations from approved texts were ruled by the approver on 2026-10-06, at the independent
review:
- **No `workflows.yaml` fragment.** F1.2 and plan-012 name fragments of `dna`, `roles`, `memory` and
  `workflows`. The composer generates `workflows.yaml` from each pack's inventory instead (§7.7),
  because a hand-written include list duplicates `contents` and can drift from it.
- **Required parameters without a default.** F1.3 and the `pack-authoring` directive say that every
  parameter has a default. A parameter such as `project_name` has no generic default, and inventing
  one would put a project value in a pack. §8.1 therefore allows a parameter without a default,
  which makes it required. The `pack-authoring` wording is aligned in a later configuration change,
  from an approved element, with a `version:` bump.

Out of scope:
- how WingFoil downloads, locks, upgrades and merges packs with a project's own files (WingFoil
  dl-138; feedback notes T5, T7);
- the declaration of phase methods (dl-007, `pending`);
- the content of any pack, which belongs to its charter.

The key words **must**, **must not**, **should** and **may** are normative.

## 2. Terms

| Term | Meaning |
|---|---|
| **pack** | A directory under `packs/` with a `pack.yaml`, versioned on its own (dl-001 D4). |
| **catalog pack id** | The pack's identifier in `catalog.yaml`, tags and `requires`: `base`, `software`, `<axis>/<name>` or `phase/<slot>/<name>`. |
| **pack name** | The last segment of the catalog pack id. Unique across the whole catalog (dl-004 1(a)). |
| **axis** | A concern a project chooses a pack for (§3). The foundation packs are outside the axes. |
| **foundation pack** | `base`, the core of every project governed by WingFoil, or `software`, the software layer above it (§3, dl-022). |
| **conditional part** | The part of a pack's content and requirements that counts only in a composition holding a given pack (§6.5). |
| **slot** | A workflow name that `sw-life-cycle` or `delivery` includes and that one pack fills (§9). Slots exist only in a composition with `software`. |
| **overlay** | A pack that only adds to or tightens the packs composed before it (dl-001 D1). |
| **fragment** | A partial `dna.yaml`, `roles.yaml` or `memory.yaml`, merged with the other packs' (§7). |
| **asset file** | A file copied whole into the project: a workflow, a directive, a Memory template (§6). |
| **composition** | The resolved, ordered set of packs with their parameter values, and the `.wingfoil/` it produces. |
| **composer** | The program that turns a composition into files: the reference composer of adr-001, or WingFoil. |
| **file kind** | A kind of file WingFoil reads, with its own format counter (WingFoil dl-149). |

## 3. Axes, cardinalities and overlays

A composition holds `base`, optionally `software`, and packs chosen along these axes (dl-001 D1,
dl-003 D1/D6, dl-008, dl-022):

| Axis | Cardinality | Overlay | Notes |
|---|---|---|---|
| *(foundation)* `base` | exactly one, always | no | Composed first. Every other pack requires it. Serves every project governed by WingFoil, software or not (dl-022 S1, S2). |
| *(foundation)* `software` | at most one | no | Composed right after `base`. Ships the software Memory types and the life cycle with its slots (dl-022 S3). |
| `methodology` | exactly one with `software`, at most one without | no | Fills the `delivery` slot only in a composition with `software` (§6.5, §9). |
| `phase` | at most one per slot | no | Slots `inception`, `specification`, `release`, `end-of-life`. |
| `blueprint` | any number | no | |
| `governance` | any number | no | |
| `team-mode` | at most one | yes | |
| `stage` | at most one | yes | Scale: `prototype` → `mvp` → `production` → `maintenance` → `sunset`. The functions of operations belong here (dl-008). |

- Every pack except `base` **must** require `base` exactly once, written `base@^<major>`, for
  example `base@^1` (dl-003 D1). `base` requires nothing.
- `software` requires `base@^<major>` only. Every phase pack **must** require `software`, written
  `software@^<major>`, and so **must** every pack that uses a Memory type, a workflow, a directive
  or a parameter shipped by `software` outside a conditional part (§6.3, §6.5).
- A composition without `software` has no life cycle: no `sw-life-cycle`, no slot, and no phase
  pack. Its methodology, if any, contributes everything but its conditional part (dl-022 S3).
- Every pack **must** only add to or tighten what the packs composed before it ship (§7). An
  overlay is composed after every non-overlay pack, so it can tighten them all.
- The axes, cardinalities, slots and stage scale are data of `catalog.yaml` (§11), so that a resolver
  reads them rather than hard-coding them.

## 4. Identifiers

- **Pack name:** `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`, unique across the catalog whatever the axis or
  slot (dl-004 1(a)). The names `base` and `software` are the foundation packs'.
- **Catalog pack id:**
  - `base` and `software` for the foundation packs;
  - `phase/<slot>/<name>` for a phase pack;
  - `<axis>/<name>` for every other pack.
- **Pack directory:** `packs/<catalog pack id>/`.
- **Memory element:** `pack-<axis>-<name>`; the foundation packs are `pack-foundation-base` and
  `pack-foundation-software`. `foundation` is a value of the element's `axis` field only. In
  `pack.yaml` and `catalog.yaml`, the foundation packs have no axis (dl-004 1(a), as amended by
  dl-022).
- **Tag** of a published version: `<catalog pack id>@<version>`, for example `base@1.0.0`,
  `methodology/kanban@1.2.0`, `phase/inception/lean-inception@1.0.0` (dl-004 2(a)).
  - The tag is annotated, points at the commit recorded in `catalog.yaml` (§11), and is never moved
    or deleted.
  - Every tag ends in a `<name>@<version>` segment, so no tag name is a prefix directory of another
    and git's ref rules hold.
- **Maintenance branch** of an N-1 line, from WingFoil 1.0 only (dl-002):
  `maint/<catalog pack id>/<major>.x`, for example `maint/methodology/kanban/1.x` (dl-004 3(b)).
- **Version:** SemVer 2.0 `MAJOR.MINOR.PATCH`, with no pre-release or build part. `pack-semver`
  gives the bump classes. Every published version is `1.0.0` or later; `0.x` is not used.

## 5. The `format:` key

WingFoil dl-149 gives every WingFoil file a `format:` key, distinct from `version:`:
- an integer counter per file kind, bumped only on a backward-incompatible change of that kind;
- an absent key reads as `format: 1`.

This specification applies it twice.

1. **Files a pack ships for WingFoil.** Every fragment, workflow, directive and Memory template
   **must** declare `format:`, even where its value is 1:
   - at the top of a YAML file;
   - in the frontmatter of a Markdown file.

   The value is the WingFoil format of that file kind that the file is written in. The pack's
   `formats` map (§6) **must** list the same value for each kind it ships, and every file of one kind
   in one pack **must** have the same format.

   WingFoil v0.3 keeps every kind at format 1 and adds optional keys without bumping it, as dl-149
   allows (read at `wingfoil/wingfoil@ffa9bf6b`). A format therefore does not say which keys a
   release knows. A pack **must not** use a key unknown to a release its computed range claims
   (§12): WingFoil refuses unknown keys in some nodes (adapter manifests, a workflow phase's
   `cadence`) and accepts them elsewhere with the warning `unknown field(s) ignored`, which the
   compatibility matrix does not allow (`pack-compatibility`). The matrix enforces it; once a
   capability names such a key, the pack also declares it.
2. **This repository's own files.** `pack.yaml`, `catalog.yaml`, `compat.yaml`, presets and
   transitions **must** declare `format:` at the top. Their counters belong to this repository; they
   follow dl-149's rule (bumped only on a backward-incompatible change) but not its default, since
   the key is required.
   - In `pack.yaml`, `version:` stays the pack's semver: its content revision, coherent with dl-149.
   - `catalog.yaml`, `compat.yaml`, presets and transitions have no `version:`. Their history is
     git's.
   - Every file of this section is format 1 in this specification. `pack.yaml` and `catalog.yaml`
     stayed at format 1 through the amendment of dl-022, which added `conditional` and gave
     `foundation` two packs: nothing was published and no reader of them existed, and the
     specification was amended in place before the first publication. This section's rule applies
     from the first publication on.

A schema under `schema/` validates the current format of its file kind, and checks `format` as a
constant. When a format is bumped, the previous schema is kept, frozen, as
`schema/<kind>.v<N>.schema.json`, and the change produces a feedback note (`wingfoil-feedback`).

## 6. The pack directory and `pack.yaml`

### 6.1 Layout

```
packs/<catalog pack id>/
  pack.yaml               required: the manifest (§6.2)
  README.md               required: purpose, parameters, adaptation notes
  CHANGELOG.md            required: one entry per published version
  fragments/dna.yaml      optional (§7.3)
  fragments/roles.yaml    optional (§7.4)
  fragments/memory.yaml   optional (§7.5)
  directives/<id>.md      zero or more (§7.6)
  workflows/<name>.yaml   zero or more (§7.6)
  memory-templates/<type>.md   zero or more (§7.6)
  agents/section.md       optional (§10)
```

- No other file or directory is allowed. Symbolic links and git submodules are not allowed (§13).
- Every path segment matches `^[A-Za-z0-9][A-Za-z0-9._-]*$`, so paths are ASCII and need no
  Unicode normalization.
- The file stem is the asset's identifier:
  - a directive's `id`;
  - a workflow's `name`;
  - a Memory template's type.

  The identifier inside the file **must** equal the stem.

### 6.2 `pack.yaml`

```yaml
format: 1
id: methodology/kanban          # catalog pack id (§4)
axis: methodology               # absent for the foundation packs
name: kanban                    # equals the last segment of id
# slot: release                 # phase packs only; equals the middle segment of id
title: "Kanban"
description: >-
  Continuous flow under explicit WIP limits …
version: 1.0.0                  # the pack's semver (§4)
formats:                        # file kind -> WingFoil format the content is written in (dl-002)
  memory: 1
  roles: 1
  workflow: 1
  directive: 1
requires_capabilities: []       # WingFoil capabilities needed, from compat.yaml (dl-002)
requires:                       # catalog pack id @ range (§6.3)
  - base@^1
conflicts: []                   # catalog pack id, optionally @ range (§6.3)
parameters:                     # §8
  wip_limit: { type: integer, default: 3, description: "WIP limit of the in-progress column" }
contents:                       # §6.4
  fragments: [roles, memory]
  directives: [wip-limits]
  workflows: [replenishment]
  memory_templates: []
  agents_section: false
conditional:                    # §6.5: counts only in a composition with software
  - with: software@^1
    contents:
      workflows: [delivery, kanban-delivery]
```

| Field | Required | Rule |
|---|---|---|
| `format` | yes | `1` |
| `id` | yes | §4. Equals the directory path under `packs/`. |
| `axis` | yes, except the foundation packs | One of the axes of §3. Absent for `base` and `software`. Equals the first segment of `id`. |
| `name` | yes | §4. Equals the last segment of `id`. |
| `slot` | phase packs only | One of the `phase` slots. Equals the middle segment of `id`. |
| `title`, `description` | yes | Non-empty. English (dl-001 D8). |
| `version` | yes | §4. |
| `formats` | yes | Map from file kind (§12) to format, one entry per kind the pack ships. May be empty only for a pack that ships no WingFoil file. |
| `requires_capabilities` | yes | Capability names from `compat.yaml` (§12), sorted, unique. May be empty. |
| `requires` | yes, except `base` | §6.3. Exactly one `base@^<major>` entry for every pack but `base`; empty or absent for `base`; `software` requires `base@^<major>` only. |
| `conflicts` | no | §6.3. |
| `parameters` | no | §8. |
| `contents` | yes | §6.4. |
| `conditional` | no | §6.5. At most one entry in format 1, on a non-foundation pack only. |

`schema/pack.schema.json` checks what JSON Schema can express. The lint rules (F3.5) check the
rest; §18 lists them for every file kind.

`pack.yaml` has no `status` and no `bundled` field:
- the state of a pack is its Memory element's, and its published versions are in `catalog.yaml`;
- no pack is bundled in WingFoil's npm package: WingFoil installs packs from this repository
  (dl-021 R1, WingFoil dl-138 Action 3).

### 6.3 `requires` and `conflicts`

- An entry is `<catalog pack id>@<range>`. In `conflicts`, `@<range>` may be omitted, which means
  every version.
- `<range>` is a subset of node-semver:
  - a caret `^1`, `^1.2`, `^1.2.3`;
  - a tilde `~1.2`, `~1.2.3`;
  - an exact version `1.2.3`;
  - an intersection of `>=`, `>`, `<=`, `<` comparators separated by one space, for example
    `>=1.2.0 <3.0.0`.

  `||`, hyphen ranges, `x` wildcards and pre-releases are not allowed.
- A pack has at most one `requires` entry per catalog pack id. It never requires or conflicts with
  itself, and never conflicts with `base` or `software`.
- A composition **must** satisfy every `requires` of every pack, and **must not** contain two packs
  of which one `conflicts` with the other.
- The cardinalities of §3 are conflicts already, so packs **must not** restate them.
- A pack that uses a parameter, a Memory type, a role, a directive or an included workflow that it
  does not ship itself **must** `require` the pack that ships it (`pack-authoring`). The one
  exception is a conditional part, whose `with` requires `software` for what that part uses (§6.5).

### 6.4 `contents`

`contents` is the pack's inventory. Each list holds identifiers, in the order the pack wants them to
appear in the composed files:
- `fragments`: a subset of `[dna, roles, memory]`, in that order;
- `directives`, `workflows`, `memory_templates`: file stems;
- `agents_section`: `true` when `agents/section.md` exists.

An absent list is empty, and an absent `agents_section` is `false`.

Every listed file **must** exist, and every file present under those directories **must** be listed
exactly once, in `contents` or in a conditional part's `contents` (§6.5). The composer reads only
what they list.

### 6.5 The conditional part

A pack's `delivery` exists only in a composition with `software` (dl-022 S3). A pack declares such
content in an optional `conditional` list, with at most one entry in format 1:

```yaml
conditional:
  - with: software@^1           # format 1 allows only software@^<major>
    contents:
      workflows: [delivery, kanban-delivery]
      directives: []
```

- **Who.** Only a non-foundation pack that does not require `software` may carry `conditional`. A
  pack that requires `software` ships everything in `contents`, so a phase pack carries none.
- **`with`** is an entry of §6.3's syntax, and names only `software@^<major>` in format 1. It is a
  requirement that counts only when the composition holds `software`:
  - it never adds a pack, so resolution stays one pass;
  - when the composition holds `software` at a version outside the range, the requirement is
    unsatisfied, an error, never a reason to leave the part out;
  - it names no pack of the pack's `requires`, and the pack does not `conflict` with it;
  - it counts as a requirement for §7.1's rule against requiring a later pack.
- **`contents`** may list `workflows` and `directives` only, by file stem, as §6.4.
  - In a composition with `software`, the entry's workflows and directives come after the pack's
    own, each list in its written order (§7.7).
  - In a composition without `software`, the composer leaves them out, and the generated `include`
    with them.
- **Isolation.** What is always composed uses nothing that exists only with `software`:
  - no fragment, unconditional workflow or roles assignment references a workflow or a directive of
    the entry;
  - `software`'s parameters, Memory types, workflows and directives are used only inside the
    entry's files, so the parameter scope of §8.1 is checked per part;
  - the AGENTS.md section is always composed (§10).
- **Fragments are never conditional.** A pack therefore cannot tighten `software`'s Memory types
  through this part (O14).
- **One owner, slots.** §7.6's one-owner rule and §9's slot rule are checked on the composition with
  `software`.
- A methodology that does not require `software` ships `delivery` in its entry, never in
  `contents`; a methodology that requires `software` ships it in `contents` (dl-022 S3: a
  methodology does not always require `software`). A composition with `software`
  holds exactly one methodology; one without it holds at most one, which contributes no `delivery`
  (§3).

## 7. Composition and the merge of fragments

### 7.1 Composition order

The composer orders the packs of a composition as follows. The order does not depend on how the
packs were given.

1. `base`;
2. `software`, when the composition holds it;
3. the `methodology` pack;
4. the `phase` packs, in slot order: `inception`, `specification`, `release`, `end-of-life`;
5. the `blueprint` packs;
6. the `governance` packs;
7. the `team-mode` pack;
8. the `stage` pack.

Within an axis of cardinality "many", the packs are sorted topologically on `requires` (Kahn's
algorithm): at each step, the next pack is the one with the smallest catalog pack id, in byte
order, among the packs whose requirements in that axis are already placed.

A `requires` that points to a pack later in this order (for example a blueprint requiring a stage)
is an error. A conditional part's `with` counts as a requirement for this rule (§6.5).

### 7.2 General merge rules

Fragments are merged one pack at a time, in composition order: the result so far is the **base
side**, and the next fragment is the **incoming side**.
- **Mappings** merge by key. A new key is added at the end, in the incoming fragment's key order.
- **Scalars:** an incoming scalar for a key the base side already has **must** be equal to it.
  Otherwise the composition fails. A pack cannot change a value another pack set; the exceptions are
  the tightening rules of §7.5.
- **Lists** follow the rule their key declares in §7.3–§7.5:
  - a **set** keeps the base side's items, then appends the incoming items not already present;
  - a **keyed list** (a list of mappings with a `name`) merges an incoming item into the base item
    of the same `name` with these same rules, or appends it when the name is new.
- **Nothing is ever removed.** No fragment syntax deletes a key, an item or a state.

Definitions and the closing rule:
- **Set items** are scalars. Two items are equal when they have the same YAML type and value. A set
  whose items are mappings or lists fails.
- **Keyed-list items** are mappings with a `name`. An item without `name`, or two items with the
  same `name` in one fragment, fails.
- **Kind mismatch.** When the two sides hold different YAML kinds for one key (scalar, mapping,
  list), the composition fails.
- **Undeclared lists.** A list under a key that §7.3–§7.5 does not declare is treated as a scalar:
  the incoming list must be equal to the base side's, item by item and in order.
- **Otherwise: fail.** Any case these rules and §7.3–§7.5 do not allow fails the composition. A
  composer never guesses.

Each fragment **must** declare `format:` (§5), and every fragment of one kind in a composition
**must** have the same format. The composed file carries that format. Fragments carry no
`version:`; the composer writes `version: 1` in each composed file, and later content revisions
belong to the project (WingFoil task-183).

### 7.3 `dna.yaml`

| Key | Rule |
|---|---|
| `project.*` | Scalars, set once. In practice `base` sets them from parameters and the methodology, when there is one, sets `project.methodology`. |
| `modules` | Keyed list by `name`. |
| `stacks.technologies`, `stacks.methodologies` | Keyed lists by `name`. |
| `team.members`, `team.agents`, `team.roles` | Keyed lists by `name`. Within an item, `roles` and `executes_as` are sets. |
| `team.agents[].approval_authority` | Must be `false` in every pack (dl-005 G6; WingFoil's agent rule). |
| `paths.<category>` | Sets. A new category is a new key. |

### 7.4 `roles.yaml`

| Key | Rule |
|---|---|
| `assignments.<role>` | Set of directive ids. |
| `global` | Set of directive ids. |

Every directive id listed **must** be shipped by a pack of the composition or be one of WingFoil's
built-in directives.

### 7.5 `memory.yaml`: add or tighten

Besides `format:` (§5), a `memory.yaml` fragment has two keys, `defaults` and `types`. Any other
top-level key fails in format 1.

**Defining and tightening.**
- A type is **defined** by the first pack that declares it, with all its keys: `path`, `id_pattern`,
  `template`, and optionally `name`, `description`, `tags`, `amendable`, `fields` (an authoring key
  WingFoil passes through) and `states`. `states` may hold `sequence`, `gates`, `waiting`, `returns`
  and `limits`, as WingFoil's `memory.yaml` declares them.
- `defaults` is defined by `base`.
- A later pack may **tighten** a type, or `defaults`, by the rules below, and may change nothing
  else. A key not listed here fails.

| Key | A later pack may |
|---|---|
| `path`, `id_pattern`, `template.file` | nothing: an incoming value must be equal |
| `name`, `description`, `tags`, `amendable`, `fields` | nothing: an incoming value must be equal, and a value for a key the defining pack left out fails |
| `template.frontmatter.required` | add fields (set), including when the defining pack declared none |
| `template.frontmatter.not_applicable_allowed`, `template.frontmatter.lists` | add fields (set), only fields the same fragment adds to `required`, so an earlier pack's required field is never loosened |
| `template.frontmatter.exempt` | never present in a pack: it names element ids, which are project values |
| `states.sequence` | insert states (below) |
| `states.gates` | add a gate on a state that has none, a state in `waiting` included; an existing gate's `reject` target must be equal |
| `states.waiting` | add its own states (below) |
| `states.returns` | nothing: an incoming `states` without `returns` keeps it, one with `returns` must equal it |
| `states.limits` | add a limit on a state that has none, or lower one (below) |

A pack that gives a type deriving from `defaults` its own machine (below) tightens it: it is not
the defining pack, so every row above applies to it as to any later pack.

**The effective machine.** A type defined with `states` has its own machine; its `states`
**must** have a `sequence`. A type defined without `states` **derives from `defaults`**:
- While no pack tightens it on its own, it follows `defaults.states`.
- An incoming `states` on it, with a `sequence`, `gates` or both, is a tightening of
  `defaults.states` as it stands at that point of the composition. It must pass the sequence and
  gate rules against it. From then on the type has its own machine: the merge of the two.
- **Every tightening of `defaults` applies to every type that derives from `defaults`,** whether
  it still follows it or already has its own machine. For the latter, the tightening is merged into
  the type's machine with the same rules, `base`'s `defaults` sequence being the reference sequence.

So an overlay that tightens `defaults` reaches every such type, whether or not another pack
tightened it first (§3). A type defined with its own `states` never derives from `defaults`.

This is the only way a type gets its own machine after its definition. It can add states and gates
to what it inherited, never replace them.

**Sequences.** Each sequence names each state once; a duplicate fails. A pack writes the whole
sequence it wants. An incoming `states` without a `sequence` leaves the sequence unchanged: B is A. The merge of the base side's sequence A and the incoming sequence B works as
follows:
1. B **must** contain the **reference sequence** as a subsequence, in the same order. The reference
   sequence is the type's sequence as defined, or, for a type that follows `defaults` or detaches
   from it, the sequence `base` defined in `defaults`.
2. The states common to A and B **must** appear in the same relative order in both, or the
   composition fails.
3. The merged sequence keeps every state of A and B. Between two consecutive common states, and
   before the first or after the last, the base side's own states come first, in A's order, then
   the incoming side's own states, in B's order.

So two packs that do not know each other can both insert states, and the result does not depend
on anything but the composition order of §7.1.

**Gates.**
- A gate's state, and its `reject` target, **must** be states of the merged sequence. A gate whose
  `reject` target is its own state fails.
- An existing gate is never removed, and its `reject` target never changes.

**Waiting, returns and limits.**
- `waiting` is a set of states of the merged sequence. A later pack may add only its own states:
  those of its incoming sequence that are not on the base side at that point of the composition.
  Repeating an entry already present changes nothing. A tightening of `defaults` that adds a
  `waiting` entry reaches every type deriving from `defaults`, like any tightening of `defaults`.
- `returns` maps a state to an earlier state, both of the merged sequence. Since no state is
  removed and insertion keeps the relative order, a `returns` edge stays valid in every merge.
- `limits` maps a state of the merged sequence to a positive integer. A `limits.<state>` on a state
  without a limit is added; on a state with one, the merged value is the smaller of the two, so a
  limit only ever goes down and the result does not depend on which pack came first.

Which `reject` targets make sense (earlier or later states) is WingFoil's validation.

**Example.** The states are illustrative; the foundation packs' charters fix the real ones.
Suppose `base` defines `task` with `[draft, pending, backlog, in-progress, in-review, approved,
done]` and gates on `pending` and `in-review`. Two overlays, which do not require each other,
tighten it:

```yaml
# team-mode/agent-first, composed first (§7.1)
types:
  task:
    states:
      sequence: [draft, pending, backlog, ready, in-progress, in-review, approved, done]
      gates:
        ready: { reject: backlog }
# stage/production, composed after it
types:
  task:
    states:
      sequence: [draft, pending, backlog, in-progress, in-review, qa, approved, done]
```

The merged sequence is `[draft, pending, backlog, ready, in-progress, in-review, qa, approved,
done]`, with gates on `pending`, `ready` and `in-review`. Had stage inserted a state between
`backlog` and `in-progress`, it would have come after `ready`, because the base side comes first.

A second example, for a type that derives from `defaults`. `adr` has no `states` and `defaults` is
`[draft, pending, approved]`. `team-mode` gives `adr` the sequence
`[draft, pending, ai-review, approved]`; `stage` then tightens `defaults` to
`[draft, pending, approved, archived]`. `adr` ends as `[draft, pending, ai-review, approved,
archived]`, and every other type that derives from `defaults` gains `archived` too.

These fail composition:
- an incoming `[draft, pending, backlog, in-progress, approved, done]`, which drops `in-review`;
- an incoming sequence that swaps two existing states;
- changing a gate's `reject` target, or removing a gate;
- removing a required frontmatter field;
- `template.frontmatter.exempt` in a fragment;
- `not_applicable_allowed` or `lists` naming a field the same fragment does not add to `required`;
- a new `waiting` entry on a state the incoming pack did not insert, or a different `returns`;
- redefining a type's `path`, `id_pattern` or template file, or a set-once key;
- a `states` on a type that replaces, rather than extends, the machine it follows.

These rules are the add-or-tighten rule of dl-003 D1 made exact.

### 7.6 Asset files

Asset files are copied whole, after parameter substitution (§8). They are never merged.

| Pack file | Written to (format 1) |
|---|---|
| `directives/<id>.md` | `.wingfoil/directives/built-in/<id>.md` |
| `workflows/<name>.yaml` | `.wingfoil/workflows/built-in/<name>.yaml` |
| `memory-templates/<type>.md` | `.wingfoil/memory/templates/built-in/<type>.md` |

- A pack names no install folder: its asset paths are relative to each kind, and the table is the
  reference composer's mapping in format 1. A pack writes only WingFoil-managed asset folders,
  never `custom/`, which belongs to the project (`pack-authoring`). WingFoil dl-138 ratified a
  `remote` asset class (Q3): `built-in/` stays WingFoil's own, and `pack-install` maps a pack into
  the `remote` class once dl-138's Action 2 tech-spec fixes its folder, layout and lock; the
  reference composer then follows it. That changes the composer, not the pack format (dl-021 R3,
  F-029).
- **One owner per file.** Two packs of a composition **must not** ship the same directive id,
  workflow name or Memory template. The one exception is a slot workflow (§9).
- A Memory template is shipped by the pack that defines its type. The type's `template.file` in that
  pack's `memory.yaml` fragment **must** be `memory/templates/built-in/<type>.md` in format 1: the
  one path a pack writes that names a folder, kept until O13 is settled. WingFoil reads the
  template from the path the type declares, so the `built-in/` folder keeps pack files apart from
  the project's own templates, as for directives and workflows.
- A directive id that equals one of WingFoil's own built-in directives (for example
  `architecture`) is an error in format 1 (§16).

### 7.7 `workflows.yaml`

Packs ship no `workflows.yaml` fragment (§1, deviation). The composer generates the file from
`contents.workflows`:
- `format: 1` and `version: 1`. This specification fixes the composed `workflows.yaml` at format 1,
  so no pack declares the `workflows` kind; the compatibility check includes it (§12). When WingFoil
  bumps that kind, this specification is revised;
- `include`: one entry `workflows/built-in/<name>.yaml` per composed workflow (the folder follows
  §7.6's mapping), in composition order, then in each pack's `contents.workflows` order, followed,
  in a composition with `software`, by its conditional part's `contents.workflows` (§6.5).

A slot workflow appears once, at the position of the pack whose file is used.

An include list written by each pack would duplicate `contents` and could drift from it. Workflows
include each other by name, never by path (`pack-authoring`, WingFoil bug-144).

## 8. Parameters

### 8.1 Declaration

```yaml
# illustrative: project_name and plan_id would be base's, adr_path software's
parameters:
  project_name:  { type: string, description: "dna.yaml project.name" }
  adr_path:      { type: path, default: "docs/memory/adr/{id}.md", description: "path of an ADR" }
  plan_id:       { type: pattern, default: "plan-{n}-{slug}", description: "id_pattern of the plan type" }
```

- **Name:** `^[a-z][a-z0-9_]*$`.
- **Types:**

  | Type | Value |
  |---|---|
  | `string` | Any text without control characters, `"` or `\`. |
  | `integer` | A base-10 integer. |
  | `boolean` | `true` or `false`. |
  | `path` | A relative POSIX path: no leading `/`, no `..` segment, no backslash. May contain WingFoil tokens (§8.3). |
  | `pattern` | An id pattern: no `/`, no whitespace. May contain WingFoil tokens (§8.3). |

- **No value of any type contains `{{`**, so substitution is a single pass (§8.2).
- **Every value is validated** against the declaring pack's type before substitution: a `default`,
  a value set by a preset, and a value given at composition alike.
- **Description:** required, so that the README and the CLI can show it.
- **Default:**
  - a parameter with a `default` is optional;
  - a parameter without one is required, and the composition fails if no value is given;
  - a pack **must not** carry project values (`pack-authoring`), so defaults are generic;
  - `project_name`-like parameters have no default.
- **Namespace:** the parameters of a composition share one flat namespace.
  - Each name is declared by exactly one pack of the composition.
  - A pack may use the parameters it declares and those of the packs it `requires`, directly or
    transitively. A conditional part's files may also use those of its `with` pack and of the packs
    that pack requires (§6.5).

### 8.2 Substitution

- Every occurrence of `{{name}}` (exactly two braces, no spaces) in a fragment, workflow, directive,
  Memory template or agents section is replaced by the parameter's value, as text, before merging
  and copying.
- `pack.yaml`, `README.md` and `CHANGELOG.md` are not substituted.
- A `{{name}}` that names no parameter in the pack's scope is an error.
- The text `{{` followed by anything else is left as it is. Format 1 has no escape and no filters.
- Substitution is textual, so a pack author places parameters where any allowed value keeps the
  file valid: inside double-quoted YAML scalars, or in Markdown text. The composer parses each YAML
  file after substitution and fails on a parse error.

### 8.3 WingFoil tokens pass through

Single-brace tokens belong to WingFoil and to the project, and the composer never interprets any of
them. Examples: `{id}`, `{n}`, `{slug}`, `{axis}`, `{name}`, `{workflow}`, `{phase}`, and the
project tokens `{release}` and `{scope}` (`docs/notes/base-regeneration-inputs.md` §2). A `path` or `pattern` value may contain them, so a
project can set, for example, `task_path: "docs/04_memory/{release}/{id}.md"`. Which tokens WingFoil
fills, and from where, is WingFoil's.

## 9. Slots

Slots are workflow names reserved by the life cycle (dl-003 D4, D11; dl-008; dl-022 S3). They exist
only in a composition with `software`:

| Slot | Included by | Default shipped by | Filled by |
|---|---|---|---|
| `inception` | `sw-life-cycle` | `software` | a `phase/inception/*` pack |
| `specification` | `sw-life-cycle` | `software` | a `phase/specification/*` pack |
| `delivery` | `sw-life-cycle` | none | the `methodology` pack (required with `software`), in its conditional part |
| `release` | `delivery` | `software` | a `phase/release/*` pack |
| `end-of-life` | `sw-life-cycle` | `software` | a `phase/end-of-life/*` pack |

- `software` ships `sw-life-cycle` (`kind: main`). It includes `inception`, `specification`,
  `delivery` and `end-of-life` by name, and ships the defaults above.
- `base` ships `retrospective` and `governance-evolution` (dl-022 S2, S4).
- The methodology ships `delivery` (`kind: sub`): in its conditional part, with
  `with: software@^<major>` (§6.5), when it does not require `software`; in its `contents` when it
  does. `delivery` includes `release` and
  `retrospective` by name, at its own cadence (dl-003 D11, dl-006). `retrospective` is not a slot,
  so no pack replaces it. In a composition without `software`, what runs `retrospective` is fixed
  by `base`'s charter.
- A phase pack of slot `<slot>` **must** ship `workflows/<slot>.yaml`, with `name: <slot>` and
  `kind: sub`. Its file replaces `software`'s default. This is the only case in which a pack's file
  replaces another's (§7.6). A phase pack requires `software` (§3), so it carries no conditional
  part.
- No other pack may ship a workflow named after a slot.
- There is no `operations` slot (dl-008). Operations is the stage overlays' concern.

## 10. The AGENTS.md section

`AGENTS.md` and every agent file at the repository root are never pack files (dl-003 R1). A pack
contributes at most one section, `agents/section.md` (R2):
- Markdown, with parameters substituted, and no frontmatter. It is not a WingFoil file kind yet
  (§12), so it carries no `format:` until WingFoil dl-137 defines one;
- `base`'s section opens with the level-1 heading of the file; every other section, `software`'s
  included, opens with a level-2 heading and contains no level-1 heading;
- it is composed whether or not the pack's conditional part is (§6.5): a methodology's section may
  name `delivery` as present only with `software`;
- it contains no markers.

The composer writes no `AGENTS.md`. It produces the **generated region** as a separate output:
- the opening marker;
- the sections in composition order, separated by one blank line;
- the closing marker.

WingFoil generates the file and owns only that region; the rest of the file is the project's (R3).
Until WingFoil exports `AGENTS.md` (v0.4), projects paste the region by hand (R4).

The markers are **provisional** (feedback notes T14):

```
<!-- wingfoil:generated:begin -->
<!-- wingfoil:generated:end -->
```

They are realigned to the tech-spec of WingFoil dl-137 part (b), or earlier to WingFoil2's own
`AGENTS.md` if that lands first. The realignment changes this section and the composer, not the
packs.

## 11. `catalog.yaml`

`catalog.yaml`, at the repository root, is the index WingFoil reads to list, resolve and verify
packs. A resolver decides from it alone which versions to fetch.

```yaml
format: 1
foundation: base
axes:
  methodology: { cardinality: one, required: true }
  phase:       { cardinality: one-per-slot, required: false, slots: [inception, specification, release, end-of-life] }
  blueprint:   { cardinality: many, required: false }
  governance:  { cardinality: many, required: false }
  team-mode:   { cardinality: one, required: false, overlay: true }
  stage:       { cardinality: one, required: false, overlay: true, scale: [prototype, mvp, production, maintenance, sunset] }
slots:
  inception:     { included_by: sw-life-cycle, default: base, filled_by: phase }
  specification: { included_by: sw-life-cycle, default: base, filled_by: phase }
  delivery:      { included_by: sw-life-cycle, filled_by: methodology }
  release:       { included_by: delivery, default: base, filled_by: phase }
  end-of-life:   { included_by: sw-life-cycle, default: base, filled_by: phase }
packs:
  - id: base
    path: packs/base
    catalog: official
    status: active
    versions:
      - version: 1.0.0
        commit: 0123456789abcdef0123456789abcdef01234567
        digest: "sha256:…"
        formats: { dna: 1, memory: 1, roles: 1, workflow: 1, directive: 1, memory-template: 1 }   # illustrative
        requires_capabilities: []
        requires: []
        conflicts: []
        wingfoil: ">=0.3.0 <=0.3.2"
transitions:
  - id: prototype-to-production
    path: transitions/prototype-to-production.yaml
    from: stage/prototype
    to: stage/production
    formats: {}
    requires_capabilities: []
presets:
  - { id: startup-mvp, path: presets/startup-mvp.yaml }
```

- **`foundation`** names the foundation packs in composition order: `[base, software]` (dl-022).
  `base` is in every composition; `software` only where a pack of the composition requires it
  unconditionally or the project chooses it (§6.5).
- **`axes`** and **`slots`** carry §3 and §9 as data. The order of `axes` is the composition order
  of §7.1, after the foundation packs.
  - The `methodology` axis is required only in a composition with `software`. Its data form is
    `required_with: software` in place of `required: true`; the other axes keep `required: false`.
  - The `default` of the slots `inception`, `specification`, `release` and `end-of-life` is
    `software`.
- **The example above** still shows `foundation: base`, a required `methodology` axis and `base` as
  the slots' default. It changes together with `catalog.yaml` and its schema, which
  `tests/catalog.test.ts` holds equal to it (Execution Notes, 2026-10-15).
- **`packs[]`:**
  - `id`, `path` (§4);
  - `catalog`: `official` or `community` (dl-001 D7). Where community packs live, and how they
    relate to WingFoil's third-party sources (WingFoil dl-138 Q4), is open (§16). Format 1 lists
    only `official` packs, and the value is required so that adding the other kind is not a format
    change;
  - `status`: `planned` (charter accepted, nothing published, `versions` empty), `active` (at
    least one version published) or `deprecated`. Only a deprecated pack may name a `successor`;
  - `versions[]`: one entry per published version, in ascending semver order. An entry is never
    edited after publication, except its `wingfoil` field (§12).
- **A version entry** copies from the published `pack.yaml`: `formats`, `requires_capabilities`,
  `requires`, `conflicts` and, when present, `conditional` with its `with` only (§6.5). A resolver
  can therefore check compatibility and dependencies without fetching the pack. It adds:
  - `commit`: the full id of the commit the tag points at;
  - `digest` (§13);
  - `wingfoil`: the computed range (§12).
- **Publication order.** The tag `<catalog pack id>@<version>` points at commit C, which contains
  the pack version. The catalog entry naming C is committed afterwards, in a later commit, because a
  commit cannot name itself. `pack-release-cycle` › `publish` follows this order.
- **`transitions[]`** index §14. Each copies the transition's `formats` and
  `requires_capabilities`, so a resolver can check it without fetching it.
- **`presets[]`** index §15.

## 12. `compat.yaml` and the computed range

`compat.yaml`, at the repository root, maps each released WingFoil to what it reads and provides
(dl-002).

```yaml
format: 1
kinds:
  dna: ".wingfoil/dna.yaml"
  memory: ".wingfoil/memory.yaml"
  roles: ".wingfoil/roles.yaml"
  workflows: ".wingfoil/workflows.yaml"
  workflow: "a workflow file"
  directive: "a directive file"
  memory-template: "a Memory template"
capabilities:
  pack-install: "init, pack add and upgrade install packs from this repository"
  workflow-engine: "WingFoil executes workflows"
releases:
  - wingfoil: 0.2.2
    format_key: false
    reads: { dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1], memory-template: [1] }
    capabilities: []
    notes: "Predates dl-149: reads format 1 but warns on the format: key."
```

- **`kinds`** are the seven dl-149 kinds a composition involves, all of them required. `workflows`
  is listed even though packs ship no fragment of it, because the composed file has a format
  (§7.7). WingFoil's other kinds, `workflows/bindings.yaml` (WingFoil dl-153) and the adapter
  manifests, are at format 1 in v0.3; packs ship neither, so they are not listed, and changes to
  them, such as v0.3's `mcp.via: config-arg`, leave the pack format unchanged.
- **`capabilities`** are this repository's provisional vocabulary (dl-021 R4) until WingFoil's
  capabilities query publishes one (WingFoil dl-177; F-013). WingFoil owns the final names.
- **`releases[]`:**
  - only released WingFoil versions (`MAJOR.MINOR.PATCH`, no pre-release), in ascending order;
  - `format_key` says whether the release accepts the `format:` key without a warning;
  - `reads` maps each kind to the formats that release reads;
  - `capabilities` lists what it provides, from the `capabilities` vocabulary above;
    `wingfoil-release-intake` records a capability for a release only when its CHANGELOG names
    the feature or command behind it (dl-021 R4), since WingFoil names features and commands, not
    capabilities;
  - `notes` is optional free text for people, never read by a resolver.

  WingFoil 0.2.2 predates dl-149. It reads format 1, which is files with no key, but warns on the
  key: `unknown field(s) ignored: format` from `workflow list`, `dna show` and `directives list`
  (checked on 2026-10-06 in a scratch clone of this repository). Its `format_key` is therefore
  `false`.

  `wingfoil-release-intake` appends one entry per WingFoil release (dl-002).

`V.formats` counts the kinds of both parts of a pack with a conditional part (§6.5), so the check
below holds for either composition.

**Compatibility.** A pack version V is compatible with release R when all four hold:
- `R.format_key` is `true`, because every file a pack ships declares `format:` (§5), and validation
  allows no warning (`pack-compatibility`);
- for every kind `k` in `V.formats`, `R.reads[k]` exists and contains `V.formats[k]`;
- `R.reads.workflows` contains the format of the composed `workflows.yaml`, which is 1 (§7.7);
- every name in `V.requires_capabilities` is in `R.capabilities`.

**Computed range.** The `wingfoil` field of a catalog version entry is computed, never written by
hand (dl-002):
1. take the releases of `compat.yaml` compatible with V, in ascending order;
2. split them into maximal runs of releases that are consecutive in `compat.yaml`;
3. write each run as `>=first <=last`, or as `first` when the run has one release;
4. join the runs with ` || `.

The range is closed: it claims only releases that `compat.yaml` lists. An empty set is written
`""`, and such a version **must not** be published (`pack-compatibility`). The range is
informational: a resolver decides on formats and capabilities. When `wingfoil-release-intake` adds
a release, it recomputes the `wingfoil` field of every published version. That is the only edit
allowed to a published entry.

## 13. The pack digest

The digest makes a catalog entry verifiable against what was tagged (dl-004 4(a)).

1. **Files:** every file of the pack directory in the tagged commit's tree (`git ls-tree -r <tag>
   -- packs/<catalog pack id>/`). Nothing is excluded: `pack.yaml`, `README.md` and `CHANGELOG.md`
   are hashed too.
   - Only regular files are allowed: git mode `100644` or `100755`. A symbolic link (`120000`) or a
     submodule (`160000`) makes the digest fail.
   - The executable bit is not hashed.
2. **Bytes:** the blob as committed, with no line-ending conversion, no filter and no
   normalization. This repository's `.gitattributes` **must** disable conversion under `packs/`
   (`packs/** -text`), so that a checkout gives the same bytes; the tooling phase adds it.
3. **Path:** relative to the pack directory, with `/` separators and no leading `./`. Every segment
   matches `^[A-Za-z0-9][A-Za-z0-9._-]*$` (§6.1), so paths are ASCII and need no normalization.
4. **Listing:** one line per file, `<sha256 of the blob, 64 lowercase hex>`, two spaces, `<path>`,
   `LF`. The last line also ends with `LF`. This is the output format of `sha256sum`.
5. **Order:** ascending byte order of the path, which is `LC_ALL=C sort`. Upper case sorts before
   lower case.
6. **Digest:** `sha256:` followed by the 64 lowercase hex characters of the sha256 of the listing's
   bytes.

Reference command, from a clean checkout of the tag, with GNU coreutils (`shasum -a 256` prints
the same format elsewhere):

```sh
cd packs/<catalog pack id> &&
git ls-files -s | awk '$1 !~ /^100(644|755)$/ {bad=1} END {exit bad}' &&
git ls-files | LC_ALL=C sort | while IFS= read -r f; do sha256sum "$f"; done | sha256sum
```

The first line fails on a symbolic link or a submodule. The command hashes the checked-out files,
so it equals the definition only once `.gitattributes` disables conversion (step 2). Until the
tooling phase adds it, hash the blobs with `git cat-file blob <tag>:<path>` instead.

Test vector. A pack directory holding four files:
- `CHANGELOG.md`: `- 1.0.0: first version.\n`
- `README.md`: `Example pack.\n`
- `pack.yaml`: `format: 1\nid: governance/example\n`
- `workflows/example.yaml`: `name: example\n`

It gives the listing

```
f6097182a7684de9c96e3e177f7093dae055078578b6d50ffc29113615496567  CHANGELOG.md
084afaef62d7b533569e4e4b5c17209d72f7ab184b4b27de88ec6e514db5a44f  README.md
d5c3f6446bebdb367c001944c80c553c1d220d5a3f3fff14430d09dbc0b12494  pack.yaml
15fcc3870625980bf58f15ba904736b4ffa1a84495a8f4f51d781e211016e743  workflows/example.yaml
```

and the digest
`sha256:77a8a72717b5c73b556af940449ff91a609796079139ade0cb98ddf2ca81bd1c`.

The digest is the pack's, not a composition's. The determinism check (two compositions,
byte-identical) compares composed trees and is recorded in `pack-release`, not in the catalog.

## 14. Transitions

A transition describes the move of a project from one stage to the next. No `stage set` verb runs
it: the project replaces its `stage/*` overlay through a pack update, and the transition is run as
the workflow the target overlay ships (dl-021 R2, F-028, WingFoil dl-178). It lives in
`transitions/<from>-to-<to>.yaml`:

```yaml
format: 1
id: prototype-to-production
from: stage/prototype
to: stage/production
formats: {}
requires_capabilities: []
pre_checks:
  - { id: approver-declared, description: "dna.yaml team.members has at least one approver." }
actions:
  - { id: swap-stage-overlay, description: "Replace stage/prototype with stage/production." }
  - { id: record-decision, description: "Create a decision-log recording the transition." }
```

- `id` is `<from name>-to-<to name>`. `from` and `to` are stage catalog pack ids.
- `formats` and `requires_capabilities` follow dl-002, as in `pack.yaml`, and are copied into the
  catalog's `transitions[]` (§11).
- **No version of its own.** A transition is resolved together with its target stage: when a
  project moves to `stage/<to>@V`, the transition is read at the tag `stage/<to>@V`. A change to a
  transition is therefore published as a release of the target stage pack, and classified by
  `pack-semver` like any change to that pack.
- **Integrity.** The target stage's catalog version entry lists `transitions`, from transition id
  to the digest of the transition file. That digest is §13 applied to a listing of one file, whose
  path is the file name.
- `pre_checks` and `actions` are descriptive in format 1: an `id` and a `description`. They get an
  executable form when WingFoil defines how a pack update runs a transition (WingFoil dl-178); that
  will be a format bump of the transition kind.

## 15. Presets

A preset names a curated combination that `init` can select (dl-001 D1). How `init` selects one is
WingFoil's, requested by this repository as F-030; no `init --preset` option exists yet.
It lives in `presets/<id>.yaml`:

```yaml
format: 1
id: startup-mvp
title: "Startup MVP"
description: "Kanban, agent-first, a web service, Lean Inception, MVP stage."
profile: "small team building a first product"
packs:
  - methodology/kanban@^1
  - team-mode/agent-first@^1
  - blueprint/web-service@^1
  - phase/inception/lean-inception@^1
  - stage/mvp@^1
parameters: {}
```

- `packs` uses the entry syntax of §6.3. `base` may be omitted, because every pack requires it.
  `software` is in a preset's composition when the preset names it or a listed pack requires it
  unconditionally (a phase pack, for example); otherwise the preset is a composition without the
  software layer. A conditional part never brings `software` in (§6.5).
- Whether a preset holds `software` is judged on its resolved composition: with `software` it holds
  exactly one methodology, without it at most one, which contributes no `delivery` (§3, §6.5).
- `parameters` may set only generic values. A project value, such as a name or a person, is never in
  a preset (`pack-authoring`).
- `profile` names the adoption profile it serves (`docs/01_vision/04_personas.md` §2).
- A preset has no version. It is a curated pointer to version ranges, and its history is git's.
- Every preset is part of the compatibility matrix of every pack it contains
  (`pack-compatibility`).
- A pack with a conditional part is validated in compositions with and without `software`
  (`pack-compatibility`).

## 16. Open points

Each has an owner outside this specification. None blocks format 1.

| # | Point | Owner |
|---|---|---|
| O1 | Where community packs live, and how they relate to WingFoil's third-party sources. | M4 features (dl-001 D7; WingFoil dl-138 Q4) |
| O2 | The final AGENTS.md markers. | WingFoil dl-137 part (b) (notes T14) |
| O3 | The capability vocabulary. This repository's is provisional (dl-021 R4, §12). | WingFoil dl-177, the capabilities query (F-013) |
| O4 | `workflows/bindings.yaml` (v0.3): whether it becomes a dl-149 kind, and whether packs ship it. **Settled** at `wingfoil/wingfoil@ffa9bf6b`: a kind at format 1 (WingFoil dl-153); packs do not ship it in format 1 (§12). | settled; a pack that needs bindings reopens it |
| O5 | A pack directive that shares its id with a WingFoil built-in directive. In format 1 it is an error; overriding a built-in is the project's `custom/` folder. | WingFoil dl-138's Action 2 tech-spec (the override rules of the `remote` class) |
| O6 | Overlays cannot patch a workflow, only add workflows and tighten Memory, roles and DNA. A workflow-patch mechanism is a later format. | this repository, when a stage charter needs it |
| O7 | A canonical YAML serialization of composed files, so that two different composers give the same bytes. Format 1 requires determinism of one composer only (adr-001). | WingFoil, with notes T15 |
| O8 | The `{{` escape. Not needed so far. | this repository, when a pack needs it |
| O9 | The `method` entry per workflow and phase. | dl-007 (`pending`) |
| O10 | No released WingFoil has `format_key: true` before v0.3 is released, so the tooling's fixtures (sequencer W5–W7) cannot pass the zero-warning matrix on 0.2.2. Whether the matrix then runs against an unreleased v0.3 build, for tooling only and never for a publication, is the tooling phase's decision. | the tooling phase (M1) |
| O11 | task-251 decision 4, held for the WingFoil approver: `memory add` copies a template's `format: 1` into the elements it creates. If ruled so, the `format:` that §5 requires in a pack's Memory templates also appears in every project element. | WingFoil (task-251) |
| O12 | WingFoil's `init` writes its own built-in directives into `directives/built-in/`, the folder the reference composer writes packs to in format 1. Settled in principle by WingFoil dl-138 Q3 (dl-021 R3): `built-in/` is WingFoil's own and packs land in the `remote` class; what remains is the folder and how an upgrade tells them apart. | WingFoil dl-138's Action 2 tech-spec, with O5 and O13 |
| O13 | A pack's `memory.yaml` fragment names its template as `memory/templates/built-in/<type>.md` (§7.6), the one path a pack writes that names a folder. How it reads under the `remote` class: rewritten by `pack-install`, or a kind-relative form. The format-1 rule stays until then. | WingFoil dl-138's Action 2 tech-spec (F-029) |
| O14 | Fragments are never conditional (§6.5), so no pack can tighten `software`'s Memory types (for example `bug` or `release`) only in a composition with `software`. A conditional fragment is a later format. | this repository, when a methodology's charter needs it |

## 17. What the reference composer does

adr-001 makes the composer implement this specification and nothing more. Given packs (as catalog
pack ids with ranges, or local paths), parameter values and an output directory, it:

1. resolves the packs and their `requires`, and fails on a missing pack, an unsatisfied range or a
   conflict (§6.3); a conditional part's `with` is checked when the composition holds `software`,
   and never adds a pack (§6.5);
2. validates every `pack.yaml`, and the files of this repository, against `schema/` (§5, §6);
3. checks the cardinalities, the slots and the inventories (§3, §6.4, §6.5, §9);
4. orders the packs (§7.1);
5. substitutes parameters (§8), merges the fragments (§7.2–§7.5), copies the asset files (§7.6),
   those of a conditional part only with `software` (§6.5), and generates `workflows.yaml` (§7.7);
6. writes `.wingfoil/` with UTF-8, `LF` line endings and a final newline;
7. produces the AGENTS.md generated region as a separate output (§10).

It computes digests (§13) and computed ranges (§12) for the release process. It writes no lock,
downloads nothing beyond reading git tags of this repository, and never touches `custom/` or the
project's own files.

## 18. Checks beyond the schemas

The schemas check what JSON Schema can express. The lint rules of the validation command (F3.5)
check the rest, and the composer refuses what they reject.

**Every file of this repository:**
- `format`, and every integer value (an `integer` parameter's default or value), is written as a
  YAML integer, never in fractional notation such as `1.0`. JSON Schema counts `1.0` as an
  integer, so the schemas cannot reject it.

**`pack.yaml` and the pack directory:**
- `version` is `1.0.0` or later (§4);
- `id` equals the directory path under `packs/`, and `name` equals its last segment (§4, §6.2);
- the pack name is unique across the catalog (dl-004 1(a));
- `requires` has exactly one `base@^<major>` entry (§3) and at most one entry per pack id; no pack
  requires or conflicts with itself, or conflicts with a foundation pack (§6.3);
- `software` requires `base` only; every phase pack requires `software`; a pack that uses a Memory
  type, a workflow, a directive or a parameter of `software` outside a conditional part requires it
  (§3, §6.3);
- no `memory.yaml` fragment holds `template.frontmatter.exempt`, and `not_applicable_allowed` and
  `lists` name only fields the same fragment adds to `required` (§7.5);
- `requires_capabilities` is sorted;
- `contents.fragments` is in the order `dna`, `roles`, `memory`;
- `contents` and the conditional part's `contents` together match the files present, both ways,
  each file listed once (§6.4);
- `conditional`: at most one entry, on a non-foundation pack that does not require `software`,
  `with` naming `software@^<major>` and no pack of `requires` or `conflicts`; its `contents` holds
  `workflows` and `directives` only; the isolation rules of §6.5; a methodology's `delivery` in it
  when the methodology does not require `software`, in `contents` when it does;
- `formats` lists exactly the kinds of the files shipped, with the value each file declares (§5);
- the layout and path segments of §6.1, with no symbolic link or submodule;
- asset identifiers equal their file stems (§6.1);
- every `{{name}}` is in the pack's parameter scope (§8.1), checked per part (§6.5), and every
  default passes its type (§8);
- a phase pack ships its slot workflow, a methodology ships `delivery` (in its conditional part, or
  in `contents` when it requires `software`), and no other pack ships a slot name (§9);
- no pack other than `software` ships `sw-life-cycle` or a slot default, and no pack other than
  `base` ships `retrospective` or `governance-evolution` (§9, dl-022).

**`catalog.yaml`:**
- `foundation` is `[base, software]`;
- `path` equals `packs/<id>`, and pack ids are unique;
- `versions` are in ascending semver order, with unique versions;
- `transitions` appears only on versions of `stage` packs, and each of its digests recomputes from
  the transition file at the tag (§14);
- every `transitions[]` and `presets[]` index entry matches its file: id and path, and for
  transitions `from`, `to`, `formats` and `requires_capabilities`;
- every version entry matches the tagged `pack.yaml`, and its digest recomputes (§13);
- every `wingfoil` range recomputes from `compat.yaml` (§12).

**`compat.yaml`:**
- `releases` are in ascending order, with unique versions;
- every capability a release lists is in the `capabilities` vocabulary.

**Presets:**
- the resolved packs satisfy the cardinalities of §3: with `software`, exactly one methodology;
  without it, at most one methodology and no phase pack; at most one pack per slot, team-mode and
  stage;
- every parameter value passes the type of the parameter it sets (§8.1).

**Transitions:**
- `id` is `<from name>-to-<to name>`;
- `from` differs from `to`, and both are stage packs of the catalog.

## Execution Notes

- 2026-10-06, under plan-012: written together with `schema/*.schema.json`, and submitted after the
  schemas so that both say the same thing.
- **Checks run** on a scratch clone of this repository with the pinned WingFoil 0.2.2:
  - `format:` added to the configuration files: `workflow list`, `dna show` and `directives list`
    exit 0 but warn `unknown field(s) ignored: format`. This is the source of §12's `format_key`
    and of O10;
  - a Memory type whose `template.file` is under `memory/templates/built-in/`: `memory add` works and
    `workflow list` exits 0 (§7.6).
- **Schemas checked** with Python `jsonschema` 4.10 and ajv 2020 in strict mode (with union types
  allowed): they compile, and agree on 22 samples taken from this specification's examples. The 7
  valid samples pass and the 15 invalid ones fail, including:
  - an axis that does not match the id;
  - a missing `base` requirement;
  - a slot `operations`;
  - an `axis` on `base`;
  - a pre-release version;
  - a `..` path;
  - a `status` in `pack.yaml`;
  - an `active` pack without versions;
  - a hand-written open range;
  - `compat.yaml` without `format_key`.
- The digest test vector of §13 was computed twice, with the reference command and independently in
  Python, with the same result.
- Feedback note T17 (uncommitted) reports the contract to WingFoil.
- 2026-10-06: amended while `pending`, as the approver asked, after an independent review that
  requested changes. The changes:
  - **B1:** an incoming `states` on a type that follows `defaults` is a tightening of it, and the
    type then detaches (§7.5);
  - **S1:** sequences are checked against the reference sequence and merged as an order-preserving
    union, so independent overlays compose; a two-overlay example is added (§7.5);
  - **S2:** definitions and an "otherwise: fail" rule (§7.2, §7.5);
  - **S3:** the composed `workflows.yaml` is format 1 and enters the compatibility check (§7.7,
    §12);
  - **S4:** the two deviations the approver ruled are recorded in §1;
  - **S5:** exactly one `base@^<major>` (§3, §6.2, §6.3);
  - **S6:** §18 lists the lint checks per file kind, and the schemas gain the cheap constraints;
  - **S7:** every parameter value is validated, and `{{` is forbidden in every type (§8.1);
  - **nits:** the digest reference command checks file modes and is valid after `.gitattributes`;
    the test vector uses `1.0.0` (new digest
    `sha256:77a8a72717b5c73b556af940449ff91a609796079139ade0cb98ddf2ca81bd1c`, computed twice); the
    token list is open; the `compat.yaml` example and `notes`; the dl-153 citation; O11 and O12;
    transitions' `formats` and capabilities copied into the catalog; Kahn ordering (§7.1).
- Schemas re-checked after the amendment with Python `jsonschema` and ajv 2020 (strict, union types
  allowed). The two validators agree on 33 samples (7 valid, 26 invalid). The reviewer's 60
  edge cases were re-run.
- 2026-10-06: a re-review of the amendment found nothing blocking. B1 and S1–S7 are fixed, and the
  §7.5 merge was implemented independently and gives the documented results. Second amendment, from
  its findings:
  - a tightening of `defaults` now reaches types that already have their own machine derived from
    it, so an overlay reaches them all (§7.5, with an example);
  - `format:` is allowed in a `memory.yaml` fragment (§7.5);
  - an incoming `states` without `sequence` is defined (§7.5);
  - §18 gains: YAML integers (the schemas cannot reject `1.0`); `version` ≥ 1.0.0; the index entries
    and transition digests; the reserved names `sw-life-cycle` and `retrospective`;
  - the catalog schema fixes `overlay: false` on the `phase` axis.

  With these, every accept the reviewer found in the schemas is a §18 check.
- 2026-10-10, under plan-021 (dl-014 D6): the README line of §6.1 ("purpose, parameters,
  adaptation notes") is superseded by spec-002 ("Pack README and catalog index"), which fixes the
  README's sections and the generated catalog index. This specification is otherwise unchanged:
  the README stays a file of the pack, hashed into its digest (§13).
- 2026-10-10: §8.3 cites `docs/notes/base-regeneration-inputs.md` §2 for the project tokens
  `{release}` and `{scope}`. That note was removed (plan-022); the per-type path conventions it
  held are in dl-015 C10.
- 2026-10-13, erratum (plan-028, dl-020 R1): §4 says "`0.x` is allowed only while this
  specification is not approved (`pack-semver`)". `pack-semver` no longer states that clause, dead
  since this specification's approval; it now reads "Every published version is `1.0.0` or later
  (spec-001 §4, §18)". §4's citation of `pack-semver` is folded back by the next amendment of
  this specification.
- 2026-10-14, **amended in place** (plan-032, the approver's choice of 2026-10-14, as plan-031 did
  for spec-002; the merge OK of plan-032 is the approval of the edited text), after dl-021: §4 and
  §18 (the `0.x` erratum of 2026-10-13 folded back); §6.2 (no bundled packs, R1); §7.6 (no install
  folder in a pack, the `remote` class, R3; the `template.file` rule kept for format 1); §7.7 (the
  `include` folder follows §7.6); §11 and §14 (no `stage set`, no `stage-transitions`; a transition
  is the target overlay's workflow on a pack update, R2; the `transition` kind stays, descriptive,
  the approver's ruling); §16 (O3, O5, O12 re-owned; O13 new). §12 changes through task-028 with
  `compat.yaml`. WingFoil dl-177 (`b34f827f`) and dl-178 (`4d4c3221`, `662f6a4c`) are cited where
  dl-021 named dl-149 Action 3 and dl-164's mechanism.
- 2026-10-14, erratum (task-030, dl-020 R1): §15 says a preset is "selectable with
  `wingfoil init --preset <id>`", a verb WingFoil has not planned; how `init` selects a preset is
  this repository's request F-030 (refining F-006). Folded back by the next amendment of this
  specification.
- 2026-10-15, **amended in place** (plan-038, the approver's choice of 2026-10-15 to host it with
  dl-022's other actions; the merge OK of plan-038 is the approval of the edited text), after
  dl-022 and the final v0.3 formats (read at `wingfoil/wingfoil@ffa9bf6b`):
  - §1–§4, §6.2, §6.3: two foundation packs, `base` and `software`, outside the axes; the element
    `pack-foundation-software`; the requirements on `software`; the `methodology` axis exactly one
    with `software`, at most one without it;
  - §6.5 (new), with §6.2, §6.4, §7.7, §11, §12, §15, §17 and §18: the conditional part, by which a
    methodology's `delivery` exists only in a composition with `software` (dl-022 S3, the
    approver's rulings of 2026-10-15); O14 new;
  - §7.1: `software` composed right after `base`; §9: the slot defaults and `sw-life-cycle` shipped
    by `software`, `retrospective` and `governance-evolution` by `base`; §10: `software`'s section;
  - §7.5: WingFoil's other `memory.yaml` keys (`name`, `description`, `tags`, `amendable`, `fields`,
    `waiting`, `returns`, `limits`, `not_applicable_allowed`, `lists`) with their add-or-tighten
    rules, and `exempt` refused in a pack (the approver's ruling of 2026-10-15);
  - §5: the v0.3 formats (format 1 for every kind, keys a pack's range must know), and the format 1
    of `pack.yaml` and `catalog.yaml` kept through this amendment; §12: the other dl-149 kinds;
    §16: O4 settled;
  - §11: `foundation` names both packs, the `methodology` axis is `required_with: software`, the
    slots' default is `software`. **The example block of §11 is not changed by this amendment**:
    `tests/catalog.test.ts` holds `catalog.yaml`'s `axes` and `slots` equal to it, so the example,
    `catalog.yaml` and its schema change together in the tooling task that follows plan-038 (the
    approver's ruling of 2026-10-15, as task-028 did for §12). Until then the example and the prose
    differ;
  - §15: the erratum of task-030 folded back (no `init --preset`; F-030); presets with and without
    `software`; §18: the checks of all the above;
  - wording: §1 (dl-022 among the applied decisions), §7.3 (the methodology "when there is one"),
    the §7.5 example, the §8.1 example's comment and the namespace of a conditional part, §10 (the
    section of a pack with a conditional part);
  - §6.5, §9, §18: a methodology that requires `software` ships `delivery` in `contents`, and
    carries no conditional part (the approver's ruling of 2026-10-15, at the branch review).
  - Read again at `ffa9bf6b`: no v0.3 release is tagged, so O10 stands; WingFoil dl-137 and dl-138
    are `ready` and dl-138's Action 2 tech-spec does not exist yet, so O2, O5, O12 and O13 keep
    their owners.
