import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Data,
  Route,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AuthenticationService } from 'app/core/services';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  public constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkAuthorization(route.data);
  }

  public canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkAuthorization(route.data);
  }

  public canLoad(route: Route): Observable<boolean> {
    return this.checkAuthorization(route.data);
  }

  public checkAuthorization(data: Data | undefined): Observable<boolean> {
    if (this._authenticationService.isAuthenticated) {
      return of(this._authenticationService.can(data?.action, data?.subject));
    }

    return this._authenticationService.signInIfSessionExists().pipe(
      map(() => this._authenticationService.can(data?.action, data?.subject)),
      catchError(() => of(false))
    );
  }
}
