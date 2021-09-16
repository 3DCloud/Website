import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cable, Channel, createConsumer } from 'actioncable';

interface Temperature {
  name: string;
  current: number;
  target: number;
}

interface TemperaturesMessage {
  active_hotend_temperature: Temperature;
  build_plate_temperature?: Temperature;
  hotend_temperatures: Temperature[];
}

@Component({
  selector: 'app-printer',
  templateUrl: './printer-control-panel.component.html',
  styleUrls: ['./printer-control-panel.component.scss'],
})
export class PrinterControlPanelComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('logElement', { static: true })
  public logElement?: ElementRef<HTMLPreElement>;

  public connecting = true;
  public temperatures?: TemperaturesMessage;
  public scrollToBottom = true;
  public command = '';

  private _consumer?: Cable;
  private _channel?: Channel;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._consumer = createConsumer('ws://localhost:3000/cable');
    this._consumer.connect();

    this._route.params.subscribe((params) => {
      this._channel = this._consumer?.subscriptions.create(
        { channel: 'PrinterListenerChannel', id: params.id },
        {
          connected: () => this.connected(),
          received: (data: Record<string, unknown>) => this.received(data),
        }
      );
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

  private connected(): void {
    this.connecting = false;
  }

  private received(data: Record<string, unknown>): void {
    if (!data.action) {
      return;
    }

    switch (data.action) {
      case 'log_message':
        if (this.logElement) {
          // there's a delay because of change detection if we use a variable that we then reference in the view,
          // so set the text directly so scroll to bottom actually goes all the way to the bottom.
          this.logElement.nativeElement.textContent += data.message + '\n';

          if (this.scrollToBottom) {
            this.logElement.nativeElement.scrollTop =
              this.logElement.nativeElement.scrollHeight;
          }
        }

        break;

      case 'state':
        this.temperatures = data.printer_state as TemperaturesMessage;
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
