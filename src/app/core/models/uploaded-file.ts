import { User } from './user';

export interface UploadedFile {
  id: string;
  user: User;
  filename: string;
  byteSize: number;
  createdAt: Date;
  estimatedDuration: number;
  ultiGCodeNozzleSize: string;
  url: string;
}
