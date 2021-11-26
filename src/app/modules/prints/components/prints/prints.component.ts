import { Component, OnDestroy, OnInit } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { Print } from 'app/core/models';
import { PrintsService, UploadedFilesService } from 'app/shared/services';

@Component({
  selector: 'app-prints',
  templateUrl: './prints.component.html',
  styleUrls: ['./prints.component.scss'],
})
export class PrintsComponent implements OnInit, OnDestroy {
  public icons = {
    faQuestionCircle,
  };

  public loading = true;
  public error?: string;
  public prints?: Print[];

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _printsService: PrintsService,
    private _uploadedFilesService: UploadedFilesService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._printsService.getPrints().subscribe(
        (prints) => {
          this.loading = false;
          this.prints = prints;
        },
        (err) => {
          this.loading = false;
          this.error = err;
        }
      )
    );
  }

  public downloadFile(fileId: string): void {
    this._uploadedFilesService.getDownloadUrl(fileId).subscribe((url) => {
      location.assign(url);
    });
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
