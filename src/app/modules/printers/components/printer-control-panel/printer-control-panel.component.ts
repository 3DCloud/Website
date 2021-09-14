import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import * as actioncable from 'actioncable';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-printer',
  templateUrl: './printer-control-panel.component.html',
  styleUrls: ['./printer-control-panel.component.scss']
})
export class PrinterControlPanelComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('logElement', { static: true }) public logElement?: ElementRef<HTMLPreElement>;

  public connecting = true;
  public temperatures: any;
  public scrollToBottom = true;
  public command = '';

  private consumer?: actioncable.Cable;
  private channel?: actioncable.Channel;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.consumer = actioncable.createConsumer('ws://localhost:3000/cable');
    this.consumer.connect();

    this.route.params.subscribe(params => {
      this.channel = this.consumer?.subscriptions.create({ channel: 'PrinterListenerChannel', id: params.id }, {
        connected: () => this.connected(),
        disconnected: () => this.disconnected(),
        received: (data) => this.received(data)
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.logElement) {
      this.logElement.nativeElement.addEventListener('scroll', () => this.onScroll());
    }
  }

  ngOnDestroy(): void {
    this.consumer?.disconnect();
  }

  public sendCommand(): void {
    this.channel?.perform('send_command', { command: this.command });
    this.command = '';
  }

  private connected(): void {
    this.connecting = false;
  }

  private disconnected(): void { }

  private received(data: any): void {
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
            this.logElement.nativeElement.scrollTop = this.logElement.nativeElement.scrollHeight;
          }
        }

        break;

      case 'state':
        this.temperatures = data.printer_state;
        break;
    }
  }

  private onScroll(): void {
    if (!this.logElement) {
      return;
    }

    this.scrollToBottom = (this.logElement.nativeElement.scrollTop + this.logElement.nativeElement.clientHeight) === this.logElement.nativeElement.scrollHeight;
  }

}
