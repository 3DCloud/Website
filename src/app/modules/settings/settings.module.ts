import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbilityModule } from '@casl/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';

import {
  AddMaterialModalComponent,
  MaterialComponent,
  MaterialsComponent,
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
    AddMaterialModalComponent,
    MaterialsComponent,
    MaterialComponent,
  ],
  imports: [
    CommonModule,
    SettingsRouting,
    FontAwesomeModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    FormsModule,
    AbilityModule,
  ],
})
export class SettingsModule {}
