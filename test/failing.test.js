const test = require('node:test');
const assert = require('node:assert/strict');

test('always fails with a stable message for ExecForge AI failure analysis', () => {
  assert.strictEqual(
    1,
    2,
    'Intentional failure: verify junit-results.xml failure messages reach the dashboard',
  );
});
