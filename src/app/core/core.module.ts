import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  AuthenticationCallbackComponent,
  PageNotFoundComponent,
} from './components';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { AuthorizationInterceptor } from './interceptors';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    AuthenticationCallbackComponent,
    LoadingOverlayComponent,
  ],
  imports: [CommonModule, FontAwesomeModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
  ],
  exports: [LoadingOverlayComponent],
})
export class CoreModule {}