// Deliver Node signal events inside the owned test child: Windows child.kill
// forcibly terminates instead of delivering POSIX SIGINT/SIGTERM handlers.
process.on('message', message => {
  if (message === 'test:SIGINT') process.emit('SIGINT');
  if (message === 'test:SIGTERM') process.emit('SIGTERM');
});
await import('../../apps/server/src/index.js');
