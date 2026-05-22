const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

// Helper for artificial delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate heavy string processing with delays
async function processPageContentSlowly(content, iterations) {
    let foundCount = 0;
    const searchTerms = ["Next.js logo", "To get started, edit the page.tsx file.", "Deploy Now"];

    for (let i = 0; i < iterations; i++) {
        for (const term of searchTerms) {
            if (content.includes(term)) {
                foundCount++;
            }
        }
        // Introduce a small delay every N iterations to simulate I/O or heavy computation
        if (i % Math.floor(iterations / 10) === 0) {
            await sleep(50);
        }
    }
    return foundCount;
}

test('Slow test: app/page.tsx content verification with heavy processing', async (t) => {
    const pagePath = path.join(__dirname, '../app/page.tsx');
    let fileContent;

    try {
        // Simulate sequential I/O by reading the file multiple times or with delays
        console.log('Reading app/page.tsx for the first time...');
        fileContent = await fs.readFile(pagePath, 'utf8');
        await sleep(100);
        console.log('Reading app/page.tsx for the second time...');
        fileContent = await fs.readFile(pagePath, 'utf8'); // Read again to simulate more I/O
        await sleep(100);
    } catch (error) {
        assert.fail(`Failed to read app/page.tsx: ${error.message}`);
    }

    assert.ok(fileContent, 'File content should not be empty');

    // Perform heavy processing
    console.log('Starting heavy content processing...');
    const totalFound = await processPageContentSlowly(fileContent, 50000); // 50,000 iterations
    console.log(`Finished heavy content processing. Total terms found: ${totalFound}`);

    // Assertions based on the content of app/page.tsx
    assert.ok(fileContent.includes('To get started, edit the page.tsx file.'), 'Page should contain the "get started" message');
    assert.ok(fileContent.includes('alt="Next.js logo"'), 'Page should reference the Next.js logo');
    assert.ok(fileContent.includes('Deploy Now'), 'Page should contain a "Deploy Now" link');

    // Introduce a final, significant delay
    console.log('Introducing final delay...');
    await sleep(500);
    console.log('Slow test completed.');
});
