import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'app/core/services';

import { User } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {}

  public get loaded(): boolean {
    return this._router.navigated;
  }

  public get isAuthenticated(): boolean {
    return this._authenticationService.isAuthenticated;
  }

  public get currentUser(): User | undefined {
    return this._authenticationService.currentUser;
  }

  public signOut(): void {
    this._authenticationService.signOut();
  }
}
