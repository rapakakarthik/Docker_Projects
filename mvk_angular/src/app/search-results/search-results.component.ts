import { Component, input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterComponent } from '../filter/filter/filter.component';
import { CrudService } from '../shared/services/crud.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Filter } from '../product-listing/product-listing.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  @ViewChild(FilterComponent) filter!: FilterComponent;
  checkedData: {name: string, id: number}[] = [];
  filterData!: Array<Object>;
  checkbox: string[] = [];
  filterloader: boolean = true;
  hideFilter: boolean = true;
  mobilefilterOpen: boolean = false;
  pageNum = 0;

  constructor(
    private _crud: CrudService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.route.queryParamMap.subscribe(params => {
    //   const page = params.get('page');
    //   if(page) {
    //     const pageNum = parseInt(page);
    //     if(pageNum && pageNum > 0) {
    //       this.pageNum = pageNum;
    //       this.searchdetails.skip = (pageNum - 1) * 16;
    //       this.p = pageNum;
    //     }
    //   }
    // })
    this.noDataFound = false;
    this.route.paramMap.subscribe((params) => {
      this.searchKeyword = <string>params.get('keyword');
      this.type = <string>params.get('type');
      this.getData();
    });
  }


  searchKeyword: string = '';
  type: string = '';
  msg: string = '';
  searchdetails = {
    keyword: '',
    filters: [],
    limit: 12,
    type: '',
    skip: 0,
    category_id: 0,
    customizable : "all"
  };
  getData() {
    //calling Filters
    this.getFilters();
    this.searchdetails.keyword = this.searchKeyword;
    this.searchdetails.type = this.type;
    //calling Products/Manufactures
    this.getFilterProducts(this.searchdetails);
  }

  relatedCategories: any[] = [];
  getFilters() {
    this._crud.getFiltersDynamic({ keyword: this.searchKeyword, type: this.type }).subscribe({
      next: (res: any) => {
        this.filterloader = false;
        if (res.status == 200) {
          this.filterData = res.data.filter_data;
          this.relatedCategories = res.data.categories;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.filterloader = false;
      }
    });
  }

  loader: boolean = true;
  totalCount: number = 0;
  collection: any[] = [];
  noDataFound: boolean = false;
  recommendedProducts: RecommendedProduct[] = [];
  getFilterProducts(obj: any) {
    this.loader = true;
    this.noDataFound = false;
    this._crud.getFilterProducts(obj).subscribe({
      next: (result: any) => {
        this.loader = false;
        if (result.status == 200) {
          if (!result.data.length) {
            this.noDataFound = true;
            this.recommendedProducts = result.recommendations.map((product: any) => this.alterRecommededProduct(product));
          }
          this._crud.postSearchResults();
          this.hideFilter = this.type === 'company';
          this.showProducts = this.searchdetails.type == 'product';
          this.msg = result.message;
          this.totalCount = result.total;
          this.collection = []
          this.collection = result.data;
        }
        else {  
          this.noDataFound = true;
          this.collection = [];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loader = false;
        this.collection = [];
        this.noDataFound = true;
        console.error(error.error, error.message);
      },
    });
  }

  getFilteredData(event: any) {
    this.checkedData = event[1];
    this.searchdetails.filters = event[0];
    this._crud.getFilterProducts(this.searchdetails).subscribe((result) => {
      if (result) {
        this.totalCount = result.total;
        this.collection = [];
        this.collection = result.data;
      }
    });
    this.getFiltersDynamic(this.searchdetails.category_id, this.searchdetails.filters);
  }

  getFiltersDynamic(id: number, filters: any[]) {
    this.filterloader = true;
    this.filterData = [];
    this._crud.getFiltersDynamic({ keyword: this.searchKeyword, type: this.type, id, filters }).subscribe({
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
    let index = this.checkedData.findIndex(c => c.id === check.id);
    if (index != -1) {
      this.checkedData.splice(index, 1);
    }
    this.searchdetails.filters = this.searchdetails.filters.filter((res: Filter) => res.filter_option_id !== check.id);
    this._crud.getFilterProducts(this.searchdetails).subscribe((result) => {
      if (result) {
        this.totalCount = result.total;
        this.collection = [];
        this.collection = result.data;
      }
    });
  }

  clearFilters() {
    this.filter.checkboxForm.reset();
    this.searchdetails.filters = [];
    this.checkedData = [];
    this._crud.getFilterProducts(this.searchdetails).subscribe((result) => {
      if (result) {
        this.totalCount = result.total;
        this.collection = [];
        this.collection = result.data;
      }
    });
  }

  filterIconfn() {
    this.mobilefilterOpen = true;
  }
  backto() {
    this.mobilefilterOpen = false;
  }

  skipItems: number = 0;
  p: number = 0;
  onPageChange2(pageNumber: number) {
    window.scrollTo(0, 0);
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 12;
    this.searchdetails.skip = this.skipItems;
    this._crud.getFilterProducts(this.searchdetails).subscribe((result) => {
      if (result) {
        this.collection = [];
        this.collection = result.data;
        // this.router.navigate([], { queryParams: { page: pageNumber } });
      }
    });
  }

  images = [
    { id: 1, image: "https://mvk-prd-laravel-media.s3.ap-south-1.amazonaws.com/seller_account/59/product_images/1619086567tSIkBo.jpg"},
    { id: 2, image: "https://mvk-prd-laravel-media.s3.ap-south-1.amazonaws.com/seller_account/59/product_images/1619086678xz5rtO.jpg"},
    { id: 3, image: "https://mvk-prd-laravel-media.s3.ap-south-1.amazonaws.com/seller_account/135/product_images/1619088729vXHvje.jpg"}
  ]

  viewClass: string = 'grid_view'; // Default class

  listView(): void {
    this.viewClass = 'list_view';
  }

  gridView(): void {
    this.viewClass = 'grid_view';
  }

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

  goTo(id: number, name: string) {
    let url = encodeURIComponent(name).toLowerCase() + "-" + id;
    this.router.navigate(['/product', url]);
  }

  chips = [{name: 'All', id: 'all'},{name: 'Customizable', id: 'yes'}]
  selectedChip = 'all';
  changeChip(chip: {name: string, id: string}) {
    this.selectedChip = chip.id;
    this.searchdetails.customizable = chip.id
    this.getFilterProducts(this.searchdetails)
  }

  
  showAllFilter = false;
  
  clickAllFilters(){
    this.showAllFilter = true;
  }
  
  showProducts = true;
  showProductsFn(show: boolean){
    this.selectedChip = 'all';
    this.searchdetails.customizable = 'all';
    if(!show) {
      //calling Products/Manufactures
      this.searchdetails.type = 'manufacture';
      this.getFilterProducts(this.searchdetails);
    } else {
      this.searchdetails.type = 'product';
      this.getFilterProducts(this.searchdetails);
    }
    this.showProducts = show;
  }

  // search results based on category 
  getCategoryProducts(id: number) {
    this.searchdetails.category_id = id;
    this.searchdetails.keyword = "";
    this.getFilterProducts(this.searchdetails);
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
