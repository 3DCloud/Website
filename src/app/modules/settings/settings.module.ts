import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';

import {
  PrinterDefinitionComponent,
  PrinterDefinitionsComponent,
  SettingsComponent,
} from './components';
import { SettingsRouting } from './settings.routing';

@NgModule({
  declarations: [
    SettingsComponent,
    PrinterDefinitionsComponent,
    PrinterDefinitionComponent,
  ],
  imports: [
    CommonModule,
    SettingsRouting,
    FontAwesomeModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FormsModule,
  ],
})
export class SettingsModule {}
