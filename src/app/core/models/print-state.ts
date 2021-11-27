export type PrintState =
  | 'pending'
  | 'downloading'
  | 'running'
  | 'success'
  | 'canceling'
  | 'canceled'
  | 'errored'
  | 'unknown';
