import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { link, lstat, mkdir, mkdtemp, readFile, rmdir, symlink, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { request } from 'node:http';
import type { Server } from 'node:http';
import { GENERATED_FILES, validateArtifact } from '../scripts/artifact-paths.mjs';
import { repositoryRoot, validateBuildDirectory } from '../scripts/build-path.mjs';
import { closeDemo, createDemoServer, listenDemo } from '../apps/server/src/app.js';

const directories: string[] = [];
const extraFiles: string[] = [];
const servers: Server[] = [];
const previousDirectory = process.env.APP_BUILD_DIRECTORY;
afterEach(async () => {
  if (previousDirectory === undefined) delete process.env.APP_BUILD_DIRECTORY;
  else process.env.APP_BUILD_DIRECTORY = previousDirectory;
  for (const server of servers.splice(0)) await closeDemo(server);
  for (const file of extraFiles.splice(0).reverse()) await unlink(file);
  for (const directory of directories.splice(0).reverse()) {
    // Exact generated names only. Never recurse through an unknown path or link.
    for (const name of GENERATED_FILES) {
      await unlink(join(directory, name)).catch(error => { if (error.code !== 'ENOENT') throw error; });
    }
    await rmdir(join(directory, 'overlay')).catch(error => { if (error.code !== 'ENOENT') throw error; });
    await rmdir(directory);
  }
});
async function scratch() {
  await mkdir(resolve(repositoryRoot, 'dist'), { recursive: true });
  const directory = await mkdtemp(resolve(repositoryRoot, 'dist', 'overlay-security-'));
  directories.push(directory);
  return directory;
}
async function fixture() {
  const directory = await scratch();
  await mkdir(join(directory, 'overlay'));
  for (const name of GENERATED_FILES) await writeFile(join(directory, name), `fixture ${name}`);
  return directory;
}
async function start(directory: string) {
  process.env.APP_BUILD_DIRECTORY = directory;
  const server = createDemoServer();
  servers.push(server);
  return listenDemo(server, 0);
}
function raw(port: number, path: string, headers: Record<string, string> = {}, method = 'GET') {
  return new Promise<{ status: number | undefined; type: string | undefined; csp: string | string[] | undefined; body: string }>((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method, headers, timeout: 3000 }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, type: response.headers['content-type'], csp: response.headers['content-security-policy'], body }));
    });
    req.on('timeout', () => req.destroy(new Error('HTTP timeout')));
    req.on('error', reject);
    req.end();
  });
}
function build(directory: string) {
  return spawnSync(process.execPath, ['scripts/build.mjs'], {
    cwd: repositoryRoot, windowsHide: true, encoding: 'utf8', timeout: 15000,
    env: { ...process.env, APP_BUILD_DIRECTORY: directory },
  });
}

describe('overlay exact static routes and missing builds', () => {
  it('serves only fixed MIME-typed assets with local-only CSP and existing request guards', async () => {
    const directory = await fixture();
    const port = await start(directory);
    for (const [path, mime] of [['/overlay/', 'text/html'], ['/overlay/app.js', 'text/javascript'], ['/overlay/app.css', 'text/css'], ['/overlay/THIRD_PARTY_LICENSES.txt', 'text/plain']]) {
      const result = await raw(port, path!);
      expect(result.status).toBe(200);
      expect(result.type).toContain(mime);
      expect(result.csp).toContain("script-src 'self'");
      expect(result.csp).toContain("connect-src 'none'");
      expect(result.csp).not.toContain('unsafe-eval');
    }
    expect((await raw(port, '/overlay/', { Origin: 'https://foreign.invalid' })).status).toBe(403);
    expect((await raw(port, '/overlay/', { Host: 'foreign.invalid' })).status).toBe(403);
    expect((await raw(port, '/overlay/', {}, 'POST')).status).toBe(405);
    expect((await raw(port, '/')).body).toContain('href="/overlay/"');
  });
  it('rejects raw traversal/encoded paths, query suffixes and unallowlisted files', async () => {
    const port = await start(await fixture());
    for (const path of ['/overlay/../server.mjs', '/overlay/../../README.md', '/overlay/%2e%2e/server.mjs',
      '/overlay/%252e%252e/server.mjs', '/overlay/..%5cserver.mjs', '/overlay/app.js%00', '/overlay/app.js:stream',
      '/overlay//app.js', '/overlay/app.js?path=../../package.json', '/overlay/.env', '/overlay/app.js.map',
      '/package.json', '/Design/README.md', '/server.mjs']) {
      const result = await raw(port, path);
      expect(result.status, path).toBe(404);
      expect(result.body).toBe('{"error":"NOT_FOUND"}');
    }
  });
  it('missing or partial build returns 503 while health/state keep working', async () => {
    const directory = await scratch();
    const port = await start(directory);
    expect((await raw(port, '/overlay/')).status).toBe(503);
    expect((await raw(port, '/overlay/app.js')).body).toContain('build required');
    await mkdir(join(directory, 'overlay'));
    await writeFile(join(directory, 'overlay/index.html'), 'partial');
    expect((await raw(port, '/overlay/')).status).toBe(503);
    expect(JSON.parse((await raw(port, '/health')).body)).toEqual({ app: 'onlinechurch', ok: true, mode: 'DEMO', liveConnected: false });
    expect(JSON.parse((await raw(port, '/api/demo/state')).body)).toEqual({ schemaVersion: 1, source: 'DEMO', scene: 'PLACEHOLDER', revision: 0, actors: [], candles: [] });
  });
  it('rejects bad runtime override without serving repo files or changing JSON endpoints', async () => {
    const port = await start('../OnlinePagoda');
    expect((await raw(port, '/overlay/')).status).toBe(503);
    expect((await raw(port, '/health')).status).toBe(200);
    process.env.APP_BUILD_DIRECTORY = '';
    expect((await raw(port, '/overlay/')).status).toBe(503);
  });
});

describe('per-artifact build and serving confinement', () => {
  it.each(GENERATED_FILES.filter(name => name !== 'server.mjs'))('rejects hardlinked %s before any output overwrite and on HTTP read', async name => {
    const directory = await fixture();
    const target = join(directory, name);
    const sentinel = join(directory, 'sentinel.txt');
    await writeFile(sentinel, 'must not change');
    extraFiles.push(sentinel);
    await unlink(target);
    await link(sentinel, target);
    await expect(validateBuildDirectory(directory)).rejects.toThrow('regular');
    const result = build(directory);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('regular');
    expect(await readFile(join(directory, 'server.mjs'), 'utf8')).toBe('fixture server.mjs');
    expect(await readFile(sentinel, 'utf8')).toBe('must not change');
    const port = await start(directory);
    const route = name.endsWith('index.html') ? '/overlay/' : '/' + name;
    expect((await raw(port, route)).status).toBe(503);
  });
  it('rejects an overlay parent junction pointing outside the repository before build and serve', async () => {
    const directory = await scratch();
    const junction = join(directory, 'overlay');
    await symlink(dirname(resolve(repositoryRoot)), junction, process.platform === 'win32' ? 'junction' : 'dir');
    extraFiles.push(junction);
    await expect(validateBuildDirectory(directory)).rejects.toThrow('symlinks');
    const result = build(directory);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('symlinks');
    const port = await start(directory);
    expect((await raw(port, '/overlay/')).status).toBe(503);
    expect((await raw(port, '/overlay/app.js')).status).toBe(503);
    expect((await lstat(junction)).isSymbolicLink()).toBe(true);
  });
  it('rejects file-target directory links and arbitrary artifact names', async () => {
    const directory = await fixture();
    const target = join(directory, 'overlay/app.css');
    await unlink(target);
    await symlink(dirname(resolve(repositoryRoot)), target, process.platform === 'win32' ? 'junction' : 'dir');
    // Normal cleanup unlinks the junction itself, never its target.
    await expect(validateArtifact(repositoryRoot, directory, 'overlay/app.css')).rejects.toThrow('symlinks');
    await expect(validateArtifact(repositoryRoot, directory, '../package.json')).rejects.toThrow('allowlisted');
    expect((await raw(await start(directory), '/overlay/app.css')).status).toBe(503);
  });
});
