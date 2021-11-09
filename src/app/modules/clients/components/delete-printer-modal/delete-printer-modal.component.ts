import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Printer } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

@Component({
  selector: 'app-delete-printer-modal',
  templateUrl: './delete-printer-modal.component.html',
  styleUrls: ['./delete-printer-modal.component.scss'],
})
export class DeletePrinterModalComponent implements OnDestroy {
  @Input() public printer?: Printer;

  public busy = false;
  public error?: unknown;

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _printersService: PrintersService
  ) {}

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public deletePrinter(): void {
    if (!this.printer) {
      this.modal.dismiss();
      return;
    }

    this.busy = true;
    this._subscriptions.push(
      this._printersService
        .deletePrinter(this.printer.id)
        .subscribe(
          () => {
            this.modal.close();
          },
          (error) => {
            this.error = error;
          }
        )
        .add(() => {
          this.busy = false;
        })
    );
  }
}
