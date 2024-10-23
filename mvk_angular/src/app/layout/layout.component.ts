import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit{
  routerlink: string = '/searchresults'

  constructor(
    private location: Location,
  ) {
    this.onViewPage();
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  
  viewOnly: boolean = false;
  onViewPage() {
    const currentURL: string = this.location.path();
    if (currentURL.includes('/product/view/')) {
      this.viewOnly = true;
    }
  }
}
