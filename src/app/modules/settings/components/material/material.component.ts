import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faMinus, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { Material } from 'app/core/models';
import { MaterialsService } from 'app/shared/services';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
})
export class MaterialComponent implements OnInit, OnDestroy {
  public icons = {
    faMinus,
    faPlus,
    faSave,
  };

  public materialId: string | null = null;
  public materialColors = new FormArray([]);
  public form = new FormGroup({
    name: new FormControl(null, Validators.required),
    brand: new FormControl(null, Validators.required),
    netFilamentWeight: new FormControl(null, Validators.required),
    emptySpoolWeight: new FormControl(null, Validators.required),
    filamentDiameter: new FormControl(null, Validators.required),
    materialColors: this.materialColors,
  });

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _materialsService: MaterialsService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._route.paramMap.subscribe((paramMap) => {
        this.materialId = paramMap.get('id');

        if (this.materialId) {
          this._subscriptions.push(
            this._materialsService
              .getMaterial(this.materialId)
              .subscribe((material) => {
                for (let i = 0; i < material.materialColors!.length; i++) {
                  this.materialColors.push(this.createColor());
                }
                this.form.patchValue(material);
              })
          );
        }
      })
    );
  }

  public addColor(): void {
    this.materialColors.push(this.createColor());
  }

  public removeColor(index: number): void {
    this.materialColors.removeAt(index);
  }

  public submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    let request;

    if (this.materialId) {
      request = this._materialsService.updateMaterial(
        this.materialId,
        this.form.value as Material
      );
    } else {
      request = this._materialsService.createMaterial(
        this.form.value as Material
      );
    }

    request.subscribe(() => {
      this._router.navigate(['..'], { relativeTo: this._route }).then();
    });
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  private createColor(): FormGroup {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      color: new FormControl(null, Validators.required),
    });
  }
}
