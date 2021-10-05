import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UploadedFile } from 'app/core/models';
import { PrintsService, UsersService } from 'app/shared/services';

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
    private _usersService: UsersService,
    private _printsService: PrintsService,
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

  public showUploadFileModal(): void {
    this._modalService.open(UploadFileModalComponent, {
      backdrop: 'static',
      keyboard: false,
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

  public startPrint(fileId: string, printerId: string): void {
    this._printsService.startPrint(fileId, printerId).subscribe(() => {
      this._router.navigate(['/printers', printerId]);
    });
  }
}
