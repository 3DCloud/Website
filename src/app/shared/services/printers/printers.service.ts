import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import {
  MaterialColor,
  Printer,
  PrinterDefinition,
  PrinterInput,
} from 'app/core/models';

import CancelCurrentPrint from './queries/CancelCurrentPrint.graphql';
import CreatePrinter from './queries/CreatePrinter.graphql';
import DeletePrinter from './queries/DeletePrinter.graphql';
import GetPrinter from './queries/GetPrinter.graphql';
import GetPrinterWithMaterials from './queries/GetPrinterWithMaterials.graphql';
import GetPrinters from './queries/GetPrinters.graphql';
import GetPrintersAndDefinitions from './queries/GetPrintersAndDefinitions.graphql';
import ReassignPrinter from './queries/ReassignPrinter.graphql';
import ReconnectPrinter from './queries/ReconnectPrinter.graphql';
import UpdatePrinter from './queries/UpdatePrinter.graphql';

@Injectable({
  providedIn: 'root',
})
export class PrintersService {
  public constructor(private _apollo: Apollo) {}

  public getPrinters(): Observable<Printer[]> {
    return this._apollo
      .query<{ printers: Printer[] }>({ query: GetPrinters })
      .pipe(map((result) => result.data.printers));
  }

  public getPrintersAndDefinitions(): Observable<{
    printers: Printer[];
    printerDefinitions: PrinterDefinition[];
  }> {
    return this._apollo
      .query<{ printers: Printer[]; printerDefinitions: PrinterDefinition[] }>({
        query: GetPrintersAndDefinitions,
      })
      .pipe(map((result) => result.data));
  }

  public getPrinter(id: string): Observable<Printer> {
    return this._apollo
      .query<{ printer: Printer }>({ query: GetPrinter, variables: { id } })
      .pipe(map((result) => result.data.printer));
  }

  public getPrinterSettings(
    id: string
  ): Observable<{ printer: Printer; materialColors: MaterialColor[] }> {
    return this._apollo
      .query<{
        printer: Printer;
        materialColors: MaterialColor[];
      }>({
        query: GetPrinterWithMaterials,
        variables: { id },
      })
      .pipe(map((result) => result.data));
  }

  public createPrinter(
    deviceId: string,
    printerDefinitionId: string,
    name: string
  ): Observable<Printer> {
    return this._apollo
      .mutate<{ createPrinter: Printer }>({
        mutation: CreatePrinter,
        variables: { deviceId, printerDefinitionId, name },
      })
      .pipe(mapMutationResult((data) => data.createPrinter));
  }

  public assignPrinter(
    deviceId: string,
    printerId: string
  ): Observable<Printer> {
    return this._apollo
      .mutate<{ reassignPrinter: Printer }>({
        mutation: ReassignPrinter,
        variables: { deviceId, printerId },
      })
      .pipe(mapMutationResult((data) => data.reassignPrinter));
  }

  public updatePrinter(id: string, printer: PrinterInput): Observable<Printer> {
    return this._apollo
      .mutate<{ printer: Printer }>({
        mutation: UpdatePrinter,
        variables: { id, printer },
      })
      .pipe(mapMutationResult((result) => result.printer));
  }

  public deletePrinter(id: string): Observable<void> {
    return this._apollo
      .mutate({ mutation: DeletePrinter, variables: { id } })
      .pipe(map(() => undefined));
  }

  public cancelCurrentPrint(id: string): Observable<Printer> {
    return this._apollo
      .mutate<{ cancelCurrentPrint: Printer }>({
        mutation: CancelCurrentPrint,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.cancelCurrentPrint));
  }

  public reconnectPrinter(id: string): Observable<Printer> {
    return this._apollo
      .mutate<{ reconnectPrinter: Printer }>({
        mutation: ReconnectPrinter,
        variables: { id },
      })
      .pipe(mapMutationResult((data) => data.reconnectPrinter));
  }
}
