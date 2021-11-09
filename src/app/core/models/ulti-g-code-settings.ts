import { Material } from './material';
import { NozzleSettings } from './nozzle-settings';
import { PrinterDefinition } from './printer-definition';

export interface UltiGCodeSettings {
  id: string;
  printerDefinition: PrinterDefinition;
  material: Material;
  buildPlateTemperature: number;
  endOfPrintRetractionLength: number;
  fanSpeed: number;
  flowRate: number;
  perNozzleSettings: {
    size025: NozzleSettings;
    size040: NozzleSettings;
    size060: NozzleSettings;
    size080: NozzleSettings;
    size100: NozzleSettings;
  };
  createdAt: Date;
  updatedAt: Date;
}
