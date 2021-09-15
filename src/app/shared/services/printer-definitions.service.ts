import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root',
})
export class PrinterDefinitionsService {
  constructor(private apollo: Apollo) {}

  public getPrinterDefinitions(): Observable<PrinterDefinition[]> {
    return this.apollo
      .query<{ printerDefinitions: PrinterDefinition[] }>({
        query: GET_PRINTER_DEFINITIONS,
      })
      .pipe(map((result) => result.data.printerDefinitions));
  }
}
