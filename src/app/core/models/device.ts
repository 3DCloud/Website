import { Client } from './client';
import { Printer } from './printer';

export interface Device {
  id: string;
  name: string;
  path: string;
  serialNumber?: string;
  lastSeen: Date;
  clientId: string;
  client: Client;
  createdAt: Date;
  updatedAt: Date;
  printerId: string;
  printer?: Printer;
}
