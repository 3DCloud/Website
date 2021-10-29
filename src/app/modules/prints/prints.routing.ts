import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import { PrintsComponent } from './components';

const routes: Routes = [
  {
    path: 'prints',
    canActivateChild: [AuthorizationGuard],
    children: [{ path: '', component: PrintsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrintsRouting {}
