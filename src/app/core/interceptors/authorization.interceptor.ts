import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'app/core/services';
import { environment } from 'environments/environment';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  constructor(private _authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(environment.apiUrl)) {
      return next.handle(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${this._authenticationService.accessToken}`,
          },
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
