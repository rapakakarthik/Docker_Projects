import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { RfqHomeComponent } from 'src/app/shared/components/rfq/rfq-home/rfq-home.component';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';
import { Location } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit, OnDestroy { 

  customOptions2: OwlOptions = {
    loop: false,
    autoplayTimeout: 5000,
    slideBy: 1,
    items:6 ,
    autoplay: false,
    autoplaySpeed: 1000,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: true,
    margin: 0,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      250: {
        items: 2,
        
        autoplay: true
        
      },
      1000: {
        items: 6,
      }
    },
    nav: false,
   
  };
  
  constructor( private curdService: CrudService, private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog,
    private api: RecommendationService,
    private location: Location,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.getRouteParams();
  }

  catId: number = 0;
  routeSub!: Subscription
  getRouteParams() {
    this.routeSub = this.route.params.subscribe(params => {
      let url: string = params['id'];
      this.catId = Number(url.slice(url.lastIndexOf("-") + 1));
      this.getCatDetails(this.catId);
      this.getLeastCategories(this.catId);
      this.getProductsDetails(this.catId);
      // this.getHomeTopProducts(this.newProductType);
      this.getTopTypes(this.catId);
    })
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  productLoad:boolean = false;
  productData: any;
  totalProducts: number = 0;
  getProductsDetails(id: number, skip?: number): void { 
    this.productLoad = true
    const data = {
      category_id : id,
      limit: this.limit,
      skip: skip ? skip : 0
    }
    this.curdService.getProductList(data).subscribe({
      next: (res: any) => {
        this.productLoad = false
        if(res.status == 200) {
          this.totalProducts = res.total;
          this.productData = res.data;
        } else{
          this.productData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  skipItems: number = 0;
  p: number = 0;
  limit = 12;
  @ViewChild('productsView') myDivRef!: ElementRef;
  onPageChange(pageNumber: number) {
    this.productData = [];
    if (this.myDivRef) {
      this.myDivRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * this.limit;
    this.getProductsDetails(this.catId, this.skipItems);
  }

  categoryLoad: boolean = false;
  category_details: any;
  // catData1: any[] = [{
  //   category_banner : "https://cdn.pixabay.com/photo/2015/11/19/08/52/banner-1050629__340.jpg",
  //   category_id : 0,
  //   category_image : "",
  //   category_label : "",
  //   category_name : "All",
  //   least_categories: [{
  //     category_id : 0,
  //     category_name : "All",
  //     children_count : 0,
  //     have_children : false,
  //     have_products : false,
  //   }]
  // }];
  catData: any[] = [];
  getCatDetails(id: number) {
    this.categoryLoad = true;
    this.curdService.getSubCategories(id).subscribe({
      next: (value: any) => {
        this.categoryLoad = false;
        if(value.status == 200) {
          this.category_details = value.data.category_details;
          this.setOpenGraphMetaTags(value.data.category_details);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  more_data = {
    category_name: "More",
    category_id: 0,
    category_img: "assets/svg/more_category.svg",
    parent_id: 0
  }
  getSubCategoriesV2(id: number) {
    this.catData = [];
    this.curdService.getSubCategoriesV2(id).subscribe({
      next: (value: any) => {
        this.categoryLoad = false;
        if(value.status == 200) {
          // this.catData = [...this.catData1, ...value.data.subcategory_details];
          // this.catData[0].category_image = value.data.category_details.category_icon;
          this.catData = value.data.sub_categories;
          if(value.data.sub_categories.length > 0 && this.leastCats.length > 8) {
            this.leastCats = this.leastCats.slice(0,7);
            this.leastCats.push({category_id: 0, category_img: '../../../../assets/images/icons/more_cat.png', category_name: 'More'})
          }
          // this.catData.push({category_id: 0, category_img: '../../../../assets/images/icons/more_cat.png', category_name: 'More'})
          // if(this.catData.length > 1) {
          //   this.more_data.parent_id = id;
          //   this.catData.push(this.more_data);
          // }
          this.generateProductSchemaV2(value.data.sub_categories);
        } else {
          this.catData = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.categoryLoad = false;
        console.error(err.message, err.error);
      }
    })
  }

  leastCats: any[] = [];
  getLeastCategories(id: number) {
    this.catData = [];
    this.curdService.getLeafCategories(id).subscribe({
      next: (value: any) => {
        this.categoryLoad = false;
        if(value.status == 200) {
          this.leastCats = value.data.leaf_categories;
          this.getSubCategoriesV2(this.catId);
          this.generateProductSchemaV2(value.data.leaf_categories);
        } else {
          this.leastCats = [];
        }
      },
      error: (err: HttpErrorResponse) => {
        this.categoryLoad = false;
        console.error(err.message, err.error);
      }
    })
  }
  

  //Source by store type
  storeloader: boolean = false
  sources : SourceType[] = [];
  getSourceByStoreType() {
    this.storeloader = true
    this.curdService.getSourceByStore().subscribe({
      next: (res: any) => {
        this.storeloader = false
        if (res.status == 200) {
          this.sources = res.data.types
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  // selectedChipIndex: number = 0;
  // newProductType: string = 'top_search';
  // tabChange(id: string, index: number) {
  //   this.selectedChipIndex = index;
  //   this.newProductType = id;
  //   this.getHomeTopProducts(this.newProductType);
  // }
  
  // newProductLoader: boolean = true;
  // newProductData: any[] = [];
  // newProductInfo: any[] = [];
  // newProductTitle: string = '';
  // getHomeTopProducts(type: string) {
  //   this.newProductLoader = true;
  //   this.newProductData = [];
  //   this.api.getHomeTopProducts(type, this.catId).subscribe({
  //     next: (res: any) => {
  //       this.newProductLoader = false;
  //       if (res.status === 200) {
  //         if(!this.newProductTitle) this.newProductTitle = res.info.title;
  //         if(this.newProductInfo.length === 0) this.newProductInfo = [...res.info.types];
  //         this.newProductData = [...res.data];
  //       }
  //     },  
  //     error: (err: HttpErrorResponse) => {
  //       this.newProductLoader = false;
  //       console.error(err.message, err.error);
  //     },
  //   })
  // }

  
  topProductTypes: any = [];
  topProductTitle = '';
  topCompanyTypes: any[] = [];
  topCompanyTitle: string = '';
  recommendSupplierLoad = true;
  getTopTypes(catId: number) {
    this.api.getCompanySpotlights(catId).subscribe({
      next: (value: any) => {
        this.recommendSupplierLoad = false;
        if (value.status === 200) {
          if(Object.keys(value.data.company).length > 0) {
            this.topCompanyTypes = value.data.company.recommendation_types;
            this.topCompanyTitle = value.data.company.title;
          }
          if(Object.keys(value.data.product).length > 0) {
          this.topProductTypes = value.data.product.recommendation_types;
          this.topProductTitle = value.data.product.title;
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.recommendSupplierLoad = false;
        console.error(err.message, err.error);
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
      data: this.location.path()
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
  
  dialogRef: any;
  openRFQForm() {
    if (!localStorage.getItem('token')) {
      this.openDialog();
    } else {
      this.dialogRef = this.dialog.open(RfqHomeComponent, {
        width: '1000px'
      });
      this.dialogRef.afterClosed().subscribe((_result: any) => {});
    }
  }

  goToRfqQuote() {
    this.router.navigateByUrl("/rfq-quote")
  }

  // gotonavigation(p: any) {
  //   let idlink = this.newProductType;
  //   let idlink1 = p.cat_id;
  //   let category_name: string = p.cat_name;
  //   category_name = encodeURIComponent(category_name).toLowerCase();
  //   // category_name = category_name.replaceAll(" ", "-").toLowerCase();
  //   let url = category_name + "-" + idlink1;
  //   this.router.navigate(['/category', idlink, url]);
  //   // this.router.navigate(['/category', idlink, idlink1]);
  // }

  goTo(route: string) {
    this.router.navigate(['category/topranking', route])
  }

  categorySchema: any;
  generateProductSchema(main_cats: any[]): void {
    let cats: any[] = main_cats.map(main_cat => {
      if(main_cat.least_categories.length > 1) {
        return main_cat.least_categories.map((least_cat: any) => {
          return {cat_name: least_cat.category_name, cat_id: least_cat.category_id};
        })
      }else {
        return {cat_name: main_cat.category_name, cat_id: main_cat.category_id};
      }
    });
    let itemList = cats.map((cat: any, index: number) => {
      return {
        "@type": "ListItem",
        "position": index+1,
        "item": {
          "@id": `https://www.myverkoper.com/category/${ cat.cat_name}-${ cat.cat_id}`,
          "name": cat.cat_name,
          "description": `Find a wide selection of ${cat.cat_name } products from top suppliers on MyVerkoper - the B2B e-commerce marketplace for school procurement.`
        }
      }
    })

    this.categorySchema = {
      "@context": "http://schema.org",
      "@type": "ItemList",
      "name": "Product Categories",
      "description": "List of product categories",
      "itemListElement": itemList
    }
    this.appendJsonLdScript();
  }

  generateProductSchemaV2(cats: any[]): void {
    let itemList = cats.map((cat: any, index: number) => {
      return {
        "@type": "ListItem",
        "position": index+1,
        "item": {
          "@id": `https://www.myverkoper.com/category/${ cat.category_name}-${ cat.category_id}`,
          "name": cat.category_name,
          "description": `Find a wide selection of ${cat.category_name } products from top suppliers on MyVerkoper - the B2B e-commerce marketplace for school procurement.`
        }
      }
    })

    this.categorySchema = {
      "@context": "http://schema.org",
      "@type": "ItemList",
      "name": "Product Categories",
      "description": "List of product categories",
      "itemListElement": itemList
    }
    this.appendJsonLdScript();
  }

  private appendJsonLdScript(): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(this.categorySchema);
    document.head.appendChild(script);
  }

  setOpenGraphMetaTags(categoryData: any) {
    let category_name = <string>categoryData.category_name;
    category_name = encodeURIComponent(category_name).toLowerCase();
    const description = `Shop now for top-quality ${categoryData.category_name} at MyVerkoper. Explore a wide range of educational products and find everything you need for your institution`;
    let url = 'https://www.myverkoper.com/category/' + category_name + "-" + categoryData.category_id;

    this.meta.updateTag({ name: "og:url", property: 'og:url', content: url });
    this.meta.updateTag({ name: 'og:title', property: 'og:title', content: categoryData.meta_title || categoryData.category_name});
    this.meta.updateTag({ name: 'og:description', property: 'og:description',  content: categoryData.meta_description || description });
    this.meta.updateTag({ name: 'og:image', property: 'og:image', itemprop: "image", content: categoryData.category_icon });
    this.meta.updateTag({ name: 'description',  content: categoryData.meta_description || description });
    this.meta.updateTag({ name: 'keywords',  content: categoryData.meta_keywords || categoryData.category_name });

    this.meta.updateTag({ name: 'twitter:title', content: categoryData.meta_title || categoryData.category_name});
    this.meta.updateTag({ name: 'twitter:image', content: categoryData.category_icon });
    this.meta.updateTag({ name: 'twitter:description',  content: categoryData.meta_description || description });
  }

  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }
  
}

interface SourceType {
  id : number,
  name : string,
  image : string
}
