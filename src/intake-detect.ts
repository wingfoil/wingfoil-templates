// Red step stub (task-078): replaced by the implementation.
export interface DetectReport { code: number; lines: string[]; errors: string[] }
export function detectMissing(...args: [unknown, readonly string[]]): DetectReport {
  throw new Error(`not implemented (${String(args.length)} arguments)`);
}
