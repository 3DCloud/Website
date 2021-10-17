import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
import { DjsDateFormatPipe } from './pipes/djs-date-format.pipe';
import { DjsTimeAgoPipe } from './pipes/djs-time-ago.pipe';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    AuthenticationCallbackComponent,
    LoadingOverlayComponent,
    AlertComponent,
    SpinnerComponent,
    DjsTimeAgoPipe,
    DjsDateFormatPipe,
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
  ],
  exports: [
    LoadingOverlayComponent,
    SpinnerComponent,
    AlertComponent,
    DjsTimeAgoPipe,
    DjsDateFormatPipe,
  ],
})
export class CoreModule {}
