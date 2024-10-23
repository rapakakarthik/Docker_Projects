import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from '../shared/services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit{
  @ViewChild('tabGroup')
  tabGroup!: MatTabGroup;
  productId!: number;
  productData: any[] = [];
  productLoad: boolean = false;
  mainCatList: MainCatList[] = [];
  catId: number = 0;
  categoryId: number = 0;
  disabled: boolean = true
  loader: boolean = false;
  dataloader: boolean = false;
  keywordType: string = 'trending';
  activeCls: boolean = true;
  productDataApi: ProductDataApi = {
    category_id :0,
    home_product: 0,
    type: '',
    // keyword: '',
    limit: 0,
    skip: 0,
  };
  selectedTabIndex: number = 0;

  constructor( private crudService: CrudService, private route: ActivatedRoute) {}  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['catId'];
      this.productId = params['pId'];
      this.getMainCategories();
    })
    // this.getProductList('trending');
    // this.getMainCategories(); //tabs display
  }

  getMainCategories() {
    this.loader = true
    this.dataloader = true;
    this.crudService.getMainCategories().subscribe({
      next: (res: any) => {
        if(res.status == 200) {
          this.mainCatList = res.data;
          this.selectedTabIndex = this.categoryId;
          this.getProductList('trending')
        }else {
          console.info(res.message)
        }
        this.loader = false;
      }, 
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        console.log(err.error);
      }
    })
  }

  

  clearData: boolean = false;
  previousKeyword: string = 'trending';
  data: any[] = [];
  totalItems: number = 0;
  getProductList(keyword: string, skip: number = 0, limit: number = 54) {
    if(this.productData.length < 1) {
      this.dataloader = true;
    }
    this.activeCls = keyword =='trending' ? true : false;
    this.clearData = false;
    if(keyword !== this.previousKeyword) {
      this.clearData = true;
      this.previousKeyword = keyword;
    }

    this.keywordType = keyword;
    this.productDataApi.category_id = this.catId || Number(this.categoryId);
    this.productDataApi.home_product = this.productId;
    this.productDataApi.type = keyword;
    this.productDataApi.skip = skip;
    this.productDataApi.limit = limit;
    this.crudService.getProductList(this.productDataApi).subscribe({
      next: (value: any) => {
        this.dataloader = false;
        if(value.status == 200){
          if(this.clearData) {
            this.data = [];
            this.productData = [];
          }
          this.data.push(...value.data);
          this.totalItems += value.data.length;
          if(this.productData.length < 1) {
            this.productData = this.data.slice(0,18)
          }
        }
        else {
          this.productData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.dataloader = false;
        console.log(err.message);
      }
    })
  }

  onPageChange(event: PageEvent) {
    const skip = event.pageIndex * event.pageSize;
    if (event.pageIndex === Math.ceil(event.length / event.pageSize) - 1) {
      this.getProductList(this.keywordType, this.totalItems, 54);
    }
    this.productData = this.data.slice(skip, skip + event.pageSize);
  }

  // getMainCategories() {
  //   this.loader = true
  //   this.dataloader = true;
  //   this.curdService.getMainCategories().subscribe({
  //     next: (res: any) => {
  //       if(res.status == 200) {
  //         this.mainCatList = res.data;
  //         this.highlightTab(this.categoryId)
  //         this.catId = this.mainCatList[0].category_id;
  //         setTimeout(() => {
  //           if (this.tabGroup.selectedIndex === 0) {
  //           this.getProductList('trending')
  //           }
  //         }, 1000);        
  //       }
  //       this.loader = false;
  //     }, 
  //     error: (err: HttpErrorResponse) => {
  //       this.loader = false;
  //       console.log(err.error);
  //     }
  //   })
  // }

  onTabClick(event: MatTabChangeEvent) {
    this.dataloader = true;
    this.mainCatList.forEach(cat => {
      if(cat.category_name == event.tab.textLabel) {
        this.catId = cat.category_id
      }
    })

    this.productDataApi.category_id = this.catId;
    this.productDataApi.type = this.keywordType;
    this.productDataApi.home_product = 0;
    this.productDataApi.skip = 0;
    this.productDataApi.limit = 54;
    this.crudService.getProductList(this.productDataApi).subscribe({
      next: (value: any) => {
        this.dataloader = false;
        if(value.status == 200){
          this.data = [];
          this.totalItems = 0;
          this.productData = [];
          this.data.push(...value.data);
          this.totalItems += value.data.length;
          if(this.productData.length < 1) {
            this.productData = this.data.slice(0,18)
          }else {
            this.productData = [];
          }
        }
        // if(res.status== 200) {
        //   this.productData = res.data
        // }
        // this.dataloader = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.error, err.message)
      }
    })
  }
  
}  


export interface MainCatList {
  category_name: string;
  category_id: number
}

interface ProductDataApi {
  category_id: number,
  home_product: number,
  type: string,
  keyword?: string,
  limit: number,
  skip: number,
}




