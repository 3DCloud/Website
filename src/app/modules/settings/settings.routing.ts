import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import {
  PrinterDefinitionComponent,
  PrinterDefinitionsComponent,
  SettingsComponent,
} from './components';

const routes: Routes = [
  {
    path: 'settings',
    canActivate: [AuthorizationGuard],
    component: SettingsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'printer-definitions', // TODO: replace with 'general' once that's implemented
      },
      {
        path: 'printer-definitions',
        component: PrinterDefinitionsComponent,
      },
      {
        path: 'printer-definitions/new',
        component: PrinterDefinitionComponent,
      },
      {
        path: 'printer-definitions/:id',
        component: PrinterDefinitionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRouting {}
