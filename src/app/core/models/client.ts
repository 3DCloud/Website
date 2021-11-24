import { Device } from './device';
import { Printer } from './printer';

export interface Client {
  id: string;
  name: string;
  authorized: boolean;
  createdAt: Date;
  updatedAt: Date;
  devices: Device[];
  printers: Printer[];
}
