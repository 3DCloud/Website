import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faEdit,
  faExclamationTriangle,
  faInfoCircle,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { PrinterDefinition } from 'app/core/models';
import { PrinterDefinitionsService } from 'app/shared/services';

@Component({
  selector: 'app-printer-definitions',
  templateUrl: './printer-definitions.component.html',
  styleUrls: ['./printer-definitions.component.scss'],
})
export class PrinterDefinitionsComponent implements OnInit, OnDestroy {
  public loading = true;
  public printerDefinitions?: PrinterDefinition[];
  public error?: string;

  public icons = {
    faEdit,
    faExclamationTriangle,
    faInfoCircle,
    faPlus,
    faTrash,
  };

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _printerDefinitionsService: PrinterDefinitionsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printerDefinitionsService.getPrinterDefinitions().subscribe(
        (printerDefinitions) => {
          this.printerDefinitions = printerDefinitions;
          this.loading = false;
        },
        (err) => {
          this.error = err;
          this.loading = false;
        }
      )
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public deletePrinterDefinition(id: string): void {
    this._printerDefinitionsService.deletePrinterDefinition(id).subscribe(
      () => {
        this.printerDefinitions = this.printerDefinitions?.filter(
          (pd) => pd.id !== id
        );
      },
      (err) => {
        this.error = err;
      }
    );
  }
}
