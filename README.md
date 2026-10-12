# WingFoil-Templates

The official catalog of template packs for WingFoil: the WingFoil CLI downloads them to configure a
project's `.wingfoil/` (its DNA, Memory types, directives and workflows), once a release provides
it; until then each pack README gives the hand steps. Packs come on the axes of
[`catalog.yaml`](catalog.yaml): methodologies, phase methods, project blueprints, governance packs,
and the team-mode and stage overlays, all on top of the foundation pack `base`.

## The catalog

- **For people:** [`CATALOG.md`](CATALOG.md) lists the published packs, by axis, with their
  presets, transitions and adoption profiles; each pack links its README at its latest version.
- **For agents:** [`llms.txt`](llms.txt) is the entry point, also at
  `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/llms.txt`. It leads to the
  machine index [`catalog-index.json`](catalog-index.json) and to each published version's README
  and `pack.yaml`, pinned to its tag; no server or token is needed.

The first pack, `base`, is published only after WingFoil v0.3 is released.

## The specifications

- [spec-001](docs/memory/tech-spec/spec-001-the-pack-format-manifest-fragments-composition-catalog-compatibility-and-digest.md):
  the pack format, its manifest and fragments, composition, the catalog, compatibility and the
  digest.
- [spec-002](docs/memory/tech-spec/spec-002-pack-readme-and-catalog-index.md): the pack README and
  the catalog index.

## Working in this repository

The tooling is TypeScript on Node.js 22.12 or later ([adr-002](docs/memory/adr/adr-002-repository-tooling-in-typescript-on-node.js-22.12-or-later.md)).
After `npm ci` and `npm run build`, the main commands are:

- `npm run validate`: the one validation command, which checks the schemas, the lint and the
  index, and composes every preset and example twice and runs them through the compatibility
  matrix;
- `npm run check:packs`: the lint rules alone;
- `npm run index`: writes `CATALOG.md`, `catalog-index.json`, `llms.txt` and the generated
  sections of each pack README (`--check` compares them);
- `npm run compose`: composes packs into a `.wingfoil/` configuration;
- `npm run publish:pack`: publishes a pack version, after its release is approved.

The work follows the repository's own process:

- the vision, features and sequencer: [`docs/01_vision/`](docs/01_vision/);
- the decisions, specifications, tasks and other Memory elements: [`docs/memory/`](docs/memory/);
- the phase plans: [`docs/plans/`](docs/plans/);
- the workflows: [`.wingfoil/workflows/`](.wingfoil/workflows/);
- the feedback inbox for WingFoil: [`docs/wingfoil-feedback/`](docs/wingfoil-feedback/).

The repository does not take outside pull requests for now; contributions open later as Memory
elements ([`03_is-isnot.md`](docs/01_vision/03_is-isnot.md)).

## License

MIT, as [`package.json`](package.json) declares.
