import { fork } from 'node:child_process';
import { createServer } from 'node:net';

/** Reserve and release a loopback test port; no external listeners are inspected.
 * @returns {Promise<number>}
 */
export async function unusedPort() {
  const reservation = createServer();
  await new Promise((resolve, reject) => {
    reservation.once('error', reject);
    reservation.listen(0, '127.0.0.1', () => resolve(undefined));
  });
  const address = reservation.address();
  await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve(undefined)));
  if (!address || typeof address === 'string' || address.port === 3000) throw new Error('Invalid isolated test port.');
  return address.port;
}

/** Only this direct Node child is ever controlled; no shell or process tree.
 * @param {string} entry
 * @param {string} port
 * @param {string[]} [execArgv]
 */
export function launchDemo(entry, port, execArgv = []) {
  const child = fork(entry, [], {
    execArgv,
    windowsHide: true,
    env: { ...process.env, PORT: port },
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });
  let output = '';
  child.stdout?.on('data', chunk => { output = (output + String(chunk)).slice(-16_000); });
  child.stderr?.on('data', chunk => { output = (output + String(chunk)).slice(-16_000); });
  /** @type {Promise<{code: number | null, signal: NodeJS.Signals | null}>} */
  const exited = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => resolve({ code, signal }));
  });
  // Register before startup so the ready message cannot be missed.
  /** @type {Promise<void>} */
  const ready = new Promise(resolve => child.on('message', message => {
    if (typeof message === 'object' && message !== null && 'type' in message && message.type === 'ready') resolve();
  }));
  return { child, exited, ready, output: () => output };
}

/** @template T @param {Promise<T>} operation @param {number} ms @param {string} label */
export async function withTimeout(operation, ms, label) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  try {
    return await Promise.race([operation, new Promise(/** @param {(value: never) => void} _ */ (_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    })]);
  } finally { clearTimeout(timer); }
}

/** @param {ReturnType<typeof launchDemo>} demo */
export async function waitReady(demo) {
  await withTimeout(Promise.race([
    demo.ready,
    demo.exited.then(() => { throw new Error(`DEMO exited before ready: ${demo.output()}`); }),
  ]), 10_000, 'DEMO startup');
}

/** Windows does not deliver POSIX signals through child.kill; IPC closes the same server.
 * Forced fallback is a test failure, even if it successfully reaps the owned child.
 * @param {ReturnType<typeof launchDemo>} demo
 */
export async function stopDemo(demo) {
  if (demo.child.exitCode !== null || demo.child.signalCode !== null) return;
  try {
    if (demo.child.connected) demo.child.send('shutdown');
    else demo.child.kill('SIGTERM');
    const result = await withTimeout(demo.exited, 5_000, 'DEMO shutdown');
    if (!result || typeof result !== 'object' || !('code' in result) || result.code !== 0) {
      throw new Error(`Unclean DEMO shutdown: ${demo.output()}`);
    }
  } catch (error) {
    if (demo.child.exitCode === null && demo.child.signalCode === null) demo.child.kill('SIGKILL');
    await withTimeout(demo.exited, 5_000, 'Owned child cleanup');
    throw error;
  }
}

/** @param {number} port */
export async function assertPortClosed(port) {
  // Rebinding proves the child no longer owns its listener.
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once('error', reject);
    probe.listen(port, '127.0.0.1', () => resolve(undefined));
  });
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve(undefined)));
}

/** Only loopback HTTP requests, bounded even when a server stalls.
 * @param {number} port @param {string} path
 */
export async function readJson(port, path) {
  if (!Number.isInteger(port) || port < 1 || port > 65535 || port === 3000 || !['/health', '/api/demo/state'].includes(path)) {
    throw new Error('Invalid smoke request.');
  }
  const response = await fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(2_000), redirect: 'error' });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`Unexpected response from ${path}: ${response.status}`);
  }
  return response.json();
}
