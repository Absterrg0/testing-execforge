const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Failing: eslint.config.mjs content check', (t) => {
  const eslintConfigPath = path.join(__dirname, '..', 'eslint.config.mjs');
  const eslintConfigContent = fs.readFileSync(eslintConfigPath, 'utf8');

  // This test is designed to fail. The file *does* contain this string.
  // We are asserting it should *not* contain it.
  assert.ok(!eslintConfigContent.includes('eslint-config-next/core-web-vitals'), 'Expected eslint config to NOT include core-web-vitals, but it does.');
});

test('Failing: postcss.config.mjs plugin check', (t) => {
  const postcssConfigPath = path.join(__dirname, '..', 'postcss.config.mjs');
  const postcssConfigContent = fs.readFileSync(postcssConfigPath, 'utf8');

  // This test is designed to fail. The file *does* contain this string.
  // We are asserting it should *not* contain it.
  assert.ok(!postcssConfigContent.includes('@tailwindcss/postcss'), 'Expected postcss config to NOT include tailwindcss plugin, but it does.');
});
