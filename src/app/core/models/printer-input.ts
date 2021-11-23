import { PrinterExtruderInput } from './printer-extruder-input';

export interface PrinterInput {
  id?: string;
  printerExtruders: PrinterExtruderInput[];
}
