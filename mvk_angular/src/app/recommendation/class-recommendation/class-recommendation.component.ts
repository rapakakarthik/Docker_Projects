import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-class-recommendation',
  templateUrl: './class-recommendation.component.html',
  styleUrls: ['./class-recommendation.component.scss']
})
export class ClassRecommendationComponent implements OnInit{
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  // @ViewChild('subTabGroup') subTabGroup!: MatTabGroup;
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
      let url: string = params['classId'];
      this.classId = Number(url.slice(url.lastIndexOf("-") + 1)); //for getting sub categories
      this.classIndex = this.classId; //for selecting tab by default
      this.getClasses();
      // if(this.classId == 11) 
        this.getSubClasses(this.classId);
    })
  }

  // Main Room Categories called after component initalization
  mainCategoryData: any[] = [];
  classIndex: number = 0;
  selectedTabClassIndex: number = 0;
  getClasses() {
    this.loader = true
    this.api.getClasses().subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.loader = false;
          this.mainCategoryData = value.data.classes;
          if(this.classIndex) {
            this.selectedTabClassIndex = this.mainCategoryData.findIndex(obj => obj.pk_class_id == this.classIndex);
            this.selectTab(this.selectedTabClassIndex);
            this.classIndex = 0;
          } else {
            this.selectedTabClassIndex = 0;
            this.selectTab(this.selectedTabClassIndex);
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
    },0)
  }

  // Sub Room Categories called after component initalization and after every time cliked on main category
  classId: number = 0;
  subClassId: number = 0;
  subCategoryData: any[] = [];
  filters: any[] = [];
  subCategoryInfo: any;
  subRoomIndex: number = 0;
  selectedTabSubRoomIndex: number = 0;
  getSubClasses(categoryId: number) {
    this.classId = categoryId
    this.api.getSubClasses(this.classId).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.subCategoryData = value.data.categories;
          if(this.subCategoryData.length === 0) {
            this.nodata = true;
            this.collection = [];
            this.filters = [];
          }
          this.filters = this.subCategoryData[0].filters;
          this.subCategoryInfo = value.data.main_class;
          this.subRoomIndex = 0
          // setTimeout(() => {
          //   this.subTabGroup.selectedIndex = 0;
          // }, 1000)
          if(this.filters.length > 0) {
            this.filterId = this.filters[0].id;
          }
          this.subClassId = this.subCategoryData[0].category_id;
          this.getClassProducts(this.classId, this.subClassId);
        } else {
          this.nodata = true
          this.collection = [];
          this.subCategoryData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error)
      }
    })
  }

  classFirst = true;


/* code here */
@ViewChild('subTabGroup')
subTabGroup!: any;
@ViewChild('subTabGroup1')
subTabGroup1!: any;

activeTab = 0;
activeIndex=0;
subActiveIndex=0;
subActiveTab = 0;
subActiveIndex1=0;
subActiveTab1 = 0;
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

setSubActiveTab1(index:any)
{
  this.subActiveIndex1=index;
  this.subTabGroup1.selectedIndex = this.subActiveIndex1;
}

/* code end here */




  getSubClasses2(eve: any) {
    this.activeTab=eve;
    this.classId = this.mainCategoryData[eve].pk_class_id;
    if(!this.classFirst) {
      this.getSubClasses(this.classId);
    } else {
      this.classFirst = false;
    }
  }
  
  onTabClick(event: MatTabChangeEvent) {
    // if(event.index === 0) this.subClassId = 0;
    // else 
    this.subActiveTab=event.index
    let category = this.subCategoryData[event.index]
    this.subClassId = category.category_id;
    this.filters = category.filters;
    if(category.filters && category.filters.length > 0) {
      this.filterId = category.filters[0].id;
    }
    this.getClassProducts(this.classId, this.subClassId);
  }

  onFilterChange(event: MatTabChangeEvent) {
    this.subActiveTab1=event.index
    let filter = this.filters[event.index]
    this.filterId = filter.id;
    this.getClassProducts(this.classId, this.subClassId);
  }

  //Room Products called after every time clicked on main category and sub category
  totalCount: number = 0;
  collection: any[] = [];
  nodata = false;
  filterId = 0;
  getClassProducts(mainId: number, category_id: number,  skip: number = 0) {
    this.collection = [];
    const obj = {
      class_id: mainId,
      category_id: category_id,
      skip: skip,
      limit: 10,
      search: '',
      user_id: 0,
      filter_id: this.filterId
    }
    this.dataloader = true;
    this.api.getClassProducts(obj).subscribe({
      next: (value: any) => {
        this.dataloader = false;
        if(value.status === 200) {
          this.totalCount = value.count;
          this.collection = value.data.products;
          this.nodata = !this.collection.length
        }
        else {
          this.nodata = true
          this.collection = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.nodata = true
        this.collection = [];
        this.dataloader = false;
        console.error(err.message, err.error)
      }
    })
  }

  p: number = 0;
  onPageChange2(pageNumber: number) {
    window.scroll(0,0);
    this.p = pageNumber;
    let skipItems = (pageNumber - 1) * 10;
    this.getClassProducts(this.classId, this.subClassId, skipItems);
  }
}  




