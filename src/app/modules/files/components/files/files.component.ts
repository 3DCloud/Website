import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import md5 from 'js-md5';

import { UploadedFile } from 'app/core/models';
import { SelectPrinterModalComponent } from 'app/modules/files/components';
import { FilesService, PrintsService, UsersService } from 'app/shared/services';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  public icons = {
    faDownload,
    faUpload,
  };

  public loading = true;
  public error?: unknown;
  public files: UploadedFile[] = [];
  public uploadStatus = {
    uploading: false,
    progress: 0,
    error: '',
    success: false,
    fileName: '',
  };

  constructor(
    private _modalService: NgbModal,
    private _usersService: UsersService,
    private _printsService: PrintsService,
    private _filesService: FilesService,
    private _router: Router
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

  public upload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (!files || !files.length) {
      return;
    }

    const file = files[0];

    this.uploadStatus.fileName = file.name;
    this.uploadStatus.success = false;

    if (!file.name.endsWith('.gcode')) {
      this.uploadStatus.error = 'Only G-code files are accepted.';
      return;
    }

    this.uploadStatus.error = '';
    this.uploadStatus.uploading = true;

    const progressCallback = (progress: number) => {
      this.uploadStatus.progress = progress * 100;
    };

    file.arrayBuffer().then((buffer) => {
      const checksum = md5.base64(buffer);

      this._filesService.requestFileUpload(file, checksum).subscribe(
        ({ url, headers, signedId }) => {
          this._filesService
            .uploadFile(url, buffer, headers, progressCallback)
            .subscribe(
              () => {
                this._filesService.recordUpload(signedId).subscribe(
                  (file) => {
                    this.files.splice(0, 0, file);
                    this.uploadStatus.uploading = false;
                    this.uploadStatus.success = true;
                  },
                  (err) => {
                    this.uploadStatus.uploading = false;
                    this.uploadStatus.error = err;
                  }
                );
              },
              (err) => {
                this.uploadStatus.uploading = false;
                this.uploadStatus.error = err;
              }
            );
        },
        (err) => {
          this.uploadStatus.uploading = false;
          this.uploadStatus.error = err;
        }
      );
    });
  }

  public showSelectPrinterModal(fileId: string): void {
    const modalRef = this._modalService.open(SelectPrinterModalComponent, {
      backdrop: 'static',
      keyboard: false,
      modalDialogClass: 'printers-modal',
    });

    const modalComponent =
      modalRef.componentInstance as SelectPrinterModalComponent;

    modalComponent.fileId = fileId;
  }

  public downloadFile(fileId: string): void {
    this._filesService.getDownloadUrl(fileId).subscribe((url) => {
      location.assign(url);
    });
  }

  public bytesToReadable(bytes: number): string {
    const dividend = 1024;
    const prefixes = ['B', 'KiB', 'MiB', 'GiB'];
    const index =
      bytes >= 1 ? Math.floor(Math.log(bytes) / Math.log(dividend)) : 0;

    return `${Math.round((bytes / Math.pow(dividend, index)) * 100) / 100} ${
      prefixes[index]
    }`;
  }
}
