import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faExclamationTriangle,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Printer, PrinterInput } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

@Component({
  selector: 'app-printer-settings',
  templateUrl: './printer-settings.component.html',
  styleUrls: ['./printer-settings.component.scss'],
})
export class PrinterSettingsComponent implements OnInit, OnDestroy {
  public readonly nozzleSizes = [
    'size_0_25',
    'size_0_40',
    'size_0_60',
    'size_0_80',
    'size_1_00',
  ];

  public readonly nozzleSizeNames = [
    '0.25 mm',
    '0.40 mm',
    '0.60 mm',
    '0.80 mm',
    '1.00 mm',
  ];

  public readonly icons = {
    faExclamationTriangle,
    faSave,
  };

  public loading = true;
  public error?: string;
  public printer?: Readonly<Printer>;
  public busy = false;

  public formControls = {
    printerExtruders: new FormArray([]),
  };

  public form = new FormGroup(this.formControls);

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _printersService: PrintersService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._route.paramMap
        .pipe(
          concatMap((paramMap) => {
            const id = paramMap.get('id');

            if (!id) {
              throw new Error('Missing ID');
            }

            return this._printersService.getPrinterSettings(id);
          })
        )
        .subscribe(
          (data) => {
            this.printer = data.printer;

            for (
              let i = 0;
              i < data.printer.printerDefinition.extruderCount;
              i++
            ) {
              this.formControls.printerExtruders.push(
                new FormGroup({
                  extruderIndex: new FormControl(i),
                  ultiGCodeNozzleSize: new FormControl(),
                })
              );
            }

            this.form.patchValue(data.printer);

            this.loading = false;
          },
          (err) => {
            this.error = err;
            this.loading = false;
          }
        )
    );
  }

  public submit(): void {
    if (!this.printer || this.form.invalid) {
      return;
    }

    this.busy = true;
    const printer = this.form.value as PrinterInput;

    this._subscriptions.push(
      this._printersService
        .updatePrinter(this.printer.id, printer)
        .subscribe(
          () => {
            this._router.navigate(['../..'], { relativeTo: this._route });
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
}
