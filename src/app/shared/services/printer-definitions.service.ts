import { Injectable } from '@angular/core';
import { PrinterDefinition } from 'app/core/models';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { gql } from '@apollo/client/core';

const GET_PRINTER_DEFINITIONS = gql`
query GetPrinterDefinitions {
  printerDefinitions {
    id,
    name,
    createdAt,
    updatedAt
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class PrinterDefinitionsService {

  constructor(private apollo: Apollo) { }

  public getPrinterDefinitions(): Observable<PrinterDefinition[]> {
    return this.apollo.query<any>({ query: GET_PRINTER_DEFINITIONS }).pipe(map(result => result.data.printerDefinitions));
  }

}
