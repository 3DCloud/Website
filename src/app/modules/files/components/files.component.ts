import { Component } from '@angular/core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent {
  public icons = {
    faUpload,
  };

  constructor(private _modalService: NgbModal) {}

  public showUploadFileModal(): void {
    this._modalService.open(UploadFileModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
  }
}
