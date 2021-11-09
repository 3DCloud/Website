import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-not-found-component',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  public icons = { faArrowLeft, faQuestionCircle };

  public constructor(private _location: Location) {}

  public back(): void {
    this._location.back();
  }
}
