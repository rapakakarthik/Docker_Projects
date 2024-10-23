import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RecommendationService } from '../../services/recommendation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-category-carousel',
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent implements OnInit{
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1.5,
        nav: false,
      },
      300: {
        items: 2.5,
        nav: false,
      }, 500: {
        items: 3.5,
        nav: false,
      },
      640: {
        items: 4.5,
        nav: false,
      },
      940: {
        items: 7,
      },
    },
    nav: true
  }

  constructor(
    private api: RecommendationService,
    private router: Router,
    private crud: CrudService
  ) {}
  ngOnInit(): void {
    this.getMainCategories();
  }

  categories: any[] = [{category_id: 0, category_name: "All Categories", category_icon: "/assets/svg/all-category.svg"}];
  catLength = 0;
  loader = false;
  getMainCategories() {
    this.loader = true;
    this.crud.getMainCategories().subscribe({
      next: (value: any) => {
        this.loader = false;
        if(value.status == 200) {
          this.categories = [...this.categories, ...value.data];
          this.crud.pushCategories(this.categories);
          this.catLength = Math.round(this.categories.length / 2);
        }
      }, 
      error: (err: HttpErrorResponse) => {
        this.loader = false;
      }
    })
  }

  goTo(id: number, name: string) {
    if(id === 0) {
      this.router.navigateByUrl('/category/all');
      return;
    }
    let url = name + '-' + id;
    this.router.navigate(['category', url]);
  }

  isAfter = true;
  check(e: any) {
    let arrLength = e.slides.length;
    if(this.catLength - arrLength - 1 == e.startPosition) {
      this.isAfter = false
    } else {
      this.isAfter = true;
    }
  }

  colour = 'filter: brightness(0) saturate(100%) invert(49%) sepia(83%) saturate(7200%) hue-rotate(182deg) brightness(87%) contrast(99%)';
  
}
