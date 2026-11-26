// The rule of a report's path outside the repository (dl-044 P1, dl-054 P1): a stub (dl-018).

export type ReportPathKind = 'inside' | 'dangling';

export class ReportPathError extends Error {
  constructor(readonly kind: ReportPathKind, readonly path: string) {
    super(`${path}: ${kind}`);
  }
}

export function checkReportPath(report: string, _top: string, _tree: string): string {
  return report;
}
