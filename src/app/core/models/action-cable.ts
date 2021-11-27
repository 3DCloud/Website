import { PrinterState } from './index';

export interface PrinterStateMessage {
  action: string;
  state: PrinterStateObject;
  id?: string;
}

export interface PrinterStateObject {
  printer_state: PrinterState;
  temperatures?: Temperatures;
  progress?: number;
  time_remaining?: number;
}

export interface Temperature {
  name: string;
  current: number;
  target: number;
}

export interface Temperatures {
  active_hotend_temperature: Temperature;
  bed_temperature?: Temperature;
  hotend_temperatures: Temperature[];
}
