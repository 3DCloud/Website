import { Component, OnDestroy, OnInit } from '@angular/core';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { Material } from 'app/core/models';
import { MaterialsService } from 'app/shared/services';

interface MaterialItem extends Material {
  deleting: boolean;
}

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss'],
})
export class MaterialsComponent implements OnInit, OnDestroy {
  public icons = {
    faEdit,
    faPlus,
    faTrash,
  };

  public loading = true;
  public error?: string;
  public materials?: MaterialItem[];

  private _subscriptions: Subscription[] = [];

  public constructor(private _materialsService: MaterialsService) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._materialsService
        .getMaterials()
        .subscribe(
          (materials) => {
            this.materials = materials.map((material) => ({
              ...material,
              deleting: false,
            }));
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

  public delete(material: MaterialItem): void {
    material.deleting = true;

    this._subscriptions.push(
      this._materialsService.deleteMaterial(material.id).subscribe(
        () => {
          this.materials = this.materials?.filter((m) => m.id !== material.id);
        },
        (error) => {
          this.error = error;
          material.deleting = false;
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
