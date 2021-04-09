import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ClientComponent } from './clients/client/client.component';
import { PrintersComponent } from './printers/printers.component';
import { PrinterControlPanelComponent } from './printers/printer-control-panel/printer-control-panel.component';

const routes: Routes = [
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/:id', component: ClientComponent },
  { path: 'printers', component: PrintersComponent },
  { path: 'printers/:id/control-panel', component: PrinterControlPanelComponent },
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
