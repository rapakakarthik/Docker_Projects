import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CrudService } from 'src/app/shared/services/crud.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-region-banner',
  templateUrl: './region-banner.component.html',
  styleUrls: ['./region-banner.component.scss']
})
export class RegionBannerComponent {

  @Input() bannerDetails!: any;
  
  desktopitem:number=1;
  mobileitem:number=1;
  customOptions!:OwlOptions;
  constructor(private route:Router, private crud: CrudService) {}
  ngOnInit(): void {
 //  this.bannerDetails= 
  //   this.bannerDetails= [
  //     {
  //       "banner_image": '../assets/images/regionbg.jpg',
  //       "background_color": 'rgb(228, 167, 130)',
  //       "title": "The Pavilion for ",
  //       "banner_title_color": "#fff",
  //       "banner_sub_title":'Popular Products from Prominent Vendor Partners',
       
  //   },
   
  // ]
    this.customOptions = {
      loop: false,
      autoplayTimeout: 5000,
      slideBy: 1,
      items:6 ,
      autoplay: false,
      autoplaySpeed: 300,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: true,
      margin: 0,
    
      dots: true,
      navSpeed: 700,
      navText: [
        '<i class="bi bi-chevron-left"></i>',
        '<i class="bi bi-chevron-right"></i>',
      ],
      responsive: {
        0: {
          items: 1,
        },
        250: {
          items: 1,
          loop: false,
          autoplay: false
          
        },
        1000: {
          items: 1,
        }
      },
      nav: true,
     
    };

   

  }

  bannersData: any[] = [];
 

linktoclick(obj:any)
{
this.route.navigate(['/category', obj.link_id])
//product/68
}

  // For background images 
  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }

}
