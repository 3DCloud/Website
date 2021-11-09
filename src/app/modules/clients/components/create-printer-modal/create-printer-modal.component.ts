import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Device, PrinterDefinition } from 'app/core/models';
import {
  PrinterDefinitionsService,
  PrintersService,
} from 'app/shared/services';

@Component({
  selector: 'app-create-printer-modal',
  templateUrl: './create-printer-modal.component.html',
  styleUrls: ['./create-printer-modal.component.scss'],
})
export class CreatePrinterModalComponent implements OnInit, OnDestroy {
  @Input() public device?: Device;

  public busy = false;
  public error?: unknown;
  public printerDefinitions: PrinterDefinition[] = [];

  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    printerDefinition: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
  });

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _printerService: PrintersService,
    private _printerDefinitionsService: PrinterDefinitionsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printerDefinitionsService
        .getPrinterDefinitions()
        .subscribe(
          (printerDefinitions) => {
            this.printerDefinitions = printerDefinitions;
          },
          (error) => {
            this.error = error;
          }
        )
        .add(() => {
          this.form.get('printerDefinition')?.enable();
        })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public createPrinter(): void {
    if (this.form.invalid) {
      return;
    }

    if (!this.device) {
      this.modal.dismiss();
      return;
    }

    this.busy = true;

    this._subscriptions.push(
      this._printerService
        .createPrinter(
          this.device.id,
          this.form.get('printerDefinition')?.value,
          this.form.get('name')?.value
        )
        .subscribe(
          (printer) => {
            this.modal.close(printer);
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
