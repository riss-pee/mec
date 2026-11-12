# Playwright Testing & Verification Guide

This project includes automated Playwright testing (`@playwright/test`):
- Run tests: `npm run test:e2e` or `npx playwright test`
- Interactive UI test mode: `npm run test:e2e:ui`
- View report: `npx playwright show-report`

## Agent Visual QA Loop
 Coding agents can use the Playwright MCP tool or CLI to:
1. Launch local preview dev server: `npm run dev`
2. Run `browser_navigate` to `http://localhost:3000`
3. Execute `browser_take_screenshot` to verify layout alignment, fonts, and responsive behavior.
4. Run regression tests before shipping changes.
