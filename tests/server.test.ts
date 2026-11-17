import { afterEach, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import { request as httpRequest } from 'node:http';
import { createDemoServer, listenDemo, closeDemo } from '../apps/server/src/app.js';
import { parsePort } from '../apps/server/src/config.js';
import { ChurchSnapshotSchema, createInitialSnapshot } from '@onlinechurch/shared';

const servers: Server[] = [];
afterEach(async () => { await Promise.all(servers.splice(0).map(closeDemo)); });
async function start() {
  const server = createDemoServer();
  servers.push(server);
  const port = await listenDemo(server, 0);
  return { server, port, url: `http://127.0.0.1:${port}` };
}
const request = (url: string, init?: RequestInit) => fetch(url, { ...init, signal: AbortSignal.timeout(2_000) });

describe('configuration boundary', () => {
  it('defaults to 3100 and accepts explicit valid ports', () => {
    expect(parsePort(undefined)).toBe(3100);
    expect(parsePort('3101')).toBe(3101);
    expect(parsePort('1')).toBe(1);
    expect(parsePort('65535')).toBe(65535);
  });
  it.each(['', '0', '3000', '65536', '-1', '3.1', '1e3', ' 3100', '3100x', null, 3100])('rejects PORT %j', input => {
    expect(() => parsePort(input)).toThrow('PORT');
  });
  it.each([-1, 3000, 65536, NaN, 1.5])('rejects invalid programmatic listener %j', async port => {
    await expect(listenDemo(createDemoServer(), port)).rejects.toThrow('port');
  });
});

describe('offline HTTP', () => {
  it('binds IPv4 loopback and returns typed, deterministic DEMO state', async () => {
    const { server, url, port } = await start();
    expect(server.address()).toEqual({ address: '127.0.0.1', family: 'IPv4', port });
    const health = await request(`${url}/health`);
    expect(health.status).toBe(200);
    expect(health.headers.get('content-type')).toContain('application/json');
    expect(await health.json()).toEqual({ app: 'onlinechurch', ok: true, mode: 'DEMO', liveConnected: false });
    for (let index = 0; index < 3; index++) {
      const response = await request(`${url}/api/demo/state`);
      expect(ChurchSnapshotSchema.parse(await response.json())).toEqual(createInitialSnapshot());
    }
    const page = await request(`${url}/`);
    expect(await page.text()).toContain('DEMO — Không gian mô phỏng, không phải Thánh lễ');
    expect(page.headers.get('content-security-policy')).toContain("default-src 'none'");
  });
  it('rejects unrecognized paths, writes, and cross-origin/foreign-host access without echoing input', async () => {
    const { url } = await start();
    for (const [path, init, status, error] of [
      ['/<script>secret</script>', {}, 404, 'NOT_FOUND'],
      ['/api/demo/state', { method: 'POST', body: 'private' }, 405, 'METHOD_NOT_ALLOWED'],
      ['/health', { headers: { Origin: 'https://untrusted.invalid' } }, 403, 'LOCAL_ONLY'],
    ] as const) {
      const response = await request(`${url}${path}`, init);
      expect(response.status).toBe(status);
      expect(await response.json()).toEqual({ error });
    }
    expect((await request(`${url}/health`, { headers: { Origin: url } })).status).toBe(200);
    // Node fetch normalizes Host; raw HTTP is required to exercise this boundary.
    const status = await new Promise<number | undefined>((resolve, reject) => {
      const req = httpRequest(`${url}/health`, { headers: { Host: 'untrusted.invalid' }, timeout: 2_000 }, response => {
        response.resume();
        response.on('end', () => resolve(response.statusCode));
      });
      req.on('timeout', () => req.destroy(new Error('HTTP test timeout')));
      req.on('error', reject);
      req.end();
    });
    expect(status).toBe(403);
  });
  it('reports EADDRINUSE while leaving the original owned listener working', async () => {
    const first = await start();
    const second = createDemoServer();
    servers.push(second);
    await expect(listenDemo(second, first.port)).rejects.toMatchObject({ code: 'EADDRINUSE' });
    expect((await request(`${first.url}/health`)).status).toBe(200);
  });
  it('shutdown closes connections, releases its port, and is idempotent', async () => {
    const { server, port, url } = await start();
    await request(`${url}/health`);
    await closeDemo(server);
    await closeDemo(server);
    const replacement = createDemoServer();
    servers.push(replacement);
    expect(await listenDemo(replacement, port)).toBe(port);
  });
});
