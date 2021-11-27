import { Component, OnDestroy, OnInit } from '@angular/core';
import { ForcedSubject, subject } from '@casl/ability';
import {
  faQuestionCircle,
  faTrash,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Printer } from 'app/core/models';
import { PrintersService } from 'app/shared/services';

import { ChangeMaterialModalComponent } from '..';

interface PrinterItem extends Printer {
  deleting: boolean;
}

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss'],
})
export class PrintersComponent implements OnInit, OnDestroy {
  public icons = {
    faQuestionCircle,
    faTrash,
    faWrench,
  };

  public loading = true;
  public printers?: PrinterItem[];
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
            this.printers = printers.map((printer) => ({
              ...printer,
              deleting: false,
            }));
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

  public subject<T extends string, U>(
    type: T,
    object: U
  ): U & ForcedSubject<T> {
    return subject(type, object);
  }

  public showChangeMaterialModal(printer: Printer): void {
    const modalRef = this._modal.open(ChangeMaterialModalComponent);
    const component =
      modalRef.componentInstance as ChangeMaterialModalComponent;
    component.printer = printer;
  }

  public delete(printer: PrinterItem): void {
    printer.deleting = true;

    this._printersService
      .deletePrinter(printer.id)
      .subscribe(
        () => {
          this.printers = this.printers?.filter((p) => p.id !== printer.id);
        },
        (err) => {
          this.error = err;
        }
      )
      .add(() => (printer.deleting = false));
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
