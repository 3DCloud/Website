import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import { FilesComponent } from './components';

const routes: Routes = [
  {
    path: 'files',
    canActivateChild: [AuthorizationGuard],
    children: [
      {
        path: '',
        component: FilesComponent,
        data: { subject: 'UploadedFile' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesRouting {}
