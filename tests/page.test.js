const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Path to the app/page.tsx file
const pageFilePath = path.resolve(__dirname, '../app/page.tsx');

test('app/page.tsx content assertions (failing)', async (t) => {
  let pageContent;
  try {
    pageContent = fs.readFileSync(pageFilePath, 'utf8');
  } catch (error) {
    assert.fail(`Failed to read app/page.tsx: ${error.message}`);
  }

  await t.test('should have the correct h1 title (failing)', () => {
    const expectedTitle = 'This is an intentionally wrong title.'; // Intentionally wrong
    const actualTitleRegex = /<h1[^>]*>(.*?)<\/h1>/s;
    const match = pageContent.match(actualTitleRegex);
    const actualTitle = match ? match[1].trim() : 'No title found';
    assert.strictEqual(actualTitle, expectedTitle, 'The h1 title should match the expected (failing)');
  });

  await t.test('should have the correct alt text for Next.js logo (failing)', () => {
    const expectedAltText = 'Incorrect Next.js logo alt text'; // Intentionally wrong
    const actualAltTextRegex = /<Image[^>]*src="\/next\.svg"[^>]*alt="(.*?)"[^>]*\/>/;
    const match = pageContent.match(actualAltTextRegex);
    const actualAltText = match ? match[1] : 'No Next.js logo alt text found';
    assert.strictEqual(actualAltText, expectedAltText, 'The Next.js logo alt text should match the expected (failing)');
  });

  await t.test('should contain a link to Vercel with correct href (failing)', () => {
    const expectedHref = 'https://vercel.com/wrong-link'; // Intentionally wrong
    const actualHrefRegex = /<a[^>]*href="(https:\/\/vercel\.com\/new[^"]*)"[^>]*>\s*<Image[^>]*src="\/vercel\.svg"[^>]*\/>\s*Deploy Now\s*<\/a>/;
    const match = pageContent.match(actualHrefRegex);
    const actualHref = match ? match[1] : 'No Vercel deploy link found';
    assert.strictEqual(actualHref, expectedHref, 'The Vercel deploy link href should match the expected (failing)');
  });
});
