import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainCatList } from 'src/app/recommendation/recommendation.component';
import { RecommendationService } from 'src/app/shared/services/recommendation.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-recommendation-results',
  templateUrl: './recommendation-results.component.html',
  styleUrls: ['./recommendation-results.component.scss'],
})
export class RecommendationResultsComponent implements OnInit {
  productsBanner: any;
  catId: number = 0;
  rec_type!: any;
  // Recommendation
  mainCatList: MainCatList[] = [];
  productTypeData: any;
  selectedChipIndex: number = 0;
  constructor(
    private service: RecommendationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getRankingTypes();
    this.route.paramMap.subscribe((params) => {
      let url: string = params.get('catId') ?? "";
      this.catId = Number(url.slice(url.lastIndexOf("-") + 1));
      this.rec_type = params.get('type');
      this.getRoomProducts();
    });
  }


  getRankingTypes() {
    this.service.getrankingTypes().subscribe((res) => {
      if (res.status == 200) {
        this.productTypeData = res.data[0];
        this.selectedChipIndex = [...res.data[0].recommendation_types].findIndex(value => value.key === this.rec_type);
        this.titleText = [...res.data[0].recommendation_types].find(value => value.key === this.rec_type).type;
      }
    });
  }

  titleText: string = '';
  onChipSelected(e: any, index: number) {
    this.selectedChipIndex = index;
    this.titleText = e.type
    this.rec_type = e.key;
    this.getRoomProducts();
  }

  justForYouLoad: boolean = false;
  collection: any[] = [];
  totalCount: number = 0;
  nodata = false;
  getRoomProducts( skip?: number) {
    this.justForYouLoad = true;
    this.nodata = false;
    let data = {
      type: this.rec_type,
      category_id: this.catId,
      skip: skip ? skip : 0,
      limit: 18,
    };

    this.service.getAllrankproductsList(data).subscribe({
      next: (value: any) => {
        this.justForYouLoad = false;
        if (value.status === 200) {
          this.collection = value.data.products;
          this.totalCount = value.total_count;
          this.productsBanner = value.data.banner;
          if(this.collection.length == 0) {
            this.nodata = true;
          }
        } else {
          this.nodata = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.justForYouLoad = false;
        this.nodata = true;
        console.error(err.message, err.error);
      },
    });
  }

  skipItems: number = 0;
  p: number = 0;
  onPageChange(pageNumber: number) {
    this.p = pageNumber
    this.skipItems = (pageNumber - 1) * 18;
    this.getRoomProducts(this.skipItems);
    window.scrollTo(0, 0);
  }

  // For background images 
  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }
}