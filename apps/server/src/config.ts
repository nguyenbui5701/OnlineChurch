export const DEMO_HOST = '127.0.0.1';
export const DEFAULT_PORT = 3100;

export function parsePort(value: unknown): number {
  if (value === undefined) return DEFAULT_PORT;
  if (typeof value !== 'string' || !/^[0-9]{1,5}$/.test(value)) {
    throw new Error('PORT must be an integer from 1 to 65535; port 3000 is reserved.');
  }
  const port = Number(value);
  if (port < 1 || port > 65535 || port === 3000) {
    throw new Error('PORT must be an integer from 1 to 65535; port 3000 is reserved.');
  }
  return port;
}
