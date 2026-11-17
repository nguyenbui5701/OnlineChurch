import { closeDemo, createDemoServer, listenDemo } from './app.js';
import { DEMO_HOST, parsePort } from './config.js';

async function main(): Promise<void> {
  const port = parsePort(process.env.PORT);
  const server = createDemoServer();
  let closing = false;
  const shutdown = (): void => {
    if (closing) return;
    closing = true;
    void closeDemo(server).then(() => {
      console.log('OnlineChurch DEMO stopped.');
      if (process.connected) process.disconnect?.();
    }).catch(() => { process.exitCode = 1; if (process.connected) process.disconnect?.(); });
  };
  try {
    await listenDemo(server, port);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      throw new Error(`EADDRINUSE: ${DEMO_HOST}:${port} is busy. Choose another PORT; no process was stopped.`);
    }
    throw error;
  }
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  // Private parent/child IPC permits graceful smoke teardown on Windows.
  if (process.send) {
    process.on('message', message => { if (message === 'shutdown') shutdown(); });
    process.on('disconnect', shutdown);
    process.send({ type: 'ready', port, host: DEMO_HOST });
  }
  console.log(`OnlineChurch DEMO: http://${DEMO_HOST}:${port} (offline; liveConnected=false)`);
}

void main().catch(error => {
  console.error(error instanceof Error ? error.message : 'DEMO startup failed.');
  process.exitCode = 1;
  if (process.connected) process.disconnect?.();
});
