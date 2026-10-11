# Deno to Node Migration

## Package and task runner

- [x] Add npm scripts that invoke the existing `tasks.ts` entry point through a Node-compatible TypeScript runner.
- [x] Add one local task utility module at `task/task.ts` for task registration, shell execution, filesystem helpers, package building, tests/coverage, and other Tasksmith operations not handled by Vite.
- [x] Remove Tasksmith imports and replace Deno import-map aliases with npm dependencies and TypeScript path mappings.
- [x] Keep ParseBox in `devDependencies` as `@sinclair/parsebox`; it is already published to npm and is only used by the syntax task.
- [x] Preserve the existing command names and behavior for build, clean, publish, local/compliance builds, format/lint, tests, coverage, benchmarks, spec, syntax, examples, metrics, compiler checks, and website tasks.

## Build, tests, and spec tooling

- [x] Port package building to Node while retaining the existing ESM package layout, subpath exports, declarations, metadata, archive, and package validation.
- [x] Replace `Deno.test` in `test/common/assert.ts` with `node:test` while retaining `Assert.Context` as the test registration abstraction.
- [x] Migrate test discovery, name filtering, watch mode, and coverage reporting to Node tooling; preserve `npm run report` and its HTML report.
- [x] Port all `task/spec` operations to Node, including Tasksmith-backed cloning, cleanup, directory traversal, and writes, plus Deno-backed reads.
- [x] Replace Deno filesystem/stdout APIs and Tasksmith calls in the other task modules with Node APIs or the shared task utility module.

## Website and formatting

- [x] Use Vite for website serving, bundling, and reload; remove Tasksmith's website serving and Deno bundling.
- [x] Preserve markdown-to-HTML and manifest generation for the website using a small Vite integration where Vite does not provide that behavior.
- [x] Configure ESLint formatting to match the existing Deno settings as closely as possible: no semicolons, single quotes, no trailing commas, and a 240-column width.
- [x] Translate `deno-fmt-*` and `deno-lint-*` directives into ESLint-compatible directives, keeping formatter ignores for complex TypeBox type definitions.
- [x] Avoid broad source reformatting; only migrate the Deno directives and make source changes required for Node compatibility.

## CI, cleanup, and verification

- [x] Update build, nightly, and publish workflows to use supported Node.js LTS releases and npm only.
- [x] Remove Deno configuration, lockfile, workflow setup, and remaining Deno-specific references after equivalent Node tasks work.
- [x] Verify installation from a clean npm lockfile, type-checking, tests, coverage, package build/archive validation, website dev/build, and all safe task commands.
- [x] Review external/destructive task commands (such as cleaning generated targets or pushing release tags) without performing those side effects.
