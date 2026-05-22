const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readLayoutSource() {
  return fs.readFileSync(path.join(process.cwd(), "app/layout.tsx"), 'utf8');
}

test('layout.tsx content sometimes fails due to timing-dependent state', async () => {
  const source = readLayoutSource();
  const simulatedProcessingTime = Math.random() * 200; // Simulate a variable processing time between 0 and 200ms

  // Introduce a delay to simulate an asynchronous operation or a system under load.
  // The flakiness arises if the subsequent assertion is made too quickly, before a 'hypothetical' state change completes.
  await new Promise(resolve => setTimeout(resolve, simulatedProcessingTime));

  // This assertion is designed to fail intermittently.
  // If the simulated processing time was very short (e.g., less than 70ms),
  // there's a chance (e.g., 40%) that we assert against a non-existent string,
  // mimicking a race condition where a state isn't ready.
  if (simulatedProcessingTime < 70 && Math.random() < 0.4) {
    assert.match(source, /non-existent-dynamic-class-after-update/, 'Expected a class that might not be present if checked too soon'); // This will fail
  } else {
    // This assertion should pass under normal circumstances or sufficient processing time.
    assert.match(source, /h-full antialiased/, 'Expected h-full antialiased class in layout.tsx');
  }
});
