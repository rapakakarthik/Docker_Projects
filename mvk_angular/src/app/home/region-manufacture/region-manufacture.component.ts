import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MainCatList } from 'src/app/recommendation/recommendation.component';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-region-manufacture',
  templateUrl: './region-manufacture.component.html',
  styleUrls: ['./region-manufacture.component.scss'],
})
export class RegionManufactureComponent implements OnInit {
  manufacturesToShow: any[] = [];
  pageLength: number = 0;
  // mfgData: any[] = [];
  noProdFound: boolean = false;
  mainCatList: MainCatList[] = [];
  CategoryList: SubCategory[] = [];
  loader: boolean = false;
  //data to pass post API for companyList
  data: ListData = {
    category_id: 0,
    limit: 50,
    skip: 0,
  };

  constructor(
    private curdService: CrudService,
    private route: ActivatedRoute,
    private  meta: Meta
  ) {}
  datanew = [
    {
      banner_image: './../../../../assets/images/regionbg.jpg',
      background_color: 'rgb(99 179 248)',
      title: 'The Pavilion for ',
      banner_title_color: '#fff',
      banner_sub_title: 'Popular Products from Prominent Vendor Partners',
    },
  ];
  ngOnInit(): void {
    this.getRouteParams();
  }

  regionName: string = '';
  getRouteParams() {
    this.route.params.subscribe((params) => {
      this.regionName = params['id'];
      this.getMainCategories(this.regionName);
      this.setOpenGraphMetaTags(this.regionName);
      this.datanew[0].title = this.datanew[0].title + this.regionName;
    });
  }

  //sub categories when clicked on main category by passing the main category ID
  // getAllCategories(id: number) {
  //   this.curdService.getTopRanking('manufacture', 1, 15, id).subscribe(res => {
  //     if (res.status == 200) {
  //       this.CategoryList = res.sub_categories
  //     }
  //   })
  // }

  //Main Category only names for displaying purpose
  getMainCategories(state: string) {
    this.loader = true;
    this.noProdFound = false;
    this.curdService.getMainCategoriesState(state).subscribe((res) => {
      this.loader = false;
      if (res.status == 200) {
        this.mainCatList = res.data;
        if(res.data.length == 0) {
          this.noProdFound = true;
        }
      } else {
        this.noProdFound = true;
      }
    });
  }

  totalCount: number = 0;
  collection: any[] = [];




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
    // this.catId = this.mainCatList[event.index].category_id;
    // this.getAllCategories(this.catId);
    this.data.category_id = this.mainCatList[event.index].category_id;
    //getting company list based on main category id
    this.catId = 0;
    this.getTopRanking(0, 0);
  }

  getTopRanking(skip: number, cat_id: number) {
    this.loader = true;
    this.collection = [];
    this.curdService.getTopRanking('manufacture',1,skip,this.data.category_id,cat_id,this.regionName).subscribe({
      next: (res) => {
        this.loader = false;
        if (res.status == 200) {
          this.CategoryList = res.sub_categories;
          this.noProdFound = res.data.manufactures.length == 0;
          this.totalCount = res.data.count;
          this.collection = res.data.manufactures;
          if(this.collection.length <= 0) {
            this.noProdFound = true;
          }
          // this.mfgData = res.data.manufactures
          // this.pageLength = res.total_count
          // this.manufacturesToShow = this.mfgData.slice(0, 5)
        } else {
          this.noProdFound = true;
        }
      },
      error: (err) => {
        this.loader = false;
        if ((err.status = 500)) {
          // this.mfgData = [];
          this.noProdFound = true;
        }
      }
    });
  }

  //getting company list based on main category id and sub category
  catId: number = 0;
  subChange(cat_id: number) {
    this.catId = cat_id;
    let skip = 0;
    this.curdService
      .getTopRanking(
        'manufacture',
        1,
        skip,
        this.data.category_id,
        cat_id,
        this.regionName
      )
      .subscribe((res) => {
        if (res.status == 200) {
          this.totalCount = res.data.count;
          this.collection = res.data.manufactures;
          // this.mfgData = res.data.manufactures
          // this.pageLength = res.total_count
          // this.manufacturesToShow = this.mfgData.slice(0, 5)
        }
      });
  }

  skipItems: number = 0;
  p: number = 0;
  @ViewChild('productsView') myDivRef!: ElementRef;
  onPageChange2(pageNumber: number) {
    // const container = this.myDivRef.nativeElement;
    // this.renderer.setProperty(container, 'scrollTop', 0);
    if (this.myDivRef) {
      // this.myDivRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
      const headerHeight = 150; // Replace with the actual height of your header
      const topOffset = this.myDivRef.nativeElement.getBoundingClientRect().top;
      const scrollPosition =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const scrollToY = topOffset + scrollPosition - headerHeight;

      window.scroll({
        top: scrollToY,
        behavior: 'smooth',
      });
    }
    // window.scrollTo(0, 0);
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 5;
    this.getTopRanking(this.skipItems, this.catId);
  }

  setOpenGraphMetaTags(regionName: string) {
    const description = `Discover tailored solutions for educational procurement in ${regionName} with MyVerkoper. Elevate your institution's sourcing experience. Explore our services in your region!`
    const url = `https://www.myverkoper.com/region/${regionName}`;
    const title = `Explore MyVerkoper in ${regionName} - Buy Educational Supplies Online in India`;
    this.meta.updateTag({ name: "og:url", property: 'og:url', content: url });
    this.meta.updateTag({ name: 'og:title', property: 'og:title', content: title});
    this.meta.updateTag({ name: 'og:description', property: 'og:description',  content: description });
    this.meta.updateTag({ name: 'description',  content: description });
    this.meta.updateTag({ name: 'keywords',  content: ""});

    this.meta.updateTag({ name: 'twitter:title', content: title});
    this.meta.updateTag({ name: 'twitter:description',  content: description });
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
