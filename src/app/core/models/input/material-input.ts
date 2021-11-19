import { MaterialColorInput } from './material-color-input';

export interface MaterialInput {
  id: string;
  name: string;
  brand: string;
  materialColors?: MaterialColorInput[];
}
