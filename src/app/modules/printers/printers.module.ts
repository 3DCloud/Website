import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreModule } from 'app/core/core.module';

import { PrinterComponent, PrintersComponent } from './components';
import { PrintersRouting } from './printers.routing';

@NgModule({
  declarations: [PrintersComponent, PrinterComponent],
  imports: [CommonModule, PrintersRouting, FormsModule, CoreModule],
  exports: [PrinterComponent],
})
export class PrintersModule {}
