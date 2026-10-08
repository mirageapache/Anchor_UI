# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@anchor-ui/core` — a framework-agnostic Web Component library built with Lit 3 + TypeScript, styled by SCSS design tokens exposed as CSS custom properties. Published as ESM-only. Elements use the `aui-` prefix (`<aui-button>`, `<aui-tooltip>`, …). Docs/specs live in `doc/` (written in Traditional Chinese): `anchor-ui-spec.md`, `design-system.md` (token dictionary), `anchor-ui-components-list.md` (20 planned components), `anchor-ui-development-schedule.md` (phases / TASK-xxx ids referenced in commit messages).

## Commands

Package manager is pnpm (workspace includes `examples/*`); Node version in `.nvmrc`.

- `pnpm storybook` — Storybook on :6006 (primary dev/preview surface); `pnpm dev` — plain Vite server
- `pnpm build` — `tsc && vite build && pnpm build:tokens` → `dist/` (`index.js`, `.d.ts`, `styles.css`, `tokens.css`)
- `pnpm typecheck`, `pnpm lint`, `pnpm stylelint`, `pnpm format:check` (these four are what CI runs before build; `:fix` / `format` variants exist)
- `pnpm test` — web-test-runner (Playwright Chromium) over `src/components/**/*.test.ts`
  - single file: `pnpm test --files src/components/button/button.test.ts` (or `pnpm wtr "<glob>"`)
  - `pnpm test:watch`, `pnpm test:coverage` (thresholds: 85% statements/functions/lines, 75% branches)
  - `pnpm test:a11y` — only `*.a11y.test.ts` (axe-core via `@open-wc/testing`'s `to.be.accessible()`)
- `pnpm test:vue` / `pnpm test:angular` — integration tests in `examples/vue3` and `examples/angular` (vitest + happy-dom) that consume the library via `workspace:*`

Commits are enforced by commitlint (Conventional Commits; types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert) and Husky + lint-staged on pre-commit.

## Architecture

**Component layout** — each component is a folder `src/components/<name>/` with `<name>.ts` (LitElement class), `<name>.styles.ts` (`css` tagged template), `<name>.types.ts`, `index.ts` (re-exports class + types), `<name>.test.ts`, `<name>.a11y.test.ts`. A new component must also be exported from `src/components/index.ts` (which `src/index.ts` re-exports), get its own `./<name>` entry in `package.json` `exports` plus its `index.js` and `<name>.js` (the module calling `customElements.define`) in `sideEffects`, and gets a story in `src/stories/`. `pnpm verify:package` (run in CI after build) fails if any of these are missing. Vite picks up the build entry automatically.

**Tokens** — `src/tokens/*.scss` is the single source of truth (colors, typography, spacing, radius, motion). It is compiled two ways: into `dist/tokens.css` via `build:tokens` (sass), and also exposed as source SCSS through package exports (`./tokens`, `./reset`). Component styles reference tokens via `var(--space-lg, 24px)` with literal fallbacks; they never hardcode theme values.

**Theming** — dark mode is driven by `data-theme="dark"` on `<html>`. `setTheme` / `getTheme` / `toggleTheme` in `src/index.ts` manage it and briefly add a `.theme-transitioning` class for smooth transitions.

**Build** — Vite library mode, ESM-only with `preserveModules` (output mirrors `src/`): a full entry `src/index.ts` (registers every component) plus one entry per `src/components/*/index.ts`, exposed as `@anchor-ui/core/<name>` for tree-shakable on-demand imports. `lit*` and `@floating-ui/*` are externalized (`@floating-ui/dom` is a runtime dependency); test, story and `test-utils` files are excluded from the `.d.ts` output. `__PKG_VERSION__` is injected from `package.json` via Vite `define` (declared in `src/env.d.ts`). `@` aliases `src/`.

**Tooltip** is the most involved component: native Popover API (top layer) + `@floating-ui/dom` (`computePosition`/`autoUpdate`/flip/shift/arrow), emits cancelable `aui-show`/`aui-hide` and `aui-after-show`/`aui-after-hide` events. Custom events are prefixed `aui-`.

**Tests** — run in real Chromium via web-test-runner with esbuild TS transform. A11y tests load `/dist/tokens.css` in a `<link>` so contrast checks use real tokens — **run `pnpm build` first** or color-contrast results will be wrong/missing.

**Examples** — `examples/vue3` and `examples/angular` verify the custom elements work inside host frameworks (property/event binding); they depend on the built `dist/`.

## Conventions

- JSDoc on component classes uses the custom-elements-manifest tags (`@element`, `@slot`, `@csspart`, `@fires`); keep them updated when changing a component's API.
- Source comments and docs are mostly in Traditional Chinese; match the surrounding language.
- Font files are intentionally not bundled — only font-family tokens are defined (see README "字體載入").
