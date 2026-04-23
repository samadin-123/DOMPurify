#!/usr/bin/env node

/**
 * DOMPurify Performance Benchmark
 *
 * Measures sanitization throughput (ops/sec) on realistic HTML payloads.
 * Outputs: METRIC=<number> where number is operations per second.
 */

const { JSDOM } = require('jsdom');
const createDOMPurify = require('../dist/purify.cjs.js');

// Setup JSDOM environment
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Realistic test payloads covering common use cases
const testPayloads = [
  // Simple text with basic formatting
  '<p>Hello <b>world</b>!</p>',

  // Rich content with multiple elements
  '<div><h1>Title</h1><p>Paragraph with <a href="https://example.com">link</a></p><ul><li>Item 1</li><li>Item 2</li></ul></div>',

  // Form elements
  '<form><input type="text" name="username"><input type="password" name="pass"><button type="submit">Login</button></form>',

  // Table structure
  '<table><tr><td>Cell 1</td><td>Cell 2</td></tr><tr><td>Cell 3</td><td>Cell 4</td></tr></table>',

  // Complex nested structure
  '<div class="container"><section><article><header><h2>Article Title</h2></header><p>First paragraph with <strong>bold</strong> and <em>italic</em> text.</p><p>Second paragraph.</p></article></section></div>',

  // SVG content
  '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>',

  // Data attributes and ARIA
  '<div data-id="123" data-value="test" role="button" aria-label="Click me" tabindex="0">Button</div>',

  // XSS attempt (will be sanitized)
  '<img src=x onerror=alert(1)><script>alert(2)</script><a href="javascript:alert(3)">click</a>',

  // Large document fragment
  '<div>' + Array(50).fill('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>').join('') + '</div>',

  // Style attributes
  '<div style="color: red; font-size: 16px; margin: 10px;">Styled content</div>',
];

/**
 * Run benchmark for a given duration
 */
function benchmark(durationMs = 2000) {
  const startTime = Date.now();
  let iterations = 0;
  let payloadIndex = 0;

  while (Date.now() - startTime < durationMs) {
    // Cycle through different payloads for realistic testing
    const payload = testPayloads[payloadIndex];
    DOMPurify.sanitize(payload);

    iterations++;
    payloadIndex = (payloadIndex + 1) % testPayloads.length;
  }

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const opsPerSecond = iterations / elapsedSeconds;

  return opsPerSecond;
}

/**
 * Run multiple trials and report statistics
 */
function runBenchmark() {
  const warmupDuration = 500; // ms
  const benchDuration = 2000; // ms per trial
  const numTrials = 5;

  // Warmup
  benchmark(warmupDuration);

  // Run trials
  const results = [];
  for (let i = 0; i < numTrials; i++) {
    const ops = benchmark(benchDuration);
    results.push(ops);
  }

  // Calculate statistics
  const mean = results.reduce((a, b) => a + b, 0) / results.length;
  const sorted = results.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Use median as the primary metric (more stable than mean)
  console.log(`METRIC=${median.toFixed(2)}`);
  console.log(`# Benchmark Results:`);
  console.log(`#   Trials: ${numTrials}`);
  console.log(`#   Median: ${median.toFixed(2)} ops/sec`);
  console.log(`#   Mean:   ${mean.toFixed(2)} ops/sec`);
  console.log(`#   Min:    ${min.toFixed(2)} ops/sec`);
  console.log(`#   Max:    ${max.toFixed(2)} ops/sec`);
  console.log(`#   Payloads tested: ${testPayloads.length}`);
}

// Run the benchmark
runBenchmark();
