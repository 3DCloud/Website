import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
  ],
})
export class PrintsModule {}
