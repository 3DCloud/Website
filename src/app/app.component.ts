import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public get isAuthenticated() {
    return this.authenticationService.isAuthenticated;
  }

  public get currentUser() {
    return this.authenticationService.currentUser!;
  }

  public constructor(private authenticationService: AuthenticationService) { }

  public ngOnInit(): void {
    this.authenticationService.initialize().then(() => {});
  }

  public signOut(): void {
    this.authenticationService.signOut();
  }

}
