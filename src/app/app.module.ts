import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from './graphql.module';
import {
  ClientsModule,
  FilesModule,
  PrintersModule,
  PrintsModule,
  SettingsModule,
} from './modules';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,

    // AppRoutingModule should always be last for the fallback page to work properly
    ClientsModule,
    FilesModule,
    PrintersModule,
    PrintsModule,
    SettingsModule,
    CoreModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
