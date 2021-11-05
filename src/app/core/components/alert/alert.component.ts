import { Component, Input } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { BootstrapColorClass } from 'app/shared/types';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() public type: BootstrapColorClass = 'info';
  @Input() public icon = faInfoCircle;
}
