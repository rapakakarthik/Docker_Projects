import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-banner',
  templateUrl: './tab-banner.component.html',
  styleUrls: ['./tab-banner.component.scss'],
})
export class TabBannerComponent implements OnInit , AfterViewInit{
  activeId: number = 0;
  subCategoryData: any[] = [];
  subCategoryInfo: any;
  
  constructor(private api: RecommendationService, private router: Router, private renderer: Renderer2) {}
  ngOnInit(): void {
    this.getMainCategory();
  }
  ngAfterViewInit() {
   
    // Attach a scroll event to disable transition
    // mat-mdc-tab-label-container
    // this.renderer.listen(this.tabGroup?._elementRef.nativeElement.children[0].children[1], 'scroll', () => {
    // //  this.removeTabTransition();
    // });
  }
  mainCategoryData: any[] = [];
  mainCategoryInfo: any;
  getMainCategory() {
    this.api.getMainCategory().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          console.log('hai')
          this.mainCategoryData = value.data.main_rooms;
          this.mainCategoryInfo = value.data.info;
          // this.getSubCategory(this.mainCategoryData[0].pk_room_id);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      },
    });
  }

  loader: boolean = true;
  tabtitle:string = '';
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
  getSubCategory1(eve: any) {
    let categoryId;
    console.log(eve)
    this.activeTab=eve;
    this.tabtitle=this.mainCategoryData[eve].room_name
    categoryId = this.mainCategoryData[eve].pk_room_id;
    this.activeId = categoryId;
    this.loader = true;
    this.subCategoryData = [];
    this.api.getSubCategory(categoryId).subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.loader = false;
          this.subCategoryData = value.data.sub_rooms;
          this.subCategoryInfo = value.data.main_room;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        console.error(err.message, err.error);
      },
    });
  }
  // getSubCategory(categoryId: number) {
  //   this.activeId = categoryId;
  //   this.loader = true;
  //   this.subCategoryData = [];
  //   this.api.getSubCategory(categoryId).subscribe({
  //     next: (value: any) => {
  //       if (value.status === 200) {
  //         this.loader = false;
  //         this.subCategoryData = value.data.sub_rooms;
  //         this.subCategoryInfo = value.data.main_room;
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.error(err.message, err.error);
  //     },
  //   });
  // }

  goTo(subCategoryId: number) {
    this.api.postRooms(this.mainCategoryData);
    this.router.navigate(['/recommendations', this.activeId, subCategoryId]);
  }
}
