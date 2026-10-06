# MVP Canvas — WingFoil-Templates

**Version:** 1.0
**Date:** 2026-10-06
**Status:** Draft
**Traces to:** [07_sequencer.md](07_sequencer.md) (milestones M0–M3), [01_product-brief.md](01_product-brief.md)

---

## MVP proposal

**The first official catalog, ready when WingFoil v0.4 installs packs.** It contains:
- the pack format and its schemas, approved;
- one command that composes and validates packs against every compatible WingFoil release;
- `base` and `governance/wingfoil-dogfood`, adopted by the four governed repositories;
- the first scope, published and validated:
  - `scrum`, `kanban`;
  - `agent-first`;
  - `lean-inception`, `bdd-sbe`;
  - `web-service`, `cli-library`;
  - `prototype`, `production`, and the transition between them.

## Segmented personas

- **Governed-repository maintainer** (primary until v0.4): one shared foundation across the four
  repositories.
- **WingFoil maintainer** (primary until v0.4): versioned packs to bundle, and a true `compat.yaml`.
- **Adopter** (primary from v0.4): a validated project from one `init`.
- **Pack author** and **agent**: the format, the tooling and content written for an agent reader.

## Journeys

- J1 — Author and publish a pack
- J2 — Adopt `base` by hand
- J3 — Bundle packs into a WingFoil release
- J4 — Record a WingFoil release
- J5 — Work a phase under a composed configuration
- J6, J7 — Start from a preset; add a pack, upgrade (from v0.4)

## Features

The 32 features of waves W1–W12 in [07_sequencer.md](07_sequencer.md). In short:

- the format (manifest, fragments, parameters, slots, `format:` key, AGENTS.md section, schemas);
- the catalog (tags, digests, `compat.yaml`, computed ranges, presets);
- the tooling (reference composer, one validation command, matrix, determinism, lint, CI);
- the release process (evidence, release intake, line policy, feedback notes);
- the content: `base`, `wingfoil-dogfood` and the first scope.

## Expected result

- The four governed repositories run on `base` and record its version.
- WingFoil bundles packs published here instead of its compiled templates.
- From v0.4, a new project validates on its first `init` from a preset.

## Metrics to validate the MVP

| Hypothesis | Metric | Target |
|---|---|---|
| The format is enough for real projects | governed repositories on `base`, recorded in their Memory | 4 of 4 |
| Packs replace the compiled templates | WingFoil release that bundles packs from here | the first release that installs packs |
| Composition is deterministic | presets composed twice from a clean state, byte-identical | 100% |
| Packs validate where they claim | compositions passing the matrix with exit 0 and no warning | 100% of published versions |
| Packs work for an agent | phases completed in a composed project with no process correction from the approver | observed in the governed repositories (no target yet) |
| People use the catalog | clone and view traffic of the repository (F7.3) | observed after v0.4 (no target yet) |

## Cost and schedule

- **Build effort:** 12 waves. No dates are fixed.
- **Main uncertainty:**
  - W2: the fragment merge;
  - W4: the capability vocabulary;
  - W5: the reference composer;
  - W8: the AGENTS.md markers;
  - W12: `agent-first`.
- **Dependencies on WingFoil:**
  - the v0.3 formats, for W8;
  - the v0.3 release, to publish `base`;
  - dl-137's part-(b) tech-spec, for the AGENTS.md markers;
  - the capability names (notes T13);
  - v0.4, for J6–J7;
  - the composer proposal (notes T15).
- **Run cost:** the validation matrix installs pinned WingFoil releases, and there are no paid
  services.
