import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';

@Component({
  selector: 'app-room-recommendation',
  templateUrl: './room-recommendation.component.html',
  styleUrls: ['./room-recommendation.component.scss']
})
export class RoomRecommendationComponent implements OnInit  {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('subTabGroup') subTabGroup!: MatTabGroup;
  @ViewChild('leastTabGroup') leastTabGroup!: MatTabGroup;
  showData: any[] = [];
  productLoad: boolean = false;
  disabled: boolean = true;
  dataloader: boolean = false;

  constructor(private route: ActivatedRoute, private api: RecommendationService) {}  

  ngOnInit(): void {
    this.getRouteParams();
  }

  roomIndex: number = 0;
  getRouteParams() {
    this.route.params.subscribe(params => {
      let url1: string = params['roomId'];
      let productId1 = Number(url1.slice(url1.lastIndexOf("-") + 1));

      let url2: string = params['subRoomId'];
      let productId2 = Number(url2.slice(url2.lastIndexOf("-") + 1));

      this.mainRoomId = productId1 //for getting sub categories
      this.subRoomId = productId2  //for getting products 
      this.roomIndex = productId1 //for selecting tab by default
      this.subRoomIndex = productId2 //for selecting tab by default
      this.getMainCategory();
      this.getSubCategory(this.mainRoomId);
    })
  }

  // Main Room Categories called after component initalization
  mainCategoryData: any[] = [];
  loader: boolean = false;
  getMainCategory() {
  this.loader = true
    this.api.getMainCategory().subscribe({
      next: (value: any) => {
        this.loader = false;
        if(value.status === 200) {
          this.mainCategoryData = value.data.main_rooms;
            this.selectedTabRoomIndex = this.mainCategoryData.findIndex(obj => obj.pk_room_id == this.roomIndex);
            this.selectTab(this.selectedTabRoomIndex);
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

  // Sub Room Categories called after component initalization and after every time cliked on main category
  mainRoomId: number = 0;
  subRoomId: number = 0;
  subCategoryData: any[] = [];
  subRoomIndex: number = 0;
  selectedTabSubRoomIndex: number = 0;
  selectedTabRoomIndex: number = 0;
  getSubCategory(categoryId: number) {
    this.mainRoomId = categoryId;
    this.api.getSubCategory(categoryId).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.subCategoryData = value.data.sub_rooms;
          if(this.subRoomIndex) {
            this.selectedTabSubRoomIndex = this.subCategoryData.findIndex(obj => obj.pk_sub_id == this.subRoomIndex) + 1;
            setTimeout(() => {
              this.selectSubTab(this.selectedTabSubRoomIndex);
            })
            this.subRoomIndex = 0;
          } else {
            this.subRoomId = 0;
            this.selectedTabSubRoomIndex = 0;
            this.selectSubTab(this.selectedTabSubRoomIndex);
          }
          this.getRoomProducts(this.mainRoomId, this.subRoomId);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error)
      }
    })
  }



/* code here */

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
  this.leastTabGroup.selectedIndex = this.subActiveIndex1;
}

/* code end here */




  getSubCategory2(eve: any) {
    
    this.activeTab=eve;
    let categoryId = this.mainCategoryData[eve].pk_room_id;
    this.getSubCategory(categoryId);
  }  

  selectSubTab(tabIndex: number) {
      if(this.subTabGroup) {
        this.subTabGroup.selectedIndex = tabIndex;
      }
  }

  onTabClick(event: MatTabChangeEvent) {
    
    this.subActiveTab=event.index
  if (this.leastTabGroup) 
  {
    this.leastTabGroup.selectedIndex = 0;
  } 
    if(event.index === 0) this.subRoomId = 0;
    else this.subRoomId = this.subCategoryData[event.index - 1].pk_sub_id;
    this.getRoomProducts(this.mainRoomId, this.subRoomId);
  }

  //Room Products called after every time clicked on main category and sub category
  leastCategories: any[] = [];
  clearData: boolean = false;
  previousKeyword: string = 'trending';
  totalData: any[] = [];
  totalItems: number = 0;
  totalCount: number = 0;
  collection: any[] = [];
  noDataFound = false;
  getRoomProducts(mainId: number, subId: number,  category_id?: number, skip?: number) {
    this.dataloader = true;
    this.noDataFound = false;
    const obj = {
      main_room: mainId,
      sub_room: subId ? subId : null,
      category_id: category_id ? category_id : null,
      skip: skip ? skip : 0,
      limit: 15,
      search: '',
      user_id: 0
    }
    if(this.showData.length < 1) {
      // this.dataloader = true;
    }
    this.api.getRoomProducts(obj).subscribe({
      next: (value: any) => {
        
        this.dataloader = false;
        if(value.status === 200) {
          this.leastCategories = value.data.categories;
          this.collection = value.data.products;
          if(this.collection.length == 0) {
            this.noDataFound = true;
          }
          this.totalCount = value.count;
          // if(from !== 'pageChange') {
          //   this.totalData = [];
          //   this.totalItems = 0;
          //   this.showData = [];
          // }
          // this.totalData.push(...value.data.products);
          // this.totalItems += value.data.products.length;
          // if(this.showData.length < 1) {
          //   this.showData = this.totalData.slice(0,18)
          // }
        }
        else {
          this.noDataFound = true;
          this.collection = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.dataloader = false;
        this.noDataFound = true;
        console.error(err.message, err.error)
      }
    })
  }

  categoryId: number = 0;
  getLeastCategory(eve: any) {
    this.subActiveTab1=eve
    if(eve === 0) this.categoryId = 0;
    else this.categoryId = this.leastCategories[eve - 1].category_id;
    this.p = 0;
    this.getRoomProducts(this.mainRoomId, this.subRoomId,  this.categoryId);
  }
  
  // onPageChange(event: PageEvent) {
  //   const skip = event.pageIndex * event.pageSize;
  //   if (event.pageIndex === Math.ceil(event.length / event.pageSize) - 1) {
  //     this.getRoomProducts(this.mainRoomId, this.subRoomId, 'pageChange', 0, this.totalItems);
  //   }
  //   this.showData = this.totalData.slice(skip, skip + event.pageSize);
  // }

  skipItems: number = 0;
  p: number = 0;
  onPageChange2(pageNumber: number) {
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 15;
    this.getRoomProducts(this.mainRoomId, this.subRoomId, 0, this.skipItems);
    window.scrollTo(0, 0);
  }
}  




