import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BannersResponse } from 'src/app/home/models/banner';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  userId: number = 0;
  headers: HttpHeaders;
  constructor(private http: HttpClient) { 
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
    }
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  mainRooms: any[] = [];
  getMainRooms() {
    return this.mainRooms;
  }

  postRooms(main_rooms: any[]) {
    this.mainRooms = [];
    this.mainRooms = main_rooms;
  }

  // Classes
  mainClasses: any[] = [];
  getMainClasses() {
    return this.mainClasses;
  }

  postClasses(main_classes: any[]) {
    this.mainClasses = [];
    this.mainClasses = main_classes;
  }

  // Rooms Category
  getMainCategory(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-recommended-rooms`);
  }

  getSubCategory(categoryId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-recommended-sub-rooms`, {main_room: categoryId});
  }

  getRoomProducts(obj: any): Observable<any> {
    obj['user_id'] = this.userId;
    return this.http.post(`${environment.apiUrl}/get-recommended-room-products`, obj);
  }

  // Classes Category
  getClasses(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-recommended-classes`);
  }

  getSubClasses(categoryId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-recommended-class-categories`, {class_id: categoryId});
  }

  getClassProducts(obj: any): Observable<any> {
    obj['user_id'] = this.userId;
    return this.http.post(`${environment.apiUrl}/get-recommended-class-products`, obj);
  }

  // schools Category
  getSchools(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-recommended-schools`);
  }

  getSubSchools(categoryId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-recommended-school-categories`, {school_id: categoryId});
  }

  getSchoolProducts(obj: any): Observable<any> {
    obj['user_id'] = this.userId;
    return this.http.post(`${environment.apiUrl}/get-recommended-school-products`, obj);
  }

  // Top Types
  getTopTypes(type: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/getTopRankingTypes`, {type: type}); // not using
  }
  
  getCompanySpotlights(catId: number = 0): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-product-company-spotlights-v3`, {category_id: catId});
  }

  getHomeTopProducts(categoryType: string, category_id?: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-homepage-prodcuts`, {type: categoryType, category_id});
  }

  getRankingCompanyDetails(categoryType: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-ranking-company-details`, {type: categoryType});
  }

  getRankingCompanyData(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-ranking-company-data`, obj);
  }

  // Just For You
  getJustForYou(obj: any): Observable<any> {
    obj['user_id'] = this.userId;
    return this.http.post(`${environment.apiUrl}/get-recommended-just-for-you`, obj);
  }

  getRecommendedBanners(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-recommended-banners`);
  }

  getRecommendedBannersV2(): Observable<BannersResponse> {
    return this.http.get<BannersResponse>(`${environment.apiUrl}/get-recommended-banners-v2`);
  }

  bannersSub = new Subject();
  banners$ = this.bannersSub.asObservable();

  postBanners(value: any) {
    this.bannersValue = value;
    this.bannersSub.next('');
  }
  
  bannersValue: any
  getBanners() {
    return this.bannersValue;
  }

  getPrimeSuppliers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/fetch-prime-suppliers-v2`);
  }

  getEliteSuppliers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/fetch-elite-suppliers`);
  }

  getrankingTypes(): Observable<any> { // types - top_search, most_popular, newly_added
    return this.http.get(`${environment.apiUrl}/get-top-ranking-types`);
  }

  getAllrankingProductData(obj: {type: string, category_id: number}): Observable<any> { //Products based on ranking type and category id
    return this.http.post(`${environment.apiUrl}/fetch-ranking-product-data`,  obj);
  }

  getRankingDetails(type:string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-ranking-product-details`,  {type}); //Banners data and main categories
  }

  getRankingDetailsV2(type: string, id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-ranking-product-details`,  {type, category_id: id});
  }

  getAllrankproductsList(obj:any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-ranking-product-list`,  obj);
  }
  
  getAllStatesData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-recommended-states`);
  }


}
