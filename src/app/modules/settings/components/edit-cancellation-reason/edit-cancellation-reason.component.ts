import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { CancellationReason, CancellationReasonInput } from 'app/core/models';
import { CancellationReasonsService } from 'app/shared/services';

@Component({
  selector: 'app-edit-cancellation-reason',
  templateUrl: './edit-cancellation-reason.component.html',
  styleUrls: ['./edit-cancellation-reason.component.scss'],
})
export class EditCancellationReasonComponent implements OnInit, OnDestroy {
  public icons = {
    faSave,
  };

  public loading = true;
  public id: string | null = null;
  public error?: string;
  public busy = false;

  public formControls = {
    name: new FormControl(null, Validators.required),
    description: new FormControl(null),
  };
  public form = new FormGroup(this.formControls);

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _cancellationReasonsService: CancellationReasonsService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._route.paramMap
        .pipe(
          concatMap((paramMap) => {
            this.id = paramMap.get('id');
            if (this.id) {
              return this._cancellationReasonsService.getCancellationReason(
                this.id
              );
            } else {
              return of(undefined);
            }
          })
        )
        .subscribe(
          (cancellationReason) => {
            if (this.id) {
              if (cancellationReason) {
                this.form.patchValue(cancellationReason);
              } else {
                this.error = 'Cancellation reason not found.';
              }
            }

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
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.busy = true;

    const cancellationReason = this.form.value as CancellationReasonInput;
    let request: Observable<CancellationReason>;

    if (this.id) {
      request = this._cancellationReasonsService.updateCancellationReason(
        this.id,
        cancellationReason
      );
    } else {
      request =
        this._cancellationReasonsService.createCancellationReason(
          cancellationReason
        );
    }

    request.subscribe(
      () => {
        this._router.navigate(['..'], { relativeTo: this._route }).then();
        this.busy = false;
      },
      (err) => {
        this.error = err;
        this.busy = false;
      }
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
