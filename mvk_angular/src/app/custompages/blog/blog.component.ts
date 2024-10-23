import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit{

  searchKeyword: string = "";
  
  constructor(private api: BlogService) {}
  ngOnInit(): void {
    this.getBlogsList(0);
    this.getCategoryList();
  }

  categoriesList: any[] = [];
  getCategoryList() {
    this.api.getBlogsCategories().subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.categoriesList = value.data ;
          // console.log(this.categoriesList);
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog list error', err.message)
    })
  }

  blogList: any[] = [];
  mainBlog: any;
  totalCount = 0;
  noDataFound = false;
  serverError = false;
  getBlogsList(categoryId: number, skip = 0) {
    this.noDataFound = false;
    this.serverError = false;
    let obj = {
      category: categoryId,
      limit: 9,
      skip: skip,
      search: this.searchKeyword
    }
    this.api.getBlogsList(obj).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          if(value.data.lenght == 0) 
          this.noDataFound = true;
          this.mainBlog = value.data[0];
          this.blogList = value.data.slice(1);
          this.totalCount = value.total_count;
          // console.log(this.mainBlog);
        } else {
          this.blogList = [];
          this.mainBlog = null;
          this.noDataFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('blog list error', err.message);
        this.serverError = true;        
      } 
    })
  }

  categoryId = 0;
  onTabClick(event: MatTabChangeEvent) {
    let category_id = this.categoriesList[event.index].id;
    // console.log(category_id);
    this.categoryId = category_id;
    this.searchKeyword = "";
    this.getBlogsList(category_id);
  }

  onSearch() {
    this.getBlogsList(this.categoryId);

  }

  search() {
    if(this.searchKeyword == '') {
      this.onSearch();
    }
  }

  p: number = 0;
  onPageChange2(pageNumber: number) {
    window.scroll(0,0);
    this.p = pageNumber;
    let skipItems = (pageNumber - 1) * 9;
    this.getBlogsList(this.categoryId,  skipItems);
  }


  generateProductSchema(blog: any): string {

    const schema = {
      "@context": "https://schema.org/",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://www.myverkoper.com/blog/" + blog.url_slug
      },
      "headline": blog.blog_title,
      "subTitle": blog.blog_sub_title,
      "image": {
        "@type": "ImageObject",
        "url": blog.blog_image,
        "width": "1200",
        "height": "630"
      },
      "author": {
        "@type": "Organization",
        "name": "MyVerkoper"
      },
      "publisher": {
        "@type": "Organization",
        "name": blog.created_by,
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.myverkoper.com/assets/images/logo.gif",
          "width": "536",
          "height": "60"
        }
      },
      "datePublished": blog.created_at
    }
    return JSON.stringify(schema);
  }
}
