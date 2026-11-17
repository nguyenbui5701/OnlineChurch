import { afterAll, beforeAll, vi } from 'vitest';

const originalFetch = globalThis.fetch;
beforeAll(() => {
  vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.port === '3000') {
      throw new Error('Tests only permit their own loopback DEMO requests.');
    }
    return originalFetch(input, { ...init, redirect: 'error' });
  });
});
afterAll(() => vi.restoreAllMocks());
