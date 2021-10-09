import { Device } from './device';
import { PrinterDefinition } from './printer-definition';

export interface Printer {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deviceId: string;
  device?: Device;
  state: string;
  printerDefinition?: PrinterDefinition;
}
