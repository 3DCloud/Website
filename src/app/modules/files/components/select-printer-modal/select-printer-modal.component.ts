import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { MaterialColor, Printer, PrinterDefinition } from 'app/core/models';
import { PrintersService, PrintsService } from 'app/shared/services';

@Component({
  selector: 'app-select-printer-modal',
  templateUrl: './select-printer-modal.component.html',
  styleUrls: ['./select-printer-modal.component.scss'],
})
export class SelectPrinterModalComponent implements OnInit, OnDestroy {
  public fileId = '';
  public loading = true;
  public busy = false;
  public printers?: Printer[];
  public readonly printerDefinitions = new Map<string, PrinterDefinition>();
  public error?: string;
  public materialColor: MaterialColor = {
    id: '1',
    name: 'Black',
    color: '111',
    material: {
      id: '1',
      name: 'PLA',
      brand: 'Generic',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _router: Router,
    private _printersService: PrintersService,
    private _printsService: PrintsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printersService
        .getPrinters()
        .subscribe(
          (printers) => {
            this.printers = printers;
          },
          (err) => {
            this.error = err;
          }
        )
        .add(() => {
          this.loading = false;
        })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public startPrint(printerId: string): void {
    this.busy = true;
    this._printsService.startPrint(this.fileId, printerId).subscribe(
      () => {
        this.modal.dismiss();
        this._router.navigate(['/printers', printerId, 'status']).then();
      },
      (err) => {
        this.busy = false;
        this.error = err;
      }
    );
  }
}
