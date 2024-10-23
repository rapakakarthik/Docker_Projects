import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WishlistData, WishlistResponse } from '../models/wishlist/api-response';
import { WishListFolder } from '../models/wishlist/wishlist-folder';
import { CompareProduct, WishlistProduct } from '../models/wishlist/wishlist-product';
import { WishilistSupplier } from '../models/wishlist/wishlist-supplier';
import { WishilistAddRemove } from '../models/wishlist/wishlistAdd';
import { AddComment, AddCommentSupplier } from '../models/wishlist/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {


  private http = inject(HttpClient)
  
  userId: number = 0;
  // headers: HttpHeaders;
  localHeaders: HttpHeaders;
  private get headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }
  
  constructor() { 
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
    }
    this.localHeaders = new HttpHeaders().set('Security-Token', '1234')
    // this.headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  // Products adding and removing from wishlist

  // addProductToWishlist(id: number, folder_id: number): Observable<any> { // comma seperate for multiple products
  //   return this.http.post(`${environment.apiUrl}/v2/add-product-to-wishlist`, { product_id: id, folder_id}, {headers: this.headers})
  // }

  // removeProductFromWishlist(id: number | string, folder_id: number): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/v2/remove-wishlist-product`, { product_id: id, folder_id}, {headers: this.headers})
  // }

  // Proeucts move 
  moveProductsToWishlist(id: string, from_folder_id: number, to_folder_id: number, shared: 1 | 0): Observable<any> { // comma seperate for multiple products
    return this.http.post(`${environment.apiUrl}/v2/move-wishlist-product-to-folder`, { product_id: id, from_folder_id, to_folder_id, shared}, {headers: this.headers})
  }

  // Suppliers move 
  moveSuppliersToWishlist(id: string, from_folder_id: number, to_folder_id: number, shared: 1 | 0): Observable<any> { // comma seperate for multiple suppliers
    return this.http.post(`${environment.apiUrl}/v2/move-wishlist-supplier-to-folder`, { seller_user_id: id, from_folder_id, to_folder_id, shared}, {headers: this.headers})
  }
  
  // Folders create, update, edit and delete

  // getWishlistFolders() { 
  //   return this.http.post<WishlistData<WishListFolder>>(`${environment.apiUrl}/v2/fetch-wishlist-folder-list`, {}, {headers: this.headers})
  // }

  getWishlistFoldersData(obj: {type: 1 | 2, limit: number, skip: number, shared?: number}) { 
    return this.http.post<WishlistData<WishListFolder>>(`${environment.apiUrl}/v2/fetch-wishlist-data`, obj, {headers: this.headers})
  }

  createWishlistFolder(folder_name: string) { 
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/add-wishlist-folder`, {folder_name}, {headers: this.headers})
  }

  editWishlistFolder(folder_name: string, folder_id: number) { 
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/add-wishlist-folder`, {folder_name, folder_id}, {headers: this.headers})
  }

  deleteWishlistFolder(folder_id: number | string)  {
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/delete-wishlist-folder`, {folder_id}, {headers: this.headers})
  }

  editManageList(folders: {id: number, name: string}[]) {
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/wishlist-bulk-folder-update`, {folders}, {headers: this.headers})
  }

  

  // Products based on wishlist
  getProductsByWishlistId(obj: {limit: number, skip: number, folder_id: number}) {
    return this.http.post<WishlistData<WishlistProduct>>(`${environment.apiUrl}/v2/fetch-wishlist-product-by-folder`, obj, {headers: this.headers})
  }

  // Products Compare 
  getProductsCompare(ids: string) {
    return this.http.post<WishlistData<WishlistProduct>>(`${environment.apiUrl}/v2/wishlist-product-compare`, {products : ids}, {headers: this.headers})
  }

  // Suppliers based on wishlist
  getCompanyByWishlistId(obj: {limit: number, skip: number, folder_id: number}) {
    return this.http.post<WishlistData<WishilistSupplier>>(`${environment.apiUrl}/v2/fetch-wishlist-supplier-by-folder`, obj, {headers: this.headers})
  }

  // Add & remove Product or seller  wishlist api
  /**
   * Adds or removes a product or seller from the wishlist.
   * @param folder_id - ID of the wishlist folder
   * @param action - Action to perform: "add" or "remove"
   * @param type - Type of record: "product" or "seller"
   * @param record_id - ID of the product or seller
   * @returns An Observable containing the response from the API
  */
  addRemoveProductCompany(obj: WishilistAddRemove) {
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/add-remove-product-or-supplier-wishlist`, obj, {headers: this.headers})
  }

  addProductComment(obj: AddComment) {
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/add-comment-quantity-wishlist-product`, obj, {headers: this.headers})
  }

  addSupplierComment(obj: AddCommentSupplier) {
    return this.http.post<WishlistResponse>(`${environment.apiUrl}/v2/add-comment-quantity-wishlist-supplier`, obj, {headers: this.headers})
  }

  // Wishlist share
  getWishlistSharedDataApi(obj: {share_link: string}) {
    return this.http.post<any>(`${environment.apiUrl}/v2/get-wishlist-by-shared-token`, obj, {headers: this.headers})
  }

  acceptWishlistShareRequestApi(obj: {share_link: string}) {
    return this.http.post<any>(`${environment.apiUrl}/v2/store-wishlist-shared-folder-accept`, obj, {headers: this.headers})
  }

  removeMemberApi(id: number, folder_id: number) {
    return this.http.post<any>(`${environment.apiUrl}/v2/admin-remove-wishlist-shared-user`, {buyer_id: id, folder_id}, {headers: this.headers})
  }

  removeListFromShared(folder_id: number) {
    return this.http.post<any>(`${environment.apiUrl}/v2/user-delete-shared-wishlist`, {folder_id}, {headers: this.headers})
  }

  getProductsByWishlistIdNoAuth(obj: {limit: number, skip: number, folder_id: number}) {
    return this.http.post<WishlistData<WishlistProduct>>(`${environment.apiUrl}/fetch-wishlist-product-by-folder-no-auth`, obj, {headers: this.headers});
  }

  getCompanyByWishlistIdNoAuth(obj: {limit: number, skip: number, folder_id: number}) {
    return this.http.post<WishlistData<WishilistSupplier>>(`${environment.apiUrl}/fetch-wishlist-supplier-by-folder-no-auth`, obj, {headers: this.headers})
  }

  getWishlistSharedDataApiNoAuth(obj: {share_link: string}) {
    return this.http.post<any>(`${environment.apiUrl}/get-wishlist-by-shared-token-no-auth`, obj, {headers: this.headers})
  }
}