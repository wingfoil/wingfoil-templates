// Lint (adr-004): type-aware correctness rules and the determinism rules, no style rules.
// `npm run lint` runs `eslint --max-warnings 0 .`, on the newest Node.js 22.x.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const DETERMINISM = 'determinism directive: no wall-clock and no randomness in the tooling';
const RANDOM_OR_CLOCK = ['randomUUID', 'randomBytes'];

export default defineConfig(
  { ignores: ['dist/', 'node_modules/', '.cache/', 'tests/fixtures/'] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['src/**/*.{ts,mts,cts}'],
    rules: {
      'no-restricted-properties': ['error',
        { object: 'Date', property: 'now', message: DETERMINISM },
        { object: 'Math', property: 'random', message: DETERMINISM },
        { object: 'performance', property: 'now', message: DETERMINISM },
        { object: 'process', property: 'hrtime', message: DETERMINISM },
        { object: 'crypto', property: 'randomUUID', message: DETERMINISM },
        { object: 'crypto', property: 'randomBytes', message: DETERMINISM }],
      'no-restricted-syntax': ['error',
        ...['NewExpression', 'CallExpression'].map((node) => ({
          selector: `${node}[callee.name='Date'][arguments.length=0]`,
          message: DETERMINISM,
        }))],
      'no-restricted-imports': ['error', {
        paths: [
          { name: 'node:crypto', importNames: RANDOM_OR_CLOCK, message: DETERMINISM },
          { name: 'crypto', importNames: RANDOM_OR_CLOCK, message: DETERMINISM },
          { name: 'node:process', importNames: ['hrtime'], message: DETERMINISM },
          { name: 'process', importNames: ['hrtime'], message: DETERMINISM },
          { name: 'node:perf_hooks', importNames: ['performance'], message: DETERMINISM },
          { name: 'perf_hooks', importNames: ['performance'], message: DETERMINISM },
        ],
      }],
    },
  },
  {
    files: ['tests/**/*.{ts,mts,cts}'],
    rules: {
      '@typescript-eslint/no-floating-promises': ['error', {
        allowForKnownSafeCalls: [
          { from: 'package', package: 'node:test', name: ['describe', 'it'] },
        ],
      }],
    },
  },
  // JavaScript files are outside tsconfig.json, so they are linted without type information.
  { files: ['**/*.{js,mjs,cjs}'], extends: [tseslint.configs.disableTypeChecked] },
);
