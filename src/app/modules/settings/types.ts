import { NozzleSettings } from 'app/core/models';

export interface MaterialTxtEntry {
  name: string;
  perNozzleSettings: {
    size025: NozzleSettings;
    size040: NozzleSettings;
    size060: NozzleSettings;
    size080: NozzleSettings;
    size100: NozzleSettings;
  };
  endOfPrintRetractionLength: number;
  buildPlateTemperature: number;
  fanSpeed: number;
  flowRate: number;
}
