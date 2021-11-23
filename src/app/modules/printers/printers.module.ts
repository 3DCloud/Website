import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';

import {
  ChangeMaterialModalComponent,
  PrinterComponent,
  PrinterSettingsComponent,
  PrintersComponent,
} from './components';
import { PrintersRouting } from './printers.routing';

@NgModule({
  declarations: [
    ChangeMaterialModalComponent,
    PrinterComponent,
    PrinterSettingsComponent,
    PrintersComponent,
  ],
  imports: [
    CommonModule,
    PrintersRouting,
    FormsModule,
    CoreModule,
    FontAwesomeModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  exports: [PrinterComponent],
})
export class PrintersModule {}
