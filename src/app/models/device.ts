import { Client } from './client';
import { Printer } from './printer';

export interface Device {
  id: number;
  deviceName: string;
  hardwareIdentifier: string;
  isPortableHardwareIdentifier: boolean;
  lastSeen: Date;
  clientId: number;
  client?: Client;
  createdAt: Date;
  updatedAt: Date;
  printer?: Printer;
}
