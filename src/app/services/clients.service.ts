import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

const GET_CLIENTS = gql`
query GetClients {
  clients {
    id,
    name,
    authorized,
    createdAt,
    updatedAt
  }
}
`;

const GET_CLIENT = gql`
query GetClient($clientId: ID!) {
  client(id: $clientId) {
    id,
    name,
    authorized,
    createdAt,
    updatedAt,
    devices {
      id,
      deviceName,
      hardwareIdentifier,
      isPortableHardwareIdentifier,
      lastSeen,
      createdAt,
      updatedAt,
      printer {
        id
      }
    },
    printers {
      id,
      name,
      deviceId
    }
  }
}
`;

const SET_NAME = gql`
mutation SetClientName($id: ID!, $name: String) {
  setClientName(id: $id, name: $name) {
    id,
    name
  }
}
`;

const GRANT_AUTHORIZATION = gql`
mutation GrantClientAuthorization($clientId: ID!) {
  grantClientAuthorization(id: $clientId) {
    id,
    name,
    authorized,
    createdAt,
    updatedAt
  }
}
`;

const REVOKE_AUTHORIZATION = gql`
mutation RevokeClientAuthorization($clientId: ID!) {
  revokeClientAuthorization(id: $clientId) {
    id,
    name,
    authorized,
    createdAt,
    updatedAt
  }
}
`;

const DELETE_CLIENT = gql`
mutation DeleteClient($id: ID!) {
  deleteClient(id: $id) {
    deleteCount
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private apollo: Apollo) { }

  getClients(): Observable<Client[]> {
    return this.apollo.query<any>({ query: GET_CLIENTS })
      .pipe(map(result => result.data.clients));
  }

  getClient(clientId: string): Observable<Client> {
    return this.apollo.query<any>({ query: GET_CLIENT, variables: { clientId } })
      .pipe(map(result => result.data.client));
  }

  setName(id: string, name?: string): Observable<Client> {
    return this.apollo.mutate<any>({ mutation: SET_NAME, variables: { id, name } })
      .pipe(map(result => result.data.setClientName));
  }

  grantAuthorization(clientId: string): Observable<Client> {
    return this.apollo.mutate<any>({ mutation: GRANT_AUTHORIZATION, variables: { clientId } })
      .pipe(map(result => result.data.grantClientAuthorization));
  }

  revokeAuthorization(clientId: string): Observable<Client> {
    return this.apollo.mutate<any>({ mutation: REVOKE_AUTHORIZATION, variables: { clientId } })
      .pipe(map(result => result.data.revokeClientAuthorization));
  }

  delete(id: string): Observable<void> {
    return this.apollo.mutate({ mutation: DELETE_CLIENT, variables: { id } })
      .pipe(map(() => {}))
  }
}
