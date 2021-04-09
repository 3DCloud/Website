import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ClientsComponent } from './clients/clients.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClientComponent } from './clients/client/client.component';
import { DeletePrinterModalComponent } from './clients/client/delete-printer-modal/delete-printer-modal.component';
import { CreatePrinterModalComponent } from './clients/client/create-printer-modal/create-printer-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrintersComponent } from './printers/printers.component';
import { PrinterComponent } from './printers/printer/printer.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    PageNotFoundComponent,
    ClientComponent,
    DeletePrinterModalComponent,
    CreatePrinterModalComponent,
    PrintersComponent,
    PrinterComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GraphQLModule,
        HttpClientModule,
        NgbModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
