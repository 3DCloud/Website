import { Device } from './device';
import { PrinterDefinition } from './printer-definition';
import { PrinterExtruder } from './printer-extruder';
import { PrinterState } from './printer-state';

export interface Printer {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deviceId?: string;
  device?: Device;
  state: PrinterState;
  printerDefinition: PrinterDefinition;
  printerExtruders: (PrinterExtruder | undefined)[];
}
