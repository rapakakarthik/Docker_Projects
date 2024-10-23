import { Component, ElementRef, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MainCatList } from 'src/app/recommendation/recommendation.component';
import { CrudService } from 'src/app/shared/services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manufacture-recommendation',
  templateUrl: './manufacture-recommendation.component.html',
  styleUrls: ['./manufacture-recommendation.component.scss'],
})
export class ManufactureRecommendationComponent implements OnInit {
  manufacturesToShow: any[] = [];
  pageLength: number = 0;
  mfgData: any[] = [];
  noProdFound: boolean = false;
  mainCatList: MainCatList[] = [];
  categoryList: SubCategory[] = [];
  loader: boolean = false;
  //data to pass post API for companyList
  data: ListData = {
    category_id: 0,
    limit: 50,
    skip: 0,
  };

  constructor(private curdService: CrudService) {}
  ngOnInit(): void {
    this.getMainCategories();
  }

  //Main Category only names for displaying purpose
  getMainCategories() {
    this.curdService.getMainCategories().subscribe((res) => {
      if (res.status == 200) {
        this.mainCatList = res.data;
      }
    });
  }

  totalCount: number = 0;
  collection: any[] = [];



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



  onTabClick(event: MatTabChangeEvent) {
    this.activeTab=event.index;
    // this.catId = this.mainCatList[event.index].category_id;
    // this.getAllCategories(this.catId);
    // this.data.category_id = this.catId;
    this.data.category_id = this.mainCatList[event.index].category_id;
    this.catId = 0;
    this.getTopRanking(0, 0);

    //getting company list based on main category id
    // this.curdService.getCompanyList(this.data).subscribe({
    //   next: (res) => {
    //     if (res.status == 200) {
    //       this.loader = false;
    //       this.totalCount = res.data.count;
    //       this.collection = res.data.manufactures;
    //       // this.mfgData = res.data;
    //       // this.pageLength = res.total_count;
    //       // this.manufacturesToShow = this.mfgData.slice(0, 5);
    //     }
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.loader = false;
    //     if ((err.status == 500)) {
    //       this.mfgData = [];
    //       this.noProdFound = true;
    //     }
    //   }
    // });
  }

  onSubTabClick(event: MatTabChangeEvent) {
    this.subActiveTab=event.index;
    let id = this.categoryList[event.index].pk_id;
    this.subChange(id);
  }

  getTopRanking(skip: number, cat_id: number) {
    this.loader = true;
    this.noProdFound = false;
    this.curdService.getTopRanking('manufacture', 1, skip, this.data.category_id, cat_id).subscribe(res => {
      if (res.status == 200) {
        this.loader = false;
        this.categoryList = res.sub_categories;
        if(res.data.manufactures.length == 0) this.noProdFound = true;
        this.totalCount = res.data.count;
        this.collection = res.data.manufactures;
        // this.mfgData = res.data.manufactures
        // this.pageLength = res.total_count
        // this.manufacturesToShow = this.mfgData.slice(0, 5)
      } else {
        this.collection = [];
        this.noProdFound = true;
        this.categoryList = [];
      }
    },
      err => {
        this.loader = false;
        if (err.status = 500) {
          this.collection = []
          this.categoryList = [];
          this.noProdFound = true
        }
    })
  }
  
  //sub categories when clicked on main category by passing the main category ID
  // getAllCategories(id: number) {
  //   let skip = 0;
  //   this.curdService.getTopRanking('manufacture', 1, skip, id).subscribe((res) => {
  //     if (res.status == 200) {
  //       this.CategoryList = res.sub_categories;
  //     }
  //   });
  // }


  //getting company list based on main category id and sub category
  catId: number = 0;
  subChange(cat_id: number) {
    this.catId = cat_id;
    let skip = 0;
    this.curdService.getTopRanking('manufacture', 1, skip, this.data.category_id, cat_id)
      .subscribe((res) => {
        if (res.status == 200) {
          this.totalCount = res.data.count;
          this.collection = res.data.manufactures;
          // this.mfgData = res.data.manufactures;
          // this.pageLength = res.total_count;
          // this.manufacturesToShow = this.mfgData.slice(0, 5);
        }
      });
  }

  // onPageChange(event: any) {
  //   const start = event.pageIndex * event.pageSize;
  //   console.log(event.pageIndex);
  //   this.manufacturesToShow = this.mfgData.slice(start, start + event.pageSize);
  // }

  skipItems: number = 0;
  p: number = 0;
  @ViewChild('productsView') myDivRef!: ElementRef;
  onPageChange2(pageNumber: number) {
    if (this.myDivRef) {
      // this.myDivRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
      const headerHeight = 150; // Replace with the actual height of your header
      const topOffset = this.myDivRef.nativeElement.getBoundingClientRect().top;
      const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollToY = topOffset + scrollPosition - headerHeight;

      window.scroll({
        top: scrollToY,
        behavior: 'smooth'
      });
    }
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 5;
    this.getTopRanking( this.skipItems, this.catId);
  }
}
export interface SubCategory {
  pk_id: number;
  cat_name: string;
}

export interface ListData {
  category_id: number;
  limit: number;
  skip: number;
  user_id?: number;
}
