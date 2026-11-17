export const demoScope = { source: 'DEMO', roomId: 'demo-room', sessionId: 'demo-session-001' } as const;
export const demoEvent = {
  schemaVersion: 1,
  ...demoScope,
  eventId: 'demo-event-001',
  actorKey: 'demo-actor-001',
  kind: 'command',
  timestamp: 1_800_000_000_000,
  intent: 'ENTER',
} as const;
