import { createServer } from 'node:http';
import type { Server, ServerResponse } from 'node:http';
import { createInitialSnapshot } from '@onlinechurch/shared';
import { DEMO_HOST } from './config.js';
import { placeholderHtml } from './placeholder.js';

function json(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

export function createDemoServer(): Server {
  const state = createInitialSnapshot();
  return createServer({ requestTimeout: 5_000, headersTimeout: 5_000, keepAliveTimeout: 1_000 }, (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    const port = request.socket.localPort;
    const allowedHosts = [`${DEMO_HOST}:${port}`, `localhost:${port}`];
    if (!request.headers.host || !allowedHosts.includes(request.headers.host)
      || (request.headers.origin !== undefined && !allowedHosts.some(host => request.headers.origin === `http://${host}`))) {
      json(response, 403, { error: 'LOCAL_ONLY' });
      return;
    }
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET');
      json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
      return;
    }
    switch (request.url) {
      case '/health':
        json(response, 200, { app: 'onlinechurch', ok: true, mode: 'DEMO', liveConnected: false });
        break;
      case '/api/demo/state': json(response, 200, state); break;
      case '/':
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(placeholderHtml);
        break;
      default: json(response, 404, { error: 'NOT_FOUND' });
    }
  });
}

/** Port zero is for owned ephemeral test listeners only; PORT env never accepts it. */
export async function listenDemo(server: Server, port: number): Promise<number> {
  if (!Number.isInteger(port) || port < 0 || port > 65535 || port === 3000) {
    throw new Error('Invalid DEMO listener port; port 3000 is reserved.');
  }
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => reject(error);
    server.once('error', onError);
    server.listen(port, DEMO_HOST, () => {
      server.off('error', onError);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing DEMO listener address.');
  return address.port;
}

export async function closeDemo(server: Server): Promise<void> {
  if (!server.listening) return;
  await new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
    server.closeAllConnections();
  });
}
