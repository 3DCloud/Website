import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Printer } from 'app/core/models';
import { PrintersService } from 'app/shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-printer-modal',
  templateUrl: './delete-printer-modal.component.html',
  styleUrls: ['./delete-printer-modal.component.scss']
})
export class DeletePrinterModalComponent implements OnDestroy {

  @Input() public printer?: Printer;

  public busy = false;
  public error: any = null;

  private subscriptions: Subscription[] = [];

  constructor(public modal: NgbActiveModal, private printersService: PrintersService) { }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public deletePrinter(): void {
    if (!this.printer) {
      this.modal.dismiss();
      return;
    }

    this.busy = true;
    this.subscriptions.push(this.printersService.deletePrinter(this.printer.id).subscribe(() => {
      this.modal.close();
    }, error => {
      this.error = error;
    }).add(() => {
      this.busy = false;
    }));
  }

}
