import { Component, OnDestroy, OnInit } from '@angular/core';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { PrinterDefinition } from 'app/core/models';
import { PrinterDefinitionsService } from 'app/shared/services';

interface PrinterDefinitionItem extends PrinterDefinition {
  deleting: boolean;
}

@Component({
  selector: 'app-printer-definitions',
  templateUrl: './printer-definitions.component.html',
  styleUrls: ['./printer-definitions.component.scss'],
})
export class PrinterDefinitionsComponent implements OnInit, OnDestroy {
  public loading = true;
  public printerDefinitions?: PrinterDefinitionItem[];
  public error?: string;

  public icons = {
    faEdit,
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
          this.printerDefinitions = printerDefinitions.map(
            (printerDefinition) => ({
              ...printerDefinition,
              deleting: false,
            })
          );
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

  public deletePrinterDefinition(
    printerDefinition: PrinterDefinitionItem
  ): void {
    printerDefinition.deleting = true;

    this._printerDefinitionsService
      .deletePrinterDefinition(printerDefinition.id)
      .subscribe(
        () => {
          this.printerDefinitions = this.printerDefinitions?.filter(
            (pd) => pd.id !== printerDefinition.id
          );
        },
        (err) => {
          this.error = err;
          printerDefinition.deleting = false;
        }
      );
  }
}
