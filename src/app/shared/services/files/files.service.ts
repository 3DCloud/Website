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
import { UploadFileRequest } from 'app/core/models';

import CreateUploadFileRequest from './queries/CreateUploadFileRequest.graphql';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  public constructor(private _apollo: Apollo, private _http: HttpClient) {}

  public readAsArrayBuffer(file: File): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((sub) => {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        sub.next(fileReader.result as ArrayBuffer);
      };

      fileReader.onerror = () => {
        sub.error(fileReader.error);
      };

      fileReader.onerror = () => {
        sub.error(fileReader.error);
      };

      fileReader.readAsArrayBuffer(file);
    });
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
          contentType: file.type?.length
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
}
