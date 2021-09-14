import { NgModule } from '@angular/core';
import { PrintersComponent, PrinterControlPanelComponent } from './components';
import { CommonModule } from '@angular/common';
import { PrintersRoutingModule } from './printers-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrintersComponent,
    PrinterControlPanelComponent,
  ],
  imports: [
    CommonModule,
    PrintersRoutingModule,
    FormsModule,
  ]
})
export class PrintersModule { }
