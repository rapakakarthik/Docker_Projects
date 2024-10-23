import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categorynew',
  templateUrl: './categorynew.component.html',
  styleUrls: ['./categorynew.component.scss'],
})
export class CategorynewComponent implements OnInit {
  private rec_type!: string;
  catId = 0;

  // Recommendation
  typeDesc: any;
  getTypes: any;
  newProductData: any[] = [];
  selectedChipIndex: number = 0;
  constructor(
    private router: Router,
    private service: RecommendationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.catId = Number(params.get('catId'));
      this.rec_type = params.get('type') as string;
      this.getRankingDetails();
      this.getRankingTypes();
      this.getproductData(this.rec_type);
    });
  }

  bannerLoader: boolean = true;
  recomendationsData: any;
  productCategories: any[] = [];
  selectedTabIndex: number = 0;
  getRankingDetails() { //banner data and main categories
    this.productCategories = [];
    this.service.getRankingDetailsV2(this.rec_type, this.catId).subscribe({
      next: (res: any) => {
        this.bannerLoader = false;
        if (res.status === 200) {
          this.recomendationsData = res.data;
          this.productCategories = res.data.categories;
          this.selectedTabIndex = this.productCategories.findIndex(cat => cat.pk_id == this.catId);
          this.typeDesc = res.data.banner.tag;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.bannerLoader = false;
        console.error(err.message, err.error);
      },
    });
  }

  getRankingTypes() {
    this.service.getrankingTypes().subscribe((res) => {
      if (res.status == 200) {
        this.getTypes = res.data[0];
        this.selectedChipIndex = this.getTypes.recommendation_types.findIndex((obj: { key: string; }) => obj.key == this.rec_type);
      }
    });
  }

  noProdFound: boolean = false;
  loader: boolean = false;
  totalCount = 0;
  getproductData(type: string) {
    this.noProdFound = false;
    this.loader = true;
    let obj = {
      type,
      category_id: this.catId,
      limit: 9,
      skip: this.skipItems
    }
    this.service.getAllrankingProductData(obj).subscribe({
      next: (res: any) => {
        this.loader = false;
        if (res.status === 200) {
          this.newProductData = res.data;
          this.totalCount = res.total_count;
          if (this.newProductData.length == 0) {
            this.noProdFound = true;
          } 
        } else {
          this.noProdFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        this.noProdFound = true;
        console.error(err.message, err.error);
      },
    });
  }

  changeType(type: any, index: number) {
    this.catId = 1;
    this.selectedChipIndex = index;
    this.rec_type = type.key;
    this.getRankingDetails();
    this.p = 0;
    this.skipItems = 0;
    this.getproductData(this.rec_type);
  }

  changeCatOrder(id: number) {
    this.catId = id;
    this.getRankingDetails();
    this.p = 0;
    this.skipItems = 0;
    this.getproductData(this.rec_type);
  }

  gotonavigation(p: any) {
    let idlink = this.rec_type;
    let idlink1 = p.cat_id;

    let category_name: string = p.cat_name;
    category_name = encodeURIComponent(category_name).toLowerCase()
    let url = category_name + "-" + idlink1;
    this.router.navigate(['/category', idlink, url]);
  }

  skipItems: number = 0;
  p: number = 0;
  onPageChange(pageNumber: number) {
    this.p = pageNumber;
    this.skipItems = (pageNumber - 1) * 9;
    this.getproductData(this.rec_type);
    window.scrollTo(0, 0);
  }

  clicked = false;
  onTabClick(event: MatTabChangeEvent) {
    this.catId = this.productCategories[event.index].pk_id;
    // this.getRankingDetails();
    this.p = 0;
    this.skipItems = 0;
    this.getproductData(this.rec_type);

  }

  // For background images 
  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }
}
