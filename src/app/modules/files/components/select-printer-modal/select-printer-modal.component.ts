import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { MaterialColor, Printer } from 'app/core/models';
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

  constructor(
    public modal: NgbActiveModal,
    private _router: Router,
    private _printersService: PrintersService,
    private _printsService: PrintsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printersService.getPrinters().subscribe(
        (printers) => {
          this.printers = printers;
          this.loading = false;
        },
        (err) => {
          this.error = err;
        }
      )
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
        this._router.navigate(['/printers', printerId]);
      },
      (err) => {
        this.busy = false;
        this.error = err;
      }
    );
  }
}
