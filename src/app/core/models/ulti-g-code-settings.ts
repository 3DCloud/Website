import { Material } from './material';
import { PrinterDefinition } from './printer-definition';

export interface UltiGCodeSettings {
  id: string;
  printerDefinition?: PrinterDefinition;
  material?: Material;
  hotendTemperature: number;
  buildPlateTemperature: number;
  retractionLength: number;
  endOfPrintRetractionLength: number;
  retractionSpeed: number;
  fanSpeed: number;
  flowRate: number;
  createdAt: Date;
  updatedAt: Date;
}
