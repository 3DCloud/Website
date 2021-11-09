import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Device, Printer } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

@Component({
  selector: 'app-reassign-printer-modal',
  templateUrl: './reassign-printer-modal.component.html',
  styleUrls: ['./reassign-printer-modal.component.scss'],
})
export class ReassignPrinterModalComponent implements OnInit, OnDestroy {
  @Input() public device?: Device;

  public busy = false;
  public error?: unknown;
  public printers: Printer[] = [];

  public form = new FormGroup({
    printer: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
  });

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _printersService: PrintersService
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
          this.form.get('printer')?.enable();
        })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public reassignPrinter(): void {
    if (!this.device || this.form.invalid) {
      return;
    }

    this.busy = true;

    this._printersService
      .reassignPrinter(this.device.id, this.form.get('printer')?.value)
      .subscribe(
        (printer) => {
          this.modal.close(printer);
          this.busy = false;
        },
        (err) => {
          this.error = err;
          this.busy = false;
        }
      );
  }
}
