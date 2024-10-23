import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HomeBanner } from '../models/banner';
import { selectBanner, selectLoading } from '../selectors/banner.selector';
import * as BannerActions from 'src/app/home/actions/banner.actions';

@Component({
  selector: 'app-home-banner-v3',
  templateUrl: './home-banner-v3.component.html',
  styleUrl: './home-banner-v3.component.scss'
})
export class HomeBannerV3Component implements OnInit {
  getStates: any = [];
  customOptions: OwlOptions = {
    loop: true,
    autoplayTimeout: 5000,
    slideBy: 1,
    autoplay: true,
    autoplaySpeed: 300,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    margin: 0,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
        nav: false,
        dots: true,
      },
      400: {
        items: 1,
        nav: false,
        dots: true,
      },
      700: {
        items: 2,
        nav: false,
      },
      940: {
        items: 2.5,
      },
    },
    nav: true,
    // onInitialized: this.handleCarouselInit,
    // onTranslated: this.handleCarouselTranslate
  };

  constructor(    private route: Router, 
    private store: Store<any>) {}
  ngOnInit(): void {
    this.getBanners();
    this.banner$ = this.store.pipe( select(selectBanner) );
  }

  getBanners() {
    this.store.dispatch( BannerActions.loadBanner() )
    this.loading$ = this.store.pipe(select(selectLoading));
  }

  banner$!: Observable<HomeBanner[]>;
  loading$!: Observable<boolean>;

  linktoclick(obj: any) {
    if(obj.have_link) {
      let id = obj.link_id;
      let category_name = (obj.link_name as string).toLowerCase();
      let url = category_name + '-' + id; 
      this.route.navigate(['/category', url]);
    }
  }


}
