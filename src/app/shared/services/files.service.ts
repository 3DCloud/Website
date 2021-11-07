import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { last, map, tap } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { UploadFileRequest, UploadedFile } from 'app/core/models';

const UPLOAD_MUTATION = gql`
  mutation createUploadFileRequest(
    $filename: String!
    $byteSize: Int!
    $checksum: String!
    $contentType: String!
  ) {
    createUploadFileRequest(
      filename: $filename
      byteSize: $byteSize
      checksum: $checksum
      contentType: $contentType
    ) {
      url
      headers
      signedId
    }
  }
`;

const RECORD_UPLOAD_MUTATION = gql`
  mutation recordFileUploaded($signedId: String!) {
    recordFileUploaded(signedId: $signedId) {
      id
      filename
      byteSize
      createdAt
    }
  }
`;

const GET_DOWNLOAD_URL_QUERY = gql`
  query getFileDownloadUrl($id: ID!) {
    getFileDownloadUrl(id: $id)
  }
`;

const DELETE_UPLOADED_FILE_MUTATION = gql`
  mutation deleteUploadedFile($id: ID!) {
    deleteUploadedFile(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private _apollo: Apollo, private _http: HttpClient) {}

  public requestFileUpload(
    file: File,
    checksum: string
  ): Observable<UploadFileRequest> {
    return this._apollo
      .mutate<{ createUploadFileRequest: UploadFileRequest }>({
        mutation: UPLOAD_MUTATION,
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
        mutation: RECORD_UPLOAD_MUTATION,
        variables: { signedId },
      })
      .pipe(mapMutationResult((data) => data.recordFileUploaded));
  }

  public getDownloadUrl(id: string): Observable<string> {
    return this._apollo
      .query<{ getFileDownloadUrl: string }>({
        query: GET_DOWNLOAD_URL_QUERY,
        variables: { id },
      })
      .pipe(map((result) => result.data.getFileDownloadUrl));
  }

  public delete(id: string): Observable<UploadedFile> {
    return this._apollo
      .mutate<{ deleteUploadedFile: UploadedFile }>({
        mutation: DELETE_UPLOADED_FILE_MUTATION,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.deleteUploadedFile));
  }
}
