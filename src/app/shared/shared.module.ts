import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PrintStateBadgeComponent } from './components/print-state-badge/print-state-badge.component';
import { PrinterStateBadgeComponent } from './components/printer-state-badge/printer-state-badge.component';

@NgModule({
  declarations: [PrinterStateBadgeComponent, PrintStateBadgeComponent],
  imports: [CommonModule, FontAwesomeModule],
  providers: [],
  exports: [PrinterStateBadgeComponent, PrintStateBadgeComponent],
})
export class SharedModule {}
