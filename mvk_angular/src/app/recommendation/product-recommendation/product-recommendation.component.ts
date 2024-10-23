import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';

@Component({
  selector: 'app-product-recommendation',
  templateUrl: './product-recommendation.component.html',
  styleUrls: ['./product-recommendation.component.scss']
})
export class ProductRecommendationComponent implements OnInit {
  //routing links
  linkTo: string = "homepage";
  
  //smart loaders
  productLoad: boolean = false;
  homeCategoryLoad : boolean = false
  justForYouLoad : boolean = false
  
  //Data from API

  constructor( private crudService : CrudService, private api: RecommendationService) {}
  ngOnInit(): void {
    this.getMainCategories();
    this.getRecommendProducts(this.categoryId);
  }

  mainCatList: any[] = [{category_name: 'All', category_id: 0}];
  getMainCategories() {
    // this.crudService.getMainCategories().subscribe({
    //   next: (res: any) => {
    //     if(res.status == 200) {
    //       this.mainCatList = [...this.mainCatList, ...res.data];
    //     } else {
    //       console.info(res.message)
    //     }
    //   }, 
    //   error: (err: HttpErrorResponse) => {
    //     console.log(err.error);
    //   }
    // })

    this.crudService.categories$.subscribe(() => {
      this.mainCatList = [...this.mainCatList, ...this.crudService.getCategories()];
    })

  }

  categoryId: number = 0;
  tabtitle:string="All";


/* code here */
@ViewChild('tabGroup')
tabGroup!: any;
activeTab = 0;
activeIndex=0;

setActiveTab(index:any)
{
  this.activeIndex=index;
 
  this.tabGroup.selectedIndex = this.activeIndex;
  
}
/* code end here */


  onTabClick(event: MatTabChangeEvent) {
    
    this.activeTab=event.index
    // if(event.index === 0) this.categoryId = 0;
    this.tabtitle=this.mainCatList[event.index].category_name;
    this.categoryId = this.mainCatList[event.index].category_id;
    this.getRecommendProducts(this.categoryId);
  }

  noProductsFound = false;
  totalCount: number = 0;
  collection: any[] = [];
  getRecommendProducts(catId: number, skip?: number) {
    this.noProductsFound = false;
    this.justForYouLoad = true;
    const obj = {
      type: 1, //products - 1, manufactures - 2
      category_id: catId ? catId : null,
      skip: skip ? skip : 0,
      limit: 18,
      search: '',
      user_id: 0
    }
    this.api.getJustForYou(obj).subscribe({
      next: (res: any) => {
        this.justForYouLoad = false;
        if(res.status == 200) {
          this.totalCount = res.total_count;
          if(this.totalCount <= 0) {
            console.log(this.totalCount);
            this.noProductsFound = true;
          }
          this.collection = res.data.products;
        }
        else  {
          this.collection = [];
          this.noProductsFound = true
        }
      },
      error: (err: HttpErrorResponse) => {
        this.collection = [];
        this.justForYouLoad = false;
        this.noProductsFound = true
        console.error(err.message, err.error)
      }
    })
  }

  skipItems: number = 0;
  p: number = 0;
  @ViewChild('productsView') myDivRef!: ElementRef;
  onPageChange2(pageNumber: number) {
    if (this.myDivRef) {
      this.myDivRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 18;
    this.getRecommendProducts(this.categoryId, this.skipItems);
  }
}
