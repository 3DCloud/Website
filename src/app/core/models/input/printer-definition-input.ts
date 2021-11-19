import { GCodeSettingsInput } from './g-code-settings-input';
import { UltiGCodeSettingsInput } from './ulti-g-code-settings-input';

export interface PrinterDefinitionInput {
  id: string;
  name: string;
  thumbnailSignedId: string;
  gCodeSettings?: GCodeSettingsInput;
  ultiGCodeSettings?: UltiGCodeSettingsInput[];
}
