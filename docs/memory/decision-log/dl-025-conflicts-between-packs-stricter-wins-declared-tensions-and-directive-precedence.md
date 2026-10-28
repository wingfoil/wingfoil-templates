---
id: dl-025-conflicts-between-packs-stricter-wins-declared-tensions-and-directive-precedence
type: decision-log
title: "Conflicts between packs: stricter wins, declared tensions and directive precedence"
status: draft
tags: ["packs","composition","directives","format"]
---

## Context

On 2026-10-22 the approver observed that with many packs some will contradict each other, and
asked how that is handled. The example: **a rapid-prototyping pack used together with a stricter
pack**, here called **S**, for instance one that requires every requirement to carry an id and a
trace (`stage/prototype` with S).

What the format already handles (spec-001):
- **Cardinality** (§3): two methodologies, two stages or two team-modes cannot be composed.
- **`conflicts`** (§6.3): a pack names the packs it cannot live with; the composition fails.
- **Add or tighten** (§3, §7.2, §7.5): every pack only adds or tightens what the packs before it
  ship; nothing is ever removed; an incoming scalar must equal the base side's, or the composition
  fails. Overlays come last and can tighten everything. So the **structure is monotonic**: a
  `stage/prototype` composed after S cannot drop a required field, a state or a gate S added. On
  the structure, **the stricter always wins**, and a real structural clash fails the composition
  rather than being guessed (§7.2 "Otherwise: fail").
- **F3.5 "no contradictions between overlays"** (`src/overlay-rules.ts`, task-012): every
  methodology × team-mode × stage combination is composed and a refusal is a problem.

What it does not handle:
1. **Semantic tension in directives.** Directives are prose and are copied whole (§7.6); nothing
   compares them. A prototype directive saying "skip formal specifications, move fast" and S's
   directive saying "every requirement has an id and a trace" both land in the project. The agent
   receives contradictory instructions, and the composition says nothing.
2. **The intent of a lighter pack is silently defeated.** Because the structure is monotonic, a
   prototype composed with S gets every gate S ships. That is safe, but the project does not get
   the prototyping it chose, and nobody is told.
3. **Coverage.** F3.5 composes overlays with methodologies only; the packs of the other axes
   (`phase`, `blueprint`, `governance`) are composed once each, with `base` and the first
   methodology (task-012). Pairs among them are never tried.

The tension is legitimate, not an error: a team may well prototype a product that a strict process
governs. Regulated sectors commonly keep exploratory prototypes out of the released product, and
let the process apply to what is released; a pack should express that, not forbid the pair.

## Options

- **(a) Status quo.**
  - Against: the three gaps stay; agents resolve contradictions by guesswork.
- **(b) Declare `conflicts` between every lighter pack and every stricter one.**
  - For: no format change.
  - Against: it forbids the legitimate combination; the number of pairs grows with the catalog.
- **(c) Four layers: stricter wins on the structure (as today), a directive precedence, declared
  tensions with their resolution, and bridges shipped by the later pack; plus an escalation rule
  for what remains.**
  - For: keeps the legitimate combinations; makes every tension visible at composition and in the
    catalog; gives agents a rule instead of a guess.
  - Against: a new `pack.yaml` key, conditional parts on packs other than `software`, and a lint
    extension.
- **(d) Leave it to the agents at run time**: an agent that meets a contradiction asks the
  approver.
  - Against: alone, it pushes every contradiction to run time and repeats it in every project.
    It is kept in (c) as the last layer.

## Decision

**Proposed: option (c).** The approver rules at `memory approve`.

### D1 — Stricter wins on the structure (unchanged)

The add-or-tighten rule stays as spec-001 states it. It is restated in the `pack-authoring`
directive as the first answer to a conflict: a pack never loosens what another ships, and a
structural clash fails the composition.

The same rule is extended to **directives**, as an authoring rule: a directive only adds or
tightens obligations. It never says that another pack's rule is waived, skipped or optional. A
lighter pack expresses lightness only where no stricter pack speaks, or through a bridge (D4).
Lint, as a heuristic: an overlay or a `stage/*` directive that uses waiver wording ("skip",
"not required", "optional", "ignore") about something it does not ship is reported for review.

### D2 — Directive precedence, as a tie-break only

**The stricter rule always wins (D1).** Precedence decides only between two rules that are not
comparable by strictness: they ask for different things and neither contains the other (two
formats for the same record, two places for the same evidence). Then, from the strongest:

| Class | Directives |
|---|---|
| 1 `law` | directives that implement a law, whatever pack ships them |
| 2 `standard` | directives that implement a safety or sector standard, whatever pack ships them |
| 3 `security` | every directive whose subject is security, whatever ships it: `base`'s `security-secrets`, WingFoil's built-in `security`, a pack's security directives |
| 4 `foundation` | the other directives of `base` and `software`, and WingFoil's other built-in directives |
| 5 `governance` | `governance` and `blueprint` packs |
| 6 `method` | the methodology and the phase packs |
| 7 `overlay` | `team-mode` and `stage` |

- **By subject for classes 1–3, by axis for the others.** A directive's class follows its pack's
  axis, except classes 1–3, which follow the subject. Each directive states its class on its first
  line ("Precedence: law"), so an agent reads it without knowing the catalog. A class-1 or class-2
  directive names the law or standard it implements, and review checks the claim.
- **A bridge directive (D4) takes the highest class among the directives it reconciles**, not the
  class of the pack that ships it: a bridge that `stage/prototype` ships for S takes the class of
  the strictest S directive it resolves against.
- **The project's `custom/` directives** declare their class; they may only add or tighten, like a
  pack (D1), and they never claim class 1–3 to override a pack's rule of those classes. They are
  where the approver records an escalation (D5).
- The precedence is **not** the composition order of §7.1: the composition order decides the
  structure (later packs tighten), the precedence decides ties between prose rules.

Where it lives, without any WingFoil change: `base`'s AGENTS.md section (spec-001 §10) states the
table and the tie-break rule; each directive carries its first line. A directive frontmatter key
would be cleaner, but WingFoil warns on an unknown key (`unknown field(s) ignored`), which the
compatibility matrix does not allow; it is left for a later feedback note, once the classes have
been used.

### D3 — Declared tensions

A new optional `pack.yaml` key, `tensions`, lists the packs this pack combines with only with care.
In S's `pack.yaml`:

```yaml
tensions:
  - pack: stage/prototype
    resolution: "Exploration is allowed in the exploration scope only; nothing in it is released
      before the requirements are traced (bridge in stage/prototype and stage/production)."
```

- The stricter pack declares the tension, since it knows its constraints; a `tensions` entry never
  makes a composition fail.
- The composer prints each tension the composition holds, with its resolution, as a notice.
- The catalog index and the pack README (spec-002) show them under "Combines with care"; the
  initialization template (dl-011) asks the user about them.
- `conflicts` stays for real incompatibilities only, where no resolution exists.

### D4 — Bridges, shipped by the later packs

A resolution that needs content is a **bridge**. §7.1 forbids requiring a later pack, and a
conditional part's `with` counts as a requirement, so a bridge is shipped by a pack **composed
later** than the stricter one. Bridges ship **directives and workflows only**: fragments are never
conditional (§6.5), so a bridge adds no Memory type and tightens none.

For the approver's example the bridge has two halves, because a stage change is a pack update and
the transition belongs to the target stage (§14, dl-021 R2): while the project moves to
production, `stage/prototype` is being replaced.

- **`stage/prototype`** ships the exploration rules, in a conditional part `with: S@^1`, as a
  bridge directive:
  - exploration happens only in a declared exploration scope (a parameter); its elements are
    tagged `exploratory`;
  - requirements are captured lightly but always get an id and a trace, so nothing has to be
    reconstructed later;
  - what the prototype skips is recorded as debt in the existing elements (a "Debt" section or a
    tag), not in a new Memory type.
- **`stage/production`** ships the exit check, in a conditional part with the same `with`: its
  transition workflow `prototype-to-production` gains a step, before the swap, that checks the
  debt is cleared (requirements traced, verification evidence present). The transition file's
  `pre_checks` stay descriptive in format 1 (§14); the step in the workflow is what runs.

When several stricter packs all require one common pack that carries the shared constraint, **one**
condition on that common pack covers all of them, and the bridge stays small. A stricter pack
without such a common pack carries its own condition in the same two halves, stating its own
exploration limit (for example: a kind of data never enters the exploration scope, or its required
assessment is done before it does).

**The format change this needs** (§6.5 and §18, format 1 allow one entry, `with: software@^<major>`,
on a pack that does not require `software`):
- several conditional entries per pack;
- `with` naming any pack composed earlier, not only `software`;
- the "Who" rule relaxed: a pack that requires `software` may carry entries whose `with` is
  another pack;
- the isolation rules of §6.5 applied per entry; the lint of §18 amended to match.

### D5 — Escalation for what remains

An agent that still meets a contradiction after D2 stops, does not choose, and opens a
decision-log through `base`'s `decision-log-ingest`. The approver rules; the ruling may become a
project `custom/` directive (D2) so the question is not asked again.

### D6 — Coverage

F3.5 is extended: each pack is composed with every pack its `tensions` name and with each
`stage/*` overlay. Not the full Cartesian product: only the declared and the known-risky pairs.

### D7 — What this decision implies, after approval

- spec-001: `tensions` in §6.2; §6.5's conditional part generalised as D4 lists (entries, `with`,
  the "Who" rule, isolation per entry) and §18's lint to match; D2's table in §10's guidance for
  `base`'s section; `schema/pack.schema.json`, with the feedback note `wingfoil-cli` rule 8
  requires;
- spec-002: the "Combines with care" section and its index field;
- `pack-authoring`: D1's directive rule, D2's first-line class and the named law or standard of a
  class-1 or class-2 directive;
- the F3.5 lint: D1's heuristic and D6's coverage;
- the charters of `stage/prototype` and `stage/production`, and of each stricter pack that declares
  a tension, when opened: D4's two halves. `stage/prototype` and `stage/production` are in the
  first scope (W12): the halves for a stricter pack arrive with them only if that pack exists by
  then; otherwise they arrive in a later minor release of each stage.

## Execution Notes

- 2026-10-22: drafted at the approver's request. An independent review of the draft (dl-017),
  verdict "approve after substantial amendments", was applied before submission: D2 made a
  tie-break between rules not comparable by strictness, with classes by axis plus classes by
  subject, foundation and built-in directives ranked, bridge directives taking the stricter pack's
  class, and project directives never above class 3; D4 split in two halves, since the transition
  belongs to the target stage (§14, dl-021 R2), with the format change spelled out (several
  entries, any earlier `with`, the "Who" rule, §18) and no Memory type in a bridge (fragments are
  never conditional).
- 2026-10-24: text revised for submission: the examples are generic (a stricter pack S), D2's
  classes 1–2 are defined by subject like class 3, D6 names only the declared tensions and the
  stage overlays. Second independent review (dl-017) of the revised text, verdict "approve after
  amendments", 0 blocking, 3 should-fix, 0 nit, all applied before submission: a bridge takes the
  highest class among the directives it reconciles; a class-1 or class-2 directive names its law or
  standard (D2, D7); gap 3 matches task-012's compositions.
- 2026-10-28, plan-053: added to this repository from the text the approver ruled on 2026-10-24
  that this repository add after W9, relayed by the coordinating session (re-sent unchanged on
  2026-10-28, the first copy lost with the session that queued it). The number is the one the text
  gives. Changes to the received text: the frontmatter `status` is this repository's (`draft` until
  `submit`), and none to the prose; the table rows stay over 100 characters. No word changed.
