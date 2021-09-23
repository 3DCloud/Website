import { Injectable } from '@angular/core';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UploadedFile, User } from 'app/core/models';

const CURRENT_USER_QUERY = gql`
  {
    currentUser {
      name
      emailAddress
    }
  }
`;

const CURRENT_USER_FILES_QUERY = gql`
  {
    currentUser {
      uploadedFiles {
        id
        filename
        byteSize
        createdAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private _apollo: Apollo) {}

  public getCurrentUser(): Observable<User> {
    return this._apollo
      .query<{ currentUser: User }>({ query: CURRENT_USER_QUERY })
      .pipe(map((result) => result.data.currentUser));
  }

  public getCurrentUserFiles(): Observable<UploadedFile[]> {
    return this._apollo
      .query<{ currentUser: User }>({
        query: CURRENT_USER_FILES_QUERY,
      })
      .pipe(map((result) => result.data.currentUser.uploadedFiles));
  }
}
