import { Component, OnDestroy, OnInit } from '@angular/core';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Printer } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

import { ChangeMaterialModalComponent } from '..';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent implements OnInit, OnDestroy {
  public icons = {
    faWrench,
  };

  public loading = true;
  public printers: Printer[] = [];
  public error: unknown = null;

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _modal: NgbModal,
    private _printersService: PrintersService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printersService
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

  public showChangeMaterialModal(printer: Printer): void {
    const modalRef = this._modal.open(ChangeMaterialModalComponent);
    const component =
      modalRef.componentInstance as ChangeMaterialModalComponent;
    component.printer = printer;
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
