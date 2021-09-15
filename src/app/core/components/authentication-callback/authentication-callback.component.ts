import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from 'app/core/services';

@Component({
  selector: 'app-authentication-callback',
  templateUrl: './authentication-callback.component.html',
  styleUrls: ['./authentication-callback.component.scss'],
})
export class AuthenticationCallbackComponent implements OnInit {
  constructor(
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.queryParamMap.subscribe((params) => {
      const code = params.get('code');

      if (!code || !code.length) {
        this._router.navigate(['/']);
        return;
      }

      this._authenticationService.continueAuthorization(code).subscribe(() => {
        const returnPath = params.get('return') || '';
        this._router.navigate([returnPath], {
          queryParams: { code: null },
          queryParamsHandling: 'merge',
        });
      });
    });
  }
}
