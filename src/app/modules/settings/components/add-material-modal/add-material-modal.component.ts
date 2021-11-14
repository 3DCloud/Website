import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Material } from 'app/core/models';
import { MaterialTxtEntry } from 'app/modules/settings/types';
import { MaterialsService } from 'app/shared/services';

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.component.html',
  styleUrls: ['./add-material-modal.component.scss'],
})
export class AddMaterialModalComponent implements OnInit, OnDestroy {
  public existingMaterials: Material[] = [];
  public materialIndex = 0;
  public copyFromIndex = 0;
  public loading = true;
  public busy = false;
  public importSelection: 'blank' | 'use-existing' | 'use-material-txt' =
    'blank';
  public materials?: Material[];
  public error?: string;

  public reading = false;
  public readError?: string;
  public materialTxtOptions?: MaterialTxtEntry[];
  public useMaterialTxtIndex = 0;

  private _subscriptions: Subscription[] = [];

  public constructor(
    public modal: NgbActiveModal,
    private _materialsService: MaterialsService
  ) {}

  public get isValid(): boolean {
    return (
      this.materials !== undefined &&
      this.materials.length > 0 &&
      (this.importSelection !== 'use-material-txt' ||
        this.materialTxtOptions?.length !== undefined)
    );
  }

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

  public readFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.readyState !== FileReader.DONE) {
        return;
      }

      const contents = reader.result as string;
      let currentMaterial: Record<string, string> | undefined = undefined;
      this.materialTxtOptions = [];

      for (const line of contents.split('\n')) {
        if (line === '[material]') {
          if (currentMaterial) {
            const parsed = this.parseMaterial(currentMaterial);

            if (parsed) {
              this.materialTxtOptions.push(parsed);
            }
          }

          currentMaterial = {};

          continue;
        }

        if (!currentMaterial) {
          continue;
        }

        const [key, value] = line.split('=', 2);
        currentMaterial[key] = value;
      }

      this.reading = false;
    };

    reader.onerror = () => {
      this.readError = reader.error?.message;
      this.reading = false;
    };

    reader.readAsText(file);
  }

  private parseMaterial(
    material: Record<string, string>
  ): MaterialTxtEntry | undefined {
    const required = [
      'name',
      'temperature_0.25',
      'retraction_length_0.25',
      'retraction_speed_0.25',
      'temperature_0.40',
      'retraction_length_0.40',
      'retraction_speed_0.40',
      'temperature_0.60',
      'retraction_length_0.60',
      'retraction_speed_0.60',
      'temperature_0.80',
      'retraction_length_0.80',
      'retraction_speed_0.80',
      'temperature_1.00',
      'retraction_length_1.00',
      'retraction_speed_1.00',
      'bed_temperature',
      'fan_speed',
      'flow',
    ];

    const keys = Object.keys(material);

    if (required.filter((k) => keys.indexOf(k) === -1).length) {
      return undefined;
    }

    return {
      name: material['name'],
      perNozzleSettings: {
        size025: {
          hotendTemperature: parseInt(material['temperature_0.25'], 10),
          retractionLength: parseFloat(material['retraction_length_0.25']),
          retractionSpeed: parseFloat(material['retraction_speed_0.25']),
        },
        size040: {
          hotendTemperature: parseInt(material['temperature_0.40'], 10),
          retractionLength: parseFloat(material['retraction_length_0.40']),
          retractionSpeed: parseFloat(material['retraction_speed_0.40']),
        },
        size060: {
          hotendTemperature: parseInt(material['temperature_0.60'], 10),
          retractionLength: parseFloat(material['retraction_length_0.60']),
          retractionSpeed: parseFloat(material['retraction_speed_0.60']),
        },
        size080: {
          hotendTemperature: parseInt(material['temperature_0.80'], 10),
          retractionLength: parseFloat(material['retraction_length_0.80']),
          retractionSpeed: parseFloat(material['retraction_speed_0.80']),
        },
        size100: {
          hotendTemperature: parseInt(material['temperature_1.00'], 10),
          retractionLength: parseFloat(material['retraction_length_1.00']),
          retractionSpeed: parseFloat(material['retraction_speed_1.00']),
        },
      },
      endOfPrintRetractionLength: 20, // Ultimaker 2+ default
      buildPlateTemperature: parseInt(material['bed_temperature'], 10),
      fanSpeed: parseInt(material['fan_speed'], 10),
      flowRate: parseInt(material['flow'], 10),
    };
  }

  public submit(): void {
    if (!this.materials || !this.isValid) {
      return;
    }

    this.modal.close({
      material: this.materials[this.materialIndex],
      copyFrom:
        this.importSelection === 'use-existing'
          ? this.copyFromIndex
          : undefined,
      useMaterialTxt:
        this.importSelection === 'use-material-txt' &&
        this.materialTxtOptions?.length
          ? this.materialTxtOptions[this.useMaterialTxtIndex]
          : undefined,
    });
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }
}
