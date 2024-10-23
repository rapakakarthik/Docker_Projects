import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-stories-details',
  templateUrl: './stories-details.component.html',
  styleUrls: ['./stories-details.component.scss']
})
export class StoriesDetailsComponent implements OnInit{

  
  constructor(
    private api: BlogService, 
    private route: ActivatedRoute, 
    private authguard: AuthGuard
    ) {}
  ngOnInit(): void {
    this.getUserDetails();
    this.getRouteParams();
  }

  getRouteParams() {
    this.route.paramMap.subscribe(res => {
      let name = res.get('url') ?? '';
      let id = res.get('id') ?? '';
      this.getStoryDetails(name);
      if(this.isUserSignedIn) {
        this.markStoryAsRead(id);
      }
    })
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

  storyDetails: any;
  sellerDetails: any;
  getStoryDetails(name: string) {
    let story: {name: string, headers?: any} = {
      name
    }
    if(this.isUserSignedIn) {
      story.headers = {headers: this.headers}
    }
    this.api.getStoryDetails(story).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.storyDetails = value.data.story_full_view;
          this.sellerDetails = value.data.seller_details;
          this.isLiked = this.storyDetails.is_liked == 1;
          this.likesCount = this.storyDetails.likes;
          this.isBookmarked = this.storyDetails.is_bookmarked == 1;
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog details error', err.message)
    })
  }

  isLiked = false;
  likesCount = 0;
  like(storyId: number) {
    if(!this.isUserSignedIn) {
      this.authguard.openDialog();
      return;
    }
    let obj = {
      story_id: storyId,
      type: 1
    }
    if(this.isLiked) {
      obj.type = 0;
      this.likesCount--;
    } else {
      obj.type = 1
      this.likesCount++;
    }
    this.isLiked = !this.isLiked;
    this.api.likeStory(obj).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          // this.storyDetails = value.data.story_full_view;
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog details error', err.message)
    })
  }

  isBookmarked = false;
  bookmark(storyId: number) {
    if(!this.isUserSignedIn) {
      this.authguard.openDialog();
      return;
    }
    let obj = {
      story_id: storyId,
      bookmark: 1
    }
    if(this.isBookmarked) {
      obj.bookmark = 0;
    } else {
      obj.bookmark = 1
    }
    this.isBookmarked = !this.isBookmarked;
    this.api.bookmarkStory(obj).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          // this.storyDetails = value.data.story_full_view;
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog details error', err.message)
    })
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this seller!',
        url: window.location.href
      }).then(() => {
        console.log('Successful share');
      }).catch(error => {
        console.error('Error sharing', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Web Share API is not supported in your browser.');
    }
  }

  markStoryAsRead(id: string) {
    let obj = {
      read: 1,
      story_id: id
    }
    this.api.markStoryAsRead(obj).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          
        }
      },
      error: (err: HttpErrorResponse) => console.error('blog details error', err.message)
    })
  }
}

