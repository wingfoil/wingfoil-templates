/** The Node.js warnings `body` emits; the 'warning' event arrives on the next tick (task-070). */
export async function warningsOf(body: () => void): Promise<string[]> {
  const warnings: string[] = [];
  const listener = (warning: Error): void => { warnings.push(warning.message); };
  process.on('warning', listener);
  try {
    body();
    await new Promise((resolve) => setImmediate(resolve));
  } finally {
    process.off('warning', listener);
  }
  return warnings;
}
