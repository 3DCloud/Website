import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  PrintStateBadgeComponent,
  PrinterButtonComponent,
  PrinterStateBadgeComponent,
} from './components';
import { IsInvalidPipe } from './pipes/is-invalid.pipe';
import { TimesPipe } from './pipes/times.pipe';

@NgModule({
  declarations: [
    PrinterStateBadgeComponent,
    PrintStateBadgeComponent,
    IsInvalidPipe,
    TimesPipe,
    PrinterButtonComponent,
  ],
  imports: [CommonModule, FontAwesomeModule, NgbModule],
  providers: [],
  exports: [
    PrinterStateBadgeComponent,
    PrintStateBadgeComponent,
    IsInvalidPipe,
    TimesPipe,
    PrinterButtonComponent,
  ],
})
export class SharedModule {}
