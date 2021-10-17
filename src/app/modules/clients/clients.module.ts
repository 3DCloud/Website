import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
    NgbModule,
  ],
})
export class ClientsModule {}
