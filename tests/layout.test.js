const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Path to the app/layout.tsx file
const layoutFilePath = path.resolve(__dirname, '../app/layout.tsx');

test('app/layout.tsx content assertions (failing)', async (t) => {
  let layoutContent;
  try {
    layoutContent = fs.readFileSync(layoutFilePath, 'utf8');
  } catch (error) {
    assert.fail(`Failed to read app/layout.tsx: ${error.message}`);
  }

  await t.test('should have the correct metadata title (failing)', () => {
    const expectedTitle = 'My Custom App Title'; // Intentionally wrong
    const actualTitleRegex = /export const metadata: Metadata = {\s*title: "(.*?)",/s;
    const match = layoutContent.match(actualTitleRegex);
    const actualTitle = match ? match[1] : 'No metadata title found';
    assert.strictEqual(actualTitle, expectedTitle, 'The metadata title should match the expected (failing)');
  });

  await t.test('should have the correct html lang attribute (failing)', () => {
    const expectedLang = 'fr'; // Intentionally wrong
    const actualLangRegex = /<html\s*lang="(.*?)"/;
    const match = layoutContent.match(actualLangRegex);
    const actualLang = match ? match[1] : 'No html lang attribute found';
    assert.strictEqual(actualLang, expectedLang, 'The html lang attribute should match the expected (failing)');
  });

  await t.test('should apply a specific class to the body tag (failing)', () => {
    const expectedBodyClass = 'wrong-body-class'; // Intentionally wrong
    const actualBodyClassRegex = /<body\s*class="(.*?)"/;
    const match = layoutContent.match(actualBodyClassRegex);
    const actualBodyClass = match ? match[1] : 'No body class found';
    assert.ok(actualBodyClass.includes(expectedBodyClass), `Body tag should contain class '${expectedBodyClass}' (failing)`);
  });
});
