# testing-execforge

A minimal Next.js application used as a **live target repository** for ExecForge development and testing. It exists to generate realistic, varied CI telemetry signals — slow tests, flaky tests, and timing-sensitive tests — so ExecForge's dashboard analytics can be developed and validated against real data.

This repository is not a production application. Its entire purpose is to be observed by ExecForge.

---

## What's Inside

### Test Suite

All tests live in `test/` and use Node.js's built-in `node:test` runner with JUnit XML output:

| File | Behaviour | Purpose |
|---|---|---|
| `test/execforge-slow.test.js` | Always passes, but takes ~3.5 s | Exercises slow-test detection and P95 duration tracking |
| `test/flaky-random.test.js` | Fails ~30% of runs at random | Exercises flakiness detection and failure rate tracking |
| `test/flaky-timing.test.js` | Fails when runner is under load (timing-sensitive) | Exercises environment-dependent flakiness |
| `test/failing.test.js` | Always fails with a fixed assertion message | Exercises JUnit failure messages → AI run analysis |

### Workflows

`.github/workflows/` contains individual dispatchable workflows per test type, enabling granular per-test reruns from the ExecForge dashboard:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | push to `main`, pull request | Full combined CI run |
| `test-slow.yml` | `workflow_dispatch` | Dispatch only the slow test |
| `test-flaky-random.yml` | `workflow_dispatch` | Dispatch only the random flaky test |
| `test-flaky-timing.yml` | `workflow_dispatch` | Dispatch only the timing-sensitive flaky test |
| `test-failing.yml` | `workflow_dispatch` | Dispatch a deterministic failing test (JUnit failure messages) |

Every workflow uses the `Absterrg0/execforge-runtime/start@v1` + `finish@v1` split pattern for zero-overhead telemetry collection.

---

## ExecForge Integration

The workflows are wired to ExecForge via two repository secrets:

| Secret | Description |
|---|---|
| `EXECFORGE_API_TOKEN` | Scoped ingestion token created from the ExecForge onboarding wizard |
| `EXECFORGE_API_URL` | URL of the ExecForge instance (defaults to `https://execforge.vercel.app`) |

The CI workflow looks like this:

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: Absterrg0/execforge-runtime/start@v1
    env:
      EXECFORGE_API_TOKEN: ${{ secrets.EXECFORGE_API_TOKEN }}
      EXECFORGE_API_URL: ${{ secrets.EXECFORGE_API_URL }}

  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  - name: Install dependencies
    run: npm ci

  - name: Build & test
    run: npm run build && npm test

  - uses: Absterrg0/execforge-runtime/finish@v1
    if: always()
    env:
      EXECFORGE_API_TOKEN: ${{ secrets.EXECFORGE_API_TOKEN }}
      EXECFORGE_API_URL: ${{ secrets.EXECFORGE_API_URL }}
      EXECFORGE_JOB_STATUS: ${{ job.status }}
```

The `finish` step automatically discovers `junit-results.xml`, logs each failure in the Actions console, and uploads per-test results (including **failure messages**) for ExecForge AI scan and run analysis.

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (port may vary if 3000 is taken by the ExecForge webapp).

### Running Tests Locally

```bash
npm test
```

This runs all tests and writes `junit-results.xml` to the project root. When running under ExecForge locally, set:

```env
EXECFORGE_API_URL=http://localhost:3000
EXECFORGE_API_TOKEN=exf_your_local_token
```

---

## Adding More Signal Types

To add a new test scenario:

1. Create `test/your-scenario.test.js`.
2. Add an npm test script in `package.json` that targets it (e.g., `node --test test/your-scenario.test.js --reporter junit`).
3. Add `.github/workflows/test-your-scenario.yml` with `workflow_dispatch` trigger and ExecForge start/finish steps.
4. Trigger the workflow from the ExecForge dashboard → **Tests** → **Test inventory** → **Rerun** on the matching row (requires GitHub App **Actions: Read and write** on the installation).
