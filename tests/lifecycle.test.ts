import { afterEach, describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { createDemoServer, listenDemo, closeDemo } from '../apps/server/src/app.js';
import { assertPortClosed, launchDemo, readJson, stopDemo, unusedPort, waitReady, withTimeout } from '../scripts/demo-process.mjs';
import { repositoryRoot } from '../scripts/build-path.mjs';

const owned: ReturnType<typeof launchDemo>[] = [];
afterEach(async () => { for (const demo of owned.splice(0)) await stopDemo(demo); });
function launch(port: string) {
  const demo = launchDemo(resolve(repositoryRoot, 'apps/server/src/index.ts'), port, ['--import', 'tsx']);
  owned.push(demo);
  return demo;
}

describe('real child lifecycle and failure paths', () => {
  it.each(['SIGINT', 'SIGTERM'])('closes cleanly when Node receives the %s event', async signal => {
    const port = await unusedPort();
    const demo = launchDemo(resolve(repositoryRoot, 'tests/fixtures/signal-child.ts'), String(port), ['--import', 'tsx']);
    owned.push(demo);
    await waitReady(demo);
    demo.child.send(`test:${signal}`);
    expect(await withTimeout(demo.exited, 5_000, signal)).toEqual({ code: 0, signal: null });
    expect(demo.output()).toContain('DEMO stopped');
    await assertPortClosed(port);
  });
  it('starts on an isolated port and exits cleanly using Windows-compatible private IPC', async () => {
    const port = await unusedPort();
    const demo = launch(String(port));
    await waitReady(demo);
    expect(await readJson(port, '/health')).toMatchObject({ mode: 'DEMO', liveConnected: false });
    await stopDemo(demo);
    expect(demo.child.exitCode).toBe(0);
    expect(demo.output()).toContain('DEMO stopped');
    await assertPortClosed(port);
  });
  it('rejects invalid PORT at startup and does not create a listener', async () => {
    const demo = launch('3000');
    await expect(waitReady(demo)).rejects.toThrow('PORT');
    expect(demo.child.exitCode).toBe(1);
  });
  it('prints EADDRINUSE and leaves the existing owned server healthy', async () => {
    const occupied = createDemoServer();
    const port = await listenDemo(occupied, 0);
    try {
      const demo = launch(String(port));
      await expect(waitReady(demo)).rejects.toThrow('EADDRINUSE');
      expect(demo.child.exitCode).toBe(1);
      expect(await readJson(port, '/health')).toMatchObject({ ok: true });
    } finally { await closeDemo(occupied); }
  });
  it('exits when its private parent IPC disconnects', async () => {
    const port = await unusedPort();
    const demo = launch(String(port));
    await waitReady(demo);
    demo.child.disconnect();
    expect(await withTimeout(demo.exited, 5_000, 'Parent disconnect')).toEqual({ code: 0, signal: null });
    await assertPortClosed(port);
  });
  it('bounds stalled work and rejects invalid smoke request targets', async () => {
    await expect(withTimeout(new Promise(() => {}), 10, 'Stall')).rejects.toThrow('timed out');
    await expect(readJson(3000, '/health')).rejects.toThrow('Invalid');
    await expect(readJson(3100, '//external.invalid')).rejects.toThrow('Invalid');
  });
});
