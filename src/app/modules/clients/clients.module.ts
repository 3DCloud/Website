import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from 'app/core/core.module';

import { ClientsRouting } from './clients.routing';
import {
  ClientComponent,
  ClientsComponent,
  DeletePrinterModalComponent,
  SetUpPrinterModalComponent,
} from './components';

@NgModule({
  declarations: [
    ClientsComponent,
    ClientComponent,
    DeletePrinterModalComponent,
    SetUpPrinterModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientsRouting,
    FontAwesomeModule,
    CoreModule,
    NgbModule,
    FormsModule,
  ],
})
export class ClientsModule {}
