import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Material, Printer } from 'app/core/models';
import { MaterialsService } from 'app/shared/services';

@Component({
  selector: 'app-change-material-modal',
  templateUrl: './change-material-modal.component.html',
  styleUrls: ['./change-material-modal.component.scss'],
})
export class ChangeMaterialModalComponent implements OnInit, OnDestroy {
  public printer: Printer = null!;
  public loading = true;
  public error?: string;
  public busy = false;
  public materials?: Material[];
  public extruderIndex = 0;
  public materialIndex = 0;
  public materialColorIndex = 0;

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _materialsService: MaterialsService
  ) {}

  public get isValid(): boolean {
    return (
      this.materials !== undefined &&
      this.materialIndex < this.materials.length &&
      this.materialColorIndex <
        this.materials[this.materialIndex].materialColors.length
    );
  }

  public ngOnInit(): void {
    this._subscriptions.push(
      this._materialsService.getMaterialsDetailed().subscribe(
        (materials) => {
          this.materials = materials;
          this.loading = false;
        },
        (err) => {
          this.error = err;
          this.loading = false;
        }
      )
    );
  }

  public submit(): void {
    if (!this.isValid || !this.materials) {
      return;
    }

    this.busy = true;

    this._subscriptions.push(
      this._materialsService
        .changeMaterial(
          this.printer.id,
          this.extruderIndex,
          this.materials[this.materialIndex].materialColors[
            this.materialColorIndex
          ].id
        )
        .subscribe(
          (result) => {
            this.printer.printerExtruders[this.extruderIndex].materialColor =
              result.materialColor;
            this.modal.close();
          },
          (err) => {
            this.busy = false;
            this.error = err;
          }
        )
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
