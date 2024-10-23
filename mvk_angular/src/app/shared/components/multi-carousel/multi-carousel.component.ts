import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Product } from 'src/app/layout/banner/product';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CrudService } from '../../services/crud.service';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-multi-carousel',
  templateUrl: './multi-carousel.component.html',
  styleUrls: ['./multi-carousel.component.scss']
})
export class MultiCarouselComponent {

  @Input('catData') categories!: any[]
  @Input('leastCats') leadCats!: any[]
  @Input() screenName!: any
  @Input() productImages!: string[];
  @Input() allMedia!: {type: string, value: string}[];
  @Output() changeImage = new EventEmitter()
  products: Product[] = [];
  // responsiveOptions;

  customOptions: OwlOptions = {
    loop: false,
    autoplayTimeout: 3000,
    autoplay: false,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    margin: 35,
    animateIn: true,
    animateOut: 'fadeOut',
    dots: false,
    navSpeed: 700,
    navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      300: {
        items: 3.5,
        nav: false,
      },
      740: {
        items: 4.5,
        nav: false,
      },
      940: {
        items: 8
      }
    },
    nav: true
  }
  timedOutCloser: any;

  constructor(private router: Router, private curdService: CrudService, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.screenName == 'home') {
      this.customOptions.responsive = {
        0: {
          items: 2
        },
        400: {
          items: 2
        },
        500: {
          items: 2
        },
        740: {
          items: 4
        },
        940: {
          items: 5
        },
        1200: {
          items: 6
        },
        1400: {
          items: 7
        }
      }
    }
    if (this.screenName == 'productdetails') {
      this.customOptions.margin = 5
      this.customOptions.loop = false;
      this.customOptions.responsive = {
        0: {
          items: 2
        },
        400: {
          items: 2
        },
        740: {
          items: 3
        },
        940: {
          items: 3
        },
      }
    }
    if (this.screenName == 'likedetails') {

      this.customOptions.margin = 20
      this.customOptions.responsive = {
        0: {
          items: 1
        },
        400: {
          items: 2
        },
        740: {
          items: 5
        },
        940: {
          items: 5
        },
        1200: {
          items: 3
        },
        1400: {
          items: 3
        }
      }
    }

    

    // this.getMainCategories();
    // this.getCatDetails();
  }
  mouseEnter(trigger: any) {
    if (trigger && trigger.menuOpen) {
      trigger.closeMenu();
    }
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger: { closeMenu: () => void; }) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 0);
  }

  changeImages(image: string) {
    this.changeImage.emit(image)
  }

  goTo(route: string, id: number) {
    this.router.navigate([`/${route}/${id}`])
  }

  navigate(category: any) {
    const {category_id, category_name} = category;
    if(category_id == 0) {
      // const { parent_id } = category;
      this.loadMore(this.categories[0].category_id);
      return;
    }
    let url = category_name + "-" + category_id;
    this.router.navigate(['/products', url])
  }

  // New category code
  showMore = false;
  loadMore(id?: number) {
    if(!this.showMore) {
      this.sub_cat_name = this.categories[0].category_name;
      this.getLeafCategories(true, id ?? 0, this.sub_cat_name);
    }
    this.showMore = !this.showMore;
  }

  getLeafCategories( children: boolean, id: number, name: string = '') {
    if(!children) {
      this.goTo2('products', id, name);
      return;
    }
    this.sub_cat_name = name;
    this.curdService.getLeafCategories(id).subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.leastCats = value.data.leaf_categories;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  // subCats: any[] = [];
  // subCatLoader = false;
  // getSubCategories(id: number) {
  //   this.subCats = [];
  //   this.subCatLoader = true;
  //   this.curdService.getSubCategoriesV2(id).subscribe({
  //     next: (value: any) => {
  //       this.subCatLoader = false;
  //       this.categoryLoad = false;
  //       if(value.status == 200) {
  //         this.subCats = value.data.sub_categories;
  //       } else {
  //         this.subCats = [];
  //       }
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.subCatLoader = false;
  //       console.error(err.message, err.error);
  //     }
  //   })
  // }

  leastCats: any[] = [];
  leastCatList: any[] = [];
  room_name: string = "";

  fillSubCatList(list: any[], room_name: string) {
    this.room_name = room_name;
    this.leastCats = list;
    this.leastCatList = list[0].sub_cat;
    this.sub_cat_name = list[0].cat_name;
    this.sub_cat_id = list[0].cat_id;
  }

  sub_cat_name: string ='';
  sub_cat_id: number = 0;
  fillLeastCatList(list: any[], cat_name: string) {
    this.sub_cat_name = cat_name;
    this.leastCatList = list;
  }

  goTo2(route: string, id: number, name: string) {
    let category_name = encodeURIComponent(name);
    let url = category_name + "-" + id
    this.router.navigate([route, url]);
  }

  getMainCategories() {
    let data = [{
      "pk_id":46,
      "icon":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/rooms\/1709361803-DALL\u00b7E2024-01-1814.36.34-Aphotorealisticimageofasinglekeyproductfromthe'Electronics'category,specificallyforeducationaluseinIndianschools.Theimagefeatures.png",
      "cat_id":2,
      "cat_name":"Pens",
      "cat_img":"https:\/\/mvk-prd-laravel-media.s3.ap-south-1.amazonaws.com\/admin\/1\/cat_subcat\/rlNGwXkWDBahe4J4ULuFPc6wQA3Icf2bU3pIk54f.png",
      "sub_cat":[{
          "sub_cat_id":3,
          "cat_name":"ball point",
          "cat_img":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/cat_subcat\/1695818349-1672906117ERz7V2.png"
        },
        {
          "sub_cat_id":4,
          "cat_name":"pencil",
          "cat_img":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/cat_subcat\/1695277997-unnamed.png"
        },
        {
          "sub_cat_id":5,
          "cat_name":"eraser",
          "cat_img":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/cat_subcat\/1695818429-1672721398wn2n8B.png"
        }]
      },
      {
        "pk_id":46,
        "icon":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/rooms\/1709361803-DALL\u00b7E2024-01-1814.36.34-Aphotorealisticimageofasinglekeyproductfromthe'Electronics'category,specificallyforeducationaluseinIndianschools.Theimagefeatures.png",
        "cat_id":2,
        "cat_name":"Books",
        "cat_img":"https:\/\/mvk-prd-laravel-media.s3.ap-south-1.amazonaws.com\/admin\/1\/cat_subcat\/rlNGwXkWDBahe4J4ULuFPc6wQA3Icf2bU3pIk54f.png",
        "sub_cat":[{
            "sub_cat_id":3,
            "cat_name":"TextBooks",
            "cat_img":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/cat_subcat\/1695818349-1672906117ERz7V2.png"
          },
          {
            "sub_cat_id":4,
            "cat_name":"Workbooks",
            "cat_img":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/cat_subcat\/1695277997-unnamed.png"
          },
          {
            "sub_cat_id":5,
            "cat_name":"Question Banks",
            "cat_img":"https:\/\/mvk-qa-laravel-media.s3.ap-south-1.amazonaws.com\/super-admin\/cat_subcat\/1695818429-1672721398wn2n8B.png"
          }]
        }
    ];
    // this.menulist = data;
    this.leastCats = [...data];
    this.room_name = data[0].cat_name;
    this.leastCatList = [...this.leastCats[0].sub_cat];
    this.sub_cat_name = this.leastCats[0].cat_name;
  }


  catData: any[] = [];
  categoryLoad: boolean = false;
  getCatDetails(id: number) {
    this.categoryLoad = true;
    this.curdService.getSubCategories(id).subscribe({
      next: (value: any) => {
        this.categoryLoad = false;
        if(value.status == 200) {

        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  
  @ViewChild('videoModal')
  videoModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;
  videoUrl: string = "";
  openVideo(url: string): void {
    this.videoUrl = url;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = '';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogRef = this.dialog.open(this.videoModal, dialogConfig);

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
