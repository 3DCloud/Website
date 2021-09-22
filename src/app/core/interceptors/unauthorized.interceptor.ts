import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';

import {
  AuthenticationService,
  HTTP_CONTEXT_AUTHENTICATION_REQUEST_KEY,
} from 'app/core/services';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private _authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          !(err instanceof HttpErrorResponse) ||
          err.status != 401 ||
          request.context.get(HTTP_CONTEXT_AUTHENTICATION_REQUEST_KEY)
        ) {
          return throwError(err);
        }

        return this._authenticationService.refreshAccessToken().pipe(
          concatMap((result) => {
            if (result) {
              return next.handle(request);
            } else {
              return new Observable<never>();
            }
          })
        );
      })
    );
  }
}
