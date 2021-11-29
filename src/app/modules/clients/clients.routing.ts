import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from 'app/core/guards';

import { ClientComponent, ClientsComponent } from './components';

const routes: Routes = [
  {
    path: 'clients',
    canActivateChild: [AuthorizationGuard],
    data: {
      title: 'Clients',
    },
    children: [
      { path: '', component: ClientsComponent, data: { subject: 'Client' } },
      { path: ':id', component: ClientComponent, data: { subject: 'Client' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRouting {}
