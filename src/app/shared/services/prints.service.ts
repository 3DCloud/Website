import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

import { mapMutationResult } from 'app/core/helpers';
import { Print } from 'app/core/models';

const START_PRINT = gql`
  mutation startPrint($fileId: ID!, $printerId: ID!) {
    startPrint(fileId: $fileId, printerId: $printerId) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PrintsService {
  constructor(private _apollo: Apollo) {}

  public startPrint(fileId: string, printerId: string): Observable<Print> {
    return this._apollo
      .mutate<{ startPrint: Print }>({
        mutation: START_PRINT,
        variables: { fileId, printerId },
      })
      .pipe(mapMutationResult((data) => data.startPrint));
  }
}
