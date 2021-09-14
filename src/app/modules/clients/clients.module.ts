import { NgModule } from '@angular/core';
import { ClientsComponent, ClientComponent, CreatePrinterModalComponent, DeletePrinterModalComponent } from './components';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientsRoutingModule } from './clients-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
    ClientsRoutingModule,
    FontAwesomeModule,
  ]
})
export class ClientsModule { }
