import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faMinus, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Subscription, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Material } from 'app/core/models';
import { MaterialsService } from 'app/shared/services';

@Component({
  selector: 'app-material',
  templateUrl: './edit-material.component.html',
  styleUrls: ['./edit-material.component.scss'],
})
export class EditMaterialComponent implements OnInit, OnDestroy {
  public icons = {
    faMinus,
    faPlus,
    faSave,
  };

  public loading = true;
  public error?: unknown;

  public materialId: string | null = null;
  public material?: Readonly<Material>;
  public materialColors = new FormArray([]);
  public form = new FormGroup({
    name: new FormControl(null, Validators.required),
    brand: new FormControl(null, Validators.required),
    netFilamentWeight: new FormControl(null, Validators.required),
    emptySpoolWeight: new FormControl(null, Validators.required),
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
      this._route.paramMap
        .pipe(
          concatMap((paramMap) => {
            console.log('hi');

            this.materialId = paramMap.get('id');

            if (!this.materialId) {
              return of(undefined);
            }

            return this._materialsService.getMaterial(this.materialId);
          })
        )
        .subscribe(
          (material) => {
            if (!material) {
              this.loading = false;
              return;
            }

            this.material = material;

            for (let i = 0; i < material.materialColors!.length; i++) {
              this.materialColors.push(this.createColor());
            }

            this.form.patchValue(material);

            this.loading = false;
          },
          (err) => {
            this.error = err;
            this.loading = false;
          },
          () => {
            console.log('complete');
            this.loading = false;
          }
        )
        .add(() => {
          console.log('add');
          this.loading = false;
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

    this._subscriptions.push(
      request.subscribe(
        () => {
          this._router.navigate(['..'], { relativeTo: this._route }).then();
        },
        (err) => {
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

  private createColor(): FormGroup {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      color: new FormControl('#000000', Validators.required),
    });
  }
}
