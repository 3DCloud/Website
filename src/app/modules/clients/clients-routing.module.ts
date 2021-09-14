import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent, ClientComponent } from './components';
import { AuthGuard } from 'src/app/core/guards';

const routes: Routes = [
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'clients/:id', component: ClientComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule { }
