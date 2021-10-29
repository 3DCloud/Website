import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import { BootstrapColorClass } from 'app/shared/types';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent {
  @Input() public showSpinner = true;
  @Input() public message?: string;
  @Input() public messageIcon: IconDefinition = faInfoCircle;
  @Input() public alertType: BootstrapColorClass = 'info';
}
