export type PrinterState =
  | 'disconnected'
  | 'connecting'
  | 'ready'
  | 'downloading'
  | 'disconnecting'
  | 'busy'
  | 'heating'
  | 'printing'
  | 'pausing'
  | 'paused'
  | 'resuming'
  | 'canceling'
  | 'errored'
  | 'offline';
