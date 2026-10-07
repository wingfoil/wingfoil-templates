// catalog.yaml (spec-001 §11): the axes, cardinalities and slots are read from it, never
// hard-coded (§3). The order of `axes` is the composition order after base (§7.1).
import { repositorySchemas } from './schemas';
import { loadYamlFile } from './yaml-load';

/** catalog.yaml breaks its schema. */
export class CatalogError extends Error {}

export interface AxisSpec {
  name: string;
  cardinality: 'one' | 'one-per-slot' | 'many';
  required: boolean;
  overlay: boolean;
  /** The slots of an axis of cardinality one-per-slot, in composition order. */
  slots?: string[];
}

export interface SlotSpec {
  name: string;
  includedBy: string;
  /** The pack that ships the slot's default workflow, if any. */
  default?: string;
  /** The axis whose packs fill the slot. */
  filledBy: string;
}

export interface Catalog {
  foundation: string;
  axes: AxisSpec[];
  slots: SlotSpec[];
  /** The file as parsed, for checks that compare it with spec-001. */
  raw: Record<string, unknown>;
}

interface RawAxis {
  cardinality: AxisSpec['cardinality'];
  required: boolean;
  overlay?: boolean;
  slots?: string[];
}

interface RawSlot {
  included_by: string;
  default?: string;
  filled_by: string;
}

export function loadCatalog(path: string): Catalog {
  const loaded = loadYamlFile(path, path);
  const errors = repositorySchemas().validate('catalog', loaded.data);
  if (errors.length > 0) {
    const first = errors[0];
    const where = first?.instancePath ?? '';
    throw new CatalogError(`${path}: not a valid catalog: ${where} ${first?.message ?? ''}`);
  }
  const raw = loaded.data as Record<string, unknown>;
  const axes = Object.entries(raw['axes'] as Record<string, RawAxis>).map(([name, axis]) => {
    const spec: AxisSpec = {
      name,
      cardinality: axis.cardinality,
      required: axis.required,
      overlay: axis.overlay ?? false,
    };
    if (axis.slots !== undefined) spec.slots = axis.slots;
    return spec;
  });
  const slots = Object.entries(raw['slots'] as Record<string, RawSlot>).map(([name, slot]) => {
    const spec: SlotSpec = { name, includedBy: slot.included_by, filledBy: slot.filled_by };
    if (slot.default !== undefined) spec.default = slot.default;
    return spec;
  });
  return { foundation: raw['foundation'] as string, axes, slots, raw };
}
