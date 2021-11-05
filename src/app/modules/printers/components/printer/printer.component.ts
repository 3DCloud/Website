import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBan, faSync } from '@fortawesome/free-solid-svg-icons';
import * as actioncable from 'actioncable';
import { Subscription } from 'rxjs';

import { Printer, PrinterState } from 'app/core/models';
import { AuthenticationService } from 'app/core/services';
import { PrintersService, UsersService } from 'app/shared/services';

interface Temperature {
  name: string;
  current: number;
  target: number;
}

interface Temperatures {
  bed_temperature?: Temperature;
  hotend_temperatures: Temperature[];
}

interface PrinterStateObj {
  hardware_identifier: string;
  printer_state: PrinterState;
  temperatures?: Temperatures;
  progress?: number;
  time_remaining?: number;
}

type WebSocketState = 'connecting' | 'connected' | 'disconnected';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss'],
})
export class PrinterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('logElement', { static: true })
  public logElement?: ElementRef<HTMLPreElement>;

  public icons = {
    faBan,
    faSync,
  };

  public printer: Printer | undefined;
  public printerState?: PrinterStateObj;
  public scrollToBottom = true;
  public command = '';
  public webSocketState: WebSocketState = 'connecting';

  private _printerId?: string;
  private _consumer?: actioncable.Cable;
  private _channel?: actioncable.Channel;
  private _subscriptions: Subscription[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _authenticationService: AuthenticationService,
    private _usersService: UsersService,
    private _printersService: PrintersService
  ) {}

  public get webSocketStateTooltip(): string {
    switch (this.webSocketState) {
      case 'connecting':
        return 'Connecting to live data feed...';

      case 'connected':
        return 'Connected to live data feed';

      case 'disconnected':
        return 'Disconnected from live data feed';
    }
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._route.params.subscribe((params) => {
        this._printerId = params.id;

        this._subscriptions.push(
          this._printersService.getPrinter(params.id).subscribe((printer) => {
            this.printer = printer;
            this.connectToSocket();
          })
        );
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.logElement) {
      this.logElement.nativeElement.addEventListener('scroll', () =>
        this.onScroll()
      );
    }
  }

  ngOnDestroy(): void {
    this._consumer?.disconnect();

    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
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

  private connectToSocket() {
    this.webSocketState = 'connecting';

    if (this._consumer) {
      this._consumer.disconnect();
      this._consumer = undefined;
    }

    this._subscriptions.push(
      this._usersService.getWebSocketTicket().subscribe((ticket) => {
        this._consumer = actioncable.createConsumer(
          'ws://user:pass@localhost:3000/cable?ticket=' +
            encodeURIComponent(ticket ?? '')
        );

        this._consumer.connect();

        const connected = this.connected.bind(this);
        const received = this.received.bind(this);
        const disconnected = this.disconnected.bind(this);

        this._consumer?.ensureActiveConnection();
        this._channel = this._consumer?.subscriptions.create(
          { channel: 'PrinterListenerChannel', id: this._printerId },
          {
            connected,
            received,
            disconnected,
          }
        );
      })
    );
  }

  private connected(): void {
    this.webSocketState = 'connected';
  }

  private received(data: Record<string, unknown>): void {
    if (!data.action) {
      return;
    }

    switch (data.action) {
      case 'state':
        this.printerState = data.state as PrinterStateObj;
        break;
    }
  }

  private disconnected(): void {
    this.webSocketState = 'disconnected';
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
