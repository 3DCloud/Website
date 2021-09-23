import { UploadedFile } from './uploaded-file';

export interface User {
  name: string;
  emailAddress: string;
  uploadedFiles: UploadedFile[];
}
