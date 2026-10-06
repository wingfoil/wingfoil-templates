---
id: ""
type: pack-release
title: ""           # "<axis>/<name> <version>"
status: draft
pack: ""            # the pack element id (pack-<axis>-<name>)
version: ""         # the semver being published
bump: ""            # major | minor | patch (pack-semver directive)
wingfoil: ""        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: ""            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
---

## Changes

<!-- What changed since the previous version, each line classified major/minor/patch. Copied into
     the pack's CHANGELOG.md. -->

## Validation

<!-- The compatibility matrix: every WingFoil version tested, every preset composed, the
     determinism double-run, with the commands and their exit codes. -->

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. Whether the pack is one
     WingFoil bundles (and the feedback note sent for WingFoil's advance-bundled-packs step). -->

## Execution Notes
