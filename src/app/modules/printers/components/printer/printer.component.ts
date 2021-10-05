import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as actioncable from 'actioncable';

import { AuthenticationService } from 'app/core/services';
import { UsersService } from 'app/shared/services';

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

interface PrinterState {
  hardware_identifier: string;
  printer_state: string;
  temperatures?: Temperatures;
}

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss'],
})
export class PrinterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('logElement', { static: true })
  public logElement?: ElementRef<HTMLPreElement>;

  public connecting = true;
  public printerState?: PrinterState;
  public scrollToBottom = true;
  public command = '';

  private _consumer?: actioncable.Cable;
  private _channel?: actioncable.Channel;

  constructor(
    private _route: ActivatedRoute,
    private _authenticationService: AuthenticationService,
    private _usersService: UsersService
  ) {}

  ngOnInit(): void {
    this._usersService.getWebSocketTicket().subscribe((ticket) => {
      this._consumer = actioncable.createConsumer(
        'ws://user:pass@localhost:3000/cable?ticket=' +
          encodeURIComponent(ticket ?? '')
      );
      this._consumer.connect();

      this._route.params.subscribe((params) => {
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

  ngAfterViewInit(): void {
    if (this.logElement) {
      this.logElement.nativeElement.addEventListener('scroll', () =>
        this.onScroll()
      );
    }
  }

  ngOnDestroy(): void {
    this._consumer?.disconnect();
  }

  public sendCommand(): void {
    this._channel?.perform('send_command', { command: this.command });
    this.command = '';
  }

  public badgeTypeForState(state: string): string {
    switch (state) {
      case 'ready':
        return 'success';

      case 'printing':
        return 'warning';

      case 'connecting':
        return 'light';

      default:
        return 'danger';
    }
  }

  private received(data: Record<string, unknown>): void {
    if (!data.action) {
      return;
    }

    switch (data.action) {
      case 'state':
        this.connecting = false;
        this.printerState = data.state as PrinterState;
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
