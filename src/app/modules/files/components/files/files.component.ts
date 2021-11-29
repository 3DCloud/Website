import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  faCaretDown,
  faCaretUp,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import md5 from 'js-md5';
import { Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { UploadedFile } from 'app/core/models';
import { SelectPrinterModalComponent } from 'app/modules/files/components';
import {
  FilesService,
  PrintsService,
  UploadedFilesService,
  UsersService,
} from 'app/shared/services';

interface UploadedFileItem extends UploadedFile {
  busy: boolean;
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit, OnDestroy {
  public icons = {
    faCaretDown,
    faCaretUp,
    faTrash,
    faUpload,
  };

  @ViewChild('uploadFileInput') public uploadFileInput: ElementRef | undefined;

  public searchString = '';

  public loading = true;
  public hover = false;
  public error?: unknown;
  public files?: UploadedFileItem[];
  public uploadStatus = {
    uploading: false,
    step: 'starting',
    progress: 0,
    error: '',
    success: false,
    fileName: '',
  };

  public orderBy = 'created_at';
  public ascending = false;

  private dragEnter = (event: DragEvent) => {
    this.hover = this.uploadFileInput?.nativeElement.contains(event.target);
  };

  private dragStop = () => {
    this.hover = false;
  };

  private _subscriptions: Subscription[] = [];
  private _debounceTimer?: number;

  public constructor(
    private _modalService: NgbModal,
    private _usersService: UsersService,
    private _printsService: PrintsService,
    private _filesService: FilesService,
    private _uploadedFilesService: UploadedFilesService,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    document.addEventListener('dragenter', this.dragEnter);
    document.addEventListener('dragexit', this.dragStop);
    document.addEventListener('dragend', this.dragStop);
    document.addEventListener('drop', this.dragStop);

    this.reloadFiles();
  }

  public nozzleSize(key: string): string {
    if (!key) {
      return 'N/A';
    }

    switch (key) {
      case 'size_0_25':
        return '0.25 mm';

      case 'size_0_40':
        return '0.40 mm';

      case 'size_0_60':
        return '0.60 mm';

      case 'size_0_80':
        return '0.80 mm';

      case 'size_1_00':
        return '1.00 mm';

      default:
        return 'Unknown';
    }
  }

  public debounceSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (this.searchString === value) {
      return;
    }

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => {
      this.searchString = value;
      this._debounceTimer = undefined;
      this.reloadFiles();
    }, 800);
  }

  public order(by: string, defaultAscending: boolean): void {
    if (this.orderBy == by) {
      this.ascending = !this.ascending;
    } else {
      this.orderBy = by;
      this.ascending = defaultAscending;
    }

    this.reloadFiles();
  }

  public reloadFiles(): void {
    this.loading = true;
    this.error = null;

    this._subscriptions.push(
      this._uploadedFilesService
        .getFiles(this.searchString, this.orderBy, this.ascending)
        .subscribe(
          (files) => {
            this.loading = false;
            this.files = files.map((f) => ({ ...f, busy: false }));
          },
          (err) => {
            this.loading = false;
            this.files = [];
            this.error = err;
          }
        )
    );
  }

  public ngOnDestroy(): void {
    document.removeEventListener('dragenter', this.dragEnter);
    document.removeEventListener('dragexit', this.dragStop);
    document.removeEventListener('dragend', this.dragStop);
    document.removeEventListener('drop', this.dragStop);

    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
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

    this.uploadStatus.step = 'starting';
    this.uploadStatus.progress = 0;
    this.uploadStatus.error = '';
    this.uploadStatus.uploading = true;

    const progressCallback = (progress: number) => {
      this.uploadStatus.progress = progress * 100;
    };

    this._filesService
      .readAsArrayBuffer(file)
      .pipe(
        concatMap((buffer) => {
          const checksum = md5.base64(buffer);

          return this._filesService.requestFileUpload(file, checksum).pipe(
            concatMap(({ url, headers, signedId }) => {
              this.uploadStatus.step = 'uploading';

              return this._filesService
                .uploadFile(url, buffer, headers, progressCallback)
                .pipe(
                  concatMap(() => {
                    this.uploadStatus.step = 'processing';
                    return this._uploadedFilesService.recordUpload(signedId);
                  })
                );
            })
          );
        })
      )
      .subscribe(
        (uploadedFile) => {
          this.files?.splice(0, 0, {
            ...uploadedFile,
            busy: false,
          });

          this.uploadStatus.uploading = false;
          this.uploadStatus.success = true;
        },
        (err) => {
          this.uploadStatus.uploading = false;
          this.uploadStatus.error = err;
        }
      );
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
    this._uploadedFilesService.getDownloadUrl(fileId).subscribe((url) => {
      location.assign(url);
    });
  }

  public deleteFile(file: UploadedFileItem): void {
    file.busy = true;
    this._uploadedFilesService.delete(file.id).subscribe((deleted) => {
      this.files = this.files?.filter((f) => f.id != deleted.id);
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
