import { N } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';

@Component({
  selector: 'app-products-tab',
  templateUrl: './products-tab.component.html',
  styleUrls: ['./products-tab.component.scss']
})
export class ProductsTabComponent implements OnInit {
  //routing links
  linkTo: string = "homepage";
  
  //smart loaders
  productLoad: boolean = false;
  homeCategoryLoad : boolean = false
  justForYouLoad : boolean = false
  
  catId: number = 1;
  //Data from API
  newArrivals: any[] = [];
  CategoryData:any[] = [];
  productData:any[] = [];

  constructor( private crudService : CrudService, private api: RecommendationService, private _router: Router) {}
  ngOnInit(): void {
    this.getProducts(this.catId)
    this.getHomePageCategory()
    this.getRecommendProducts();
  }

  
  getProducts(data : number) {
    this.productLoad = true
    this.crudService.getProducts(data).subscribe({
      next: (res: any) => {
        this.productLoad = false
        if(res.status == 200) {
          this.newArrivals = res.data
        }else{
          this.newArrivals = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.productLoad = false
        console.error(err.message, err.error)
      }
    })
  }


  //uniforms Api
  getHomePageCategory() {
    this.homeCategoryLoad = true
    this.crudService.getHomepageCategory().subscribe({
      next: (res: any) => {
        this.homeCategoryLoad = false
        if(res.status == 200) {
          this.CategoryData = res.data
        } else{
          this.CategoryData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.homeCategoryLoad = false
        console.error(err.message, err.error)
      }
    })
  }

  getHomepageProducts() {
    this.justForYouLoad = true
    this.crudService.getHomepageProducts().subscribe({
      next: (res: any) => {
        this.justForYouLoad = false
        if(res.status == 200) {
          this.productData = res.data
        }
        else{
          this.productData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.justForYouLoad = false
        console.error(err.message, err.error)
      }
    })
  }

  getRecommendProducts() {
    this.justForYouLoad = true
    const obj = {
      type: 1, //products - 1, manufactures - 2
      category_id: 1,
      skip: 0,
      limit: 24,
      search: '',
      user_id: 0
    }
    this.api.getJustForYou(obj).subscribe({
      next: (res: any) => {
        this.justForYouLoad = false
        if(res.status == 200) {
          this.productData = res.data.products
        }
        else {
          this.productData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error)
      }
    })
  }

  route2(id: number, name: string) {
    let category_name = encodeURIComponent(name).toLowerCase();
    // let category_name = name.replaceAll(" ", "-");
    let url = category_name + "-" + id;
    this._router.navigate(['/category', url])
  }
}


// not using