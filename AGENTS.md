# Project Operating Guidelines & Rules

## 1. Zero Skip & Test-Driven / Use Case Mandate
- **Use Case Definition**: Any new feature or code change MUST be mapped to a clear Use Case (Actor, Preconditions, Actions, Postconditions).
- **Automated Tests**: Every Use Case must have an automated Playwright test in `test_project/tests/`.
- **Zero Skips**: Strictly NO `test.skip`. If data is needed (bills, slips, rooms), write mock/data generation logic in `test_project/scripts/reset-test-data.js` or self-healing helpers.
- **Run & Update Tracker**: After any modification, run:
  ```bash
  cd test_project && npx dotenv -e .env.test -- node scripts/run-tests.js
  ```
  Ensure all tests pass (0 fails, 0 skips) and `tracker-data/tracker-state.json` is updated.
- **Server Ports**:
  - Main Next.js App: `http://localhost:3000`
  - Test Tracker Dashboard: `http://localhost:4000`
