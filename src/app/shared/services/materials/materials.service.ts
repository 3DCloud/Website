import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Material } from 'app/core/models';

import GetMaterials from './queries/GetMaterials.graphql';

@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  constructor(private _apollo: Apollo) {}

  public getMaterials(): Observable<Material[]> {
    return this._apollo
      .query<{ materials: Material[] }>({
        query: GetMaterials,
      })
      .pipe(map((result) => result.data.materials));
  }
}
