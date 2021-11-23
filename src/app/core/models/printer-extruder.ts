import { MaterialColor } from './material-color';
import { Printer } from './printer';

export interface PrinterExtruder {
  id: string;
  printer: Printer;
  printerId: string;
  materialColor: MaterialColor;
  materialColorId: string;
  extruderIndex: number;
  ultiGCodeNozzleSize?: string;
  filamentDiameter: number;
  createdAt: Date;
  updatedAt: Date;
}
