# {{project_name}}

This project is governed by WingFoil. Its configuration is in `.wingfoil/`; its decisions, tasks
and plans are its Memory.

- **Approvals are the approver's.** An agent never approves or rejects: it hands the approver the
  exact command to run.
- **Memory changes only through the WingFoil CLI** (`memory add`, `memory submit`, `memory park`,
  …; `memory approve` is the approver's), never by editing an element's state by hand.
- **Which workflow to start:**
  - a decision that changes no governance: `decision-log-ingest`;
  - a change of the project's governance (its `.wingfoil/`, this file outside its generated
    region, the roles, the Memory types): `governance-evolution`;
  - a retrospective: `retrospective-periodic`, which runs `retrospective`.
- Read the directives that apply to the role you act in before you change anything.
- **Precedence of directives.** The stricter rule always wins: a pack never loosens what another
  ships, and a directive only adds or tightens obligations. Precedence decides only between two
  rules that are not comparable by strictness (they ask for different things and neither contains
  the other); then, from the strongest:

  | Class | Directives |
  |---|---|
  | 1 `law` | directives that implement a law, whatever pack ships them |
  | 2 `standard` | directives that implement a safety or sector standard, whatever pack ships them |
  | 3 `security` | every directive whose subject is security, whatever ships it: `base`'s `security-secrets`, WingFoil's built-in `security`, a pack's security directives |
  | 4 `foundation` | the other directives of `base` and `software`, and WingFoil's other built-in directives |
  | 5 `governance` | `governance` and `blueprint` packs |
  | 6 `method` | the methodology and the phase packs |
  | 7 `overlay` | `team-mode` and `stage` |

  - Each directive states its class on its first line (`Precedence: <class>`). Classes 1 … 3
    follow the directive's subject, the others its pack or axis (`foundation` has no axis); a
    class-1 or class-2 directive names the law or standard it implements (`Precedence: law
    (<act>)`).
  - A bridge directive (a pack's directive that reconciles two packs) takes the highest class
    among the stricter pack's directives it reconciles.
  - The project's `custom/` directives declare their class, only add or tighten, never claim
    classes 1 … 3 to override a pack's rule of those classes, and never reuse a pack's directive
    id.
  - An agent that still meets a contradiction stops, does not choose, and opens a decision-log
    through `decision-log-ingest`; the approver rules, and a ruling that becomes a `custom/`
    directive is applied through `governance-evolution`.
