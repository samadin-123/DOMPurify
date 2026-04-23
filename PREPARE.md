# Evaluation Setup

This file is outside the editable surface. It defines how results are judged. Agents cannot modify the evaluator or the scoring logic — the evaluation is the trust boundary.

Consider defining more than one evaluation criterion. Optimizing for a single number makes it easy to overfit and silently break other things. A secondary metric or sanity check helps keep the process honest.

eval_cores: 1
eval_memory_gb: 1.0
prereq_command: npm run build

## Setup

Install dependencies and prepare the evaluation environment:

```bash
# Install Node.js dependencies (jsdom, rollup, typescript, etc.)
npm install

# Build is handled automatically via prereq_command
# This compiles TypeScript src/ to JavaScript dist/
```

The `prereq_command: npm run build` ensures TypeScript sources are compiled before each evaluation, measuring the performance of the actual compiled output.

## Run command

```bash
node .polyresearch/benchmark.js
```

## Output format

The benchmark prints `METRIC=<number>` to stdout, where the number is the median operations per second across 5 trials. Additional statistics are printed as comments (lines starting with #).

## Metric parsing

The CLI looks for `METRIC=<number>` or `ops_per_sec=<number>` in the output.

## Ground truth

The baseline metric (~1800 ops/sec) measures DOMPurify's sanitization throughput on Node.js v20+ with jsdom.

The benchmark:
- Tests 10 diverse HTML payloads (simple text, rich content, forms, tables, SVG, XSS attempts, large documents)
- Runs 5 trials of 2 seconds each after a 500ms warmup
- Reports the median ops/sec as METRIC (more stable than mean)
- Cycles through all payloads during each trial for balanced coverage

This metric correlates with real-world performance: higher throughput means faster sanitization of user-generated content, reducing latency in web applications.

**Correctness constraint**: All optimizations must pass `npm test` (jsdom unit tests + Playwright browser tests). The test suite validates sanitization behavior against 100+ test cases covering XSS vectors, edge cases, and security guarantees.
