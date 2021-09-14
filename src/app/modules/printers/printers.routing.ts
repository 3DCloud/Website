import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrintersComponent, PrinterControlPanelComponent } from './components';

const routes: Routes = [
  { path: 'printers', component: PrintersComponent },
  { path: 'printers/:id/control-panel', component: PrinterControlPanelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintersRouting { }
