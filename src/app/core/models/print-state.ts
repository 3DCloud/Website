export type PrintState =
  | 'pending'
  | 'downloading'
  | 'running'
  | 'success'
  | 'canceled'
  | 'errored'
  | 'unknown';
