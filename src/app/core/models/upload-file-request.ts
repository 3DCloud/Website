export interface UploadFileRequest {
  url: string;
  headers: Record<string, string>;
  signedId: string;
}
