import { Component, OnDestroy, OnInit } from '@angular/core';
import { ForcedSubject, subject } from '@casl/ability';
import {
  faCheck,
  faQuestionCircle,
  faTimes,
  faTrash,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import actioncable from 'actioncable';
import { Subscription } from 'rxjs';

import { Printer } from 'app/core/models';
import { PrinterStateMessage } from 'app/core/models/action-cable';
import { PrintersService, UsersService } from 'app/shared/services';
import { environment } from 'environments/environment';

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
    faCheck,
    faQuestionCircle,
    faTimes,
    faTrash,
    faWrench,
  };

  public loading = true;
  public printers?: PrinterItem[];
  public error: unknown = null;
  public state: 'connecting' | 'connected' | 'disconnected' = 'connecting';

  private _subscriptions: Subscription[] = [];
  private _consumer?: actioncable.Cable;
  private _channel?: actioncable.Channel;

  public constructor(
    private _modal: NgbModal,
    private _printersService: PrintersService,
    private _usersService: UsersService
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

            this._subscriptions.push(
              this._usersService.getWebSocketTicket().subscribe((ticket) => {
                this._consumer = actioncable.createConsumer(
                  `${environment.cableUrl}?ticket=${encodeURIComponent(ticket)}`
                );

                this._consumer.connect();

                const connected = this.connected.bind(this);
                const disconnected = this.disconnected.bind(this);
                const received = this.received.bind(this);

                this._consumer?.ensureActiveConnection();

                this._channel = this._consumer?.subscriptions.create(
                  { channel: 'PrinterListenerChannel' },
                  {
                    connected,
                    disconnected,
                    received,
                  }
                );
              })
            );
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
    this._channel?.unsubscribe();
    this._consumer?.disconnect();

    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private connected(): void {
    this.state = 'connected';
  }

  private received(data: Record<string, unknown>): void {
    if (!data.action) {
      return;
    }

    switch (data.action) {
      case 'state': {
        const message = data as unknown as PrinterStateMessage;
        const printer: Printer | undefined = this.printers?.find(
          (p) => p.id === message.id
        );

        if (printer) {
          printer.state = message.state.printer_state;
          printer.progress = message.state.progress;
        }
        break;
      }
    }
  }

  private disconnected(): void {
    this.state = 'disconnected';
  }
}
