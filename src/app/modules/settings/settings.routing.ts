import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import {
  CancellationReasonsComponent,
  EditCancellationReasonComponent,
  MaterialComponent,
  MaterialsComponent,
  PrinterDefinitionComponent,
  PrinterDefinitionsComponent,
  SettingsComponent,
} from './components';

const routes: Routes = [
  {
    path: 'settings',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
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
        data: {
          subject: 'PrinterDefinition',
        },
      },
      {
        path: 'printer-definitions/new',
        component: PrinterDefinitionComponent,
        data: {
          subject: 'PrinterDefinition',
        },
      },
      {
        path: 'printer-definitions/:id',
        component: PrinterDefinitionComponent,
        data: {
          subject: 'PrinterDefinition',
        },
      },
      {
        path: 'materials',
        component: MaterialsComponent,
        data: {
          subject: 'Material',
        },
      },
      {
        path: 'materials/new',
        component: MaterialComponent,
        data: {
          subject: 'Material',
        },
      },
      {
        path: 'materials/:id',
        component: MaterialComponent,
        data: {
          subject: 'Material',
        },
      },
      {
        path: 'cancellation-reasons',
        component: CancellationReasonsComponent,
        data: {
          subject: 'CancellationReason',
        },
      },
      {
        path: 'cancellation-reasons/new',
        component: EditCancellationReasonComponent,
        data: {
          subject: 'CancellationReason',
        },
      },
      {
        path: 'cancellation-reasons/:id',
        component: EditCancellationReasonComponent,
        data: {
          subject: 'CancellationReason',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRouting {}
