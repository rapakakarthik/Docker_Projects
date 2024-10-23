import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterComponent } from '../filter/filter/filter.component';
import { CrudService } from '../shared/services/crud.service';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss'],
})
export class ProductListingComponent implements OnInit {
  @ViewChild(FilterComponent) filter!: FilterComponent;
  checkedData: {name: string, id: number}[] = [];
  filterData!: Array<Object>;
  loader: boolean = true;
  mobilefilterOpen: boolean = false;

  router = inject(Router);

  constructor(
    private _crud: CrudService,
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.getRouteParams();
  }
 
  itemType: string = "";
  category_id!: number;
  category_name = "";
  getRouteParams() {
    this.route.paramMap.subscribe((params) => {
      let url: string = params.get('category_id') ?? "";
      this.category_name = url.slice(0, url.lastIndexOf("-"));
      this.category_id = Number(url.slice(url.lastIndexOf("-") + 1));
      this.itemType = params.get('viewtype') ?? 'grid';
      this.getCategoryProducts(this.category_id);
    });
  }

  totalCount: number = 0;
  collection: any[] = [];
  searchdetails = {
    category_id: 0,
    filters: [],
    limit: 12,
    skip: 0,
    type: "product",
    customizable : "all"
  };
  getProuctListData(): void {
    if(this.collection.length < 1) {
      this.loader = true;
    }
    this.searchdetails.category_id = this.category_id;
    //Calling Product List API by passing Search Details as header
    this.getProducts(this.searchdetails);
  }

  noDataFound: boolean = false;
  hideChips: boolean = false;
  // checkurl: boolean = false;
  msg: string = '';
  showProducts = true;
  recommendedProducts: RecommendedProduct[] = [];
  getProducts(details: any) {
    this.noDataFound = false;
    this.hideChips = false;
    this.collection = [];
    this.loader = true;
    this._crud.getProductListV2(details).subscribe({
      next: (result: any) => {
        this.loader = false;
        // this.showProducts = this.searchdetails.type == 'product';
        if (result.status == 200) {
          this.msg = result.message;
          this.collection = []
          this.totalCount = result.total;
          this.collection = result.data;
          // this.categoryHierarchy = result.category_hierarchy;
          if (!(this.collection.length > 0)) {
            this.noDataFound = true;
            this.recommendedProducts = result.recommendations.map((product: any) => this.alterRecommededProduct(product));
          }
        } else{
          this.noDataFound = true;
          // this.checkurl = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.showProducts = this.searchdetails.type == 'product';
        this.noDataFound = true;
        this.loader = false;
        console.error(error.error, error.message);
      }
    });
  }

  filterloader: boolean = false;
  getProductFilters() {
    this.filterloader = true;
    //Calling Filters API by passing category ID
    this._crud.getFiltersDynamic({ keyword: '', type: this.searchdetails.type, id: this.category_id}).subscribe({
      next: (res: any) => {
        this.filterloader = false;
        if (res.status == 200) {
          this.filterData = res.data.filter_data;
          this.getProductCatList(this.category_id);
          // this.categoryHierarchy = (res.category as Category[]);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.filterloader = false;
        console.error(err.error, err.message)
      }
    });
  }

  getProductCatList(id: number){
    this._crud.getProductCat(id).subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.categoryHierarchy = value.data.hierarchy;
        }
      },
      error: (err) => {
        
      },
    })
  }

  getFilteredData(event: any) {
    this.checkedData = event[1];
    this.searchdetails.filters = event[0];
    this.searchdetails.skip = 0;
    this.p = 0;
    this.getProductListApi();
    this.getFiltersDynamic(this.searchdetails.category_id, this.searchdetails.filters);
  }

  getFiltersDynamic(id: number, filters: any[]) {
    this.filterloader = true;
    this.filterData = [];
    this._crud.getFiltersDynamic({ keyword: '', type: this.searchdetails.type, id, filters }).subscribe({
      next: (res: any) => {
        this.filterloader = false;
        if (res.status == 200) {
          this.filterData = res.data.filter_data;
        }
        else {
          this.filterData = [];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.filterloader = false;
        this.filterData = [];
        console.error(error.message);
      }
    });
  }

  clearFilter(check: {name: string, id: number}) {
    this.filter.checkboxForm.get(check.id.toString())?.setValue(false);
    this.checkedData = this.checkedData.filter(checked => check.id !== checked.id);
    this.searchdetails.filters = this.searchdetails.filters.filter((res: Filter) => res.filter_option_id !== check.id);
    this.searchdetails.skip = 0;
    this.p = 0;
    this.getProductListApi();
  }

  clearFilters() {
    this.filter.checkboxForm.reset();
    this.searchdetails.filters = [];
    this.checkedData = [];
    this.searchdetails.skip = 0;
    this.p = 0;
    this.getProductListApi();
  }

  getProductListApi() {
    this.getProducts(this.searchdetails)
  }
  
  filterIconfn() {
    this.mobilefilterOpen = true;
  }
  backto() {
    this.mobilefilterOpen = false;
  }

  // change pagination
  skipItems: number = 0;
  p: number = 0;
  onPageChange2(pageNumber: number) {
    window.scrollTo(0, 0);
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 12;
    this.searchdetails.skip = this.skipItems;
    this.getProducts(this.searchdetails);
  }

  // Navigation to category page 
  categoryHierarchy: Category[] = [];
  navToCat(id: number, name: string) {
    let url = '/category/' + encodeURIComponent(name).toLowerCase() + '-' + id;
    this.router.navigate([url]);
  }

  // getting products based on category Id
  getCategoryProducts(id: number) {
    this.category_id = id;
    this.getProuctListData();
    this.getProductFilters();
  }

  // list and grid view
  viewClass: "list_view" | "grid_view" = 'grid_view'; // Default class
  changeView(type: "list_view" | "grid_view"): void {
    this.viewClass = type;
  }

  // setting seller details for chat now and send inquiry
  getSellerDetails(det: any) {
    let sellerDetails = {
      productName: det.product_name,
      sellerAccountId: det.seller_account_id,
      sellerId: det.seller_id,
      companyName: det.company_name,
      companyLogo: det.seller_account_logo,
      category_id: det.category_id,
      env: 'product',
      product_id: det.product_id,
      buyerSellerStatus: det.buyer_seller_status
    }
    return sellerDetails;
  }

  // Navigation to product details page
  goTo(id: number, name: string) {
    let url = encodeURIComponent(name).toLowerCase() + "-" + id;
    this.router.navigate(['/product', url]);
  }

  // all and customizable chips
  chips = [{name: 'All', id: 'all'},{name: 'Customizable', id: 'yes'}]
  selectedChip = 'all';
  changeChip(chip: {name: string, id: string}) {
    this.selectedChip = chip.id;
    this.searchdetails.customizable = chip.id
    this.getProducts(this.searchdetails)
  }

  // show and hide all selected filters
  showAllFilter = false;
  clickAllFilters(){
    this.showAllFilter = true;
  }

  // changing to company and products
  showProductsFn(type: string){
    this.searchdetails.type = type;
    this.showProducts = this.searchdetails.type == 'product';
    this.getProducts(this.searchdetails)
  }

  alterRecommededProduct(product: any) {
    return new RecommendedProduct(product.id, product.name, product.image, product.description);
  }

}

class RecommendedProduct {
  product_id: number;
  product_name: string
  product_image: string;
  product_description: string;
  constructor(id: number, name: string, image: string, description: string) {
    this.product_id = id;
    this.product_name = name;
    this.product_image = image;
    this.product_description = description;
  }
}


interface Category {
  cat_id: number,
  cat_name: string
}

interface SubCategory extends Category{
  sub_category: SubCategory[]
}

export interface Filter {
  name: string
  filter_id: number
  filter_option_id: number
  filter_type: string
}