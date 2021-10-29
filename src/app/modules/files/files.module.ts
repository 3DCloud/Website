import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared/shared.module';

import { FilesComponent, SelectPrinterModalComponent } from './components';
import { FilesRouting } from './files.routing';

@NgModule({
  declarations: [FilesComponent, SelectPrinterModalComponent],
  imports: [
    CommonModule,
    FilesRouting,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    CoreModule,
    SharedModule,
  ],
})
export class FilesModule {}
