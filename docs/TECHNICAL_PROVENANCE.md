# TASK-001 technical provenance

Implementation baseline: OnlineChurch `f241a76774b5f786709d0915df01a5614af6603f`.
Reference: [OnlinePagoda at ee55ee81e507135b805d116586f5814eed9a89a9](https://github.com/nguyenbui5701/OnlinePagoda/tree/ee55ee81e507135b805d116586f5814eed9a89a9).
The following four files were read from that exact remote commit. No local OnlinePagoda installation was accessed.

| Reference file | Pattern influencing this implementation | OnlineChurch implementation |
| --- | --- | --- |
| `package.json` | Node >=22.12, private npm workspaces, ESM, strict TS workflow, tsx/Vitest | Root `package.json`, `tsconfig.json`, `vitest.config.ts` |
| `scripts/build.mjs` | esbuild Node ESM server bundle and an optional build-directory setting | `scripts/build.mjs`; new validation rejects external paths and symlinks before output, restricts overrides to `dist/**`, performs no recursive cleanup |
| `docs/DEVELOPMENT.md` | Windows `npm.cmd`, reproducible lockfile install, separate generated outputs | `docs/DEVELOPMENT.md`; DEMO-only commands and UAT checklist |
| `packages/shared/package.json` | Small private shared workspace exposing TypeScript source | `@onlinechurch/shared`; independently authored schemas, fixtures and normalization |

**Original source code files copied: none.** No reference assets, rites, engine, connector, launchers, voice code, cached data or test fixtures were copied. No imports or runtime paths point to OnlinePagoda. Its source license and asset rights were not inferred or cleared for future copying; this task uses patterns only.

## Dependencies and license evidence

Versions are exact in manifests and locked by `package-lock.json`. License labels below were read from the installed package manifests and checked against lockfile metadata on 2026-11-17.

| Package | Version | Role | Declared license |
| --- | --- | --- | --- |
| `zod` | 4.6.7 | Only third-party production dependency; shared input/snapshot validation | MIT |
| `typescript` | 5.9.3 | Development: strict type checking, including build/smoke JS | Apache-2.0 |
| `vitest` | 5.1.0 | Development: unit/integration test runner | MIT |
| `tsx` | 4.23.15 | Development: DEMO/source test execution | MIT |
| `esbuild` | 0.28.2 | Development: self-contained Node server bundle | MIT |
| `@types/node` | 24.19.2 | Development: Node types | MIT |

`@onlinechurch/server` and `@onlinechurch/shared` are private first-party workspace packages, not external library dependencies. No project license has been invented. The only external production dependency is Zod; it has no production dependencies of its own. Its actual installed MIT license (`node_modules/zod/LICENSE`, copyright 2025 Colin McDonnell) is included verbatim in the generated server bundle. The bundle still requires Node.js >=22.12, but does not require node_modules at runtime.

No Express, React, PixiJS, Electron, TTS, TikTok connector, Socket.IO or Vite application dependency was added. Vitest's transitive development tooling is recorded in the lockfile and is not shipped in the DEMO server bundle.

`npm.cmd install` and clean `npm.cmd ci` reported **0 vulnerabilities**. `npm.cmd audit --omit=dev --json` reported **0 production vulnerabilities**. A separate full audit attempt encountered registry `ECONNRESET`; the subsequent clean install completed its full audit successfully. These are registry results at verification time, not a guarantee about future advisories.

The registry and pinned source reads occurred during setup only. Runtime code makes no outbound requests. Automated HTTP tests and smoke use owned loopback listeners, synthetic identifiers and no credentials.
