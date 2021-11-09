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
    size_0_25: NozzleSettings;
    size_0_40: NozzleSettings;
    size_0_60: NozzleSettings;
    size_0_80: NozzleSettings;
    size_1_00: NozzleSettings;
  };
  createdAt: Date;
  updatedAt: Date;
}
