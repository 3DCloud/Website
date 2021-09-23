import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { gql } from '@apollo/client/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Apollo } from 'apollo-angular';
import md5 from 'js-md5';
import { Observable } from 'rxjs';
import { last, map, tap } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';

interface UploadFileRequest {
  url: string;
  headers: Record<string, string>;
  signedId: string;
}

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
    }
  }
`;

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss'],
})
export class UploadFileModalComponent {
  public busy = false;
  public status = '';
  public progress = 0;
  public error?: unknown;

  private _selectedFile?: File;

  constructor(
    public modal: NgbActiveModal,
    private _apollo: Apollo,
    private _http: HttpClient
  ) {}

  public selectedFileChanged(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (!files) {
      return;
    }

    this._selectedFile = files[0];
  }

  public upload(): void {
    if (!this._selectedFile) {
      return;
    }

    this.busy = true;
    const file = this._selectedFile;

    file.arrayBuffer().then((buffer) => {
      const checksum = md5.base64(buffer);

      this.requestFileUpload(file, checksum).subscribe(
        ({ url, headers, signedId }) => {
          this.uploadFile(url, buffer, headers).subscribe(() => {
            this.recordUpload(signedId).subscribe(() => {
              this.busy = false;
            });
          });
        }
      );
    });
  }

  private requestFileUpload(
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

  private uploadFile(
    url: string,
    body: unknown,
    headers: Record<string, string>
  ): Observable<HttpResponse<unknown>> {
    const request = new HttpRequest('PUT', url, body, {
      headers: new HttpHeaders(headers),
      reportProgress: true,
    });

    return this._http.request(request).pipe(
      tap((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          if (event.total) {
            this.progress = (event.loaded / event.total) * 100;
            this.status = `Uploading... ${this.progress}%`;
          } else {
            this.status = `Uploading...`;
          }
        }
      }),
      last(),
      map((e) => e as HttpResponse<unknown>)
    );
  }

  private recordUpload(signedId: string): Observable<{ id: string }> {
    return this._apollo
      .mutate<{ recordFileUploaded: { id: string } }>({
        mutation: RECORD_UPLOAD_MUTATION,
        variables: { signedId },
      })
      .pipe(mapMutationResult((data) => data.recordFileUploaded));
  }
}
