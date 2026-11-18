import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { collectRuntimePackages, runtimeAdvisories } from './audit-runtime.mjs';

const ls = [
  {
    name: '@anchor-ui/core',
    dependencies: {
      lit: {
        version: '3.3.3',
        dependencies: {
          'lit-html': {
            version: '3.3.3',
            dependencies: { '@types/trusted-types': { version: '2.0.7' } },
          },
        },
      },
      '@floating-ui/dom': {
        version: '1.7.4',
        dependencies: { '@floating-ui/core': { version: '1.7.3' } },
      },
    },
  },
  // 在 workspace 根目錄執行時也會列出其他專案
  { name: 'anchor-ui-angular-example', dependencies: { '@angular/core': { version: '19.2.0' } } },
];

const advisory = (module_name, severity, versions) => ({
  module_name,
  severity,
  title: `${module_name} issue`,
  url: `https://example.com/${module_name}`,
  findings: versions.map((version) => ({ version, paths: [] })),
});

test('collects every package version in the runtime dependency tree', () => {
  assert.deepEqual([...collectRuntimePackages(ls, '@anchor-ui/core')].sort(), [
    '@floating-ui/core@1.7.3',
    '@floating-ui/dom@1.7.4',
    '@types/trusted-types@2.0.7',
    'lit-html@3.3.3',
    'lit@3.3.3',
  ]);
});

test('keeps only advisories whose affected version is in the runtime tree', () => {
  const audit = {
    advisories: {
      1: advisory('@angular/core', 'high', ['19.2.0']), // examples 的相依：忽略
      2: advisory('lit-html', 'critical', ['3.3.3']), // 在 runtime 樹內
      3: advisory('lit', 'moderate', ['2.0.0']), // 同名但版本不在樹內：忽略
      4: advisory('@floating-ui/core', 'low', ['1.7.3', '1.0.0']),
    },
  };
  const result = runtimeAdvisories(audit, collectRuntimePackages(ls, '@anchor-ui/core'));
  assert.deepEqual(
    result.map((f) => `${f.severity} ${f.name}@${f.version}`),
    ['critical lit-html@3.3.3', 'low @floating-ui/core@1.7.3'],
  );
});

test('fails when the root project is missing from pnpm ls', () => {
  assert.throws(() => collectRuntimePackages(ls, 'other'), /other/);
});

test('handles an audit with no advisories', () => {
  assert.deepEqual(runtimeAdvisories({ advisories: {} }, new Set(['lit@3.3.3'])), []);
});

test('fails closed on an unexpected audit format or an audit error', () => {
  const packages = new Set(['lit@3.3.3']);
  assert.throws(() => runtimeAdvisories({}, packages), /advisories/);
  assert.throws(() => runtimeAdvisories({ vulnerabilities: {} }, packages), /advisories/);
  assert.throws(() => runtimeAdvisories(null, packages), /advisories/);
  assert.throws(
    () => runtimeAdvisories({ error: { code: 'ERR_PNPM_AUDIT_BAD_RESPONSE' } }, packages),
    /ERR_PNPM_AUDIT_BAD_RESPONSE/,
  );
});
