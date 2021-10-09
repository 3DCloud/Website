import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from 'app/core/core.module';

import { FilesComponent, UploadFileModalComponent } from './components';
import { SelectPrinterModalComponent } from './components/select-printer-modal/select-printer-modal.component';
import { FilesRouting } from './files.routing';

@NgModule({
  declarations: [
    FilesComponent,
    UploadFileModalComponent,
    SelectPrinterModalComponent,
  ],
  imports: [
    CommonModule,
    FilesRouting,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    CoreModule,
  ],
})
export class FilesModule {}
