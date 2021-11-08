import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { Client } from 'app/core/models';

import DeleteClient from './queries/DeleteClient.graphql';
import GetClient from './queries/GetClient.graphql';
import GetClients from './queries/GetClients.graphql';
import GrantAuthorization from './queries/GrantAuthorization.graphql';
import RevokeAuthorization from './queries/RevokeAuthorization.graphql';
import SetName from './queries/SetName.graphql';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private _apollo: Apollo) {}

  getClients(): Observable<Client[]> {
    return this._apollo
      .query<{ clients: Client[] }>({ query: GetClients })
      .pipe(map((result) => result.data.clients));
  }

  getClient(clientId: string): Observable<Client> {
    return this._apollo
      .query<{ client: Client }>({ query: GetClient, variables: { clientId } })
      .pipe(map((result) => result.data.client));
  }

  setName(id: string, name?: string): Observable<Client> {
    return this._apollo
      .mutate<{ setClientName: Client }>({
        mutation: SetName,
        variables: { id, name },
      })
      .pipe(mapMutationResult((data) => data.setClientName));
  }

  grantAuthorization(clientId: string): Observable<Client> {
    return this._apollo
      .mutate<{ grantClientAuthorization: Client }>({
        mutation: GrantAuthorization,
        variables: { clientId },
      })
      .pipe(mapMutationResult((data) => data.grantClientAuthorization));
  }

  revokeAuthorization(clientId: string): Observable<Client> {
    return this._apollo
      .mutate<{ revokeClientAuthorization: Client }>({
        mutation: RevokeAuthorization,
        variables: { clientId },
      })
      .pipe(mapMutationResult((data) => data.revokeClientAuthorization));
  }

  delete(id: string): Observable<void> {
    return this._apollo
      .mutate({ mutation: DeleteClient, variables: { id } })
      .pipe(map(() => undefined));
  }
}
