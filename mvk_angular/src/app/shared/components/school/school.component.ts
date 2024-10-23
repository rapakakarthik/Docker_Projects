import { Component, OnInit } from '@angular/core';
import { RecommendationService } from '../../services/recommendation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit{

  constructor(private api: RecommendationService, private router: Router) {}
  ngOnInit(): void {
    this.getMainCategory();
  }

  mainCategoryData: any[] = [];
  mainCategoryInfo: any;
  getMainCategory() {
    this.api.getSchools().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.mainCategoryData = value.data.schools;
          this.mainCategoryInfo = value.data.info;
          this.getSubCategory(this.mainCategoryData[0].pk_school_id);
        } else {
          this.loader = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      },
    });
  }

  activeId: number = 0;
  subCategoryData: any[] = [];
  subCategoryInfo: any;
  loader: boolean = true;
  getSubCategory(categoryId: number) {
    this.activeId = categoryId;
    this.api.getSubSchools(categoryId).subscribe({
      next: (value: any) => {
        this.loader = false;
        if (value.status === 200) {
          this.subCategoryData = value.data.categories;
          this.subCategoryInfo = value.data.school;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        console.error(err.message, err.error);
      },
    });
  }

  getSubCategory1(eve: any) {
    let categoryId = this.mainCategoryData[eve].pk_school_id;
    this.getSubCategory(categoryId);
  }

  goTo(subCategoryId: number) {
    this.router.navigate(['/recommendations/school', this.activeId, subCategoryId]);
  }
}
