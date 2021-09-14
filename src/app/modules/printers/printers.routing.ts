import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrinterControlPanelComponent, PrintersComponent } from './components';
import { AuthorizationGuard } from '../../core/guards';

const routes: Routes = [
  {
    path: 'printers',
    canActivateChild: [AuthorizationGuard],
    children: [
      { path: '', component: PrintersComponent },
      { path: ':id/control-panel', component: PrinterControlPanelComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintersRouting { }
