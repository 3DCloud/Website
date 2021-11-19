import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { UploadedFile } from 'app/core/models';

import DeleteUploadedFile from './queries/DeleteUploadedFile.graphql';
import GetDownloadUrl from './queries/GetDownloadUrl.graphql';
import GetFiles from './queries/GetFiles.graphql';
import RecordFileUploaded from './queries/RecordFileUploaded.graphql';

@Injectable({
  providedIn: 'root',
})
export class UploadedFilesService {
  public constructor(private _apollo: Apollo, private _http: HttpClient) {}

  public getFiles(): Observable<UploadedFile[]> {
    return this._apollo
      .query<{ uploadedFiles: UploadedFile[] }>({
        query: GetFiles,
      })
      .pipe(map((result) => result.data.uploadedFiles));
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
