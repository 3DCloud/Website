import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { AuthenticationService } from 'app/core/services';

@Component({
  selector: 'app-authentication-callback',
  templateUrl: './authentication-callback.component.html',
  styleUrls: ['./authentication-callback.component.scss'],
})
export class AuthenticationCallbackComponent implements OnInit {
  public showSpinner = true;
  public message?: string;
  public messageIcon = faExclamationCircle;

  public constructor(
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this._route.queryParamMap.subscribe((params) => {
      const code = params.get('code');

      if (!code || !code.length) {
        this._router.navigate(['']);
        return;
      }

      this._authenticationService.continueAuthorization(code).subscribe(
        () => {
          const returnPath = params.get('return') || '';
          this._router.navigate([returnPath], {
            queryParams: { code: null, return: null },
            queryParamsHandling: 'merge',
          });
        },
        (err: Error) => {
          this._router.navigate([], {
            queryParams: { relativeTo: this._route, code: null, return: null },
            queryParamsHandling: 'merge',
          });
          this.showSpinner = false;
          this.message = `Failed to authenticate. Please refresh the page.\n${err.message}`;
        }
      );
    });
  }
}
