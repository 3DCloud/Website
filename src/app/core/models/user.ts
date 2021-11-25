import { UploadedFile } from './uploaded-file';

export interface User {
  name: string;
  emailAddress: string;
  uploadedFiles: UploadedFile[];
  avatar?: {
    byteSize: number;
    checksum: string;
    contentType: string;
    url: string;
  };
}
