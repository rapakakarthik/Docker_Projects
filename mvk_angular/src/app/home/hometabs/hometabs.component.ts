import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hometabs',
  templateUrl: './hometabs.component.html',
  styleUrls: ['./hometabs.component.scss']
})
export class HometabsComponent implements OnInit{
  currentRoute = '';
  
  constructor(private router: Router) {
    this.currentRoute = router.url;
    if(this.currentRoute == '/') this.currentRoute = '/products'
  }
  ngOnInit(): void {
    
  }

  goTo(route: string) {
    this.currentRoute = route;
    this.router.navigate([route]);
  }
}
