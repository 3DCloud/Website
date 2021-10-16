import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { sha256 } from 'js-sha256';
import jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { apiUrl } from 'app/core/helpers';
import { User } from 'app/core/models';
import { UsersService } from 'app/shared/services';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface TokenPayload {
  iss: string;
  jti: string;
  exp: number;
  sub: number;
}

// attempt to refresh access token 1 minute before expiry
const TOKEN_REFRESH_EXPIRY_DELAY = 60 * 1000;

const CODE_VERIFIER_KEY = '3dcloud-code-verifier';
const ACCESS_TOKEN_KEY = '3dcloud-access-token';
const REFRESH_TOKEN_KEY = '3dcloud-refresh-token';

export const HTTP_CONTEXT_AUTHENTICATION_REQUEST_KEY = new HttpContextToken(
  () => false
);

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _user?: User;
  private _accessToken?: string;
  private _refreshToken?: string;
  private _refreshTimer?: number;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _usersService: UsersService
  ) {
    this._accessToken =
      window.localStorage.getItem(ACCESS_TOKEN_KEY) || undefined;
    this._refreshToken =
      window.localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
  }

  public get isAuthenticated(): boolean {
    return this._user !== undefined;
  }

  public get accessToken(): string | undefined {
    return this._accessToken;
  }

  public get currentUser(): User | undefined {
    return this._user;
  }

  public signIn(): Observable<boolean> {
    if (this._accessToken || this._refreshToken) {
      return this.refreshAuthorization(this._accessToken, this._refreshToken);
    } else {
      this.initiateAuthorization();
      return of(false);
    }
  }

  public signInIfSessionExists(): Observable<boolean> {
    if (this._accessToken || this._refreshToken) {
      return this.refreshAuthorization(
        this._accessToken,
        this._refreshToken,
        true
      );
    } else {
      return of(false);
    }
  }

  public signOut(): void {
    this.post(apiUrl('/sessions/logout'), {
      token: this._refreshToken,
    }).subscribe(() => {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);

      this._accessToken = undefined;
      this._refreshToken = undefined;

      location.assign('https://makerepo.com');
    });
  }

  public continueAuthorization(code: string): Observable<boolean> {
    return this.post<TokenResponse>(apiUrl('/sessions/token'), {
      grant_type: 'authorization_code',
      code: code,
      code_verifier: window.localStorage.getItem(CODE_VERIFIER_KEY),
    }).pipe(
      concatMap((response) => {
        window.localStorage.removeItem(CODE_VERIFIER_KEY);
        return this.processTokens(
          response.access_token,
          response.refresh_token
        );
      })
    );
  }

  public refreshAccessToken(bailIfRefreshFails = false): Observable<boolean> {
    if (!this._refreshToken) {
      this.initiateAuthorization();
      return of(false);
    }

    return this.post<TokenResponse>(apiUrl('/sessions/token'), {
      grant_type: 'refresh_token',
      refresh_token: this._refreshToken,
    }).pipe(
      concatMap((response) => {
        return this.processTokens(
          response.access_token,
          response.refresh_token,
          bailIfRefreshFails
        );
      }),
      catchError(() => {
        if (!bailIfRefreshFails) {
          this.initiateAuthorization();
        }

        return of(false);
      })
    );
  }

  public hasRole(role: string | undefined): boolean {
    return true; // TODO: get role from back-end
  }

  private initiateAuthorization() {
    const codeChallenge = this.generateCodeChallenge();

    location.assign(
      apiUrl('/sessions/authorize', {
        code_challenge: codeChallenge,
      })
    );
  }

  private refreshAuthorization(
    accessToken: string | undefined,
    refreshToken: string | undefined,
    bailIfRefreshFails = false
  ): Observable<boolean> {
    if (
      !refreshToken ||
      jwtDecode<TokenPayload>(refreshToken).exp * 1000 <=
        Date.now() - TOKEN_REFRESH_EXPIRY_DELAY
    ) {
      if (!bailIfRefreshFails) {
        this.initiateAuthorization();
      }

      return of(false);
    }

    if (
      !accessToken ||
      jwtDecode<TokenPayload>(accessToken).exp * 1000 <=
        Date.now() - TOKEN_REFRESH_EXPIRY_DELAY
    ) {
      return this.refreshAccessToken(bailIfRefreshFails);
    }

    return this.processTokens(accessToken, refreshToken, bailIfRefreshFails);
  }

  private processTokens(
    accessToken: string,
    refreshToken: string,
    bailIfExpiredOrRefreshFails = false
  ): Observable<boolean> {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
    }

    const expiry = jwtDecode<TokenPayload>(accessToken).exp;
    const timeout = expiry * 1000 - Date.now() - TOKEN_REFRESH_EXPIRY_DELAY;

    if (timeout <= 0) {
      return this.refreshAccessToken(bailIfExpiredOrRefreshFails);
    }

    this._refreshTimer = setInterval(() => {
      const subscription = this.refreshAccessToken(
        bailIfExpiredOrRefreshFails
      ).subscribe(
        () => {
          subscription.unsubscribe();
        },
        () => {
          subscription.unsubscribe();
        }
      );
    }, timeout);

    this._accessToken = accessToken;
    this._refreshToken = refreshToken;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return this._usersService.getCurrentUser().pipe(
      map((user) => {
        this._user = user;
        return true;
      })
    );
  }

  private generateCodeChallenge() {
    const codeVerifier = this.generateSecureRandomHexString();
    window.localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    return sha256(codeVerifier);
  }

  private generateSecureRandomHexString(): string {
    const characters = '0123456789abcdef';
    const buffer = new Uint8Array(64);

    crypto.getRandomValues(buffer);

    let str = '';

    for (const num of buffer) {
      str += characters[(num >> 4) & 0xf] + characters[num & 0xf];
    }

    return str;
  }

  private post<T>(
    url: string,
    body: unknown | null,
    options?: {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ) {
    const context = new HttpContext().set(
      HTTP_CONTEXT_AUTHENTICATION_REQUEST_KEY,
      true
    );

    return this._http.post<T>(url, body, { ...options, context });
  }
}
