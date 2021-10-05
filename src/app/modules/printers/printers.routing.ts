import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import { PrinterComponent, PrintersComponent } from './components';

const routes: Routes = [
  {
    path: 'printers',
    canActivateChild: [AuthorizationGuard],
    children: [
      { path: '', component: PrintersComponent },
      { path: ':id', component: PrinterComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintersRouting {}
