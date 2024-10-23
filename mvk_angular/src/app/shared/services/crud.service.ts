import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  BehaviorSubject, Observable, Subject, mergeMap} from 'rxjs';
import { ListData } from 'src/app/home/manufactures-tab/manufactures-tab.component';
import { environment } from 'src/environments/environment';
import { Todo } from '../models/todo';
import {UAParser} from 'ua-parser-js';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  
  // userId: number = 0;
  // headers: HttpHeaders;
  localHeaders: HttpHeaders;
  private get headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }

  private get userId() {
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      return parseInt(userObj.buyerId);
    }
    return 0;
  }
  
  constructor(private http: HttpClient) {
    // if (localStorage.getItem('userObj')) {
    //   const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    //   this.userId = parseInt(userObj.buyerId);
    // }
    this.localHeaders = new HttpHeaders().set('Security-Token', '1234')
    // this.headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  //Header
  //Header/Notifications

  getNotificationHistory(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/get-buyer-notification-history`, obj, { headers: this.headers })
  }

  updateNotification(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-notification-read-status`, {id: id}, { headers: this.headers })
  }
  
  // Home

  getBannerImagesV2(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/banners-v2`) // not using
  }

  getProductHistory(userId: number) {
    return this.http.get(`${environment.apiUrl}/fetch-product-history?user_id=${userId}`)
  }

  call(id1: number, id2: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/tata-click-to-call`, {from: id1, to: id2}, { headers: this.headers })
  }

  
  //Home/Products

  getFavCount(buyer_id: number) {
    return this.http.post(`${environment.apiUrl}/buyer-fav-count`, {buyer_id: this.userId})
  }

  getMenu(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/category-web-app`); // not using
  }

  getMenuV2(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-category-rooms-list`);
  }

  getMenuV3(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/category-web-app-v2`);
  }

  getMenuV3Child(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category-web-app-child`, {category_id: id});
  }

  getProducts(id: number): Observable<any> {
    const data = {
      category_id: id,
      user_id: this.userId
    }
    return this.http.post(`${environment.apiUrl}/product-by-types`, data)
  }

  getHomeAnalytics(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/analytics-home`); //not using
  }

  getHomepageCategory(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/category-home-products`) // not using
  }

  getHomepageProducts(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/just-for-you`, {user_id: this.userId})
  }

  //Home/Manufactures
  getCompanyList(data: ListData): Observable<any> {
    data.user_id = this.userId;
    return this.http.post(`${environment.apiUrl}/fetch-company-list`, data) // not using
  }

  getManufactureCard(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/homepage-manufacture-card`)
  }

  //Search results page
  getFilters(obj: { keyword: string, type: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/search-filter-type-list`, obj)
  }

  getFiltersDynamic(obj: { keyword: string, type: string, id?: number, filters?: any[] }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category-filters`, obj)
  }

  getFilterProducts(data: FilterProduct): Observable<any> {
    data.user_id = this.userId;
    if(!this.userId) {
      let historyStr = localStorage.getItem('history');
      if(historyStr) {
        let localHistory: string[] = JSON.parse(historyStr);
        if(localHistory.length >= 4) {
          localHistory.shift();
        } 
        localHistory.push(data.keyword);
        localStorage.removeItem('history');
        localStorage.setItem('history', JSON.stringify(localHistory));
      } else {
        let localHistory = [data.keyword];
        localStorage.setItem('history', JSON.stringify(localHistory));
      }
      this.postSearchResults();
    }
    return this.http.post(`${environment.apiUrl}/search-filter-product-list`, data)
  }

  deleteLocalHistory(index: number) {
    let historyStr = localStorage.getItem('history');
    if(historyStr) {
      let localHistory: string[] = JSON.parse(historyStr);
      localHistory.splice(index, 1);
      localStorage.removeItem('history');
      localStorage.setItem('history', JSON.stringify(localHistory));
    }
  }

  //Product Listing Page
  getProductFilters(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category-products-filters`, { category_id: id })
  }

  getProductCat(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-filter-categories/${id}`)
  }
  
  getProductList(data: any): Observable<any> {
    data.user_id = this.userId;
    return this.http.post(`${environment.apiUrl}/category-products`, data) // also in sub category and recommendation
  }

  getProductListV2(data: any): Observable<any> {
    data.user_id = this.userId;
    return this.http.post(`${environment.apiUrl}/search-filter-product-list`, data)
  }

  getMediaCard(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-banner-company-products`) // not using
  }
  getMediaCardV2(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-banner-company-products-v2`, {category_id: id})
  }

  //General Recommendation
  getMainCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/main-categories`)
  }

  categorySub = new BehaviorSubject('');
  categories$ = this.categorySub.asObservable();

  pushCategories(cats: any[]) {
    this.categories = cats;
    this.categorySub.next('');
  }

  categories: any[] = [];
  getCategories() {
    return this.categories;
  }

  getMainCategoriesState(state: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/main-categories?state=${state}`)
  }

  //Category/sub
  getSubCategories(id: number): Observable<any> {
    const data = {
      category_id: id
    }
    return this.http.post(`${environment.apiUrl}/fetch-sub-categories`, data)
  }

  getSourceByStore(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/source-by-store-type`) // not using
  }


  getSubCategoriesV2(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/getSubCategories-v2?category_id=${id}`)
  }

  getLeafCategories(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-leaf-categories`, {category_id: id}) // not using
  }


  //Category/all
  getAllCategories(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-all-categories`, obj)
  }

  getMyCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/v2/getMyCategories`, {headers: this.headers})
  }

  //Top Ranking/manufactures -- Top Ranking/products
  getTopRanking(keyword: string, main_type: number, skip: number, main_id?: number, sub_id?: number | null, stateId?: string): Observable<any> {
    const data = {
      user_id: this.userId,
      product_manufacture: keyword,
      main_type: main_type,
      main_category: main_id ? main_id : null,
      sub_category: sub_id ? sub_id : null,
      skip: skip,
      limit: (keyword == 'product' && main_type == 2) ? 24 : 5,
      with_sub_categories: main_id ? true : false,
      state: stateId ? stateId : null
    }
    return this.http.post(`${environment.apiUrl}/get-products-manufactures`, data)
  }

  //Search keywords
  getSearckKeywords(key: string, type: string): Observable<any> { // not using
    return this.http.post(`${environment.apiUrl}/filter-product-keyword`, { keyword: key, type: type })
  }

  getSearckKeywordsV2(key: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/search-product-keyword`,{keyword: key})
  }

  // search recommendations 
  getSearchRecommendations(): Observable<any> {
    if(this.userId) {
      return this.http.post(`${environment.apiUrl}/search-history`,{}, {headers: this.headers})
    }
    return this.http.post(`${environment.apiUrl}/search-history`, {})
  }

  deleteHistory(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/delete-search-history`, { search_id: id }, {headers: this.headers});
  }

  private search = new Subject();
  search$ = this.search.asObservable();

  postSearchResults() {
    this.search.next(true);
  }

  // Product Details page
  getProductDetils(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-product-details`, { product_id: id, user_id: this.userId}) // not using
  }

  getProductDetilsV2(product_id: number,): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-product-details-v3`, { product_id, user_id: this.userId, type: 'web'})
  }

  addProductToWishlist(product_id: string, folderId: number): Observable<any> { //comma seperated if multiple
    return this.http.post(`${environment.apiUrl}/v2/add-product-to-wishlist`, { product_id, folder_id: folderId}, {headers: this.headers})
  }

  removeProductFromWishlist(product_id: string, folderId: number): Observable<any> { //comma seperated if multiple
    return this.http.post(`${environment.apiUrl}/v2/remove-wishlist-product`, { product_id, folder_id: folderId}, {headers: this.headers})
  }

  getProductsYouMayAlsoLike(id: number): Observable<any> {
    // return this.http.get(`${environment.apiUrl}/you-may-also-like?product_id=${id}&user_id=${this.userId}`)
    return this.http.post(`${environment.apiUrl}/you-may-also-like`, {product_id: id, user_id: this.userId})
  }
  getFrequentlyBought(id: number): Observable<any> {
    // return this.http.get(`${environment.apiUrl}/frequently-bought-together?product_id=${id}&user_id=${this.userId}`)
    return this.http.post(`${environment.apiUrl}/frequently-bought-together`, {product_id: id, user_id: this.userId})
  }
  getPopularProducts(id: number): Observable<any> {
    // return this.http.get(`${environment.apiUrl}/supplier-popular-products?seller_id=${id}&user_id=${this.userId}`)
    return this.http.post(`${environment.apiUrl}/supplier-popular-products`, {seller_id: id, user_id: this.userId})
  }
  

  // Company Profile page
  getCompanyDetails(id: number, type: string, search_key: string, filter: string, groupId: number = 0, skip: number = 0): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-company-details`, { seller_id: id, type: type, group_id: groupId, user_id: this.userId, limit: 8 , skip: skip, search_key, filter})
  }

  getSellerDetails(id: number, search_key: string, filter: string, groupId: number = 0, skip: number = 0): Observable<any> {
    return this.http.post(`${environment.apiUrl}/fetch-seller-account-details`, { seller_user_id: id, group_id: groupId, buyer_id: this.userId, limit: 8 , skip: skip, search_key, filter})
  }

  getCompanyCategoryProducts(seller_id: number, search_key: string, filter: string, category_id: number = 0, skip: number = 0): Observable<any> {
    return this.http.post(`${environment.apiUrl}/category-group-based-select`, { seller_id, category_id, limit: 8 , skip: skip, search_key, filter})
  }

  // addCompanyToWishlist(id: number, folder_id: number): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/v2/add-wishlist-supplier`, { seller_user_id: id, folder_id}, {headers: this.headers})
  // }
  // removeCompanyFromWishlist(id: number, folder_id: number): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/v2/remove-wishlist-supplier`, { seller_user_id: id, folder_id}, {headers: this.headers})
  // }

  getBannerImages(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/banners`) // not using
  }

  //Account Page
  // getInquiryList(data: any): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/v2/fetch-enquery`, data, { headers: this.headers })
  // }

  getInquiryDetails(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-enquery_details`, { enquery_id: id }, { headers: this.headers })
  }

  //Account Page buyer Profile

  getBuyerProfileDetails(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/get-buyer-profile-details`, { user_id: id }) // not using
  }
  
  updateBuyerContactInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-contact-information`, obj) // not using
  }
  
  updateBuyerBasicInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-basic-information`, obj) // not using
  }

  updateBuyerAddressInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-address-information`, obj) // not using
  }

  updateBuyerCompanyInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-company-information`, obj) //not using
  }

  updateBuyerSourcingInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-sourcing-information`, obj) // not using
  }
  updateBuyerStatutoryInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-statutory-information`, obj) //not using
  }
  updateBuyerIntelletualInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-intelletual-information`, obj) // not using
  }
  updateBuyerAttachmentInformation(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/update-buyer-attachment-information`, obj) // not using
  }
  
  getBuyerUpdateProfileDropdown(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-buyer-update-profile-dropdowns`)
  }

  //Account Page Main Chat
  getChatList(): Observable<any> {
    let obj = {connect_type_id : 2}
    return this.http.post(`${environment.apiUrl}/v2/get-connects-based-on-connect-type`,obj, { headers: this.headers })
  }


  // Fav Products Page
  getFavProducts(limit: number, skip: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/get-my-saved-products`, {limit: limit, skip: skip}, { headers: this.headers })
  }

  addToFavorite(prod_id: number, type: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/save-product`, {prod_id: prod_id, type: type}, { headers: this.headers })
  }

  // Contact Us Page
  contactUs(contact: Contact): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/submit-home-page-contact-us`, contact)
  }

  // AD banner
  getEventBanner(): Observable<Object> {
    return this.http.get(`${environment.apiUrl}/spl-events`)
  }

  // how many users visit the site?
  addVisitCount(obj: any): Observable<Object> {
    return this.http.post(`${environment.apiUrl}/app-downloads`, obj)
  }
  
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
  }

  selectedImages: ImageModel[] = [];
  getImages(): ImageModel[] {
    return this.selectedImages;
  }

  private subject = new Subject<ImageModel[]>();
  subject$ = this.subject.asObservable();
  addImage(image: ImageModel): void {
    this.selectedImages.push(image);
    this.subject.next(this.selectedImages);
  }

  removeImage(id: number) {
    let index = this.selectedImages.findIndex(img => img.id === id);
    this.selectedImages.splice(index, 1);
    this.subject.next(this.selectedImages);
  }

  parser = new UAParser()
  webVisitCount() {
    const result = this.parser.getResult();
    return this.getIpAddress().pipe(
      mergeMap(ipDetails => {
        const fullDetails = { 
          device_id: 0,
          device_os_version_number: 0,
          device_type: 'web',
          app_version_code: 1.0,
          ip_address: ipDetails.ip,
          browser_details: result.browser.name
        };
        return this.http.post(`${environment.apiUrl}/app-downloads`, fullDetails);
      })
    );
  }

  getIpAddress(): Observable<any> {
    return this.http.get('https://api.ipify.org?format=json');
  }

  getMainCategoriesAll(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-main-categories`)
  }

  getProfileDropDowns(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-profile-dropdowns`);
  }

  // Footer 
  getFooterCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/footer-categories`);
  }

  getFooterContent(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/footer-content`);
  }

  getFooterTopSearch(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/footer-top-search`);
  }
}


interface FilterProduct {
  keyword: string,
  filters: string[],
  limit: number,
  user_id?: number
}

export type Contact = {
  salutation: number,
  fullname: string,
  email: string,
  phone: number,
  subject: string,
  message: string
}

export interface ImageModel {
  url: string,
  id: number
}