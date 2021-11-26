import { Component, OnDestroy, OnInit } from '@angular/core';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { CancellationReason } from 'app/core/models';
import { CancellationReasonsService } from 'app/shared/services';

interface CancellationReasonItem extends CancellationReason {
  deleting: boolean;
}

@Component({
  selector: 'app-cancellation-reasons',
  templateUrl: './cancellation-reasons.component.html',
  styleUrls: ['./cancellation-reasons.component.scss'],
})
export class CancellationReasonsComponent implements OnInit, OnDestroy {
  public icons = {
    faEdit,
    faPlus,
    faTrash,
  };

  public loading = true;
  public error?: string;
  public cancellationReasons?: CancellationReasonItem[];

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _cancellationReasonsService: CancellationReasonsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._cancellationReasonsService
        .getCancellationReasons()
        .subscribe(
          (cancellationReasons) => {
            this.cancellationReasons = cancellationReasons.map((cr) => ({
              ...cr,
              deleting: false,
            }));
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

  public delete(item: CancellationReasonItem): void {
    item.deleting = true;

    this._cancellationReasonsService
      .deleteCancellationReason(item.id)
      .subscribe(
        () => {
          this.cancellationReasons = this.cancellationReasons?.filter(
            (cr) => cr.id !== item.id
          );
        },
        (err) => {
          this.error = err;
          item.deleting = false;
        }
      );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
