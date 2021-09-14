import { Client } from './client';
import { Printer } from './printer';

export interface Device {
  id: string;
  deviceName: string;
  hardwareIdentifier: string;
  isPortableHardwareIdentifier: boolean;
  lastSeen: Date;
  clientId: string;
  client?: Client;
  createdAt: Date;
  updatedAt: Date;
  printerId: string;
  printer?: Printer;
}
