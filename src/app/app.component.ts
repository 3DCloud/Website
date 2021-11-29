import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthenticationService } from 'app/core/services';

import { User } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public loaded = false;
  public error?: string;

  private _subscriptions: Subscription[] = [];

  public constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this._subscriptions.push(
      this._authenticationService.signInIfSessionExists().subscribe(
        () => {
          this.loaded = true;
        },
        (err) => {
          this.error = err;
        }
      )
    );

    this._subscriptions.push(
      this._router.events
        .pipe(
          filter(
            (event): event is ActivationStart =>
              event instanceof ActivationStart
          )
        )
        .subscribe((event) => {
          let title: string | undefined = undefined;
          let route: ActivatedRouteSnapshot | null = event.snapshot;

          while (route) {
            title = route.data.title;

            if (title) {
              break;
            }

            route = route.parent;
          }

          if (title) {
            document.title = `${title} | MakerRepo Print`;
          } else {
            document.title = 'MakerRepo Print';
          }
        })
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
