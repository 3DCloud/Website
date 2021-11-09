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
import { catchError } from 'rxjs/operators';

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

  private checkAuthorization(data: Data | undefined): Observable<boolean> {
    if (
      this._authenticationService.isAuthenticated &&
      this._authenticationService.hasRole(data?.requiredRole)
    ) {
      return of(true);
    }

    return this._authenticationService.signInIfSessionExists().pipe(
      catchError(() => {
        return of(false);
      })
    );
  }
}
