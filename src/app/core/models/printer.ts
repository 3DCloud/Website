import { Device } from './device';

export interface Printer {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deviceId: string;
  device?: Device;
}
