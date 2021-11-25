import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import {
  PrinterSettingsComponent,
  PrinterStatusComponent,
  PrintersComponent,
} from './components';

const routes: Routes = [
  {
    path: 'printers',
    children: [
      { path: '', component: PrintersComponent, data: { subject: 'Printer' } },
      {
        path: ':id/settings',
        component: PrinterSettingsComponent,
        canActivate: [AuthorizationGuard],
        data: { subject: 'Printer' },
      },
      {
        path: ':id/status',
        component: PrinterStatusComponent,
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
