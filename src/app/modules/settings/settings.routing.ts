import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import {
  CancellationReasonsComponent,
  EditCancellationReasonComponent,
  EditMaterialComponent,
  EditPrinterDefinitionComponent,
  MaterialsComponent,
  PrinterDefinitionsComponent,
  SettingsComponent,
} from './components';

const routes: Routes = [
  {
    path: 'settings',
    canActivate: [AuthorizationGuard],
    canActivateChild: [AuthorizationGuard],
    component: SettingsComponent,
    data: {
      title: 'Settings',
    },
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
          title: 'Printer Definitions',
        },
      },
      {
        path: 'printer-definitions/new',
        component: EditPrinterDefinitionComponent,
        data: {
          subject: 'PrinterDefinition',
          title: 'Create Printer Definition',
        },
      },
      {
        path: 'printer-definitions/:id',
        component: EditPrinterDefinitionComponent,
        data: {
          subject: 'PrinterDefinition',
          title: 'Edit Printer Definition',
        },
      },
      {
        path: 'materials',
        component: MaterialsComponent,
        data: {
          subject: 'Material',
          title: 'Materials',
        },
      },
      {
        path: 'materials/new',
        component: EditMaterialComponent,
        data: {
          subject: 'Material',
          title: 'Create Material',
        },
      },
      {
        path: 'materials/:id',
        component: EditMaterialComponent,
        data: {
          subject: 'Material',
          title: 'Edit Material',
        },
      },
      {
        path: 'cancellation-reasons',
        component: CancellationReasonsComponent,
        data: {
          subject: 'CancellationReason',
          title: 'Cancellation Reasons',
        },
      },
      {
        path: 'cancellation-reasons/new',
        component: EditCancellationReasonComponent,
        data: {
          subject: 'CancellationReason',
          title: 'Create Cancellation Reason',
        },
      },
      {
        path: 'cancellation-reasons/:id',
        component: EditCancellationReasonComponent,
        data: {
          subject: 'CancellationReason',
          title: 'Edit Cancellation Reason',
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
