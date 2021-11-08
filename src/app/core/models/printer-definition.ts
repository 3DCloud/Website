import { GCodeSettings } from './g-code-settings';
import { UltiGCodeSettings } from './ulti-g-code-settings';

export interface PrinterDefinition {
  id: string;
  name: string;
  gCodeSettings?: GCodeSettings;
  ultiGCodeSettings?: UltiGCodeSettings[];
}
