import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Ability, PureAbility } from '@casl/ability';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  AlertComponent,
  AuthenticationCallbackComponent,
  PageNotFoundComponent,
  SpinnerComponent,
} from './components';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import {
  AuthorizationInterceptor,
  UnauthorizedInterceptor,
} from './interceptors';
import {
  DjsDateFormatPipe,
  DjsDiffPipe,
  DjsDurationPipe,
  DjsTimeAgoPipe,
  SubjectPipe,
} from './pipes';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    AuthenticationCallbackComponent,
    LoadingOverlayComponent,
    AlertComponent,
    SpinnerComponent,
    DjsTimeAgoPipe,
    DjsDateFormatPipe,
    DjsDurationPipe,
    DjsDiffPipe,
    SubjectPipe,
  ],
  imports: [CommonModule, FontAwesomeModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    {
      provide: Ability,
      useValue: new Ability(),
    },
    {
      provide: PureAbility,
      useExisting: Ability,
    },
  ],
  exports: [
    LoadingOverlayComponent,
    SpinnerComponent,
    AlertComponent,
    DjsTimeAgoPipe,
    DjsDateFormatPipe,
    DjsDiffPipe,
    DjsDurationPipe,
    SubjectPipe,
  ],
})
export class CoreModule {}
