import { Component, HostListener, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-all-category',
  templateUrl: './all-category.component.html',
  styleUrls: ['./all-category.component.scss']
})
export class AllCategoryComponent implements OnInit {
  category_banner_image:any;
  constructor(private crud: CrudService, private meta: Meta, private _router: Router) {}
  ngOnInit(): void {
    this.category_banner_image='./../../../../assets/images/all_categories.jpg';
    this.getAllCategory();
    this.getMyCategories()
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ name: 'keywords', content: '' });
  }
  
  
  categoryDetails: any[] = [];
  banner: any;
  loader: boolean = true;
  totalCategories: number = 0;
  getAllCategory() {
    this.isAPILoading = true;
    const obj = {
      limit: 5,
      skip: this.skip
    }
    this.crud.getAllCategories(obj).subscribe(res => {
      if(res.status == 200) {
        this.isAPILoading = false;
        this.loader = false;
        this.totalCategories = res.total_count;
        this.categoryDetails = [...this.categoryDetails, ...res.data.category_details]
        // console.log(this.categoryDetails)
        // this.category_banner_image = res.data.banner;
      }
      else {
        this.categoryDetails = [];
      }
    })
  }

  catDetails: any;
  leaf_categories: LeafCategory[] = [];
  getMyCategories() {
    this.crud.getMyCategories().subscribe({
      next: (value: ApiResponse) => {
        if(value.status == 200) {
          this.catDetails = value.data.category_details;
          this.leaf_categories = value.data.leaf_categories;
        }
      },
      error: (err: HttpErrorResponse) => {

      }
    })
  }


  route2(id: number, name: string) {
    // let category_name = name.replaceAll(" ", "-");
    let category_name = encodeURIComponent(name).toLowerCase();
    let url = category_name + "-" + id;
    this._router.navigate(['/category', url])
  }

  footerHeight = 3200;
  skip = 0;
  isAPILoading: boolean = false;
  @HostListener('window:scroll', ['$event']) onWindowScroll(event: any) {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const scrollBottom = scrollPosition + windowHeight;
    const footerOffset = documentHeight - this.footerHeight;
    if (scrollBottom >= footerOffset && !this.isAPILoading) {
      this.skip += 5;
      if(this.skip < this.totalCategories) this.getAllCategory();
    }
  }

  // For background images 
  version: string = environment.version;
  setImageEncode(image: string): string  {
    return encodeURI(image) + `?v=${this.version}`;
  }

}

interface LeafCategory {
  category_id: number,
  category_name: string,
  category_img: string
}

interface ApiResponse {
  status: number,
  message: string,
  data: {
    category_details: any,
    leaf_categories: LeafCategory[]
  }
}
