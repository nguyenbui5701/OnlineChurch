import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateBuildDirectory } from './build-path.mjs';
import { assertPortClosed, launchDemo, readJson, stopDemo, unusedPort, waitReady } from './demo-process.mjs';

/** @type {ReturnType<typeof launchDemo> | undefined} */
let demo;
try {
  const directory = await validateBuildDirectory(process.env.APP_BUILD_DIRECTORY);
  const entry = resolve(directory, 'server.mjs');
  await access(entry).catch(() => { throw new Error('Build missing. Run npm.cmd run build first.'); });
  const port = await unusedPort();
  demo = launchDemo(entry, String(port));
  await waitReady(demo);
  const health = await readJson(port, '/health');
  const state = await readJson(port, '/api/demo/state');
  assert.deepEqual(health, { app: 'onlinechurch', ok: true, mode: 'DEMO', liveConnected: false });
  assert.deepEqual(state, { schemaVersion: 1, source: 'DEMO', scene: 'PLACEHOLDER', revision: 0, actors: [], candles: [] });
  assert.deepEqual(await readJson(port, '/api/demo/state'), state);
  console.log(`GET /health ${JSON.stringify(health)}`);
  console.log(`GET /api/demo/state ${JSON.stringify(state)}`);
  await stopDemo(demo);
  assert.equal(demo.child.exitCode, 0);
  await assertPortClosed(port);
  console.log(`PASS: offline DEMO on 127.0.0.1:${port}; owned child exited 0; port released.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Smoke failed.');
  process.exitCode = 1;
} finally {
  if (demo) {
    try { await stopDemo(demo); }
    catch (error) { console.error(error); process.exitCode = 1; }
  }
}
