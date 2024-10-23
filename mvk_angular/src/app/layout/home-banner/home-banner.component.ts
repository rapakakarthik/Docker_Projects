import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import * as BannerActions from 'src/app/home/actions/banner.actions';
import { HomeBanner } from 'src/app/home/models/banner';
import { selectBanner } from 'src/app/home/selectors/banner.selector';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss'],
})
export class HomeBannerComponent implements OnInit{
  desktopitem: number = 1;
  mobileitem: number = 1;
  customOptions: OwlOptions = {
    loop: true,
    autoplayTimeout: 5000,
    slideBy: 1,
    items: 6,
    autoplay: true,
    autoplaySpeed: 300,
    mouseDrag: true,
    touchDrag: true,
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
       
      },
      1000: {
        items: 1,
      },
    },
    nav: true,
  };


  constructor(
    private route: Router, 
    private store: Store<any>
  ) {}
  ngOnInit(): void {
    this.getBanners();
    this.banner$ = this.store.pipe( select(selectBanner) );
  }

  getBanners() {
    this.store.dispatch( BannerActions.loadBanner() )
  }

  banner$!: Observable<HomeBanner[]>

  linktoclick(obj: any) {
    if(obj.have_link) {
      let id = obj.link_id;
      let category_name = (obj.link_name as string).toLowerCase();
      let url = category_name + '-' + id; 
      this.route.navigate(['/category', url]);
    }
    //product/68
  }
}
