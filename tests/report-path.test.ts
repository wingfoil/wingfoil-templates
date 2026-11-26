import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { ReportPathError, checkReportPath } from '../src/report-path';
import { TestRepo } from './support/git-repo';

function kindOf(report: string, top: string): string {
  try {
    checkReportPath(report, top, top);
    return 'outside';
  } catch (error) {
    assert.ok(error instanceof ReportPathError);
    assert.equal(error.path, report);
    return error.kind;
  }
}

describe('the report path rule (task-106, dl-044 P1, dl-054 P1)', () => {
  it('tells a path inside, a dangling link and a path outside apart', () => {
    const repo = new TestRepo();
    const outside = mkdtempSync(join(tmpdir(), 'report-path-'));
    try {
      symlinkSync(join(repo.dir, 'none.txt'), join(outside, 'dangling'));
      symlinkSync(repo.dir, join(outside, 'to-repo'));
      assert.equal(kindOf(join(repo.dir, 'r.txt'), repo.dir), 'inside');
      assert.equal(kindOf(join(outside, 'to-repo', 'r.txt'), repo.dir), 'inside');
      assert.equal(kindOf(join(outside, 'dangling'), repo.dir), 'dangling');
      assert.equal(kindOf(join(outside, 'r.txt'), repo.dir), 'outside');
      assert.equal(checkReportPath(join(outside, 'x', '..', 'r.txt'), repo.dir, repo.dir),
        join(outside, 'r.txt'));
    } finally {
      rmSync(outside, { recursive: true, force: true });
      repo.dispose();
    }
  });
});
