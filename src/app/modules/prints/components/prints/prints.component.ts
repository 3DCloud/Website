import { Component, OnDestroy, OnInit } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { Print } from 'app/core/models';
import { PrintsService } from 'app/shared/services';

@Component({
  selector: 'app-prints',
  templateUrl: './prints.component.html',
  styleUrls: ['./prints.component.scss'],
})
export class PrintsComponent implements OnInit, OnDestroy {
  public icons = {
    faExclamationTriangle,
  };

  public loading = true;
  public error?: string;
  public prints?: Print[];

  private _subscriptions: Subscription[] = [];

  constructor(private _printsService: PrintsService) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printsService.getPrints().subscribe(
        (prints) => {
          this.loading = false;
          this.prints = prints;
        },
        (err) => {
          this.loading = false;
          this.error = err;
        }
      )
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
