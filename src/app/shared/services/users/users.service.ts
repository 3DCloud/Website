import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapMutationResult } from 'app/core/helpers';
import { AbilityRule, User, WebSocketTicket } from 'app/core/models';

import GenerateWebSocketTicket from './queries/GenerateWebSocketTicket.graphql';
import GetCurrentUser from './queries/GetCurrentUser.graphql';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public constructor(private _apollo: Apollo) {}

  public getCurrentUser(): Observable<{
    currentUser: User | null;
    currentAbility: AbilityRule[];
  }> {
    return this._apollo
      .query<{ currentUser: User; currentAbility: AbilityRule[] }>({
        query: GetCurrentUser,
      })
      .pipe(map((result) => result.data));
  }

  public getWebSocketTicket(): Observable<string> {
    return this._apollo
      .mutate<{ generateWebSocketTicket: WebSocketTicket }>({
        mutation: GenerateWebSocketTicket,
      })
      .pipe(
        mapMutationResult((result) => result.generateWebSocketTicket.ticket)
      );
  }
}
