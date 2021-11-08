import { MaterialColor } from './material-color';

export interface Material {
  id: string;
  name: string;
  brand: string;
  colors?: MaterialColor[];
}
