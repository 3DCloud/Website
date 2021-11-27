import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { CancellationReason, Printer } from 'app/core/models';
import {
  CancellationReasonsService,
  PrintersService,
  PrintsService,
} from 'app/shared/services';

@Component({
  selector: 'app-cancel-print-modal',
  templateUrl: './cancel-print-modal.component.html',
  styleUrls: ['./cancel-print-modal.component.scss'],
})
export class CancelPrintModalComponent implements OnInit, OnDestroy {
  public printer: Printer = null!;

  public loading = true;
  public error?: string;
  public reasons?: CancellationReason[];
  public busy = false;

  public formControls = {
    cancellationReasonId: new FormControl(null),
    cancellationReasonDetails: new FormControl(null),
  };

  public form = new FormGroup(this.formControls, this.detailsRequiredIfOther);

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _printsService: PrintsService,
    private _printersService: PrintersService,
    private _cancellationReasonsService: CancellationReasonsService
  ) {}

  public get selectedReason(): CancellationReason | undefined {
    return this.reasons?.find(
      (r) => r.id === this.formControls.cancellationReasonId?.value
    );
  }

  public ngOnInit(): void {
    this._subscriptions.push(
      this._cancellationReasonsService
        .getCancellationReasons()
        .subscribe(
          (cancellationReasons) => {
            this.reasons = cancellationReasons;
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
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this._subscriptions.push(
      this._printersService
        .cancelCurrentPrint(
          this.printer.id,
          this.formControls.cancellationReasonId.value,
          this.formControls.cancellationReasonDetails.value
        )
        .subscribe(
          () => {
            this.modal.close();
          },
          (err) => {
            this.error = err;
          }
        )
        .add(() => {
          this.busy = false;
        })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private detailsRequiredIfOther(
    control: AbstractControl
  ): ValidationErrors | null {
    const detailsControl = control.get(
      'cancellationReasonDetails'
    ) as AbstractControl;

    const errors = control.get('cancellationReasonId')?.value
      ? null
      : Validators.required(detailsControl);

    detailsControl.setErrors(errors);

    return null;
  }
}
