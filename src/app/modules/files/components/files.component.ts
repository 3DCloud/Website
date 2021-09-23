import { Component, OnInit } from '@angular/core';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UploadedFile } from 'app/core/models';
import { UsersService } from 'app/shared/services';

import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  public icons = {
    faUpload,
  };

  public loading = true;
  public error?: unknown;
  public files: UploadedFile[] = [];

  constructor(
    private _modalService: NgbModal,
    private _usersService: UsersService
  ) {}

  public ngOnInit(): void {
    this._usersService.getCurrentUserFiles().subscribe(
      (files) => {
        this.loading = false;
        this.files = files;
      },
      (err) => {
        this.loading = false;
        this.error = err;
      }
    );
  }

  public showUploadFileModal(): void {
    this._modalService.open(UploadFileModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
  }
}
