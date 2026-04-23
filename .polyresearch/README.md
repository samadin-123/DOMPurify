# Polyresearch Setup for DOMPurify

This directory contains the benchmark harness for performance evaluation.

## Files

- `benchmark.js` - Node.js benchmark script that measures DOMPurify sanitization throughput

## How It Works

The benchmark:
1. Loads DOMPurify in a jsdom environment
2. Tests 10 diverse HTML payloads covering common use cases and XSS attempts
3. Runs 5 trials of 2 seconds each (after 500ms warmup)
4. Reports median operations per second as the primary metric

## Running Manually

```bash
# Build the project first
npm run build

# Run the benchmark
node .polyresearch/benchmark.js
```

Expected output:
```
METRIC=1800.00
# Benchmark Results:
#   Trials: 5
#   Median: 1800.00 ops/sec
#   ...
```

## Performance Target

Baseline: ~1800 ops/sec
Goal: 10%+ improvement (1980+ ops/sec)
