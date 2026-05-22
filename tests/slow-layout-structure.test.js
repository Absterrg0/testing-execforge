const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

// Helper for artificial delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate heavy structural analysis with delays
async function analyzeLayoutStructureSlowly(content, iterations) {
    let structureScore = 0;
    const structuralKeywords = ["Metadata", "RootLayout", "html", "body", "className", "variable"];

    for (let i = 0; i < iterations; i++) {
        for (const keyword of structuralKeywords) {
            if (content.includes(keyword)) {
                structureScore++;
            }
        }
        // Introduce a small delay every N iterations
        if (i % Math.floor(iterations / 15) === 0) {
            await sleep(40);
        }
    }
    return structureScore;
}

test('Slow test: app/layout.tsx structural verification with heavy analysis', async (t) => {
    const layoutPath = path.join(__dirname, '../app/layout.tsx');
    let fileContent;

    try {
        // Simulate sequential I/O by reading the file with delays
        console.log('Reading app/layout.tsx...');
        fileContent = await fs.readFile(layoutPath, 'utf8');
        await sleep(150);
    } catch (error) {
        assert.fail(`Failed to read app/layout.tsx: ${error.message}`);
    }

    assert.ok(fileContent, 'File content should not be empty');

    // Perform heavy structural analysis
    console.log('Starting heavy layout structure analysis...');
    const analysisScore = await analyzeLayoutStructureSlowly(fileContent, 60000); // 60,000 iterations
    console.log(`Finished heavy layout structure analysis. Analysis score: ${analysisScore}`);

    // Assertions based on the content of app/layout.tsx
    assert.ok(fileContent.includes('import type { Metadata } from "next";'), 'Layout should import Metadata');
    assert.ok(fileContent.includes('export default function RootLayout'), 'Layout should export RootLayout function');
    assert.ok(fileContent.includes('<html'), 'Layout should contain an <html> tag');
    assert.ok(fileContent.includes('className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}'), 'HTML tag should have specific font classes');
    assert.ok(fileContent.includes('<body>{children}</body>'), 'Layout body should render children');

    // Introduce a final, significant delay
    console.log('Introducing final delay...');
    await sleep(600);
    console.log('Slow layout test completed.');
});
