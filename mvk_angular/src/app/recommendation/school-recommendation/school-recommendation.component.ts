import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';

@Component({
  selector: 'app-school-recommendation',
  templateUrl: './school-recommendation.component.html',
  styleUrls: ['./school-recommendation.component.scss']
})
export class SchoolRecommendationComponent implements OnInit{
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('subTabGroup') subTabGroup!: MatTabGroup;
  showData: any[] = [];
  productLoad: boolean = false;
  disabled: boolean = true;
  loader: boolean = false;
  dataloader: boolean = false;

  constructor(private route: ActivatedRoute, private api: RecommendationService) {}  
  ngOnInit(): void {
    this.getRouteParams();
  }

  getRouteParams() {
    this.route.params.subscribe(params => {
      let url1: string = params['schoolId'];
      let productId1 = Number(url1.slice(url1.lastIndexOf("-") + 1));
      let url2: string = params['subSchoolId'];
      let productId2 = Number(url2.slice(url2.lastIndexOf("-") + 1));

      this.schoolId = productId1; //for getting sub categories
      this.subSchoolId = productId2;  //for getting products 
      this.schoolIndex = this.schoolId; //for selecting tab by default
      this.subSchoolIndex = this.subSchoolId; //for selecting tab by default
      this.getMainCategory();
      if(this.schoolId == 1) this.getSubCategory(this.schoolId);
    })
  }

  // Main Class Categories called after component initalization
  mainCategoryData: any[] = [];
  mainCategoryInfo: any;
  schoolIndex: number = 0;
  getMainCategory() {
    this.loader = true
    this.api.getSchools().subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.loader = false;
          this.mainCategoryData = value.data.schools;
          this.mainCategoryInfo = value.data.info;
          if(this.schoolIndex) {
            this.selectedTabSchoolIndex = this.mainCategoryData.findIndex(obj => obj.pk_school_id == this.schoolIndex);
            this.selectTab(this.selectedTabSchoolIndex);
            this.schoolIndex = 0;
          } else {
            this.selectedTabSchoolIndex = 0;
            this.selectTab(this.selectedTabSchoolIndex);
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false
        console.error(err.message, err.error)
      }
    })
  }

  selectTab(tabIndex: number) {
    setTimeout(() => {
      if(this.tabGroup) {
        this.tabGroup.selectedIndex = tabIndex;
      }  
    })
  }

  // Sub Class Categories called after component initalization and after every time cliked on main category
  schoolId: number = 0;
  subSchoolId: number = 0;
  subCategoryData: any[] = [];
  subSchoolIndex: number = 0;
  selectedTabSubSchoolIndex: number = 0;
  selectedTabSchoolIndex: number = 0;
  getSubCategory(categoryId: number) {
    this.schoolId = categoryId;
    // this.subSchoolId = 0;
    // this.getSchoolProducts(this.schoolId, 0);
    this.api.getSubSchools(categoryId).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.subCategoryData = value.data.categories;
          if(this.subSchoolIndex) {
            this.selectedTabSubSchoolIndex = this.subCategoryData.findIndex(obj => obj.category_id == this.subSchoolIndex) + 1;
            this.selectSubTab(this.selectedTabSubSchoolIndex);
            this.subSchoolIndex = 0;
          } else {
            this.selectedTabSubSchoolIndex = 0;
            this.selectSubTab(this.selectedTabSubSchoolIndex);
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error)
      }
    })
  }

  getSubCategory2(eve: any) {
    let categoryId = this.mainCategoryData[eve].pk_school_id;
    this.getSubCategory(categoryId);
  }  

  selectSubTab(tabIndex: number) {
    if(this.subTabGroup) {
      this.subTabGroup.selectedIndex = tabIndex;
    }
  }

  onTabClick(event: MatTabChangeEvent) {
    if(event.index === 0) this.subSchoolId = 0;
    else this.subSchoolId = this.subCategoryData[event.index - 1].category_id;
    setTimeout(() => {
      this.getSchoolProducts(this.schoolId, this.subSchoolId);
    }, 0)
  }

  //School Products called after every time clicked on main category and sub category
  totalData: any[] = [];
  totalItems: number = 0;
  totalCount: number = 0;
  collection: any[] = [];
  noProdFound: boolean = false;
  getSchoolProducts(mainId: number, category_id: number, skip?: number) {
    this.noProdFound = false;
    const obj = {
      school_id: mainId,
      category_id: category_id ? category_id : null,
      skip: skip ?? 0,
      limit: 10,
      search: '',
      user_id: 0
    }
    this.dataloader = true;
    // if(this.showData.length < 1) {
    // }
    this.collection = [];
    this.api.getSchoolProducts(obj).subscribe({
      next: (value: any) => {
        this.dataloader = false;
        if(value.status === 200) {
          this.collection = value.data.products;
          this.totalCount = value.count;
          this.noProdFound = this.collection.length < 1;
        } else {
          this.noProdFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.noProdFound = true;
        this.dataloader = false;
        console.error(err.message, err.error)
      }
    })
  }
  
  // onPageChange(event: PageEvent) {
  //   const skip = event.pageIndex * event.pageSize;
  //   if (event.pageIndex === Math.ceil(event.length / event.pageSize) - 1) {
  //     this.getSchoolProducts(this.schoolId, this.subSchoolId, 'pageChange', this.totalItems);
  //   }
  //   this.showData = this.totalData.slice(skip, skip + event.pageSize);
  // }

  skipItems: number = 0;
  p: number = 0;
  @ViewChild('productsView') myDivRef!: ElementRef;
  onPageChange2(pageNumber: number) {
    // if (this.myDivRef) {
    //   this.myDivRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    // }
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 10;
    this.getSchoolProducts(this.schoolId, this.subSchoolId, this.skipItems);
    window.scrollTo(0, 0);
    // this.getRecommendProducts(this.categoryId, this.skipItems);
  }
}  




