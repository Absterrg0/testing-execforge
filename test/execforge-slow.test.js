const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readSourceFile() {
  return fs.readFileSync(path.join(process.cwd(), "app/page.tsx"), 'utf8');
}

test('source file survives a deliberately slow content validation path', async () => {
  const source = readSourceFile();
  await new Promise((resolve) => setTimeout(resolve, 3500));
  assert.match(source, /export\s+default|function\s+[A-Z][A-Za-z0-9_]*/);
  assert.match(source, /To get started, edit the page\.tsx file\./);
});
