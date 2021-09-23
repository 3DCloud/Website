import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FilesComponent, UploadFileModalComponent } from './components';
import { FilesRouting } from './files.routing';

@NgModule({
  declarations: [FilesComponent, UploadFileModalComponent],
  imports: [
    CommonModule,
    FilesRouting,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
  ],
})
export class FilesModule {}
