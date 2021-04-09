import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PrintersService } from '../services/printers.service';
import { Printer } from '../models/printer';

@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss']
})
export class PrintersComponent implements OnInit, OnDestroy {

  public loading = true;
  public printers: Printer[] = [];
  public error: any = null;

  private subscriptions: Subscription[] = [];

  constructor(private printersService: PrintersService) { }

  public ngOnInit(): void {
    this.subscriptions.push(this.printersService.getPrinters().subscribe(printers => {
      this.printers = printers;
    }, error => {
      this.error = error;
    }).add(() => {
      this.loading = false;
    }));
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
