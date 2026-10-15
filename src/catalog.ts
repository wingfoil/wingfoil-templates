// catalog.yaml (spec-001 §11): the foundation packs, axes, cardinalities and slots are read from
// it, never hard-coded (§3). `foundation` names the core and the software layer, in composition
// order; the order of `axes` is the composition order after them (§7.1).
import { repositorySchemas } from './schemas';
import { loadYamlFile } from './yaml-load';

/** catalog.yaml breaks its schema. */
export class CatalogError extends Error {}

export interface AxisSpec {
  name: string;
  cardinality: 'one' | 'one-per-slot' | 'many';
  /** Required in every composition. */
  required: boolean;
  /** Required only in a composition holding this foundation pack (`required_with`). */
  requiredWith?: string;
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
  /** The foundation packs in composition order: the core, then the software layer (§3). */
  foundation: string[];
  axes: AxisSpec[];
  slots: SlotSpec[];
  /** The file as parsed, for checks that compare it with spec-001. */
  raw: Record<string, unknown>;
}

interface RawAxis {
  cardinality: AxisSpec['cardinality'];
  required?: boolean;
  required_with?: string;
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
      required: axis.required ?? false,
      overlay: axis.overlay ?? false,
    };
    if (axis.required_with !== undefined) spec.requiredWith = axis.required_with;
    if (axis.slots !== undefined) spec.slots = axis.slots;
    return spec;
  });
  const slots = Object.entries(raw['slots'] as Record<string, RawSlot>).map(([name, slot]) => {
    const spec: SlotSpec = { name, includedBy: slot.included_by, filledBy: slot.filled_by };
    if (slot.default !== undefined) spec.default = slot.default;
    return spec;
  });
  return { foundation: raw['foundation'] as string[], axes, slots, raw };
}

/** The core foundation pack, in every composition (spec-001 §3): `base`. */
export function corePack(catalog: Catalog): string {
  return catalog.foundation[0] ?? '';
}

/** The software foundation layer, in a composition only when asked for (spec-001 §3). */
export function softwarePack(catalog: Catalog): string {
  return catalog.foundation[1] ?? '';
}

/** Whether a catalog pack id is a foundation pack, outside the axes (spec-001 §3, §6.2). */
export function isFoundation(catalog: Catalog, id: string): boolean {
  return catalog.foundation.includes(id);
}
