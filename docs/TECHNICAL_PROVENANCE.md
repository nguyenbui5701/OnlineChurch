# TASK-002 technical provenance

Baseline: OnlineChurch `5618bc5741f04920990a54d5df97f4fa53cc4e19`.
TASK-002 reuses this repository's merged TASK-001 workspace, server and tests. No additional OnlinePagoda source files were read or copied in this task. No image, video, audio, Concept 03 preview/technical overlay or user-supplied artwork was copied or integrated.

All visible placeholder primitives are newly authored code in `apps/overlay/src/scene.ts`. Synthetic polygons in `layout.ts` are original diagnostic coordinates labelled `SYNTHETIC_DEMO_ONLY`; they are not the proposed Concept 03 coordinates or final sacred masks. The future inventory in Design/visual was read as planning material only. No copyright or Catholic depiction approval is inferred from that inventory.

## New dependency footprint and actual license metadata

Exact direct dependency: **pixi.js 8.23.0 (MIT)**, pinned in `apps/overlay/package.json` and lockfile. Existing esbuild bundles it locally; no Vite server, new runtime service/port, CDN, Playwright/browser dependency, image loader calls or external font was added. The workspace package @onlinechurch/overlay is first-party/private. PixiJS uses WebGL/canvas APIs provided by the Owner's browser; no Node renderer or GPU rendering capability is claimed from unit tests.

Installed production dependency metadata checked on 2026-11-17:

| Added package | Version | Declared license |
| --- | --- | --- |
| pixi.js | 8.23.0 | MIT |
| @types/earcut | 3.0.0 | MIT |
| @webgpu/types | 0.1.74 | BSD-3-Clause |
| @xmldom/xmldom | 0.8.15 | MIT |
| colord | 2.13.0 | MIT |
| earcut | 3.2.4 | ISC |
| eventemitter3 | 5.0.4 | MIT |
| gifuct-js | 2.1.2 | MIT |
| ismobilejs | 1.1.1 | MIT |
| js-binary-schema-parser | 2.0.3 | MIT |
| parse-svg-path | 0.2.0 | MIT |
| tiny-lru | 11.4.7 | BSD-3-Clause |

These transitive packages are in PixiJS's installed tree; this does not mean every parser/loader is used by the application. Runtime application code loads no SVG/GIF/image assets. The build collects actual installed license/copyright/notice files for package inputs seen by esbuild and emits `overlay/THIRD_PARTY_LICENSES.txt`; missing notices fail the build. Generated notices are served locally and referenced in the JS banner. Zod's MIT notice remains embedded in the server bundle. Installed-only type dependencies are not browser code. Runtime Zod remains 4.6.7/MIT. Existing dev toolchain versions/licenses are unchanged from TASK-001 below.

`npm.cmd install` after final PixiJS pin reported audited 61 packages and **0 vulnerabilities**. This is a registry result at installation time. Initial checks of 8.23.0 and 8.14.0 reproduced the same upstream declaration incompatibility with exactOptionalPropertyTypes. The final pin is 8.23.0; no dependency source patch was applied. The two required typecheck passes and their precise declaration-checking exception are documented in DEVELOPMENT.md. SA must assess that compatibility tradeoff; no claim of full exact-optional checking of PixiJS declarations is made.

## API/source references

- [PixiJS Application documentation](https://pixijs.com/8.x/guides/components/application): async initialization and owned Application lifecycle. Actual installed implementations/types were also read before integration.
- [PixiJS ticker plugin](https://pixijs.com/8.x/guides/components/application/ticker-plugin): autoStart=false, private ticker; this static preview renders only after mount, resize or guide toggling.
- Installed `pixi.js/lib/unsafe-eval/init.mjs`: verifies the special entry point supplies non-eval implementations for strict CSP. Despite its name, it does not grant CSP unsafe-eval permission. Graphics/text registrations, renderer init and destroy implementations were inspected locally.
- TASK-002 Task/Design sources specify layout slots, provisional UI safe bands, primitive-only visuals, no art integration and deny-by-default until later reviewed masks. Their content is unchanged by this implementation.

Next dependency: **Owner-approved Visual Batch A/B → future TASK-002B**, including approved art provenance/license/hashes and final geometry. This scaffold does not clear those gates or introduce live platform policy assumptions.

---

# Historical TASK-001 technical provenance

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
