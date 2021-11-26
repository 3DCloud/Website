import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AbilityModule } from '@casl/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';

import { PrintsComponent } from './components';
import { PrintsRouting } from './prints.routing';

@NgModule({
  declarations: [PrintsComponent],
  imports: [
    CommonModule,
    PrintsRouting,
    CoreModule,
    NgbTooltipModule,
    SharedModule,
    AbilityModule,
    FontAwesomeModule,
  ],
})
export class PrintsModule {}
