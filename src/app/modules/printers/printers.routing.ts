import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import {
  PrinterComponent,
  PrinterSettingsComponent,
  PrintersComponent,
} from './components';

const routes: Routes = [
  {
    path: 'printers',
    canActivateChild: [AuthorizationGuard],
    children: [
      { path: '', component: PrintersComponent, data: { subject: 'Printer' } },
      {
        path: ':id/settings',
        component: PrinterSettingsComponent,
        data: { subject: 'Printer' },
      },
      {
        path: ':id/status',
        component: PrinterComponent,
        data: { subject: 'Printer' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintersRouting {}
