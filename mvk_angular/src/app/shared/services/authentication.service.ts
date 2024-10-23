import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isUserLoggedIn: boolean = false;
  // private headers = new HttpHeaders({
  //   'Authorization': 'Bearer ' + localStorage.getItem('token')
  // });
  private get headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }
  private accessToken: any;
  private refreshTokenStr: any;
  constructor(private http: HttpClient) { }

  //token
  setToken(token: any) {
    localStorage.setItem('token', token);
  }
  getToken() {
    return localStorage.getItem('token')
  }
  deleteToken() {
    localStorage.removeItem('token');
  }

  setUserObj(userObj: any) {
    localStorage.setItem('userObj', userObj);
    let user = JSON.parse(userObj);
    this.setProfilePic(user.avatar);
  }
  getUserObj() {
    return localStorage.getItem('userObj')
  }
  deleteUserObj() {
    localStorage.removeItem('userObj');
    // console.info('removed user object');
  }

  deleteUID() {
    localStorage.removeItem("uniqueId");
  }

  getBuyerId(): number {
    let obj = JSON.parse(this.getUserObj() || '{}')
    return obj.buyerId as number;
  }


  getUserDetails() {
    let obj = JSON.parse(this.getUserObj() || '{}')
    return obj;
  }






  //signup create account
  checkBuyerAccount(mobileNumber: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/check-buyer-account-v2`, { mobile: mobileNumber });
  }

  signUpOtp(mobileNumber: number | string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/send-otp-buyer-signup`, { mobile: mobileNumber });
  }

  checkBuyerAccountEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/check-buyer-account-email-v2`, { email: email });
  }

  signUpOtpEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/send-email-otp`, { email: email });
  }

  updateEmail(email: string, otp: number | string, mobile: number): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/verify-email-otp`, { email: email, otp: otp, mobile: mobile });
  }

  createEmail(email: string, otp: number, mobile: number, user_name: string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/verify-email-otp-v2`, { email, otp, mobile, user_name });
  }

  createAccount(mobile: number, otp: number): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/create-account-v3`, { mobile: mobile, otp: otp })
  }

  updateBuyerDetails(obj: any): Observable<any> { // not using
    return this.http.post(`${environment.apiLoginUrl}/update-buyer-user-details`, obj)
  }
  updateBuyerDetailsV2(obj: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/create-user-account-details`, obj)
  }

  pincodeVerify(pincode: number) {
    return this.http.post(`${environment.apiLoginUrl}/v2/fetch-locationby-pincode-v2`, {pincode: pincode})
  }

  stateBoards(pincode: number) {
    return this.http.post(`${environment.apiLoginUrl}/v2/get-state-school-boards`, {pincode: pincode}, {headers: this.headers})
  }

  // Login Account Section
  login(loginPayload: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/auth/login-v2`, loginPayload);
  }
  sendOtpToBuyer(mobileNumber: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/send-otp-buyer-signin`, { mobile: mobileNumber });
  }

  updateBuyerPassword(forgotPasswordDetails: any) {
    return this.http.post(`${environment.apiLoginUrl}/v2/update-buyer-password`, forgotPasswordDetails);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
    // localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? 'true' : 'false')
  }

  // loggedOut(): void {
  //   this.isUserLoggedIn = false;
  //   localStorage.removeItem('isUserLoggedIn')
  // }

  loginWithSocial(mob_email: string, type: string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/social-login`, { mob_email, login_type: type })
  }
  // loginWithFacebook(email: string): Observable<any> {
  //   const header = new HttpHeaders().set('Content-type', 'application/json');
  //   return this.http.post(`${environment.apiLoginUrl}/v2/social-login?mob_email=${email}`, { headers: header, withCredentials: true })
  // }

  signupSteps(): Observable<any> {
    return this.http.get(`${environment.apiLoginUrl}/fetch-signup-steps`);
  }

  buyerAccountDelete(obj: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/buyer-account-delete-request`, obj)
  }

  // sendOtpToDelete(mobile: number): Observable<any> { 
  //   return this.http.post(`${environment.apiLoginUrl}/v2/resend-otp-new`, {user_email_mobile: mobile})
  // }


  refreshToken() {
    return this.http.post<any>('your-refresh-token-url', { refreshToken: this.refreshTokenStr })
      .pipe(tap((tokens) => {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      }));
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  signUpImages(): Observable<any> {
    return this.http.get(`${environment.apiLoginUrl}/onboarding`)
  }


  // new SignUp
  signUpStep1(obj: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/buyer-new-signup-step-1`, obj) // not using
  }

  signUpStep2(obj: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/buyer-new-signup-step-2`, obj) // not using
  }

  newSignup(obj: any) {
    return this.http.post(`${environment.apiLoginUrl}/update-buyer-user-details-v2`, obj)
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/auth/logout`, {device_token: token, device_type: 3}, {headers: this.headers})
  }

  getSocialLogins(): Observable<any> {
    return this.http.get(`${environment.apiLoginUrl}/social-logins`)
  }

  verifyBuyerOtp(obj: any): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/verify-buyer-otp`, obj)
  }

  // Account page
  updateMyProfile(obj: any) {
    return this.http.post(`${environment.apiLoginUrl}/v2/edit-profile`, obj, {headers: this.headers})
  }
  
  getMyProfile() {
    return this.http.get(`${environment.apiLoginUrl}/v2/get-profile`, {headers: this.headers})
  }

  getMyProfileDropdowns() {
    return this.http.get(`${environment.apiLoginUrl}/v2/my-profile-dropdowns`, {headers: this.headers})
  }

  getSchoolProfile() {
    return this.http.get(`${environment.apiLoginUrl}/v2/get-school-profile`, {headers: this.headers})
  }

  updateSchoolProfile(obj: any) {
    return this.http.post(`${environment.apiLoginUrl}/v2/edit-school-profile`, obj, {headers: this.headers})
  }

  getProfilePic(): string {
    let image = localStorage.getItem('profilePic') ?? '';
    return image;
  }

  profilePicEvent = new EventEmitter<string>();
  setProfilePic(image: string): void {
    localStorage.removeItem('profilePic');
    localStorage.setItem('profilePic', image);
    this.profilePicSub.next(image);
    this.profilePicEvent.emit(image);
  }

  profilePicSub = new Subject<string>();
  profilePic$ = this.profilePicSub.asObservable();

  deleteProfilePic() {
    return this.http.delete(`${environment.apiLoginUrl}/v2/delete-profile-photo`, {headers: this.headers})
  }

  updateMobileNumberOtp(mobileNumber: number | string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/v2/update-buyer-mobile-number-send-otp`, { mobile: mobileNumber }, { headers: this.headers });
  }

  updateMobileNumber(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-buyer-mobile-number-verify-otp`, obj, { headers: this.headers })
  }

  // Delete Account 
  sendDeleteRequest(obj: any) {
    return this.http.post(`${environment.apiLoginUrl}/v2/send-buyer-delete-account-request`, obj, {headers: this.headers})
  }

  cancelDeleteRequest() {
    return this.http.post(`${environment.apiLoginUrl}/v2/buyer-account-cancel-delete-request`, {}, {headers: this.headers})
  }

  // sending otp using in confirm mobile and rfq dm component
  sendOtp(mobileNumber: number | string): Observable<any> {
    return this.http.post(`${environment.apiLoginUrl}/send-buyer-otp`, { mobile: mobileNumber });
  }

  // chat 
  updateChatList(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v2/update-chat-list`, obj, {headers: this.headers})
  }
}