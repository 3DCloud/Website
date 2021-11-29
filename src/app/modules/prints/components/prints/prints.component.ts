import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faCaretDown,
  faCaretUp,
  faCheck,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { Print, PrintState } from 'app/core/models';
import { PrintsService, UploadedFilesService } from 'app/shared/services';

@Component({
  selector: 'app-prints',
  templateUrl: './prints.component.html',
  styleUrls: ['./prints.component.scss'],
})
export class PrintsComponent implements OnInit, OnDestroy {
  public icons = {
    faCaretUp,
    faCaretDown,
    faCheck,
    faQuestionCircle,
  };

  public loading = true;
  public error?: string;
  public prints?: Print[];

  public searched = false;
  public searchString = '';

  public all = true;
  public printStatuses = new Map<
    PrintState,
    {
      name: string;
      selected: boolean;
    }
  >([
    ['pending', { name: 'Pending', selected: true }],
    ['downloading', { name: 'Downloading', selected: true }],
    ['running', { name: 'Running', selected: true }],
    ['canceling', { name: 'Canceling', selected: true }],
    ['canceled', { name: 'Canceled', selected: true }],
    ['errored', { name: 'Errored', selected: true }],
    ['success', { name: 'Succeeded', selected: true }],
  ]);

  public orderBy = 'started_at';
  public ascending = false;

  private _subscriptions: Subscription[] = [];
  private _debounceTimer?: number;

  public constructor(
    private _printsService: PrintsService,
    private _uploadedFilesService: UploadedFilesService
  ) {}

  public ngOnInit(): void {
    this.reloadPrints();
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
      this.reloadPrints();
    }, 800);
  }

  public toggleAll(): void {
    for (const status of this.printStatuses.values()) {
      status.selected = !this.all;
    }

    this.all = !this.all;

    this.reloadPrints();
  }

  public toggleStatus(key: PrintState): void {
    const obj = this.printStatuses.get(key)!;
    obj.selected = !obj.selected;

    let all = true;

    for (const value of this.printStatuses.values()) {
      if (!value.selected) {
        all = false;
        break;
      }
    }

    this.all = all;

    this.reloadPrints();
  }

  public order(by: string, defaultAscending: boolean): void {
    if (this.orderBy === by) {
      this.ascending = !this.ascending;
    } else {
      this.orderBy = by;
      this.ascending = defaultAscending;
    }

    this.reloadPrints();
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

  private reloadPrints(): void {
    const statuses = Array.from(this.printStatuses.entries())
      .filter(([, value]) => value.selected)
      .map(([key]) => key);

    if (!statuses.length) {
      this.prints = [];
      this.searched = true;
      return;
    }

    this.searched = Boolean(this.searchString || statuses.length);
    this.loading = true;
    this.error = undefined;

    this._subscriptions.push(
      this._printsService
        .getPrints(this.searchString, this.orderBy, this.ascending, statuses)
        .subscribe(
          (prints) => {
            this.loading = false;
            this.prints = prints;
          },
          (err) => {
            this.loading = false;
            this.prints = [];
            this.error = err;
          }
        )
    );
  }
}
