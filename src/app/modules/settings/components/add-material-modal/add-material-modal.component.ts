import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Material } from 'app/core/models';
import { MaterialsService } from 'app/shared/services';

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.component.html',
  styleUrls: ['./add-material-modal.component.scss'],
})
export class AddMaterialModalComponent implements OnInit, OnDestroy {
  public existingMaterials: Material[] = [];
  public materialIndex = 0;
  public loading = true;
  public busy = false;
  public materials?: Material[];
  public error?: string;

  private _subscriptions: Subscription[] = [];

  constructor(
    public modal: NgbActiveModal,
    private _materialsService: MaterialsService
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._materialsService
        .getMaterials()
        .subscribe(
          (materials) => {
            const ids = this.existingMaterials.map((m) => m.id);
            this.materials = materials.filter((m) => ids.indexOf(m.id) === -1);
          },
          (err) => {
            this.error = err;
          }
        )
        .add(() => {
          this.loading = false;
        })
    );
  }

  public submit(): void {
    if (!this.materials) {
      return;
    }

    this.modal.close(this.materials[this.materialIndex]);
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
