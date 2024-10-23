import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {

  year = 0;
  constructor() {
    let date = new Date();
    this.year = date.getFullYear();
  }
}
