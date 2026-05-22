const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Failing: tsconfig.json compilerOptions target', (t) => {
  const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
  const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
  const tsconfigData = JSON.parse(tsconfigContent);

  // This test is designed to fail. The actual target is "ES2017".
  // We are asserting it should be "ESNext".
  assert.strictEqual(tsconfigData.compilerOptions.target, 'ESNext', 'Expected compiler target to be ESNext, but it is different.');
});

test('Failing: tsconfig.json compilerOptions jsx', (t) => {
  const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
  const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
  const tsconfigData = JSON.parse(tsconfigContent);

  // This test is designed to fail. The actual jsx is "react-jsx".
  // We are asserting it should be "preserve".
  assert.strictEqual(tsconfigData.compilerOptions.jsx, 'preserve', 'Expected jsx option to be "preserve", but it is different.');
});
