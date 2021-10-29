import { Component, Input } from '@angular/core';

import { PrintState } from 'app/core/models';
import { BootstrapColorClass } from 'app/shared/types';

@Component({
  selector: 'app-print-state-badge',
  templateUrl: './print-state-badge.component.html',
  styleUrls: ['./print-state-badge.component.scss'],
})
export class PrintStateBadgeComponent {
  @Input() public state: PrintState = 'unknown';
  @Input() public pill = false;

  public get type(): BootstrapColorClass {
    switch (this.state) {
      case 'pending':
        return 'light';

      case 'downloading':
        return 'info';

      case 'running':
        return 'warning';

      case 'success':
        return 'success';

      case 'canceled':
      case 'errored':
      default:
        return 'danger';
    }
  }

  public get text(): string {
    switch (this.state) {
      case 'pending':
        return 'Pending';

      case 'downloading':
        return 'Downloading';

      case 'running':
        return 'Running';

      case 'success':
        return 'Success';

      case 'canceled':
        return 'Canceled';

      case 'errored':
        return 'Errored';

      default:
        return 'Unknown';
    }
  }
}
