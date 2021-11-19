import { GCodeSettings } from './g-code-settings';
import { UltiGCodeSettings } from './ulti-g-code-settings';

export interface PrinterDefinition {
  id: string;
  name: string;
  thumbnail?: {
    byteSize: number;
    checksum: string;
    contentType: string;
    url: string;
  };
  gCodeSettings?: GCodeSettings;
  ultiGCodeSettings?: UltiGCodeSettings[];
}
