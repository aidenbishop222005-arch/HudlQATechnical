# Hudl Login – Test Automation Framework

An end-to-end test suite for the [Hudl login flow](https://www.hudl.com/login), built with Playwright and TypeScript. It covers the happy path, input validation, invalid credentials, the password step, and navigation to related screens, across Chromium, Firefox, and WebKit.

## Tech stack

- [Playwright Test](https://playwright.dev/) – browser automation and test runner
- TypeScript (strict mode)
- ESLint (with `typescript-eslint` and `eslint-plugin-playwright`) and Prettier
- GitHub Actions for CI

## Prerequisites

- [Node.js](https://nodejs.org/) 20.11 or newer (CI uses Node 22)
- Git
- A Hudl test account (email and password)

## Setup

**1. Clone the repository and install dependencies**

```bash
git clone https://github.com/aidenbishop222005-arch/HudlQATechnical.git
cd hudl-login-tests
npm ci
```

**2. Install the Playwright browsers**

```bash
npx playwright install --with-deps
```

**3. Add your credentials**

Copy the example environment file:

```bash
# macOS / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Then open `.env` and fill in the test account details:

```bash
HUDL_EMAIL=your-test-account@example.com
HUDL_PASSWORD='your-password'
```

> **Wrap the password in single quotes.** Without them, characters such as `#` are treated as the start of a comment and the password is silently cut short.

`.env` is listed in `.gitignore` and must never be committed.

## Running the tests

| Command                   | What it does                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm test`                | Runs the full suite in Chromium, Firefox, and WebKit                                                                         |
| `npm run test:smoke`      | Runs only the critical `@smoke` tests                                                                                        |
| `npm run test:chromium`   | Runs the full suite in Chromium only                                                                                         |
| `npm run test:no-lockout` | Runs everything except tests that make failed login attempts (see [Account lockout protection](#account-lockout-protection)) |
| `npm run test:ui`         | Opens Playwright's interactive UI mode for running and debugging tests                                                       |

Useful options (add after `npx playwright test`):

```bash
npx playwright test --headed                # watch the browser while tests run
npx playwright test -g "logs in with valid" # run tests whose name matches
npx playwright test tests/login-ui.spec.ts  # run a single file
```

### Viewing results

```bash
npm run report
```

This opens the HTML report from the last local run. Failed tests include a screenshot, a video, and (on retry) a trace that can be stepped through action by action.

## Code quality

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run typecheck`    | Type-checks the project with the TypeScript compiler      |
| `npm run lint`         | Runs ESLint (`npm run lint:fix` to auto-fix)              |
| `npm run format:check` | Checks formatting with Prettier (`npm run format` to fix) |

All three run in CI before any browser tests.

## Project structure

```
├── .github/workflows/playwright.yml  # CI pipeline
├── src/
│   ├── config/env.ts                 # Loads and validates credentials
│   ├── data/testData.ts              # Error messages and non-secret test data
│   ├── fixtures/test.ts              # Custom fixtures: page objects and a login helper
│   └── pages/                        # Page Object Model
│       ├── LoginEmailPage.ts         # Login step 1: email
│       ├── LoginPasswordPage.ts      # Login step 2: password
│       ├── HomePage.ts               # Logged-in home page and user menu
│       ├── ResetPasswordPage.ts      # Forgot password screen
│       └── SignupBirthdayPage.ts     # First screen of account creation
├── tests/
│   ├── login-ui.spec.ts              # Page content and sign-up link
│   ├── login-validation.spec.ts      # Input validation and invalid credentials
│   ├── login-success.spec.ts         # Successful login, keyboard use, logout
│   └── login-navigation.spec.ts      # Password step behaviour and links
├── .env.example                      # Template for local credentials
├── eslint.config.mjs
├── playwright.config.ts
└── tsconfig.json
```

## Test coverage

| Area                    | Scenarios                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Page UI**             | Logo and heading render; email field is empty with an enabled Continue button; Google, Facebook, and Apple sign-in options are shown                                                       |
| **Successful login**    | Valid credentials reach the home page and the user menu shows the correct account; both steps can be submitted with the Enter key; email is case-insensitive; logging out ends the session |
| **Email validation**    | Empty email is rejected; malformed emails are rejected (data-driven over several formats)                                                                                                  |
| **Password validation** | Empty password is rejected                                                                                                                                                                 |
| **Invalid credentials** | Wrong password is rejected and the user stays logged out; an unregistered email produces the **same** error as a wrong password                                                            |
| **Password step**       | Submitted email is shown read-only; show/hide password toggle changes the input type and `aria-pressed` state; "Edit" returns to the email step                                            |
| **Navigation**          | "Forgot password?" opens the reset page; "Create Account" opens the sign-up flow                                                                                                           |
| **Accessibility** | axe-core WCAG 2.1 A/AA scans of the email step, email step with an error, and password step; every image has an `alt` attribute (empty `alt` is allowed for decorative images); `lang` is declared; one main heading; Tab order from email to Continue; validation errors are announced with their field |
| **Security** | HTML/script injection in the email and password fields is neither rendered nor executed (three payload types); a SQL injection string does not log in; the password never appears in the URL; HTTPS with HSTS; protection against embedding (clickjacking) |

### Out of scope

- **Social sign-in (Google, Facebook, Apple):** these hand off to third-party providers. The suite verifies the options are offered but does not complete those flows.
- **Account creation and password reset submission:** completing either would create data or send emails on the production platform. The suite verifies the screens load and stops there.

## Design decisions

### Page Object Model

Each screen has a class in `src/pages` that owns its locators and user actions. Tests describe _what_ should happen; page objects know _how_ to do it. If Hudl changes the UI, the fix is made once in the page object rather than in every test.

Page objects contain no test verdicts. The only assertions inside them are readiness checks (for example, waiting for the password field after submitting an email) so tests start from a known state.

### Custom fixtures

`src/fixtures/test.ts` extends Playwright's `test` so tests can request page objects directly (`async ({ loginEmailPage }) => ...`) instead of constructing them. It also provides a `login(email, password)` helper for tests where logging in is the setup rather than the behaviour under test.

### Locator strategy

In order of preference:

1. **Role-based locators** (`getByRole('button', { name: 'Continue', exact: true })`), which reflect how users and assistive technology perceive the page
2. **Hudl's `data-qa-id` test IDs**, enabled via `testIdAttribute` in `playwright.config.ts`
3. **Stable, human-named design-system classes** (such as `.hui-globaluseritem`) where neither of the above is available
4. **Never** generated CSS-module classes (such as `_auth_v4gqt_15`) or generated element IDs, which change between deployments

Locators for elements that appear more than once on a page are scoped to their container (for example, the user menu is located within the global navigation bar).

### Test data

Expected error messages and invalid inputs live in `src/data/testData.ts`, so copy changes are made in one place. Tests that don't need the real account use generated addresses on the reserved `example.com` domain.

### Waiting

The suite relies on Playwright's auto-waiting actions and web-first assertions. There are no fixed waits. The one increased timeout (the post-login redirect to the home page) is applied to that single assertion, with a reason, rather than globally.

## Security

### Scope of security testing

Security tests are deliberately non-intrusive, because they run against Hudl's production site. They use a small, fixed set of harmless payloads that only set a flag inside the test's own browser, and they use generated `example.com` addresses wherever the real account isn't needed. Automated scanners and high-volume fuzzing were intentionally not used against production.

### Credentials

Credentials are read from environment variables: a local `.env` file (gitignored) or GitHub Actions secrets in CI. `src/config/env.ts` fails with a clear message if a variable is missing, and reads credentials lazily so tests that don't need them run without them.

### Account lockout protection

Auth0, which powers Hudl's login, blocks an account after repeated consecutive failed logins. Because every test shares a single account, tests that deliberately fail a login are:

- tagged `@lockout-risk`
- run in **Chromium only**
- **never retried**

This limits each full run to two failed attempts. Use `npm run test:no-lockout` when re-running the suite repeatedly during development.

### No CI artifacts

Playwright traces and HTML reports record the values typed into fields, including the password. GitHub masks secrets in logs but not inside uploaded files, and artifacts on a public repository can be downloaded by other users. CI therefore reports through logs and GitHub annotations only, and failures are reproduced and debugged locally.

### User enumeration

The login page shows the same message for an unregistered email as for a wrong password, so it can't be used to discover which emails have accounts. A dedicated test guards against this regressing.

## Continuous integration

The workflow in `.github/workflows/playwright.yml` runs on every push and pull request to `main`, and can be triggered manually from the Actions tab. It has two jobs:

1. **Quality**: type check, lint, and format check (fast, no secrets)
2. **Tests**: the full Playwright suite across three browsers, run only if quality passes

Runs are queued rather than run in parallel so that two runs never log in to the shared account at the same time.

## Known limitations and possible improvements

- **Tests run against production.** Results can be affected by Hudl outages, deployments, or changes to bot protection. Setting `BASE_URL` would allow the suite to target another environment without code changes.
- **One shared test account.** Parallel tests log in to the same account. Separate accounts per worker would remove this coupling.
- **Error messages are asserted as exact text.** This catches unintended copy changes but means intentional wording changes require updating `testData.ts`.
- **Possible additions:** automated accessibility scanning (e.g. `@axe-core/playwright`), mobile viewport projects, and reusing an authenticated session (`storageState`) for future tests beyond the login flow.
