import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { apiObject } from 'src/app/account/rfq-list/rfq-list.component';
import { Note } from 'src/app/account/rfq-view-details/notes/notes.component';
import { environment } from 'src/environments/environment';
import { MutipleEnquiryApiReq } from '../components/enquiry-multiple/enquiry-multiple.component';

@Injectable({
  providedIn: 'root'
})
export class RfqService {

  // private headers = new HttpHeaders({
  //   'Authorization': 'Bearer ' + localStorage.getItem('token')
  // });
  private get headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }
  userId: number = 0;
  constructor(private http: HttpClient) {
    if (localStorage.getItem('userObj')) {
      const userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
      this.userId = parseInt(userObj.buyerId);
    }
  }

  setHeaders(token: string, id: number) {
    this.userId = id;
    // this.headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  //Home/Products
  getAttributes(id: any): Observable<any> {
    const data = {
      category: id
    }
    return this.http.post(`${environment.apiUrl}/v2/fetch-attr-by-catId`, data, { headers: this.headers });
  }


  // getCategories(data:any): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}/fetch-all-categories`,data);
  // }

  getAlldropdownData(id: any): Observable<any> { //if signed in
    const data = {
      category: id
    }
    return this.http.post(`${environment.apiUrl}/v2/get-product-enquery-dropdowns-api`, data, { headers: this.headers });
  }

  getAlldropdownDataV2(id: string): Observable<any> { //if not signed in
    return this.http.post(`${environment.apiUrl}/get-product-enquery-dropdowns-api`, {category: id});
  }
  getCalls(id: any): Observable<any> {
    const data = {
      company_id: id,
      prod_id: '',
      connect_type_id: ''
    }
    return this.http.post(`${environment.apiUrl}/v2/create-connect-as-call`, data, { headers: this.headers })
  }

  reqSubmit(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/rfq-submit`, data, { headers: this.headers });
  }
  
  rfqSubmitV2(data: any): Observable<any> { // if signed in
    return this.http.post(`${environment.apiUrl}/v2/rfq-submit-v3`, data, { headers: this.headers });
  }

  rfqSubmitV3(data: any): Observable<any> { // if not signed in
    return this.http.post(`${environment.apiUrl}/rfq-submit-v3`, data);
  }
  
  // Not Using
  enquerySubmit(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/product-enquery-submit`, data, { headers: this.headers });
  }

  enquerySubmitV2(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/product-enquery-submit-v2`, data, { headers: this.headers });
  }

  enquerySubmitV3(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/product-enquery-submit-v3`, data, { headers: this.headers });
  }
  multipleEnquiry(enquiryReq: MutipleEnquiryApiReq): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/product-enquery-submit-v4`, enquiryReq, { headers: this.headers });
  }

  contactSupplierApi(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/contact-supplier`, data, { headers: this.headers });
  }

  //Account Page    
  //   </-- Inquiry Details -->
  getInquiryList(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-enquery`, data, {headers: this.headers})
  }

  getInquiryDetails(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-enquery_details`, {enquery_id: id}, {headers: this.headers})
  }

  updateEnquiryDetails(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-enquery-details`, obj,  {headers: this.headers})
  }

  // Inquiry Folders 

  getFolders(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/v2/get-inquiry-folders`,  {headers: this.headers})
  }

  createFolder(name: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/create-inquiry-folder`, {folder_name: name},  {headers: this.headers})
  }

  deleteFolder(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/v2/delete-inquiry-folder?folder_id=${id}`,  {headers: this.headers})
  }

  editFolder(name: string, id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-inquiry-folder`, {folder_name: name, folder_id: id},  {headers: this.headers})
  }

  groupFolder(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/inquirys-group-to-folder`, obj,  {headers: this.headers})
  }

  unGroupFolder(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/inquirys-ungroup-to-folder`, obj,  {headers: this.headers})
  }
  
  //   </-- RFQ Details -->
  getRfqList(obj: apiObject): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-rfq-list-v2`, obj, {headers: this.headers})
  }
  getRfqDraftList(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-draft-rfq-list`, data, {headers: this.headers})
  }

  getRfqDetails(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-rfq-details`, {rfq_id: id}, {headers: this.headers})
  }

  getRfqClose(): Observable<any> {
    return this.http.get(`${environment.apiLoginUrl}/get-rfq-close-reasons`)
  }

  updateRfq(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-rfq`, obj,  {headers: this.headers})
  }

  updateRfqDetails(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-rfq-details`, obj,  {headers: this.headers})
  }

  getChatGPTDescription(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ask-chat-gpt`, obj)
  }


  // Quote Details

  getQuoteDetails(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/fetch-quotation-details`, {quote_id: id},  {headers: this.headers})
  }
  
  // Account Page Rfq
  compareRfqQuotes(id: number):Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/rfq-quotations-for-comparison`, { rfq_id: id }, { headers: this.headers })
  }

  deleteRfqQuote(id: number, reason: string):Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/delete-rfq-quotation`, { quotation_id: id, reason }, { headers: this.headers })
  }
  
  addNotes(noteData: Note):Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/store-rfq-quotation-notes`, noteData, { headers: this.headers })
  }

  getRfqTerms(): Observable<string> {
    return this.http.get(`https://api.myverkoper.com/html/v2/rfq-terms-condition`, { responseType: 'text' })
  }

  getSpanStyle(key: string) {
    let classes = '';
    let styles: { [key: string]: string } = {};
    switch (key.toLowerCase()) {
      case 'open':
        styles['border-color'] = '#02A8DF';
        styles['color'] = '#02A8DF';
        classes = 'fa-folder';
        break;
      case 'onhold':
        styles['border-color'] = '#ffd233';
        styles['color'] = '#ffd233';
        styles['background-color'] = '#fdfaee';
        classes = 'fa-pause';
        break;
        case 'approved':
          styles['border-color'] = '#3fa950';
          styles['color'] = '#3fa950';
          styles['background-color'] = '#ecf6ee';
          classes = 'fa-check';
        break;
        case 'rejected':
          styles['border-color'] = '#d63333';
          styles['color'] = '#d63333';
          styles['background-color'] = '#fce6e6';
          classes = 'fa-close';
        break;
      default:
        styles['border-color'] = 'black';
        styles['color'] = 'black';
        classes = 'fa-folder';
        break;
    }
    let obj = {style: styles, class: classes}
    return obj;
  }

  getUserDetails(token: string): Observable<any> {
    // this.setHeaders(token);
    return this.http.get(`${environment.apiLoginUrl}/v2/user`,  { headers: this.headers })
  }

  // Account / Notification List
  getNotificationList(body: {limit: number, skip: number}): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/get-buyer-notification-history`, body, {headers: this.headers})
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/delete-buyer-notification-history`, {notification_id: id}, {headers: this.headers})
  }

  private rfqRead = new Subject<boolean>();
  rfqRead$ = this.rfqRead.asObservable();

  notificationRead() {
    this.rfqRead.next(true);
  }

  // Used by android we are not using
  updateUser(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-user`, body, { headers: this.headers })
  }

  updateUserProessionalDetails(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-user-professional-deatils`, obj, { headers: this.headers })
  }

  updateUserPersonaletails(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-user-name-email`, obj, { headers: this.headers })
  }

  updateUserPic(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-user-pic`, obj, { headers: this.headers })
  }
  updateUserMobile(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-user-details-mobile`, obj, { headers: this.headers })
  }

  getDropDowns(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/db-defined-dropdowns`)
  }

  // get quote Page
  getRecommendedProductsRfq(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/rfq-count-browsed-recommendation-products`, obj, { headers: this.headers })
  }

  getRecommendedProductsRfqWithoutSignin(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/recommendation-products-without-sign-in`, obj)
  }

  // rfq digital marketing
  getRfqDetailsFromUrl(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/get-dm-campaign/${id}`)
  }

  postDmRfq(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/dm-rfq-submit`, body)
  }

  
}