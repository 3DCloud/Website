import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent, ClientComponent } from './components';
import { AuthorizationGuard } from 'app/core/guards';

const routes: Routes = [
  {
    path: 'clients',
    canActivateChild: [AuthorizationGuard],
    children: [
      { path: '', component: ClientsComponent },
      { path: ':id', component: ClientComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRouting { }
