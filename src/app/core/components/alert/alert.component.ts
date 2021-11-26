import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { BootstrapColorClass } from 'app/shared/types';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() public type: BootstrapColorClass = 'info';
  @Input() public icon?: IconDefinition;

  private _defaultIcons: Record<BootstrapColorClass, IconDefinition> = {
    info: faInfoCircle,
    primary: faInfoCircle,
    secondary: faInfoCircle,
    success: faCheckCircle,
    warning: faExclamationTriangle,
    danger: faExclamationTriangle,
    light: faInfoCircle,
    dark: faInfoCircle,
  };

  public get displayIcon(): IconDefinition {
    if (this.icon) {
      return this.icon;
    } else {
      return this._defaultIcons[this.type];
    }
  }
}
