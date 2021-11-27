import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

import { Device, Printer, PrinterDefinition } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

@Component({
  selector: 'app-reassign-printer-modal',
  templateUrl: './set-up-printer-modal.component.html',
  styleUrls: ['./set-up-printer-modal.component.scss'],
})
export class SetUpPrinterModalComponent implements OnInit, OnDestroy {
  @Input() public device: Device = null!;

  public readonly icons = {
    faExclamationTriangle,
  };

  public loading = true;
  public busy = false;
  public error?: unknown;
  public printerDefinitions?: PrinterDefinition[];
  public printers?: Printer[];
  public printerIndex: string | undefined;
  public method: 'create' | 'assign' = 'create';

  public formControls = {
    name: new FormControl('', [Validators.required]),
    printerDefinitionId: new FormControl(undefined, [Validators.required]),
  };

  public form = new FormGroup(this.formControls);

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _router: Router,
    private _printersService: PrintersService
  ) {}

  public get isValid(): boolean {
    switch (this.method) {
      case 'assign':
        return this.printerIndex !== undefined;

      case 'create':
        return this.form.valid;

      default:
        return false;
    }
  }

  public get submitText(): string {
    switch (this.method) {
      case 'assign':
        return 'Assign';

      case 'create':
        return 'Create';

      default:
        return 'Submit';
    }
  }

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printersService
        .getPrintersAndDefinitions()
        .subscribe(
          (data) => {
            this.printerDefinitions = data.printerDefinitions;
            this.printers = data.printers.filter(
              (printer) => printer.deviceId !== this.device.id
            );
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

  public submit(): void {
    if (!this.device) {
      return;
    }

    let request: Observable<Printer> | undefined;

    switch (this.method) {
      case 'assign':
        request = this.submitAssign();
        break;

      case 'create':
        request = this.submitCreate();
        break;
    }

    if (!request) {
      return;
    }

    this.busy = true;

    this._subscriptions.push(
      request
        .subscribe(
          (printer) => {
            this._router
              .navigate(['/printers', printer.id, 'status'])
              .then(() => {
                this.modal.close();
              });
          },
          (err) => {
            this.error = err;
          }
        )
        .add(() => (this.busy = false))
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private submitAssign(): Observable<Printer> | undefined {
    if (!this.printerIndex) {
      return undefined;
    }

    return this._printersService.assignPrinter(
      this.device.id,
      this.printerIndex
    );
  }

  private submitCreate(): Observable<Printer> | undefined {
    if (this.form.invalid) {
      return undefined;
    }

    return this._printersService.createPrinter(
      this.device.id,
      this.formControls.printerDefinitionId.value,
      this.formControls.name.value
    );
  }
}
