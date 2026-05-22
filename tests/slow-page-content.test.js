const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processPageContentSlowly(content, iterations) {
  let foundCount = 0;
  const searchPatterns = [/To get started/i, /alt=["']Next.js logo["']/i, />s*Deploy Nows*</i];

  for (let i = 0; i < iterations; i += 1) {
    for (const pattern of searchPatterns) {
      if (pattern.test(content)) foundCount += 1;
    }
    if (i % Math.floor(iterations / 10) === 0) {
      await sleep(50);
    }
  }
  return foundCount;
}

test('Slow test: app/page.tsx content verification with tolerant source checks', async () => {
  const pagePath = path.join(__dirname, '../app/page.tsx');
  let fileContent;

  try {
    fileContent = await fs.readFile(pagePath, 'utf8');
    await sleep(100);
    fileContent = await fs.readFile(pagePath, 'utf8');
    await sleep(100);
  } catch (error) {
    assert.fail(`Failed to read app/page.tsx: ${error.message}`);
  }

  assert.ok(fileContent, 'File content should not be empty');

  const totalFound = await processPageContentSlowly(fileContent, 50000);
  assert.ok(totalFound > 0, 'Slow processing should find expected page signals');

  assert.match(fileContent, /To get started/i, 'Page should contain the get-started message');
  assert.match(fileContent, /alt=["']Next.js logo["']/i, 'Page should reference the Next.js logo with tolerant attribute matching');
  assert.match(fileContent, />s*Deploy Nows*</i, 'Page should contain a Deploy Now link label with tolerant whitespace');

  await sleep(500);
});
