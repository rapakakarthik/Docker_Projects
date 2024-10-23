import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RecommendationService } from '../../services/recommendation.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
})
export class RegionComponent implements OnInit {
  getStates: any = [];
  customOptions: OwlOptions = {
    loop: true,
    autoplayTimeout: 3000,
    slideBy: 3,
    autoplay: false,
    autoplaySpeed: 300,
    mouseDrag: false,
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
        items: 2,
      },
      300: {
        items: 3.2,
      },
      500: {
        items: 4.2,
      },
      740: {
        items: 5.2,
      },
      940: {
        items: 8,
      },
    },
    nav: true,
    // onInitialized: this.handleCarouselInit,
    // onTranslated: this.handleCarouselTranslate
  };

  constructor(private router: Router, private service: RecommendationService) {}
  ngOnInit(): void {
    this.getAllStates();
  }

  loader: boolean = true;
  getAllStates() {
    this.service.getAllStatesData().subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status == 200) {
          this.getStates = res.data.states;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
      }
    });
  }
}
