const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const layoutFilePath = path.resolve(__dirname, '../app/layout.tsx');
const pageFilePath = path.resolve(__dirname, '../app/page.tsx');
const nextSvgPath = path.resolve(__dirname, '../public/next.svg');
const tempFilePath = path.resolve(__dirname, './temp-slow-io-test.txt');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('Slow I/O Operations Test: Multiple file reads/writes with delays', async (t) => {
  let totalBytesRead = 0;

  await t.test('should read multiple files sequentially with delays (slow and failing)', async () => {
    console.log('Starting sequential file reads...');

    const filesToRead = [layoutFilePath, pageFilePath, nextSvgPath];
    for (const filePath of filesToRead) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        totalBytesRead += content.length;
        console.log(`Read ${filePath}, size: ${content.length} bytes`);
        await delay(700); // Significant delay after each read
      } catch (error) {
        assert.fail(`Failed to read ${filePath}: ${error.message}`);
      }
    }
    console.log(`Finished sequential file reads. Total bytes read: ${totalBytesRead}`);

    // Intentionally failing assertion: totalBytesRead will be the actual sum, not 12345
    assert.strictEqual(totalBytesRead, 12345, 'Total bytes read should be an incorrect specific value (failing)');
    await delay(400); // Final delay
  });

  await t.test('should perform a slow write operation and verify (flaky)', async () => {
    const largeData = 'This is a large data string to write repeatedly.\n'.repeat(5000); // ~250KB per write
    const writeIterations = 3;
    let lastWrittenContent = '';

    console.log(`Starting ${writeIterations} large file write operations...`);
    for (let i = 0; i < writeIterations; i++) {
      const contentToWrite = `Iteration ${i + 1}: ${largeData} Random value: ${Math.random()}\n`;
      try {
        await fs.writeFile(tempFilePath, contentToWrite, 'utf8');
        lastWrittenContent = contentToWrite;
        console.log(`Wrote to ${tempFilePath}, iteration ${i + 1}`);
        await delay(1200); // Very significant delay after each write
      } catch (error) {
        assert.fail(`Failed to write to ${tempFilePath}: ${error.message}`);
      }
    }

    // Read back the last written content to verify
    let readBackContent;
    try {
      readBackContent = await fs.readFile(tempFilePath, 'utf8');
      await delay(500); // Delay after final read
    } catch (error) {
      assert.fail(`Failed to read back from ${tempFilePath}: ${error.message}`);
    }

    // Flaky assertion: `readBackContent` will always contain "Random value:".
    // The flakiness comes from the `shouldPassTest` condition.
    const contentContainsRandomValue = readBackContent.includes('Random value:');
    const shouldPassTest = Math.random() > 0.3; // 70% chance to pass, 30% chance to fail

    if (shouldPassTest) {
      assert.ok(contentContainsRandomValue, 'Content should contain "Random value:" (flaky pass)');
    } else {
      assert.ok(!contentContainsRandomValue, 'Content should NOT contain "Random value:" (flaky fail)');
    }

    // Clean up the temporary file
    try {
      await fs.unlink(tempFilePath);
      console.log(`Cleaned up ${tempFilePath}`);
    } catch (error) {
      console.warn(`Failed to clean up ${tempFilePath}: ${error.message}`);
    }
    await delay(200); // Final delay
  });
});
