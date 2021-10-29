import { PrintState } from './print-state';
import { Printer } from './printer';
import { UploadedFile } from './uploaded-file';

export interface Print {
  id: string;
  uploadedFile: UploadedFile;
  printer: Printer;
  status: PrintState;
  createdAt: Date;
  updatedAt: Date;
}
