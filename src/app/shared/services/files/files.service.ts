import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { last, map, tap } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { UploadFileRequest, UploadedFile } from 'app/core/models';

import CreateUploadFileRequest from './queries/CreateUploadFileRequest.graphql';
import DeleteUploadedFile from './queries/DeleteUploadedFile.graphql';
import GetDownloadUrl from './queries/GetDownloadUrl.graphql';
import GetFiles from './queries/GetFiles.graphql';
import RecordFileUploaded from './queries/RecordFileUploaded.graphql';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private _apollo: Apollo, private _http: HttpClient) {}

  public getFiles(): Observable<UploadedFile[]> {
    return this._apollo
      .query<{ uploadedFiles: UploadedFile[] }>({
        query: GetFiles,
      })
      .pipe(map((result) => result.data.uploadedFiles));
  }

  public requestFileUpload(
    file: File,
    checksum: string
  ): Observable<UploadFileRequest> {
    return this._apollo
      .mutate<{ createUploadFileRequest: UploadFileRequest }>({
        mutation: CreateUploadFileRequest,
        variables: {
          filename: file.name,
          byteSize: file.size,
          contentType: file.type.length
            ? file.type
            : 'application/octet-stream',
          checksum,
        },
      })
      .pipe(mapMutationResult((data) => data.createUploadFileRequest));
  }

  public uploadFile(
    url: string,
    body: unknown,
    headers: Record<string, string>,
    progressCallback: (progress: number) => void
  ): Observable<HttpResponse<unknown>> {
    const request = new HttpRequest('PUT', url, body, {
      headers: new HttpHeaders(headers),
      reportProgress: true,
    });

    return this._http.request(request).pipe(
      tap((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          if (event.total) {
            progressCallback(event.loaded / event.total);
          }
        }
      }),
      last(),
      map((e) => e as HttpResponse<unknown>)
    );
  }

  public recordUpload(signedId: string): Observable<UploadedFile> {
    return this._apollo
      .mutate<{ recordFileUploaded: UploadedFile }>({
        mutation: RecordFileUploaded,
        variables: { signedId },
      })
      .pipe(mapMutationResult((data) => data.recordFileUploaded));
  }

  public getDownloadUrl(id: string): Observable<string> {
    return this._apollo
      .query<{ uploadedFile: UploadedFile }>({
        query: GetDownloadUrl,
        variables: { id },
      })
      .pipe(map((result) => result.data.uploadedFile.url));
  }

  public delete(id: string): Observable<UploadedFile> {
    return this._apollo
      .mutate<{ deleteUploadedFile: UploadedFile }>({
        mutation: DeleteUploadedFile,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.deleteUploadedFile));
  }
}
