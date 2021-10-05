import { Printer } from './printer';
import { UploadedFile } from './uploaded-file';

export interface Print {
  id: string;
  file: UploadedFile;
  printer: Printer;
}
