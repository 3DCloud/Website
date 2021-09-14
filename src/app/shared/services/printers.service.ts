import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { gql } from '@apollo/client/core';
import { Printer } from 'core/models';

const GET_PRINTERS = gql`
query GetPrinters {
  printers {
    id,
    name,
    deviceId,
    createdAt,
    updatedAt
  }
}
`;

const GET_PRINTER = gql`
query GetPrinter($id: ID!) {
  printer(id: $id) {
    id,
    name,
    deviceId,
    createdAt,
    updatedAt
  }
}
`;

const CREATE_PRINTER = gql`
mutation CreatePrinter($deviceId: ID!, $printerDefinitionId: ID!, $name: String!) {
  createPrinter(deviceId: $deviceId, printerDefinitionId: $printerDefinitionId, name: $name) {
    id,
    name,
    deviceId,
    createdAt,
    updatedAt
  }
}
`;

const DELETE_PRINTER = gql`
mutation DeletePrinter($id: ID!) {
  deletePrinter(id: $id) {
    deleteCount
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class PrintersService {

  constructor(private apollo: Apollo) { }

  public getPrinters(): Observable<Printer[]> {
    return this.apollo.query<any>({ query: GET_PRINTERS })
      .pipe(map(result => result.data.printers));
  }

  public getPrinter(id: string): Observable<Printer> {
    return this.apollo.query<any>({ query: GET_PRINTER, variables: { id } })
      .pipe(map(result => result.data.printer));
  }

  public createPrinter(deviceId: string, printerDefinitionId: string, name: string): Observable<Printer> {
    return this.apollo.mutate<any>({ mutation: CREATE_PRINTER, variables: { deviceId, printerDefinitionId, name } })
      .pipe(map(result => result.data.createPrinter));
  }

  public deletePrinter(id: string): Observable<void> {
    return this.apollo.mutate({ mutation: DELETE_PRINTER, variables: { id } }).pipe(map(() => { }));
  }
}
