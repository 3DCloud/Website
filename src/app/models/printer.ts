import { Device } from './device';

export interface Printer {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deviceId: number;
  device?: Device;
}
