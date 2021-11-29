import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faArrowLeft,
  faMinus,
  faPlus,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import md5 from 'js-md5';
import { Observable, Subscription, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import {
  Material,
  PrinterDefinition,
  UltiGCodeSettings,
  UploadFileRequest,
} from 'app/core/models';
import { PrinterDefinitionInput } from 'app/core/models/input';
import { FilesService, PrinterDefinitionsService } from 'app/shared/services';

import { AddMaterialModalComponent } from '..';

@Component({
  selector: 'app-printer-definition',
  templateUrl: './edit-printer-definition.component.html',
  styleUrls: ['./edit-printer-definition.component.scss'],
})
export class EditPrinterDefinitionComponent implements OnInit, OnDestroy {
  public readonly nozzleSizes = [
    'size025',
    'size040',
    'size060',
    'size080',
    'size100',
  ];

  public readonly nozzleSizeNames = [
    '0.25 mm',
    '0.40 mm',
    '0.60 mm',
    '0.80 mm',
    '1.00 mm',
  ];

  private requiredIfThumbnailDoesNotExit = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (this.thumbnailUrl) {
      return null;
    }

    return Validators.required(control);
  };

  public formControls = {
    name: new FormControl(null, Validators.required),
    extruderCount: new FormControl(1, Validators.required),
    filamentDiameter: new FormControl(1.75, Validators.required),
    thumbnailSignedId: new FormControl(
      null,
      this.requiredIfThumbnailDoesNotExit
    ),
    startGCode: new FormControl(null),
    endGCode: new FormControl(null),
    cancelGCode: new FormControl(null),
    ultiGCodeSettings: new FormArray([]),
  };

  public form = new FormGroup({
    name: this.formControls.name,
    extruderCount: this.formControls.extruderCount,
    filamentDiameter: this.formControls.filamentDiameter,
    thumbnailSignedId: this.formControls.thumbnailSignedId,
    gCodeSettings: new FormGroup({
      startGCode: this.formControls.startGCode,
      endGCode: this.formControls.endGCode,
      cancelGCode: this.formControls.cancelGCode,
    }),
    ultiGCodeSettings: this.formControls.ultiGCodeSettings,
  });

  public icons = {
    faArrowLeft,
    faMinus,
    faPlus,
    faSave,
  };
  public loading = true;
  public selectedUltiGCodeIndex = 0;
  public selectedNozzleSize: string = this.nozzleSizes[0];
  public materials: Material[] = [];
  public busy = false;

  public thumbnailUrl?: string;
  public printerDefinitionId: string | null = null;
  public printerDefinition?: Readonly<PrinterDefinition>;
  public error?: string;

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _printerDefinitionsService: PrinterDefinitionsService,
    private _filesService: FilesService,
    private _modal: NgbModal
  ) {}

  public get materialFormGroup(): FormGroup {
    return this.form
      .get('ultiGCodeSettings')!
      .get(this.selectedUltiGCodeIndex.toString()) as FormGroup;
  }

  public get nozzleFormGroup(): FormGroup {
    return this.materialFormGroup
      .get('perNozzleSettings')!
      .get([this.selectedNozzleSize]) as FormGroup;
  }

  public ngOnInit(): void {
    this._subscriptions.push(
      this._route.paramMap
        .pipe(
          map((paramMap) => paramMap.get('id')),
          concatMap((id) => {
            if (!id) {
              return of(undefined);
            }

            this.printerDefinitionId = id;

            return this._printerDefinitionsService.getPrinterDefinition(id);
          })
        )
        .subscribe(
          (printerDefinition) => {
            if (!printerDefinition) {
              this.loading = false;
              return;
            }

            this.printerDefinition = printerDefinition;
            this.thumbnailUrl = this.printerDefinition.thumbnail?.url;

            if (printerDefinition.ultiGCodeSettings) {
              const formArray = this.form.get('ultiGCodeSettings') as FormArray;
              for (
                let i = 0;
                i < printerDefinition.ultiGCodeSettings.length;
                i++
              ) {
                formArray.push(this.createUltiGCodeSettings());
              }

              this.materials = printerDefinition.ultiGCodeSettings?.map(
                (ugs) => ugs.material
              );
            }

            this.form.patchValue(printerDefinition);

            this.loading = false;
          },
          (err) => {
            this.error = err;
            this.loading = false;
          }
        )
    );
  }

  public fileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files?.length) {
      return;
    }

    const thumbnail = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.formControls.thumbnailSignedId.patchValue(thumbnail);
      this.thumbnailUrl = reader.result as string;
    };

    reader.onerror = () => {
      this.error = reader.error?.message;
    };

    reader.onabort = () => {
      this.error = 'File read aborted';
    };

    reader.readAsDataURL(files[0]);
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public rows(formControl: FormControl): number {
    if (typeof formControl.value !== 'string') {
      return 3;
    }

    return Math.max(formControl.value.split('\n').length, 3);
  }

  public openAddMaterialDialog(): void {
    const modalRef = this._modal.open(AddMaterialModalComponent);
    modalRef.componentInstance.existingMaterials = this.materials;

    this._subscriptions.push(
      modalRef.closed.subscribe(
        ({
          material,
          copyFrom,
          useMaterialTxt,
        }: {
          material: Material;
          copyFrom: number;
          useMaterialTxt: UltiGCodeSettings;
        }) => {
          const group = this.createUltiGCodeSettings(material);

          if (useMaterialTxt) {
            group.patchValue({
              ...useMaterialTxt,
              id: undefined,
              materialId: material.id,
            });
          } else if (copyFrom >= 0) {
            group.patchValue({
              ...this.formControls.ultiGCodeSettings.get([copyFrom])?.value,
              id: undefined,
              materialId: material.id,
            });
          }

          this.formControls.ultiGCodeSettings.push(group);
          this.materials.push(material);
          this.selectedUltiGCodeIndex = this.materials.length - 1;
        }
      )
    );
  }

  public removeMaterial(index: number): void {
    this.formControls.ultiGCodeSettings.removeAt(index);
    this.materials.splice(index, 1);
    this.selectedUltiGCodeIndex = Math.min(
      this.selectedUltiGCodeIndex,
      this.materials.length - 1
    );
  }

  public copyNozzleSettings(): void {
    const selectedGroupValue = this.nozzleFormGroup.value;

    for (const [size, group] of Object.entries(
      (this.materialFormGroup.get('perNozzleSettings') as FormGroup).controls
    )) {
      if (size === this.selectedNozzleSize) {
        continue;
      }

      group.patchValue(selectedGroupValue);
    }
  }

  public submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.error = undefined;
    this.busy = true;

    const thumbnail = this.formControls.thumbnailSignedId.value as File;
    const printerDefinition = this.form.value as PrinterDefinitionInput;

    let observable: Observable<string | undefined> = of(undefined);

    if (thumbnail) {
      observable = this._filesService.readAsArrayBuffer(thumbnail).pipe(
        concatMap((arrayBuffer: ArrayBuffer) => {
          return this._filesService
            .requestFileUpload(thumbnail, md5.base64(arrayBuffer), true)
            .pipe(
              concatMap((request: UploadFileRequest) => {
                return this._filesService
                  .uploadFile(
                    request.url,
                    arrayBuffer,
                    request.headers,
                    () => undefined
                  )
                  .pipe(map(() => request.signedId));
              })
            );
        })
      );
    }

    this._subscriptions.push(
      observable
        .pipe(
          concatMap((thumbnailSignedId) => {
            if (thumbnailSignedId) {
              printerDefinition.thumbnailSignedId = thumbnailSignedId;
            }

            return this.printerDefinitionId
              ? this._printerDefinitionsService.updatePrinterDefinition(
                  this.printerDefinitionId,
                  printerDefinition
                )
              : this._printerDefinitionsService.createPrinterDefinition(
                  printerDefinition
                );
          })
        )
        .subscribe(
          () => {
            this._router.navigate(['..'], { relativeTo: this._route }).then();
          },
          (err) => {
            this.error = err;
            this.busy = false;
          }
        )
    );
  }

  private createUltiGCodeSettings(material?: Material): FormGroup {
    return new FormGroup({
      id: new FormControl(null),
      materialId: new FormControl(material?.id, Validators.required),
      buildPlateTemperature: new FormControl(null, Validators.required),
      endOfPrintRetractionLength: new FormControl(null, Validators.required),
      flowRate: new FormControl(null, Validators.required),
      fanSpeed: new FormControl(null, Validators.required),
      perNozzleSettings: this.createPerNozzleSettings(),
    });
  }

  private createPerNozzleSettings(): FormGroup {
    const obj: Record<string, FormGroup> = {};

    for (const nozzleSize of this.nozzleSizes) {
      obj[nozzleSize] = new FormGroup({
        hotendTemperature: new FormControl(null, Validators.required),
        retractionLength: new FormControl(null, Validators.required),
        retractionSpeed: new FormControl(null, Validators.required),
      });
    }

    return new FormGroup(obj);
  }
}
