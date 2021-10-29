import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';

import { PrinterComponent, PrintersComponent } from './components';
import { PrintersRouting } from './printers.routing';

@NgModule({
  declarations: [PrintersComponent, PrinterComponent],
  imports: [
    CommonModule,
    PrintersRouting,
    FormsModule,
    CoreModule,
    FontAwesomeModule,
    SharedModule,
  ],
  exports: [PrinterComponent],
})
export class PrintersModule {}
