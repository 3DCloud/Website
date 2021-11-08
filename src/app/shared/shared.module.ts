import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PrintStateBadgeComponent } from './components/print-state-badge/print-state-badge.component';
import { PrinterStateBadgeComponent } from './components/printer-state-badge/printer-state-badge.component';
import { IsInvalidPipe } from './pipes/is-invalid.pipe';

@NgModule({
  declarations: [
    PrinterStateBadgeComponent,
    PrintStateBadgeComponent,
    IsInvalidPipe,
  ],
  imports: [CommonModule, FontAwesomeModule],
  providers: [],
  exports: [
    PrinterStateBadgeComponent,
    PrintStateBadgeComponent,
    IsInvalidPipe,
  ],
})
export class SharedModule {}
