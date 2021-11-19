import { MaterialInput } from './material-input';
import { NozzleSettingsInput } from './nozzle-settings-input';

export interface UltiGCodeSettingsInput {
  id: string;
  material: MaterialInput;
  buildPlateTemperature: number;
  endOfPrintRetractionLength: number;
  fanSpeed: number;
  flowRate: number;
  perNozzleSettings: {
    size025: NozzleSettingsInput;
    size040: NozzleSettingsInput;
    size060: NozzleSettingsInput;
    size080: NozzleSettingsInput;
    size100: NozzleSettingsInput;
  };
  createdAt: Date;
  updatedAt: Date;
}
