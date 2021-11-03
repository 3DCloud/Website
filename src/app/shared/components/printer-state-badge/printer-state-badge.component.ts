import { Component, Input } from '@angular/core';

import { PrinterState } from 'app/core/models';
import { BootstrapColorClass } from 'app/shared/types';

@Component({
  selector: 'app-printer-state-badge',
  templateUrl: './printer-state-badge.component.html',
  styleUrls: ['./printer-state-badge.component.scss'],
})
export class PrinterStateBadgeComponent {
  @Input() public state: PrinterState | undefined;
  @Input() public pill = false;

  public get type(): BootstrapColorClass {
    switch (this.state) {
      case 'connecting':
        return 'light';

      case 'downloading':
        return 'info';

      case 'ready':
        return 'success';

      case 'printing':
      case 'heating':
      case 'canceling':
        return 'warning';

      default:
        return 'danger';
    }
  }

  public get text(): string {
    switch (this.state) {
      case 'busy':
        return 'Busy';

      case 'canceling':
        return 'Canceling';

      case 'connecting':
        return 'Connecting';

      case 'disconnected':
        return 'Disconnected';

      case 'disconnecting':
        return 'Disconnecting';

      case 'downloading':
        return 'Downloading';

      case 'errored':
        return 'Errored';

      case 'heating':
        return 'Heating';

      case 'offline':
        return 'Offline';

      case 'paused':
        return 'Paused';

      case 'pausing':
        return 'Pausing';

      case 'printing':
        return 'Printing';

      case 'ready':
        return 'Ready';

      case 'resuming':
        return 'Resuming';

      default:
        return 'Unknown';
    }
  }
}
