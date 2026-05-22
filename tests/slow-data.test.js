const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

const pageFilePath = path.resolve(__dirname, '../app/page.tsx');

// Helper for artificial delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

test('Slow Data Processing Test: app/page.tsx content analysis with delays', async (t) => {
  let pageContent;
  try {
    pageContent = await fs.readFile(pageFilePath, 'utf8');
    await delay(500); // Initial delay for file read
  } catch (error) {
    assert.fail(`Failed to read app/page.tsx: ${error.message}`);
  }

  await t.test('should perform a CPU-intensive loop on content (slow and failing)', async () => {
    const iterations = 50000; // Large number of iterations
    let processedCount = 0;
    const words = pageContent.split(/\s+/).filter(Boolean); // Split into words

    console.log(`Starting CPU-intensive loop with ${iterations} iterations...`);
    for (let i = 0; i < iterations; i++) {
      // Simulate complex processing: find a specific word
      if (words.includes('Image')) {
        processedCount++;
      }
      if (i % 10000 === 0) { // Add a small delay periodically
        await delay(50); // Adds to overall slowness
      }
    }
    console.log(`Finished CPU-intensive loop. Processed count: ${processedCount}`);

    // Intentionally wrong assertion to make it fail consistently
    // 'Image' is present in page.tsx, so processedCount will be `iterations`.
    assert.notStrictEqual(processedCount, iterations, 'Processed count should not equal total iterations (failing)');
    await delay(200); // Final delay
  });

  await t.test('should simulate another slow data transformation (flaky)', async () => {
    const largeArraySize = 10000;
    let data = Array.from({ length: largeArraySize }, (_, i) => ({ id: i, value: Math.random() * 1000 }));

    console.log(`Starting large array transformation for ${largeArraySize} items...`);
    // Simulate a complex filter operation
    data = data.filter(item => {
      // Introduce a very small random delay for added slowness, not flakiness of assertion
      if (Math.random() < 0.0001) { 
        // await delay(1); // Uncomment for even more granular, but less impactful, flakiness
      }
      return item.value > 500; // Roughly half the items will pass
    });

    await delay(1000); // Significant delay after processing

    // Flaky assertion: sometimes pass, sometimes fail based on a random condition
    const expectedMinLength = largeArraySize / 2 - 100; // Expect roughly half
    const expectedMaxLength = largeArraySize / 2 + 100;
    const actualLength = data.length;

    const isWithinExpectedRange = actualLength >= expectedMinLength && actualLength <= expectedMaxLength;
    const shouldPassTest = Math.random() > 0.5; // 50% chance to pass, 50% chance to fail

    if (shouldPassTest) {
      assert.ok(isWithinExpectedRange, `Flaky assertion: Data length (${actualLength}) should be within expected range [${expectedMinLength}, ${expectedMaxLength}] (flaky pass)`);
    } else {
      assert.ok(!isWithinExpectedRange, `Flaky assertion: Data length (${actualLength}) should NOT be within expected range [${expectedMinLength}, ${expectedMaxLength}] (flaky fail)`);
    }
    await delay(300); // Final delay
  });
});
