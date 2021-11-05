import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { PrinterDefinition } from 'app/core/models';

const GET_PRINTER_DEFINITIONS = gql`
  query GetPrinterDefinitions {
    printerDefinitions {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const GET_PRINTER_DEFINITION = gql`
  query GetPrinterDefinition($id: ID!) {
    printerDefinition(id: $id) {
      id
      name
      gCodeSettings {
        id
        startGCode
        endGCode
        cancelGCode
      }
      ultiGCodeSettings {
        id
        material {
          id
          name
          brand
        }
        hotendTemperature
        buildPlateTemperature
        retractionLength
        endOfPrintRetractionLength
        retractionSpeed
        fanSpeed
        flowRate
      }
    }
  }
`;

const CREATE_PRINTER_DEFINITION = gql`
  mutation CreatePrinterDefinition($name: String!) {
    createPrinterDefinition(name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_PRINTER_DEFINITION = gql`
  mutation UpdatePrinterDefinition($id: ID!, $name: String!) {
    updatePrinterDefinition(id: $id, name: $name) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const DELETE_PRINTER_DEFINITION = gql`
  mutation DeletePrinterDefinition($id: ID!) {
    deletePrinterDefinition(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PrinterDefinitionsService {
  constructor(private _apollo: Apollo) {}

  public getPrinterDefinitions(): Observable<PrinterDefinition[]> {
    return this._apollo
      .query<{ printerDefinitions: PrinterDefinition[] }>({
        query: GET_PRINTER_DEFINITIONS,
      })
      .pipe(map((result) => result.data.printerDefinitions));
  }

  public getPrinterDefinition(id: string): Observable<PrinterDefinition> {
    return this._apollo
      .query<{ printerDefinition: PrinterDefinition }>({
        query: GET_PRINTER_DEFINITION,
        variables: { id },
      })
      .pipe(map((result) => result.data.printerDefinition));
  }

  public createPrinterDefinition(name: string): Observable<PrinterDefinition> {
    return this._apollo
      .mutate<{ createPrinterDefinition: PrinterDefinition }>({
        mutation: CREATE_PRINTER_DEFINITION,
        variables: { name },
      })
      .pipe(mapMutationResult((data) => data.createPrinterDefinition));
  }

  public updatePrinterDefinition(
    id: string,
    name: string
  ): Observable<PrinterDefinition> {
    return this._apollo
      .mutate<{ updatePrinterDefinition: PrinterDefinition }>({
        mutation: UPDATE_PRINTER_DEFINITION,
        variables: { id, name },
      })
      .pipe(mapMutationResult((data) => data.updatePrinterDefinition));
  }

  public deletePrinterDefinition(id: string): Observable<number> {
    return this._apollo
      .mutate<{ deletePrinterDefinition: number }>({
        mutation: DELETE_PRINTER_DEFINITION,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.deletePrinterDefinition));
  }
}
