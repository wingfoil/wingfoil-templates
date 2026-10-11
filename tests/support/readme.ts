// A pack README that follows spec-002 §2 (task-018), for fixtures and synthesized trees. The
// generated sections hold placeholder content until `npm run index` writes them (plan-024 task 2);
// section 7 holds a placeholder line until examples are fixtures (plan-024 task 4).

export const CATALOG_URL = 'https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md';
export const TEMPORARY_MARK = '> **Temporary:** these hand steps are replaced by WingFoil\'s '
  + 'commands once a release provides them.';

export interface ReadmeFacts {
  id: string;
  title: string;
  description: string;
}

function axisLine(id: string): string {
  if (id === 'base') return 'Axis: foundation';
  const segments = id.split('/');
  return segments[0] === 'phase' ? `Axis: phase · Slot: ${segments[1] ?? ''}`
    : `Axis: ${segments[0] ?? ''}`;
}

function generated(name: string, body: string): string {
  return `<!-- generated:begin ${name} -->\n${body}<!-- generated:end ${name} -->\n`;
}

export function conformingReadme(facts: ReadmeFacts): string {
  const anchor = `pack-${facts.id.replaceAll('/', '-')}`;
  return [
    generated('title', `# ${facts.title}\n\n${facts.description}\n\n${axisLine(facts.id)}\n`),
    '## When to use it\n\nA test fixture of the tooling; never adopted.\n',
    `## Install and update\n\n${TEMPORARY_MARK}\n\n`
      + `See the [Install block](${CATALOG_URL}#install) of the catalog.\n`,
    generated('composition', '## Composition\n\nPlaceholder until npm run index writes it.\n'),
    generated('what-it-adds', '## What it adds\n\nPlaceholder until npm run index writes it.\n'),
    generated('parameters', '## Parameters\n\nPlaceholder until npm run index writes it.\n'),
    '## Examples\n\nPlaceholder until the examples are fixtures.\n',
    '## Sources and adaptations\n\nNone: written for this catalog.\n',
    `## Versions\n\n- [Changelog](CHANGELOG.md)\n- [Catalog entry](${CATALOG_URL}#${anchor})\n`,
  ].join('\n');
}
