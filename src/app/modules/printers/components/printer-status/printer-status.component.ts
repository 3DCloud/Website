import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForcedSubject, subject } from '@casl/ability';
import { faBan, faSync } from '@fortawesome/free-solid-svg-icons';
import * as actioncable from 'actioncable';
import { Subscription } from 'rxjs';

import { Printer, PrinterState } from 'app/core/models';
import { AuthenticationService } from 'app/core/services';
import { PrintersService, UsersService } from 'app/shared/services';
import { environment } from 'environments/environment';

interface Temperature {
  name: string;
  current: number;
  target: number;
}

interface Temperatures {
  active_hotend_temperature: Temperature;
  bed_temperature?: Temperature;
  hotend_temperatures: Temperature[];
}

interface PrinterStateObj {
  printer_state: PrinterState;
  temperatures?: Temperatures;
  progress?: number;
  time_remaining?: number;
}

@Component({
  selector: 'app-printer',
  templateUrl: './printer-status.component.html',
  styleUrls: ['./printer-status.component.scss'],
})
export class PrinterStatusComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('logElement', { static: true })
  public logElement?: ElementRef<HTMLPreElement>;

  public icons = {
    faBan,
    faSync,
  };

  public printer: Printer | undefined;
  public connecting = true;
  public printerState?: PrinterStateObj;
  public scrollToBottom = true;
  public command = '';

  private _printerId?: string;
  private _consumer?: actioncable.Cable;
  private _channel?: actioncable.Channel;
  private _subscriptions: Subscription[] = [];

  public constructor(
    private _route: ActivatedRoute,
    private _authenticationService: AuthenticationService,
    private _usersService: UsersService,
    private _printersService: PrintersService
  ) {}

  public ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this._printerId = params.id;

      this._printersService.getPrinter(params.id).subscribe((printer) => {
        this.printer = printer;
      });

      this._usersService.getWebSocketTicket().subscribe((ticket) => {
        this._consumer = actioncable.createConsumer(
          `${environment.cableUrl}?ticket=${encodeURIComponent(ticket)}`
        );

        this._consumer.connect();

        const received = this.received.bind(this);

        this._consumer?.ensureActiveConnection();
        this._channel = this._consumer?.subscriptions.create(
          { channel: 'PrinterListenerChannel', id: params.id },
          {
            received,
          }
        );
      });
    });
  }

  public ngAfterViewInit(): void {
    if (this.logElement) {
      this.logElement.nativeElement.addEventListener('scroll', () =>
        this.onScroll()
      );
    }
  }

  public hotendTrackBy(index: number, item: Temperature): string {
    return item.name;
  }

  public ngOnDestroy(): void {
    this._consumer?.disconnect();

    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public subject<T extends string, U>(
    type: T,
    object: U
  ): U & ForcedSubject<T> {
    return subject(type, object);
  }

  public sendCommand(): void {
    this._channel?.perform('send_command', { command: this.command });
    this.command = '';
  }

  public cancelPrint(): void {
    if (!this._printerId) {
      return;
    }

    this._subscriptions.push(
      this._printersService
        .cancelCurrentPrint(this._printerId)
        .subscribe(() => undefined)
    );
  }

  public reconnect(): void {
    if (!this._printerId) {
      return;
    }

    this._subscriptions.push(
      this._printersService
        .reconnectPrinter(this._printerId)
        .subscribe(() => undefined)
    );
  }

  private received(data: Record<string, unknown>): void {
    if (!data.action) {
      return;
    }

    switch (data.action) {
      case 'state':
        this.connecting = false;
        this.printerState = data.state as PrinterStateObj;
        break;
    }
  }

  private onScroll(): void {
    if (!this.logElement) {
      return;
    }

    this.scrollToBottom =
      this.logElement.nativeElement.scrollTop +
        this.logElement.nativeElement.clientHeight ===
      this.logElement.nativeElement.scrollHeight;
  }
}
