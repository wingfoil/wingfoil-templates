// compat.yaml (spec-001 §12, dl-002): what each released WingFoil reads and provides. The matrix
// selects its releases from it (task-011). Beyond the schema, two checks of spec-001 §18 that the
// selection needs: releases strictly ascending, and release capabilities from the vocabulary.
import { checkAscending } from './range';
import type { CompatRelease } from './range';
import { repositorySchemas } from './schemas';
import { loadYamlFile } from './yaml-load';

/** compat.yaml breaks its schema or a check beyond it. */
export class CompatError extends Error {}

export interface Compat {
  kinds: Record<string, string>;
  capabilities: Record<string, string>;
  releases: CompatRelease[];
}

export function loadCompat(path: string): Compat {
  const loaded = loadYamlFile(path, path);
  const errors = repositorySchemas().validate('compat', loaded.data);
  if (errors.length > 0) {
    const first = errors[0];
    throw new CompatError(`${path}: not a valid compat file: ${first?.instancePath ?? ''} `
      + `${first?.message ?? ''}`);
  }
  const compat = loaded.data as Compat;
  try {
    checkAscending(compat.releases);
  } catch (error) {
    throw new CompatError(error instanceof Error ? error.message : String(error));
  }
  for (const release of compat.releases) {
    for (const name of release.capabilities) {
      if (!Object.hasOwn(compat.capabilities, name)) {
        throw new CompatError(`compat.yaml: release ${release.wingfoil}: capability ${name} is `
          + 'not in capabilities');
      }
    }
  }
  return compat;
}
