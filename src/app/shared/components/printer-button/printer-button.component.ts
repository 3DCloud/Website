import { Component, Input } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import { Printer } from 'app/core/models';

@Component({
  selector: 'app-printer-button',
  templateUrl: './printer-button.component.html',
  styleUrls: ['./printer-button.component.scss'],
})
export class PrinterButtonComponent {
  @Input() public printer: Printer = null!;

  public icons = {
    faQuestionCircle,
  };
}
