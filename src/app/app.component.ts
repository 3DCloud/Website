import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { hex } from 'js-md5';
import { Subscription } from 'rxjs';

import { AuthenticationService } from 'app/core/services';

import { User } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public loaded = false;
  public error?: string;

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this._authenticationService.signInIfSessionExists().subscribe(
      () => {
        this.loaded = true;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public get isAuthenticated(): boolean {
    return this._authenticationService.isAuthenticated;
  }

  public get gravatarUrl(): string {
    return `https://www.gravatar.com/avatar/${hex(
      this.currentUser?.emailAddress.toLowerCase() ?? ''
    )}`;
  }

  public get currentUser(): User | undefined {
    return this._authenticationService.currentUser;
  }

  public signIn(): void {
    this.loaded = false;
    this._subscriptions.push(
      this._authenticationService.signIn().subscribe(() => undefined)
    );
  }

  public signOut(): void {
    this._authenticationService.signOut();
  }
}
