import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-page-not-found-component',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  public icons = { faArrowLeft, faQuestionCircle };

  constructor(private location: Location) { }

  public back(): void {
    this.location.back();
  }

}
