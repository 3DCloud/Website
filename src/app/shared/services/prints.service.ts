import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { Print } from 'app/core/models';

const GET_PRINTS = gql`
  query GetPrints {
    prints {
      id
      uploadedFile {
        id
        filename
      }
      printer {
        id
        name
      }
      status
      createdAt
      updatedAt
    }
  }
`;

const START_PRINT = gql`
  mutation startPrint($fileId: ID!, $printerId: ID!) {
    startPrint(fileId: $fileId, printerId: $printerId) {
      id
    }
  }
`;

const ABORT_PRINT = gql`
  mutation abortPrint($printId: ID!) {
    abortPrint(printId: $printId) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PrintsService {
  constructor(private _apollo: Apollo) {}

  public getPrints(): Observable<Print[]> {
    return this._apollo
      .query<{ prints: Print[] }>({
        query: GET_PRINTS,
      })
      .pipe(map((result) => result.data.prints));
  }

  public startPrint(fileId: string, printerId: string): Observable<Print> {
    return this._apollo
      .mutate<{ startPrint: Print }>({
        mutation: START_PRINT,
        variables: { fileId, printerId },
      })
      .pipe(mapMutationResult((data) => data.startPrint));
  }

  public abortPrint(printId: string): Observable<Print> {
    return this._apollo
      .mutate<{ abortPrint: Print }>({
        mutation: ABORT_PRINT,
        variables: { printId },
      })
      .pipe(mapMutationResult((data) => data.abortPrint));
  }
}
