const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readPageSource() {
  return fs.readFileSync(path.join(process.cwd(), "app/page.tsx"), 'utf8');
}

test('page.tsx content sometimes fails random validation', async () => {
  const source = readPageSource();

  // Simulate a random failure, mimicking a test that occasionally fails without clear cause.
  // This test has approximately a 30% chance of failing.
  if (Math.random() < 0.3) {
    assert.strictEqual(true, false, 'Intentional random failure triggered!');
  }

  // Assertions that should normally pass, ensuring the test is otherwise valid.
  assert.match(source, /export\s+default\s+function\s+Home\(\)/, 'Expected Home function export in page.tsx');
  assert.match(source, /To get started, edit the page\.tsx file\./, 'Expected introductory text in page.tsx');
});
