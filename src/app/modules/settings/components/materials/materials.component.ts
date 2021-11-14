import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faEdit,
  faExclamationTriangle,
  faInfoCircle,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { Material } from 'app/core/models';
import { MaterialsService } from 'app/shared/services';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit, OnDestroy {
  public icons = {
    faEdit,
    faExclamationTriangle,
    faInfoCircle,
    faPlus,
    faTrash,
  };

  public loading = true;
  public error?: string;
  public materials?: Material[];

  private _subscriptions: Subscription[] = [];

  public constructor(private _materialsService: MaterialsService) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._materialsService
        .getMaterials()
        .subscribe(
          (materials) => {
            this.materials = materials;
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

  public delete(id: string): void {
    this._subscriptions.push(
      this._materialsService.deleteMaterial(id).subscribe(() => {
        this.materials = this.materials?.filter((m) => m.id !== id);
      })
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
