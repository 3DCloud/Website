import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { PrinterDefinition } from 'app/core/models';
import { PrinterDefinitionInput } from 'app/core/models/input';

import CreatePrinterDefinition from './queries/CreatePrinterDefinition.graphql';
import DeletePrinterDefinition from './queries/DeletePrinterDefinition.graphql';
import GetPrinterDefinition from './queries/GetPrinterDefinition.graphql';
import GetPrinterDefinitions from './queries/GetPrinterDefinitions.graphql';
import UpdatePrinterDefinition from './queries/UpdatePrinterDefinition.graphql';

@Injectable({
  providedIn: 'root',
})
export class PrinterDefinitionsService {
  public constructor(private _apollo: Apollo) {}

  public getPrinterDefinitions(): Observable<PrinterDefinition[]> {
    return this._apollo
      .query<{ printerDefinitions: PrinterDefinition[] }>({
        query: GetPrinterDefinitions,
      })
      .pipe(map((result) => result.data.printerDefinitions));
  }

  public getPrinterDefinition(id: string): Observable<PrinterDefinition> {
    return this._apollo
      .query<{ printerDefinition: PrinterDefinition }>({
        query: GetPrinterDefinition,
        variables: { id },
      })
      .pipe(map((result) => result.data.printerDefinition));
  }

  public createPrinterDefinition(
    printerDefinition: PrinterDefinitionInput
  ): Observable<PrinterDefinition> {
    return this._apollo
      .mutate<{ createPrinterDefinition: PrinterDefinition }>({
        mutation: CreatePrinterDefinition,
        variables: { printerDefinition: printerDefinition },
      })
      .pipe(mapMutationResult((data) => data.createPrinterDefinition));
  }

  public updatePrinterDefinition(
    id: string,
    printerDefinition: PrinterDefinitionInput
  ): Observable<PrinterDefinition> {
    return this._apollo
      .mutate<{ updatePrinterDefinition: PrinterDefinition }>({
        mutation: UpdatePrinterDefinition,
        variables: { id, printerDefinition: printerDefinition },
      })
      .pipe(mapMutationResult((data) => data.updatePrinterDefinition));
  }

  public deletePrinterDefinition(id: string): Observable<number> {
    return this._apollo
      .mutate<{ deletePrinterDefinition: number }>({
        mutation: DeletePrinterDefinition,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.deletePrinterDefinition));
  }
}
