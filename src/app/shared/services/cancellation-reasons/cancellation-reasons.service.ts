import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { CancellationReason, CancellationReasonInput } from 'app/core/models';

import CreateCancellationReason from './queries/CreateCancellationReason.graphql';
import DeleteCancellationReason from './queries/DeleteCancellationReason.graphql';
import GetCancellationReason from './queries/GetCancellationReason.graphql';
import GetCancellationReasons from './queries/GetCancellationReasons.graphql';
import UpdateCancellationReason from './queries/UpdateCancellationReason.graphql';

@Injectable({
  providedIn: 'root',
})
export class CancellationReasonsService {
  public constructor(private _apollo: Apollo) {}

  public getCancellationReasons(): Observable<CancellationReason[]> {
    return this._apollo
      .query<{ cancellationReasons: CancellationReason[] }>({
        query: GetCancellationReasons,
      })
      .pipe(map((result) => result.data.cancellationReasons));
  }

  public getCancellationReason(id: string): Observable<CancellationReason> {
    return this._apollo
      .query<{ cancellationReason: CancellationReason }>({
        query: GetCancellationReason,
        variables: { id },
      })
      .pipe(map((result) => result.data.cancellationReason));
  }

  public createCancellationReason(
    cancellationReason: CancellationReasonInput
  ): Observable<CancellationReason> {
    return this._apollo
      .query<{ createCancellationReason: CancellationReason }>({
        query: CreateCancellationReason,
        variables: { cancellationReason },
      })
      .pipe(mapMutationResult((result) => result.createCancellationReason));
  }

  public updateCancellationReason(
    id: string,
    cancellationReason: CancellationReasonInput
  ): Observable<CancellationReason> {
    return this._apollo
      .query<{ updateCancellationReason: CancellationReason }>({
        query: UpdateCancellationReason,
        variables: { id, cancellationReason },
      })
      .pipe(mapMutationResult((result) => result.updateCancellationReason));
  }

  public deleteCancellationReason(id: string): Observable<CancellationReason> {
    return this._apollo
      .query<{ deleteCancellationReason: CancellationReason }>({
        query: DeleteCancellationReason,
        variables: { id },
      })
      .pipe(mapMutationResult((result) => result.deleteCancellationReason));
  }
}
