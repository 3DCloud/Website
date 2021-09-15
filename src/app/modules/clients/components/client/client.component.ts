import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Client, Device, Printer } from 'app/core/models';
import { ClientsService } from 'app/shared/services';

import { CreatePrinterModalComponent, DeletePrinterModalComponent } from '..';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {
  @ViewChild('addPrinterModal') addPrinterModal?: ElementRef = undefined;
  @ViewChild('deletePrinterModal') deletePrinterModal?: ElementRef = undefined;

  public loading = true;
  public error?: unknown;
  public busy = false;
  public client?: Client;

  public icons = { faSave };

  public name = new FormControl();

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private modalService: NgbModal
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.subscriptions.push(
          this.clientsService
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
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public saveName(): void {
    if (!this.client) {
      return;
    }

    this.busy = true;
    this.subscriptions.push(
      this.clientsService
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
    const modalRef = this.modalService.open(CreatePrinterModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.device = device;
    this.subscriptions.push(
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
    const modalRef = this.modalService.open(DeletePrinterModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.printer = printer;
    this.subscriptions.push(
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