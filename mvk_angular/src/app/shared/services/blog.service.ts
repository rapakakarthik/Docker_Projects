import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  userId: number = 0;
  // headers: HttpHeaders;
  private get headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }
  constructor(private http: HttpClient) {
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
    }
    // this.headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  getBlogsList(obj: any) {
    return this.http.post(`${environment.apiUrl}/get-blogs-list`, obj)
  }

  getBlogsDetails(name: string) {
    return this.http.get(`${environment.apiUrl}/get-blog-details/${name}`)
  }

  getBlogsCategories() {
    return this.http.get(`${environment.apiUrl}/get-blog-categories`)
  }

  postComment(obj: any) {
    return this.http.post(`${environment.apiUrl}/add-blog-comment`, obj)
  }


  getStories(id: number) {
    
    return this.http.get(`${environment.apiUrl}/get-stories?filter_id=${id}`)
  }

  getStoriesList(obj: any, signIn: boolean) {
    if(signIn) {
      return this.http.post(`${environment.apiUrl}/get-stories-list`, obj, {headers: this.headers})
    }
    return this.http.post(`${environment.apiUrl}/get-stories-list`, obj)
  }

  getStoryDetails(story: {name: string, headers?: any}) {
    if(story.headers) {
      return this.http.post(`${environment.apiUrl}/get-story-details`, {url_slug: story.name}, story.headers)
    } else {
      return this.http.post(`${environment.apiUrl}/get-story-details`, {url_slug: story.name})
    }
  }

  likeStory(obj: any) {
    return this.http.post(`${environment.apiUrl}/v2/update-story-like-unlike`, obj, {headers: this.headers})
  }

  bookmarkStory(obj: any) {
    return this.http.post(`${environment.apiUrl}/v2/update-story-bookmark-unbookmark`, obj, {headers: this.headers})
  }

  markStoryAsRead(obj: any) {
    return this.http.post(`${environment.apiUrl}/v2/update-story-read`, obj, {headers: this.headers})
  }

}
