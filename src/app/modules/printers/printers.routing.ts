import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import { PrinterControlPanelComponent, PrintersComponent } from './components';

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
export class PrintersRouting {}
