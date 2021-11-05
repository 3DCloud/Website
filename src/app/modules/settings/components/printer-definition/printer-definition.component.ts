import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faExclamationTriangle,
  faPlus,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { PrinterDefinition } from 'app/core/models';
import { PrinterDefinitionsService } from 'app/shared/services';

@Component({
  selector: 'app-printer-definition',
  templateUrl: './printer-definition.component.html',
  styleUrls: ['./printer-definition.component.scss'],
})
export class PrinterDefinitionComponent implements OnInit, OnDestroy {
  public formControls = {
    name: new FormControl(null, Validators.required),
    extruderCount: new FormControl(1, Validators.required),
    startGCode: new FormControl(null),
    endGCode: new FormControl(null),
    cancelGCode: new FormControl(null),
  };

  public form = new FormGroup({
    name: this.formControls.name,
    extruderCount: this.formControls.extruderCount,
    gCodeSettings: new FormGroup({
      startGCode: this.formControls.startGCode,
      endGCode: this.formControls.endGCode,
      cancelGCode: this.formControls.cancelGCode,
    }),
    ultiGCodeSettings: new FormArray([]),
  });

  public icons = { faExclamationTriangle, faPlus, faSave };
  public loading = { printerDefinition: true, submit: false };
  public currentUltiGCodeIndex = 0;

  public printerDefinitionId: string | null = null;
  public printerDefinition?: PrinterDefinition;
  public error?: string;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _printerDefinitionsService: PrinterDefinitionsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._route.paramMap.subscribe((paramMap) => {
        this.printerDefinitionId = paramMap.get('id');

        if (!this.printerDefinitionId) {
          this.loading.printerDefinition = false;
          return;
        }

        this._printerDefinitionsService
          .getPrinterDefinition(this.printerDefinitionId)
          .subscribe((printerDefinition) => {
            this.loading.printerDefinition = false;
            this.printerDefinition = printerDefinition;

            for (
              let i = 0;
              i < (printerDefinition.ultiGCodeSettings?.length ?? 0);
              i++
            ) {
              (this.form.get('ultiGCodeSettings') as FormArray).push(
                new FormGroup({
                  hotendTemperature: new FormControl(200, Validators.required),
                  buildPlateTemperature: new FormControl(
                    60,
                    Validators.required
                  ),
                  retractionLength: new FormControl(6.5, Validators.required),
                  endOfPrintRetractionLength: new FormControl(
                    20,
                    Validators.required
                  ),
                  retractionSpeed: new FormControl(25, Validators.required),
                  flowRate: new FormControl(100, Validators.required),
                  fanSpeed: new FormControl(100, Validators.required),
                })
              );
            }

            this.form.patchValue(printerDefinition);
          });
      })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public rows(formControl: FormControl): number {
    if (typeof formControl.value !== 'string') {
      return 0;
    }

    return formControl.value.split('\n').length;
  }

  public formGroup(): FormGroup {
    return (this.form.get('ultiGCodeSettings') as FormArray).get(
      this.currentUltiGCodeIndex.toString()
    ) as FormGroup;
  }

  public submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.error = undefined;
    this.loading.submit = true;

    const printerDefinition = this.form.value as PrinterDefinition;
    const call = this.printerDefinitionId
      ? this._printerDefinitionsService.updatePrinterDefinition(
          this.printerDefinitionId,
          printerDefinition.name
        )
      : this._printerDefinitionsService.createPrinterDefinition(
          printerDefinition.name
        );

    call.subscribe(
      () => {
        this._router.navigate(['..'], { relativeTo: this._route }).then();
      },
      (err) => {
        this.error = err;
        this.loading.submit = false;
      }
    );
  }
}
