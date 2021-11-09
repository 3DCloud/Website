import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  faExclamationTriangle,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Client, Device, Printer } from 'app/core/models';
import { ClientsService } from 'app/shared/services';

import {
  CreatePrinterModalComponent,
  DeletePrinterModalComponent,
  ReassignPrinterModalComponent,
} from '..';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
  @ViewChild('addPrinterModal') public addPrinterModal?: ElementRef = undefined;
  @ViewChild('deletePrinterModal') public deletePrinterModal?: ElementRef =
    undefined;

  public loading = true;
  public error?: unknown;
  public busy = false;
  public client?: Client;

  public icons = { faExclamationTriangle, faSave };

  public name = new FormControl();

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _route: ActivatedRoute,
    private _clientsService: ClientsService,
    private _modalService: NgbModal
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._route.params.subscribe((params) => {
        this._subscriptions.push(
          this._clientsService
            .getClient(params.id)
            .subscribe(
              (client) => {
                this.client = client;
                this.name.setValue(client.name);
              },
              (error) => {
                this.error = error;
              }
            )
            .add(() => {
              this.loading = false;
            })
        );
      })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public saveName(): void {
    if (!this.client) {
      return;
    }

    this.busy = true;
    this._subscriptions.push(
      this._clientsService
        .setName(this.client.id, this.name.value)
        .subscribe(
          (client) => {
            if (!this.client) {
              return;
            }

            this.client.name = client.name;
          },
          (error) => {
            this.error = error;
          }
        )
        .add(() => {
          this.busy = false;
        })
    );
  }

  public createPrinter(device: Device): void {
    const modalRef = this._modalService.open(CreatePrinterModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.device = device;
    this._subscriptions.push(
      modalRef.closed.subscribe((printer) => {
        if (!this.client || !this.client.printers) {
          return;
        }

        device.printer = printer;
        this.client.printers.push(printer);
      })
    );
  }

  public reassignPrinter(device: Device): void {
    const modalRef = this._modalService.open(ReassignPrinterModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.device = device;
    this._subscriptions.push(
      modalRef.closed.subscribe((printer) => {
        if (!this.client || !this.client.printers) {
          return;
        }

        device.printer = printer;
        this.client.printers.push(printer);
      })
    );
  }

  public showDeletePrinterModal(printer: Printer): void {
    const modalRef = this._modalService.open(DeletePrinterModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.printer = printer;
    this._subscriptions.push(
      modalRef.closed.subscribe(() => {
        if (!this.client || !this.client.printers) {
          return;
        }

        const device = this.client.devices?.find(
          (d) => d.id === printer.deviceId
        );

        if (device) {
          device.printer = undefined;
        }

        this.client.printers = this.client.printers.filter(
          (p) => p.id !== printer.id
        );
      })
    );
  }
}
