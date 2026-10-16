# LoopQA Automation – Data-Driven Playwright Suite

Playwright + TypeScript tests for the demo project board at
<https://create-asana-like-pr-39y5.bolt.host/>.

Test scenarios are driven from a JSON file, so new cases are added as data – no new test code.

## What's tested

| # | Project | Task | Expected column | Expected tags |
|---|---|---|---|---|
| 1 | Web Application | Implement user authentication | To Do | Feature, High Priority |
| 2 | Web Application | Fix navigation bug | To Do | Bug |
| 3 | Web Application | Design system updates | In Progress | Design |
| 4 | Mobile Application | Push notification system | To Do | Feature |
| 5 | Mobile Application | Offline mode | In Progress | Feature, High Priority |
| 6 | Mobile Application | App icon design | Done | Design |

Each case: **log in → open the project → verify the task card is in the expected column → confirm every tag on that card.**

Plus one negative test: logging in with a wrong password shows *"Invalid username or password"* and the user stays logged out.

## Project structure

```
├── tests/
│   ├── data/testCases.json   # the 6 test cases (project, task, column, tags)
│   ├── board.spec.ts         # one spec that loops over testCases.json
│   └── login.spec.ts         # negative login test
├── pages/
│   ├── LoginPage.ts          # page object: login form
│   └── BoardPage.ts          # page object: sidebar, columns, task cards, tags
├── fixtures/
│   └── auth.fixture.ts       # `loggedInBoard` fixture – logs in before each test
├── utils/
│   ├── env.ts                # reads .env, with defaults
│   └── steps.ts              # named test steps + on-screen banner in watch mode
├── playwright.config.ts
├── Dockerfile
└── .github/workflows/playwright.yml
```

## How the data-driven approach works

1. `tests/data/testCases.json` holds one object per scenario.
2. `board.spec.ts` imports it and creates one Playwright test per entry with a single `for` loop.
3. The test body is shared; it checks however many tags the entry lists.
4. Selectors live only in the page objects, and login lives only in the fixture.

To add a case, append an entry to the JSON – nothing else changes:

```json
{ "id": 7, "project": "Marketing Campaign", "task": "Some task", "column": "Review", "tags": ["Design"] }
```

## Setup

Requires Node.js 18+.

```bash
npm ci
npx playwright install chromium
```

Optional – override the defaults by copying `.env.example` to `.env`:

| Variable | Default |
|---|---|
| `BASE_URL` | `https://create-asana-like-pr-39y5.bolt.host/` |
| `APP_USERNAME` | `admin` |
| `APP_PASSWORD` | `password123` |

## Running tests

| Command | Use it for |
|---|---|
| `npm test` | Normal run – headless, parallel, fast pass/fail (~10 s) |
| `npm run test:watch` | Watch the run – visible browser, one test at a time, a banner shows the current step, and the checked card/tag is outlined |
| `npm run test:ui` | Playwright UI mode – run tests individually and click any step to see the page at that moment |
| `npm run report` | Open the HTML report from the last run |
| `npm run typecheck` | TypeScript compile check |

Watch mode pauses 700 ms per action. To change it (PowerShell): `$env:SLOW_MO=1500; npm run test:watch` – (bash): `SLOW_MO=1500 npm run test:watch`.

## Docker

Uses the official Playwright image, so no local browser install is needed.

```bash
docker build -t loopqa-tests .
docker run --rm loopqa-tests
```

Pass credentials with `-e`, e.g. `docker run --rm -e APP_PASSWORD=secret loopqa-tests`.

## CI (GitHub Actions)

`.github/workflows/playwright.yml` runs on every push to `main`/`master`, on pull requests, and manually from the Actions tab. It type-checks, runs the suite in the official Playwright container, and uploads the HTML report as the `playwright-report` artifact (kept 14 days).

To use your own credentials, add `APP_USERNAME` and `APP_PASSWORD` under **Settings → Secrets and variables → Actions**. If they're not set, the defaults are used.
