import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  PrintStateBadgeComponent,
  PrinterButtonComponent,
  PrinterStateBadgeComponent,
} from './components';
import { IsInvalidPipe } from './pipes';

@NgModule({
  declarations: [
    PrinterStateBadgeComponent,
    PrintStateBadgeComponent,
    IsInvalidPipe,
    PrinterButtonComponent,
  ],
  imports: [CommonModule, FontAwesomeModule, NgbModule],
  providers: [],
  exports: [
    PrinterStateBadgeComponent,
    PrintStateBadgeComponent,
    IsInvalidPipe,
    PrinterButtonComponent,
  ],
})
export class SharedModule {}
