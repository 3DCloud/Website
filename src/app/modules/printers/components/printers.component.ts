import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Printer } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent implements OnInit, OnDestroy {
  public loading = true;
  public printers: Printer[] = [];
  public error: unknown = null;

  private subscriptions: Subscription[] = [];

  constructor(private printersService: PrintersService) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.printersService
        .getPrinters()
        .subscribe(
          (printers) => {
            this.printers = printers;
          },
          (error) => {
            this.error = error;
          }
        )
        .add(() => {
          this.loading = false;
        })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
