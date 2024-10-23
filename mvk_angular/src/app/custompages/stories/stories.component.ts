import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
// import { MatTabChangeEvent } from '@angular/material/tabs';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit{

  authGuard = inject(AuthGuard);
  
  constructor(private api: BlogService) {}
  ngOnInit(): void {
    this.getUserDetails();
    this.getStoriesList(0);
    
  }

  userId = 0;
  isUserSignedIn = false;
  headers!: HttpHeaders;
  getUserDetails() {
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
    }
    if (localStorage.getItem('token')) {
      this.isUserSignedIn = true;
      this.headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    }
  }

  categoriesList: any[] = [{name: 'All', id:0}];
 

  storyList: any[] = [];
  totalCount = 0;
  noDataFound = false;
  getStoriesList(filter_id: number, skip = 0) {
    this.noDataFound = false;
    let obj = {
      filter_id: filter_id,
      limit: 7,
      skip: skip
      // search: this.searchKeyword
    }
    // search: this.searchKeyword
    this.api.getStoriesList(obj, this.isUserSignedIn).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          if(value.data.lenght == 0) 
          this.noDataFound = true;
          // this.storyList = value.data.slice(1);
          this.storyList = value.data;
          this.totalCount = value.total_count;
        } else {
          this.storyList = []
          this.noDataFound = true;
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog list error', err.message)
    })
  }

  searchKeyword = '';
  onSearch() {
    this.getStoriesList(0);
  }

  p: number = 0;
  onPageChange2(pageNumber: number) {
    window.scroll(0,0);
    this.p = pageNumber;
    let skipItems = (pageNumber - 1) * 7;
    this.getStoriesList(0,  skipItems);
  }

  // onTabClick(event: MatTabChangeEvent) {
  //   let category_id = this.categoriesList[event.index].id;
  //   console.log(category_id);
  //   this.getStoriesList(category_id);
  // }


  // generateProductSchema(blog: any): string {

  //   const schema = {
  //     "@context": "https://schema.org/",
  //     "@type": "BlogPosting",
  //     "mainEntityOfPage": {
  //       "@type": "WebPage",
  //       "@id": "https://www.myverkoper.com/blog/" + blog.url_slug
  //     },
  //     "headline": blog.blog_title,
  //     "subTitle": blog.blog_sub_title,
  //     "image": {
  //       "@type": "ImageObject",
  //       "url": blog.blog_image,
  //       "width": "1200",
  //       "height": "630"
  //     },
  //     "author": {
  //       "@type": "Organization",
  //       "name": "MyVerkoper"
  //     },
  //     "publisher": {
  //       "@type": "Organization",
  //       "name": blog.created_by,
  //       "logo": {
  //         "@type": "ImageObject",
  //         "url": "https://www.myverkoper.com/assets/images/logo.gif",
  //         "width": "536",
  //         "height": "60"
  //       }
  //     },
  //     "datePublished": blog.created_at
  //   }
  //   return JSON.stringify(schema);
  // }
  tabs = [
    {name: 'All', id: 0},
    {name: 'Bookmarks', id: 2},
    {name: 'Unread', id: 3},
    {name: 'Likes', id: 4},
  ];
  selectedTab: number = 0;

  selectTab(id: number): void {
    this.selectedTab = id;
    this.getStoriesList(id, 0)
  }


  // bookmark(status: number, id: number) {
  //   let index = this.storyList.findIndex(story => story.story_id == id);
  //   this.storyList[index].is_bookmarked = status == 0 ? 1 : 0;
  // }

  bookmark(status: number, storyId: number) {
    if(!this.isUserSignedIn) {
      this.authGuard.openDialog();
      return;
    }
    let index = this.storyList.findIndex(story => story.story_id == storyId);
    this.storyList[index].is_bookmarked = status == 0 ? 1 : 0;
    let obj = {
      story_id: storyId,
      bookmark: status == 0 ? 1 : 0
    }
    this.api.bookmarkStory(obj).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          // this.storyDetails = value.data.story_full_view;
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog details error', err.message)
    })
  }
}
