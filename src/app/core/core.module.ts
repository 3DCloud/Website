import { NgModule } from '@angular/core';
import { AuthenticationCallbackComponent, PageNotFoundComponent } from './components';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizationInterceptor } from './interceptors';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';

@NgModule({
  declarations: [
    PageNotFoundComponent,
    AuthenticationCallbackComponent,
    LoadingOverlayComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
  ],
  exports: [
    LoadingOverlayComponent
  ]
})
export class CoreModule { }
