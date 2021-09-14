import { NgModule } from '@angular/core';
import { PrintersComponent, PrinterControlPanelComponent } from './components';
import { CommonModule } from '@angular/common';
import { PrintersRouting } from './printers.routing';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrintersComponent,
    PrinterControlPanelComponent,
  ],
  imports: [
    CommonModule,
    PrintersRouting,
    FormsModule,
  ]
})
export class PrintersModule { }
