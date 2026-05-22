const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function analyzeLayoutStructureSlowly(content, iterations) {
  let structureScore = 0;
  const structuralPatterns = [
    /exports+consts+metadatas*:/,
    /exports+defaults+functions+RootLayout/,
    /<html[^>]*>/s,
    /<body[^>]*>[sS]*{children}[sS]*</body>/s,
    /geistSans.variable/,
    /geistMono.variable/,
    /antialiased/,
  ];

  for (let i = 0; i < iterations; i += 1) {
    for (const pattern of structuralPatterns) {
      if (pattern.test(content)) structureScore += 1;
    }
    if (i % Math.floor(iterations / 15) === 0) {
      await sleep(40);
    }
  }
  return structureScore;
}

test('Slow test: app/layout.tsx structural verification with tolerant source checks', async () => {
  const layoutPath = path.join(__dirname, '../app/layout.tsx');
  let fileContent;

  try {
    fileContent = await fs.readFile(layoutPath, 'utf8');
    await sleep(150);
  } catch (error) {
    assert.fail(`Failed to read app/layout.tsx: ${error.message}`);
  }

  assert.ok(fileContent, 'File content should not be empty');

  const analysisScore = await analyzeLayoutStructureSlowly(fileContent, 60000);
  assert.ok(analysisScore > 0, 'Slow structural analysis should find layout signals');

  assert.match(fileContent, /imports+types+{s*Metadatas*}s+froms+["']next["'];?/s, 'Layout should import Metadata from next');
  assert.match(fileContent, /exports+defaults+functions+RootLayout/, 'Layout should export RootLayout function');
  assert.match(fileContent, /<html[^>]*>/s, 'Layout should contain an html element, regardless of attributes');
  assert.match(fileContent, /<body[^>]*>[sS]*{children}[sS]*</body>/s, 'Layout body should render children regardless of whitespace or body attributes');
  assert.match(fileContent, /geistSans.variable/, 'Layout should reference the geistSans variable');
  assert.match(fileContent, /geistMono.variable/, 'Layout should reference the geistMono variable');
  assert.match(fileContent, /antialiased/, 'Layout should apply antialiased styling somewhere in the layout class configuration');

  await sleep(600);
});
