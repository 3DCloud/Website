import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { Material } from 'app/core/models';

import CreateMaterial from './queries/CreateMaterial.graphql';
import DeleteMaterial from './queries/DeleteMaterial.graphql';
import GetMaterial from './queries/GetMaterial.graphql';
import GetMaterials from './queries/GetMaterials.graphql';
import UpdateMaterial from './queries/UpdateMaterial.graphql';

@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  public constructor(private _apollo: Apollo) {}

  public getMaterials(): Observable<Material[]> {
    return this._apollo
      .query<{ materials: Material[] }>({
        query: GetMaterials,
      })
      .pipe(map((result) => result.data.materials));
  }

  public getMaterial(id: string): Observable<Material> {
    return this._apollo
      .query<{ material: Material }>({
        query: GetMaterial,
        variables: { id },
      })
      .pipe(map((result) => result.data.material));
  }

  public createMaterial(material: Material): Observable<Material> {
    return this._apollo
      .mutate<{ createMaterial: Material }>({
        mutation: CreateMaterial,
        variables: { material },
      })
      .pipe(mapMutationResult((result) => result.createMaterial));
  }

  public updateMaterial(id: string, material: Material): Observable<Material> {
    return this._apollo
      .mutate<{ updateMaterial: Material }>({
        mutation: UpdateMaterial,
        variables: { id, material },
      })
      .pipe(mapMutationResult((result) => result.updateMaterial));
  }

  public deleteMaterial(id: string): Observable<Material> {
    return this._apollo
      .mutate<{ deleteMaterial: Material }>({
        mutation: DeleteMaterial,
        variables: { id },
      })
      .pipe(mapMutationResult((result) => result.deleteMaterial));
  }
}
