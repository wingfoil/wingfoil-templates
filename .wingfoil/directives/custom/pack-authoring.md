---
id: pack-authoring
name: pack-authoring
type: directive
kind: custom
title: "Pack authoring"
tags: [packs]
---

# Pack authoring

Applies to every role that writes or reviews pack content under `packs/`.

- Pack names are unique across the whole catalog, whatever the axis or slot, because the `pack`
  Memory element id is `pack-{axis}-{name}` (dl-004). The foundation packs `base` and `software` are
  the elements `pack-foundation-base` and `pack-foundation-software`: `foundation` is the value of
  their element's `axis` field, while in `pack.yaml` and `catalog.yaml` both stay outside the axes
  (dl-022).
- Every pack lives in `packs/<axis>/[<slot>/]<name>/` and has a `pack.yaml`, a `README.md` and a
  `CHANGELOG.md`. Its `pack.yaml` validates against `schema/pack.schema.json`.
- A pack's `README.md` follows spec-002 §2 (dl-014 D1): its nine sections, in order. The generated
  ones (title, composition, what it adds, parameters) are written by `npm run index` from the pack's
  own files, never by hand. It holds no WingFoil CLI command; while no release listed in
  `compat.yaml` provides `pack-install`, its "Install and update" section gives the hand steps,
  marked temporary.
- Every example in a README is a fixture, `tests/fixtures/examples/<pack name>/<example>/`, that the
  validation command composes and validates, about a clearly fictional project (spec-002 §2.4,
  dl-014 CB-2). Its fictional names are not project values.
- A pack names no install folder: its asset paths are relative to each kind (directives,
  workflows, Memory templates); `pack-install` will map them into WingFoil's `remote` class once
  WingFoil dl-138's Action 2 tech-spec fixes it (dl-021 R3, spec-001 §7.6, O12). `built-in/` is
  WingFoil's own. Until then the reference composer maps packs as spec-001 §7.6 states for format
  1, and a Memory template's `template.file` keeps its format-1 path (spec-001 O13). A pack never
  writes `custom/`: that is where projects override it, and an update must be able to replace pack
  files without touching theirs.
- `pack.yaml` declares the `formats` of every file kind the pack ships and the WingFoil
  `requires_capabilities` it relies on, from the `compat.yaml` vocabulary (dl-002). Content uses
  only what those formats and capabilities provide.
- No project-specific values: names, paths, people and versions of the target project are
  parameters, declared in `pack.yaml` with a type, and a default unless the parameter is required
  (spec-001 §8.1).
- Composition is deterministic: no timestamps, no randomness, no ordering that depends on the
  filesystem. Lists in fragments are written in the order they must appear.
- A workflow includes another workflow by **name**, never by path (WingFoil bug-144). Every
  `include`, every role, every Memory type and every directive id a pack references is shipped by the
  pack itself or by a pack it `requires`.
- A pack declares what it `requires` and what it `conflicts` with; one methodology and one pack per
  phase slot per project.
- Every workflow phase that should create or move an element says so with `actions` and `produces`:
  a phase that parses but declares none of `include`, `actions`, `produces` and `approval` is a
  defect (WingFoil benchmark note N1); a phase with an `approval` alone is a checkpoint, a gate.
- Every pack except `base` requires `base` (`requires: [base@^<major>]`) and only adds to it or
  tightens it (dl-003 D1). `software` requires `base` only. Every phase pack requires `software`,
  and so does every pack that uses a Memory type, a workflow, a directive or a parameter of
  `software` outside a conditional part (spec-001 §3, §6.3; dl-022 S3). Overlays (`team-mode`,
  `stage`) only add or tighten relative to everything else; they never remove what a methodology
  ships. In a Memory state machine, adding a state or a gate is allowed; removing either is not.
- A pack that does not require `software`, and whose content only makes sense with it (a
  methodology's `delivery`), declares that content in a `conditional` entry, `with:
  software@^<major>` (spec-001 §6.5): it counts only in a composition holding `software`, and
  nothing outside it uses that content or anything of `software`'s. A pack that requires `software`
  ships everything in `contents`. In `pack.yaml` format 2 (spec-001 §5) a pack may carry several
  entries, each naming a pack composed earlier, one entry per pack id; each entry is isolated from
  what is always composed and from the other entries. A new pack is written at format 2, which the
  reference composer reads (spec-001 §5); a published pack stays at format 1 unless it needs a key
  of format 2, and moving to format 2 is a major release (`pack-semver`).
- Slots (dl-003 D4, D11). They exist only with `software`. `sw-life-cycle` and the slot defaults
  belong to `software`, `retrospective` and `governance-evolution` to `base` (dl-022).
  `sw-life-cycle` includes `inception`, `specification`, `delivery` and `end-of-life` by name; the
  methodology's `delivery` includes `release` and `retrospective` by name, at its own cadence,
  directly or through sub-workflows the methodology ships, at any depth, in the same part (dl-026),
  and every phase that includes `release` iterates over `release` with
  `status: [in-development, releasing]`, any other `where` key being a frontmatter field the
  composed `release` type declares (dl-027). A phase pack fills one of the slots `inception`,
  `specification`, `release`, `end-of-life` by shipping a workflow with the slot's name; this is the
  one case where a pack file replaces another pack's file. `delivery` is filled by the methodology,
  never by a phase pack: in its conditional entry, or in `contents` when the methodology requires
  `software`.
- `AGENTS.md` and every agent file at the repository root are never pack files (dl-003 R1). A pack
  contributes at most one section (`agents_section`), and WingFoil generates the file (WingFoil
  dl-137).
- **Conflicts between packs** (dl-025). The stricter rule wins: a pack never loosens what another
  ships, and a directive only adds or tightens obligations; it never says that another pack's rule
  is waived, skipped or optional (D1). A lighter pack expresses lightness only where no stricter
  pack speaks, or through a bridge: a conditional entry of a pack composed later than the stricter
  one, with directives and workflows only (spec-001 §6.5). Waiver wording ("skip", "not required",
  "optional", "ignore") in an overlay's or a `stage/*` pack's directive about something it does not
  ship is reported for review, a bridge exempt (spec-001 §18): `npm run check:packs` prints these
  hits as `review:` lines, its exit unchanged, and at `pack-release-cycle` › `prepare` the
  `pack-release` element's review records each hit with its verdict. The stricter pack declares a
  combination that needs care in `tensions`, with its resolution (format 2, spec-001 §6.2);
  `conflicts` stays for real incompatibilities. What remains after the precedence is escalated,
  never chosen (spec-001 §10.1): a decision-log, and a ruling that becomes a project `custom/`
  directive is applied through `governance-evolution`.
- **Precedence line** (dl-025 D2, spec-001 §10.1). A directive's first line after its `# ` title is
  `Precedence: <class>`, one of `law`, `standard`, `security`, `foundation`, `governance`, `method`,
  `overlay`; a class-1 or class-2 directive names what it implements, `Precedence: law (<act>)` or
  `Precedence: standard (<standard>)`, and a directive that only partly implements a law is split.
  Classes 1 … 3 follow the subject, the others the pack or axis (`foundation` has no axis); a bridge
  directive takes the highest class among the stricter pack's directives it reconciles, and a target
  stage's bridge directive carries `tags: [exit-check]` (spec-001 §6.5, §14). A project's `custom/`
  directive never reuses the id of a pack's directive. Review checks the line for every pack version
  prepared after 2026-11-05 (plan-063 ruling 6); the four packs published before carry it from their
  next minor release, classed minor.
- **MCP servers** (dl-024, spec-001 §7.8). A pack declares servers and never ships server code: a
  pinned package version or a `url`, environment variable names only, read access unless write
  tools are listed, a write tool only in phases behind their approval gate, `vendor_hosted` with
  `data_location` for a server that sends data to its vendor. The official catalog lists only
  servers published by the vendor of the resource or by a maintained open-source project (D4).
  Until a release reads the `mcp` kind, the pack ships a directive on how to use the server and the
  server entry in its README's section 3, for a copy of a built-in adapter under a name of the
  project's own (spec-002 §2.3).
