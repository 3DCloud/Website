import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoreModule } from 'app/core/core.module';

import { ClientsRouting } from './clients.routing';
import {
  ClientComponent,
  ClientsComponent,
  CreatePrinterModalComponent,
  DeletePrinterModalComponent,
} from './components';

@NgModule({
  declarations: [
    ClientsComponent,
    ClientComponent,
    CreatePrinterModalComponent,
    DeletePrinterModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientsRouting,
    FontAwesomeModule,
    CoreModule,
  ],
})
export class ClientsModule {}
