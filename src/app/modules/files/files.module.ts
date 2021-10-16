import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';

import { CoreModule } from 'app/core/core.module';

import { FilesComponent } from './components';
import { SelectPrinterModalComponent } from './components/select-printer-modal/select-printer-modal.component';
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
    MomentModule,
  ],
})
export class FilesModule {}
