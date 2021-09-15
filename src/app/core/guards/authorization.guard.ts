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

import { AuthenticationService } from 'app/core/services';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard
  implements CanActivate, CanActivateChild, CanLoad
{
  public constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkAuthorization(route.data);
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkAuthorization(route.data);
  }

  canLoad(route: Route): Observable<boolean> {
    return this.checkAuthorization(route.data);
  }

  private checkAuthorization(data: Data | undefined): Observable<boolean> {
    if (
      this.authenticationService.isAuthenticated &&
      this.authenticationService.hasRole(data?.requiredRole)
    ) {
      return of(true);
    }

    return this.authenticationService.signIn();
  }
}
