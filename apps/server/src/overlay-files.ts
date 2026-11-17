import { open } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ServerResponse } from 'node:http';
import { validateArtifact } from '../../../scripts/artifact-paths.mjs';

// Build-time constants anchor generated artifacts to this checkout, independent of cwd.
declare const __ONLINECHURCH_ROOT__: string | undefined;
declare const __ONLINECHURCH_OUTPUT__: string | undefined;
const root = typeof __ONLINECHURCH_ROOT__ === 'string' ? __ONLINECHURCH_ROOT__ : fileURLToPath(new URL('../../../', import.meta.url));
const defaultOutput = typeof __ONLINECHURCH_OUTPUT__ === 'string' ? __ONLINECHURCH_OUTPUT__ : resolve(root, 'dist');

const routes = new Map([
  ['/overlay/', { name: 'overlay/index.html', mime: 'text/html; charset=utf-8' }],
  ['/overlay/app.js', { name: 'overlay/app.js', mime: 'text/javascript; charset=utf-8' }],
  ['/overlay/app.css', { name: 'overlay/app.css', mime: 'text/css; charset=utf-8' }],
  ['/overlay/THIRD_PARTY_LICENSES.txt', { name: 'overlay/THIRD_PARTY_LICENSES.txt', mime: 'text/plain; charset=utf-8' }],
]);
export function isOverlayRoute(url: string | undefined): boolean { return routes.has(url ?? ''); }

/** Exact map keys, never user-controlled filesystem fragments. */
export async function serveOverlay(url: string, response: ServerResponse): Promise<void> {
  const route = routes.get(url);
  if (!route) throw new Error('Unknown overlay route.');
  try {
    const requested = process.env.APP_BUILD_DIRECTORY;
    if (requested !== undefined && requested.trim() === '') throw new Error('Empty build directory.');
    const output = requested === undefined ? defaultOutput : resolve(root, requested);
    if (url === '/overlay/') {
      for (const dependency of routes.values()) await validateArtifact(root, output, dependency.name, false);
    }
    const path = await validateArtifact(root, output, route.name, false);
    const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    let contents: Buffer;
    try {
      const info = await handle.stat();
      if (!info.isFile() || info.nlink !== 1 || info.size > 8_000_000) throw new Error('Unsafe artifact.');
      await validateArtifact(root, output, route.name, false);
      contents = await handle.readFile();
    } finally { await handle.close(); }
    if (response.destroyed) return;
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'none'; img-src 'none'; font-src 'none'; worker-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    response.writeHead(200, { 'Content-Type': route.mime });
    response.end(contents);
  } catch {
    if (response.destroyed) return;
    response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('OnlineChurch overlay: build required or generated files unsafe. Run npm.cmd run build.');
  }
}
