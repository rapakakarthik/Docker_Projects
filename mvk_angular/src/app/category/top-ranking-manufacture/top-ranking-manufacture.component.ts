import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-ranking-manufacture',
  templateUrl: './top-ranking-manufacture.component.html',
  styleUrls: ['./top-ranking-manufacture.component.scss'],
})
export class TopRankingManufactureComponent implements OnInit {
  
  // @ViewChild('subTabGroup') subTabGroup!: MatTabGroup;
  showData: any[] = [];
  loader: boolean = false;
  dataloader: boolean = false;
  productData: any;
  selectedTabIndex: number = 0;
  noProdFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: RecommendationService
  ) {}

  ngOnInit(): void {
    this.getRouteParams();
  }

  catId: number = 0;
  getRouteParams() {
    this.route.params.subscribe((params) => {
      this.categoryType = params['type']; //for getting sub categories
      this.categoryIndex = this.categoryType; //for selecting tab by default
      this.catId = parseInt(params['catId']);
      this.getTopTypes();
      if(this.categoryType == 'top_search') this.getRankingCompanyDetails('top_search');
    });
  }

  // Main Room Categories called after component initalization
  mainCategoryData: any[] = [];
  mainCategoryInfo: any;
  categoryIndex: string = '';
  selectedTabCategoryIndex: number = 0;
  getTopTypes() {
    this.loader = true;
    this.api.getrankingTypes().subscribe({
      next: (value: any) => {
        this.loader = false;
        if (value.status === 200) {
          this.mainCategoryData = value.data[1].recommendation_types;
          this.mainCategoryInfo = value.data[1];
        
        this.title1=this.mainCategoryInfo?.recommendation_types[0]?.type
          if (this.categoryIndex) {
            const index = this.mainCategoryData.findIndex(obj => obj.key == this.categoryIndex);
            setTimeout(() => {
              this.tabGroup.selectedIndex = index;
            }, 1000)
            this.categoryIndex = '';
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        console.error(err.message, err.error);
      },
    });
  }

  // Sub Room Categories called after component initalization and after every time cliked on main category
  categoryType: string = '';
  subCategoryId: number = 0;
  subCategoryData: any[] = [];
  subCategoryInfo: any;
  categoryLoad: boolean = false;
  noManufacturer: boolean = false;
  subIndex: number = 0
  getRankingCompanyDetails(categoryType: string) {
    this.noManufacturer = false;
    this.categoryType = categoryType;
    this.categoryLoad = true;
    this.api.getRankingCompanyDetails(this.categoryType).subscribe({
      next: (value: any) => {
        this.categoryLoad = false;
        if(value.status === 200) {
          this.subCategoryData = value.data.categories;
          console.log(this.subCategoryData)
          if(this.subCategoryData.length == 0) {
            this.noManufacturer = true;
            this.collection = [];
          } else {
            let index = this.subCategoryData.findIndex(item => item.pk_id == this.catId);
            this.subIndex = index;
            // setTimeout(() => {
            //   this.subTabGroup.selectedIndex = index;
            // }, 1000)
          }
          this.subCategoryInfo = value.data.banner;
        }
        if(value.status === 400) {
          this.noManufacturer = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.noManufacturer = true;
        this.categoryLoad = false;
        console.error(err.message, err.error)
      }
    })
  }

  isFirst = true;
  title1:string="";
  subtitle1:string="";




/* code here */
@ViewChild('tabGroup')
tabGroup!: any;
@ViewChild('subTabGroup')
subTabGroup!: any;
activeTab = 0;
activeIndex=0;
subActiveIndex=0;
subActiveTab = 0;
setActiveTab(index:any)
{
  this.activeIndex=index;
  this.tabGroup.selectedIndex = this.activeIndex;
}
setSubActiveTab(index:any)
{
  this.subActiveIndex=index;
  this.subTabGroup.selectedIndex = this.subActiveIndex;
}

/* code end here */



  getRankingCompanyDetails2(eve: any) {
    console.log(eve)
    this.activeTab=eve;
    this.title1= this.mainCategoryData[eve].type;
    this.categoryType = this.mainCategoryData[eve].key;
    if(!this.isFirst) {
      this.catId = 0;
    }
    this.isFirst = false;
    this.getRankingCompanyDetails(this.categoryType);
  }

  // After Clicking On Mat Tab
  onTabClick(event: MatTabChangeEvent) {
    this.subActiveTab=event.index;
    this.subtitle1 =this.subCategoryData[event.index].cat_name
    this.subCategoryId = this.subCategoryData[event.index].pk_id;
    this.getRankingCompanyData(this.categoryType, this.subCategoryId);
  }

  totalData: any[] = [];
  totalItems: number = 0;
  totalCount: number = 0;
  collection: any[] = [];
  getRankingCompanyData(type: string, categoryId: number, from?: string, skip?: number) {
    const obj = {
      type: type,
      category_id: categoryId,
      skip: skip ? skip : 0,
      limit: 10
    }
    this.dataloader = true;
    this.collection = [];
    this.noProdFound = false;
    this.api.getRankingCompanyData(obj).subscribe({
      next: (value: any) => {
        this.dataloader = false;
        if(value.status === 200) {
          
          this.collection = value.data;
          
          this.totalCount = value.total_count;
          if(this.collection.length == 0) {
            this.noProdFound = true;
          }
          // if(from !== 'pageChange') {
          //   this.totalData = [];
          //   this.totalItems = 0;
          //   this.showData = [];
          // }
          // this.totalData.push(...value.data);
          // this.totalItems += value.data.length;
          // if(this.showData.length < 1) this.showData = this.totalData.slice(0,10)
          this.noProdFound = this.collection.length < 1;
        } else {
          this.collection = [];
          this.noProdFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.collection = [];
        this.noProdFound = true
        this.dataloader = false;
        console.error(err.message, err.error)
      }
    })
  } 

  // Page Change Event
  onPageChange(event: PageEvent) {
    const skip = event.pageIndex * event.pageSize;
    if (event.pageIndex === Math.ceil(event.length / event.pageSize) - 1) {
      this.getRankingCompanyData(this.categoryType, this.subCategoryId, 'pageChange', this.totalItems);
    }
    this.showData = this.totalData.slice(skip, skip + event.pageSize);
  }

  skipItems: number = 0;
  p: number = 0;
  @ViewChild('productsView') myDivRef!: ElementRef;
  onPageChange2(pageNumber: number) {
    if (this.myDivRef) {
      this.myDivRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 10;
    this.getRankingCompanyData(this.categoryType, this.subCategoryId, 'pageChange', this.skipItems);
    // this.getRecommendProducts(this.categoryId, this.skipItems);
  }

  // For background images 
  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }
  
}

