import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PrinterControlPanelComponent, PrintersComponent } from './components';
import { PrintersRouting } from './printers.routing';

@NgModule({
  declarations: [PrintersComponent, PrinterControlPanelComponent],
  imports: [CommonModule, PrintersRouting, FormsModule],
})
export class PrintersModule {}
