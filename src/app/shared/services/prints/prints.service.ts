import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { Print } from 'app/core/models';

import GetPrints from './queries/GetPrints.graphql';
import StartPrint from './queries/StartPrint.graphql';

@Injectable({
  providedIn: 'root',
})
export class PrintsService {
  public constructor(private _apollo: Apollo) {}

  public getPrints(
    search?: string,
    orderBy?: string,
    ascending?: boolean,
    statuses?: string[]
  ): Observable<Print[]> {
    return this._apollo
      .query<{ prints: Print[] }>({
        query: GetPrints,
        variables: { search, orderBy, ascending, statuses },
      })
      .pipe(map((result) => result.data.prints));
  }

  public startPrint(fileId: string, printerId: string): Observable<Print> {
    return this._apollo
      .mutate<{ startPrint: Print }>({
        mutation: StartPrint,
        variables: { fileId, printerId },
      })
      .pipe(mapMutationResult((data) => data.startPrint));
  }
}
