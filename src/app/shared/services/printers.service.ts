import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { Printer } from 'app/core/models';

const GET_PRINTERS = gql`
  query getPrinters {
    printers {
      id
      name
      state
      deviceId
      createdAt
      updatedAt
      device {
        id
        hardwareIdentifier
        client {
          id
        }
      }
      printerDefinition {
        id
        name
      }
    }
  }
`;

const GET_PRINTER = gql`
  query getPrinter($id: ID!) {
    printer(id: $id) {
      id
      name
      deviceId
      createdAt
      updatedAt
      printerDefinition {
        id
        name
      }
    }
  }
`;

const CREATE_PRINTER = gql`
  mutation createPrinter(
    $deviceId: ID!
    $printerDefinitionId: ID!
    $name: String!
  ) {
    createPrinter(
      deviceId: $deviceId
      printerDefinitionId: $printerDefinitionId
      name: $name
    ) {
      id
      name
      deviceId
      createdAt
      updatedAt
    }
  }
`;

const REASSIGN_PRINTER = gql`
  mutation reassignPrinter($deviceId: ID!, $printerId: ID!) {
    reassignPrinter(deviceId: $deviceId, printerId: $printerId) {
      id
      name
      deviceId
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PRINTER = gql`
  mutation deletePrinter($id: ID!) {
    deletePrinter(id: $id) {
      deleteCount
    }
  }
`;

const CANCEL_CURRENT_PRINT = gql`
  mutation cancelCurrentPrint($id: ID!) {
    cancelCurrentPrint(id: $id) {
      id
      currentPrintId
    }
  }
`;

const RECONNECT_PRINTER = gql`
  mutation reconnectPrinter($id: ID!) {
    reconnectPrinter(id: $id) {
      id
      name
      deviceId
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PrintersService {
  constructor(private _apollo: Apollo) {}

  public getPrinters(): Observable<Printer[]> {
    return this._apollo
      .query<{ printers: Printer[] }>({ query: GET_PRINTERS })
      .pipe(map((result) => result.data.printers));
  }

  public getPrinter(id: string): Observable<Printer> {
    return this._apollo
      .query<{ printer: Printer }>({ query: GET_PRINTER, variables: { id } })
      .pipe(map((result) => result.data.printer));
  }

  public createPrinter(
    deviceId: string,
    printerDefinitionId: string,
    name: string
  ): Observable<Printer> {
    return this._apollo
      .mutate<{ createPrinter: Printer }>({
        mutation: CREATE_PRINTER,
        variables: { deviceId, printerDefinitionId, name },
      })
      .pipe(mapMutationResult((data) => data.createPrinter));
  }

  public reassignPrinter(
    deviceId: string,
    printerId: string
  ): Observable<Printer> {
    return this._apollo
      .mutate<{ reassignPrinter: Printer }>({
        mutation: REASSIGN_PRINTER,
        variables: { deviceId, printerId },
      })
      .pipe(mapMutationResult((data) => data.reassignPrinter));
  }

  public deletePrinter(id: string): Observable<void> {
    return this._apollo
      .mutate({ mutation: DELETE_PRINTER, variables: { id } })
      .pipe(map(() => undefined));
  }

  public cancelCurrentPrint(id: string): Observable<Printer> {
    return this._apollo
      .mutate<{ cancelCurrentPrint: Printer }>({
        mutation: CANCEL_CURRENT_PRINT,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.cancelCurrentPrint));
  }

  public reconnectPrinter(id: string): Observable<Printer> {
    return this._apollo
      .mutate<{ reconnectPrinter: Printer }>({
        mutation: RECONNECT_PRINTER,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.reconnectPrinter));
  }
}
