import { Material } from './material';

export interface MaterialColor {
  id: string;
  material: Material;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
