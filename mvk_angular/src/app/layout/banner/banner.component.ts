import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  bannerimages: any;
  loader: boolean = true;
  constructor(private crudservice: CrudService) {}

  ngOnInit() {
    this.getbannerimages();
  }

  getbannerimages() {
    this.crudservice.getBannerImages().subscribe((res: any) => {
      if (res.status == 200) {
        this.bannerimages = res.data;
        this.loader = false;
      }
    });
  }
}

// Not using