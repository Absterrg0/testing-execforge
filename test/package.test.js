const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Failing: package.json version check', (t) => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageData = JSON.parse(packageJsonContent);

  // This test is designed to fail. The actual version is "0.1.0".
  // We are asserting it should be "1.0.0".
  assert.strictEqual(packageData.version, '1.0.0', 'Expected package version to be 1.0.0, but it is different.');
});

test('Failing: package.json script check', (t) => {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  const packageData = JSON.parse(packageJsonContent);

  // This test is designed to fail. The actual 'lint' script is "eslint".
  // We are asserting it should be "next lint".
  assert.strictEqual(packageData.scripts.lint, 'next lint', 'Expected lint script to be "next lint", but it is different.');
});
