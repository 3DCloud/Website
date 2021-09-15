import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { gql } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { sha256 } from 'js-sha256';
import jwtDecode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';

import { apiUrl } from 'app/core/helpers';
import { User } from 'app/core/models';

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

const CODE_VERIFIER_KEY = '3dcloud-code-verifier';
const ACCESS_TOKEN_KEY = '3dcloud-access-token';
const REFRESH_TOKEN_KEY = '3dcloud-refresh-token';

const GET_USER_INFO = gql`
  {
    currentUser {
      name
      emailAddress
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _user?: User;
  private _accessToken?: string;
  private _refreshToken?: string;

  constructor(
    private _http: HttpClient,
    private _apollo: Apollo,
    private _router: Router
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

  public signOut(): void {
    this._http
      .post(apiUrl('/sessions/logout'), { token: this._refreshToken })
      .subscribe(() => {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);

        this._accessToken = undefined;
        this._refreshToken = undefined;

        location.assign('https://makerepo.com');
      });
  }

  public continueAuthorization(code: string): Observable<boolean> {
    return this._http
      .post<TokenResponse>(apiUrl('/sessions/token'), {
        grant_type: 'authorization_code',
        code: code,
        code_verifier: window.localStorage.getItem(CODE_VERIFIER_KEY),
      })
      .pipe(
        concatMap((response) => {
          window.localStorage.removeItem(CODE_VERIFIER_KEY);
          return this.processTokens(
            response.access_token,
            response.refresh_token
          );
        })
      );
  }

  public hasRole(role: string | undefined): boolean {
    return true; // TODO: get role from back-end
  }

  private initiateAuthorization() {
    const codeChallenge = this.generateCodeChallenge();
    location.assign(
      apiUrl(`/sessions/authorize?code_challenge=${codeChallenge}`)
    );
  }

  private refreshAuthorization(
    accessToken?: string,
    refreshToken?: string
  ): Observable<boolean> {
    if (
      !refreshToken ||
      jwtDecode<TokenPayload>(refreshToken).exp * 1000 <= Date.now()
    ) {
      this.initiateAuthorization();
      return of(false);
    }

    if (
      accessToken &&
      jwtDecode<TokenPayload>(accessToken).exp * 1000 > Date.now()
    ) {
      return this.processTokens(accessToken, refreshToken);
    }

    return this._http
      .post<TokenResponse>(apiUrl('/sessions/token'), {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .pipe(
        concatMap((response) => {
          return this.processTokens(
            response.access_token,
            response.refresh_token
          );
        }),
        catchError(() => {
          this.initiateAuthorization();
          return of(false);
        })
      );
  }

  private processTokens(
    accessToken: string,
    refreshToken: string
  ): Observable<boolean> {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    return this.getUserInfo().pipe(
      map((userInfo) => {
        this._user = userInfo;
        return true;
      })
    );
  }

  private getUserInfo(): Observable<User> {
    return this._apollo
      .query<{ currentUser: User }>({ query: GET_USER_INFO })
      .pipe(map((result) => result.data.currentUser));
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
}
